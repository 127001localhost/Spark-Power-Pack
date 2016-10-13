var page = 0;
var pageData = [];
var selected = []; // array for tracking item selections when moving between pages
var myRoomTitles = [];
var sortMethod = {"id": "created"};
var sortDir = 1; // Ascending
var url = "https://api.ciscospark.com/v1/rooms";
var next = "";
var results = [];
var search = false;

if (localStorage.getItem("max") === null) {
  var max = 10;
}else{
	var max = parseInt(localStorage.getItem("max"));
}

$("#listRooms").on('click', function(){
	$("#intro").remove();
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(next, url); // list my rooms
});

function getMembershipId(roomId, personId){
	return $.ajax({
		url: "https://api.ciscospark.com/v1/memberships?roomId="+roomId+"&personId="+personId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	});
}

function leaveRoom(membershipId, roomId){
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships/"+membershipId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "DELETE",
		statusCode: {
			204: function(){
				results.push({"roomId": roomId, "status": "success"});
				displayResults();
			},
			403: function(){
				results.push({"roomId": roomId, "status": "failed"});
				displayResults();
			},
			409: function(){
				results.push({"roomId": roomId, "status": "failed"});
				displayResults();
			}
		}
	});
}	

function displayResults(){
	if(selected.length === results.length){
		var HTML = '<div class="jumbotron"><h2>Exodus Results:</h2>';
		for(var i = 0; i < selected.length; i++){
			var thisId = selected[i].id;
			for(var index in results){
				if (thisId == results[index].roomId){
					if(results[index].status == "success"){
						HTML += "<p><i class='glyphicon glyphicon-ok text-success'></i> "+selected[i].value+" was removed successfully.</p>";
					}else{
						HTML += "<p><i class='glyphicon glyphicon-remove text-danger' style='syle: red;'></i> "+selected[i].value+" could not be removed.</p>";
					}
				}
			}
		}
		HTML += '<button class="btn btn-success" type="button" onclick=\'window.location="powerpack.php"\'>Home</button></div>';
		$(".container").html(HTML);
	}
}

function leaveSelected(){
	$(".container").html('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Leaving Rooms...</h3></div></div>');
	for(var i = 0; i < selected.length; i++){
		// clean up cached data
    pageData = JSON.parse(localStorage.getItem("roomList"));
		for(var j in pageData){
			if (selected[i].id == pageData[j].id){
				pageData.splice(j, 1);
			}
		}
		getMembershipId(selected[i].id, localStorage.getItem("myId"))
		.then(function(membership){
			leaveRoom(membership.items[0].id, membership.items[0].roomId);
		});
		
	}
	localStorage.setItem("roomList", JSON.stringify(pageData));
}


function reviewSelected(){
	checkSelected(); // check to see what is selected
	
	var HTML = '<div class="jumbotron"><h2>Are you sure you wish to leave the following rooms?</h2>';
	
	for(var i = 0; i < selected.length; i++){
		HTML += "<p><i class='glyphicon glyphicon-remove text-danger' style='syle: red;'></i> "+selected[i].value+"</p>";
	}
	HTML += '<button class="btn btn-danger has-spinner" id="leave" type="button" onClick="leaveSelected()">Leave Rooms</button>  <button class="btn btn-normal" id="cancel" type="button" onClick="startOver()">Cancel</button></div>';

	$(".container").html(HTML);
	console.log(selected);
}

function refreshRooms(){
	pageData = [];
	localStorage.removeItem("roomList");
	$(".container").html('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(next, url);
}

function listRooms(next,url){
	// check for cached data
	if (localStorage.getItem("roomList")){
		pageData = JSON.parse(localStorage.getItem("roomList"));
		var exodusData = [];
		for(var i = 0; i < pageData.length; i++){
			if(pageData[i].type != "direct" && (typeof pageData[i].teamId === 'undefined')){
				exodusData.push(pageData[i]);
			}
		}
		// remove 1:1 rooms for list for Exodus
		pageData = exodusData;

		page = localStorage.getItem("page");
		pagination(max);
	}else{
		// check to see if list rooms came back with a "next link"
		if(next.length > 1){
			url = next;
		}else{
			url = url+"?max=100";
		}

		$.ajax({
			url: url,
			headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
			cache: false,
			method: "GET",
			statusCode: {
				502: function(){
					$("#roomButton").hide();
					$("#step1a").append("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>");
				}
			}
		}).done(function(data, status, xhr){
			//pagination
			pageData.push(data.items);
			console.log("my pageData info: ", pageData);
			//parse the next link from the respone header
			var link = xhr.getResponseHeader('Link');
			if(link){
				var myRegexp = /(http.+)(>)/g;
				var match = myRegexp.exec(link);
				page++;
				// call listRooms again with the next link
				listRooms(match[1], url);
			}else{
				//flatten the pageData array 
				pageData = _.flatten(pageData);
				console.log("pageData after flattening, unsorted" , pageData);
				pageData = sortObjectBy(pageData,"lastActivity","D");
				console.log("pageData after flattening, sorted" , pageData);
				localStorage.setItem("roomList", JSON.stringify(pageData));
				localStorage.setItem("page", page);

				// remove 1:1 rooms for list for Exodus
				var exodusData = [];
				for(var i = 0; i < pageData.length; i++){
					if(pageData[i].type != "direct" && (typeof pageData[i].teamId === 'undefined')){
						exodusData.push(pageData[i]);
					}
				}
				pageData = exodusData;

				// call the pagiation script
				pagination(max);
			}
		});
	}
}

function sortObjectBy(array, srtKey, srtOrder){
    if (srtOrder =="A"){
        if (srtKey =="title" || srtKey =="name"){
            return array.sort(function (a, b) {
                var x = a[srtKey].toLowerCase(); var y = b[srtKey].toLowerCase();
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });    
        }else{

        return array.sort(function (a, b) {
            var x = a[srtKey]; var y = b[srtKey];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });

        }
    }

    if (srtOrder =="D"){
        if (srtKey =="title" || srtKey =="name"){
            return array.sort(function (a, b) {
                var x = a[srtKey].toLowerCase(); var y = b[srtKey].toLowerCase();
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });    
        }else{
			return array.sort(function (a, b) {
            var x = a[srtKey]; var y = b[srtKey];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });

        }
    }
}

function sortBy(srtValue, srtOrder){
	pageData = sortObjectBy(pageData,srtValue,srtOrder);
	checkSelected();
	pagination(max);
}	

function perPage(){
	checkSelected();
	if($("#max").val() > 10){
		max = parseInt($("#max").val());
		localStorage.setItem('max', max);
		if(max > pageData.length){
			max = pageData.length;
		}
	}else{
		max = 10;
	}
	pagination(max);
}

function pagination(max){
	$("#progress").remove();
	//setup page navigation
	var HTML = "<div class='row'><div class='col-md-12'><h2>Select the rooms you want to leave</h2></div></div>";
	$(".container").html(HTML);

	var totalRooms = pageData.length;
	//console.log(totalRooms);
	if(totalRooms <= max){
		var numPages = 1;
		max = totalRooms;
	}else{
		var numPages = (totalRooms / max);
		numPages = Math.ceil(numPages);
	}
	
	var HTML = '<div class="row"><div class="col-md-12"><nav style="display: inline-block;"><ul class="pagination">';
	for(var i = 0; i < numPages; i++){
		var start = i * max;
		var stop = start + max-1;
		if(stop > totalRooms){
			stop = totalRooms - 1;
		}
		var pageDisplay = i + 1;
		if (pageDisplay == 1){
			HTML += "<li class='active'><a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a></li>";
		}else{
			HTML += "<li><a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a></li>";
		}
		
	}
	HTML += '<li><a onClick=\'refreshRooms()\'><i class="glyphicon glyphicon-refresh"></i></a></li>&nbsp;&nbsp;<span><input type="text" placeholder=10 size="3" maxlength="3" id="max">&nbsp;<button class="btn btn-normal btn-sm" id="perPage" type="button" onClick=\'perPage()\'>Per/Page</button></span></nav></div></div>';
	if(!search){
		HTML += '<div class="row"><div class="col-md-6"><div class="input-group" id="search"><input type="text" class="form-control" id="searchString" placeholder="Room Name"><div class="input-group-addon" id="liveSearch"><i class="glyphicon glyphicon-search"></i></div></div></div></div>';
	}else{
		HTML += '<div class="row"><div class="col-md-6"><div id="clearSearch"><button class="btn btn-warning btn-sm">Clear Search</button></div></div></div>';
	}

	$(".container").append(HTML);

	// set Max per/page placeholder
	$("#max").attr("placeholder", max);

	roomDisplay(0,max-1);
}


// handle the active page
$(document).on('click', 'li', function() {
   $("li").removeClass("active");
   $(this).addClass("active");
});

$(document).on('click', 'th a', function() {
	if(sortMethod.id == $(this).attr("id") && sortDir == 0){
		console.log("sorting by: ", $(this).attr("id"));
		sortBy($(this).attr("id"), "A");
		sortDir = 1;
	}else{
		console.log("sorting by: ", $(this).attr("id"));
		sortBy($(this).attr("id"), "D");
		sortMethod.id = $(this).attr("id");
		sortDir = 0;
	}
});

$(document).on('click', '#selectAll', function(e){
	e.preventDefault();
	if($("#selectAll").hasClass("selected")){
		$("#selectAll").removeClass("selected");
		$(":checkbox").prop('checked', false);
	}else{
		$("#selectAll").addClass("selected");
		$(":checkbox").prop('checked', true);
	}
});

function roomDisplay(start,stop){
	checkSelected();

	var table = '<div class="row" id="roomList"><div class="col-md-12"><table class="table table-striped" id="roomTable"><thead><th><i class="glyphicon glyphicon-check" id="selectAll"></i></th><th width="55%">Room Name <a class="glyphicon glyphicon-sort" id="title"></a></th><th width="20%">Created <a class="glyphicon glyphicon-sort" id="created"></a></th><th width="20%">Last Activity <a class="glyphicon glyphicon-sort" id="lastActivity"></a></th></thead>';

	var data = pageData;
	for(var i = start; i <= stop; i++){
		var checked = false;
		if(selected.length > 0){
			for(var index in selected){
				if(data[i].id == selected[index].id){
					checked = true;
					console.log("checked item");
					break;
				}
			}
		}
		var created = new Date(data[i].created);
		var activity = new Date(data[i].lastActivity);
		if(checked){
			console.log("no selections have been made yet");

			table += '<tr><td><input type="checkbox" name="checkboxes" id="'+data[i].id+'" value="'+data[i].title+'" checked><td class="name">'+data[i].title+'</td><td>'+created.toLocaleString()+'</td><td>'+activity.toLocaleString()+'</td><td></tr><div class="preview active" style="display:none">Preview</div>';
			checked = false;
		}else{
			table += '<tr><td><input type="checkbox" name="checkboxes" id="'+data[i].id+'" value="'+data[i].title+'"><td class="name">'+data[i].title+'</td><td>'+created.toLocaleString()+'</td><td>'+activity.toLocaleString()+'</td><td></tr><tr class="preview active" style="display:none"><td colspan="4">Fetching last 4 messages</</td></tr>';
		}
		
	}
		$("#roomList").remove();
		$(".container").append(table);

		var button = "</br><button class='btn btn-success' type='button' onclick='reviewSelected()'>Review Selection(s)</button>  <button class='btn btn-normal' type='button' onclick='window.location=\"exodus.php\"'>Cancel</button>";
		$("#roomTable").after(button);
}

function checkSelected(){
		$("input:not(:checked)").each(function(){
		if(selected.length >= 1){
			for(var i = 0; i < selected.length; i++){
				if(selected[i].id == this.id){
					selected.splice(i, 1);
				}
			}
		}
	});
	// record any selected
	$("input:checked").each(function(){
		var addItem = true;
		if(selected.length > 0){
			for(var i = 0; i < selected.length; i++){
				if(selected[i].id == this.id){
					addItem = false
				}	
			}
		}

		if(addItem){
			selected.push(this);
		}
	});
}

/////////////////////////////////////////////
// remove users from a moderated room in bulk
/////////////////////////////////////////////
var exodusUsers = {
	moderatedRooms: [],
	removeList: [],
	existingBots: [],

	listRooms: function(){
		return $.ajax({
			url: "https://api.ciscospark.com/v1/memberships?max=1000",
			headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
			cache: false,
			method: "GET"
		}).done($.proxy(function(rooms){
			for(var i = 0; i < rooms.items.length; i++){
				if (rooms.items[i].isModerator){
					this.moderatedRooms.push({id: rooms.items[i].roomId, title: null, created: null, teamId: null, lastActivity: null});
				} 
			 }
		 }, this));
	},

	getRoomDetails: function(roomId, index){
		var _def = $.Deferred();
		$.ajax({
			 	url: "https://api.ciscospark.com/v1/rooms/"+roomId,
		 	headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		 	cache: false,
		 	method: "GET"
		}).done($.proxy(function(data){
			this.moderatedRooms[index].title = data.title;
			this.moderatedRooms[index].created = data.created;
			this.moderatedRooms[index].lastActivity = data.lastActivity;
			this.moderatedRooms[index].teamId = data.teamId;
			_def.resolve();
		}, this))
		.fail(function(error){
			//console.log(error);
			_def.resolve();
		});
		return _def.promise();
	},

	displayRooms: function(){
		var cleanList = [];
		var i;
		var HTML = "";
		for(i = 0; i < this.moderatedRooms.length; i++){
			if(this.moderatedRooms[i].title !== null && typeof this.moderatedRooms[i].title !== "undefined"){
				cleanList.push(this.moderatedRooms[i]);
			}
		}
		if(cleanList.length === 0){
			HTML = '<div class="jumbotron"><h3>No rooms found.</h3><p>You must be the moderator of a room or team to remove users in bulk.</p>';
			HTML += '<button class="btn btn-success" type="button" onclick=window.location=\x22powerpack.php\x22>Home</button>';
		}else{
			HTML = '<div class="row"><div class="col-md-12"><h2>Select Room to Remove Users from</h2><div class="form-group" id="roomForm" hidden><div><select name="rooms" id="rooms" class="form-control"><option value="">Select a room:</option></select></div></div>';
		}

		$(".container").html(HTML);
		$("#removesel").hide();
		$("#listRoomsSelf").hide();
		$("#roomButton").toggleClass('active');
		$("#step1a").show();
		$("#listRoomsOthers").removeClass("active");

		myRoomTitles = sortObjectBy(cleanList,"title","D");

		for (i = 0; i < myRoomTitles.length; i++){
			var roomName;
			if(typeof myRoomTitles[i].teamId !== "undefined"){
				roomName = myRoomTitles[i].title + " (This is a Team)";
			}else{
				roomName = myRoomTitles[i].title;
			}
			
			var created = new Date(myRoomTitles[i].created);
			var activity = new Date(myRoomTitles[i].lastActivity);
			$("#rooms").append("<option value="+i+">"+roomName+"</option>");
			}
			
		$("#roomForm").show();
		$("#roomButton").hide();
	},

	getTeamMembers: function(teamId){
		var _def = $.Deferred();
		$.ajax({
			url: "https://api.ciscospark.com/v1/team/memberships?max=1000&teamId="+teamId,
			headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
			cache: false,
			method: "GET"
		}).done($.proxy(function(data){
			var usersList = [];
			var yourself = localStorage.getItem("myEmail");

			for (var i = 0; i < data.items.length; i++){
				//Only push the contact if their email does not contain "bot@" which would indicate this is not a regular user, but a bot such as Cisco Security bot monitoring the room
				if (data.items[i].personEmail.indexOf("bot@") ==-1 && data.items[i].personEmail != yourself && data.items[i].personEmail.indexOf("powerpack") ==-1){
					usersList.push(data.items[i]);
				}else if(data.items[i].personEmail.indexOf("powerpack")){
					this.existingBots.push(data.items[i]);
				}

			} //for (var i = 0; i< data.length; i++)
			usersList = sortObjectBy(usersList,"personDisplayName","D");
			_def.resolve(usersList);
		}, this));
		return _def.promise();
	},

	getUsers: function(roomId,roomTitle){
		var _def = $.Deferred();
		$.ajax({
			url: "https://api.ciscospark.com/v1/memberships?max=1000&roomId="+roomId,
			headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
			cache: false,
			method: "GET"
		}).done($.proxy(function(data){
			var usersList = [];
			var yourself = localStorage.getItem("myEmail");

			for (var i = 0; i < data.items.length; i++){
				//Only push the contact if their email does not contain "bot@" which would indicate this is not a regular user, but a bot such as Cisco Security bot monitoring the room
				if (data.items[i].personEmail.indexOf("bot@") ==-1 && data.items[i].personEmail != yourself && data.items[i].personEmail.indexOf("powerpack") ==-1){
					usersList.push(data.items[i]);
				}else if(data.items[i].personEmail.indexOf("powerpack")){
					this.existingBots.push(data.items[i]);
				}

			} //for (var i = 0; i< data.length; i++)
			usersList = sortObjectBy(usersList,"personDisplayName","D");
			_def.resolve(usersList);
		}, this));
		return _def.promise();
	},

	displayUsers: function(usersList, roomTitle){
		var HTML = "";
		if(typeof selectedRoom.teamId !== "undefined"){
			HTML = '<div class="row"><div class="col-md-12"><h3>Select Users to Remove from the '+roomTitle+' Team</h3>';
		}else{
			HTML = '<div class="row"><div class="col-md-12"><h3>Select Users to Remove from '+roomTitle+' Room</h3>';
		}
		
		HTML += '<table class="table table-striped" id="roomList"><thead><th><label><input type="checkbox" id="checkAll"/></lable></th><th>Name</th><th>Email</th></thead>';
		var removeUsers = {};
		for (var i = 0; i < usersList.length ; i++){
			removeUsers = {name: usersList[i].personDisplayName, id: usersList[i].id};
			HTML += "<tr><td><input type=\"checkbox\" name=\""+usersList[i].personDisplayName+"\" id=\"users"+i+"\" value=\""+usersList[i].id+"\"><td>"+usersList[i].personDisplayName+"</td><td>"+usersList[i].personEmail+"</td></tr>";
		}

		HTML += "</table><button class=\"btn btn-danger\" id=\"leave\" type=\"button\" onClick=\'exodusUsers.reviewSelectedUsers(\""+roomTitle+"\")'>Review Selected Users</button>  <button class=\"btn btn-normal\" type=\"button\" onClick=\'window.location=\"exodus.php\"\'>Cancel</button></div></div>";

		$(".container").html(HTML);

		$("#checkAll").change(function () {
			$("input:checkbox").prop('checked', $(this).prop("checked"));
		});
	},

	reviewSelectedUsers: function(roomTitle){
		// record any selected
		$("input:checked").each(function(){
			selected.push(this);
		});
		var HTML = "";
		if(typeof selectedRoom.teamId !== "undefined"){
			HTML = '<div class="jumbotron"><h3>Are you sure you want to remove these users from the '+roomTitle+' Team?</h3>';
		}else{
			HTML = '<div class="jumbotron"><h3>Are you sure you want to remove these users from '+roomTitle+' room?</h3>';
		}
		for(var i = 0; i < selected.length; i++){
			if(selected[i].value !== "on"){
				this.removeList.push({personDisplayName: selected[i].name, membershipId: selected[i].value});
				HTML += "<p><i class='glyphicon glyphicon-remove text-danger' style='syle: red;'></i> "+selected[i].name+"</p>";
			}
		}
		HTML += '<button class="btn btn-danger" id="removeUsersClick" type="button">Remove Users</button>  <button class="btn btn-normal" id="cancel" type="button" onClick="startOver()">Cancel</button></div></div>';

		$(".container").html(HTML);
	},

	removeSelectedUsers: function(){
		$.ajax({
			url: "https://sparkpowerpack.com:8443/removeContacts",
			cache: false,
			method: "POST",
			dataType: 'json',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({'removeList': this.removeList, 'roomId': selectedRoom.id, 'teamId': selectedRoom.teamId, 'roomName': selectedRoom.title, 'token': sparkToken, 'isLocked': true, 'email': localStorage.getItem('myEmail')})
		}).done(function(data){
			if(data.success){
				$('.container').html('<h3 style="color: green;">'+data.success+'</h4><p>');
			}
			$('.container').append('<button class="btn btn-success" type="button" onclick=\'window.location="powerpack.php"\'>Home</button>');
		});
	}
};

// handle click on website.
$(document).on('click', '#exodusUsers', function(e){
	e.preventDefault();
	exodusUsers.listRooms()
	.then(function(){
		var promises = [];
		// loop through list of moderated rooms and get titles.
		for(var index = 0; index < exodusUsers.moderatedRooms.length; index++){
			var _def = exodusUsers.getRoomDetails(exodusUsers.moderatedRooms[index].id, index);
			promises.push(_def);
		}
		return $.when.apply(undefined, promises).promise();
	})
	.then(function(){
		exodusUsers.displayRooms();
	});
});

// List users of selected room
$(document.body).on('change', '#rooms' ,function(){
  var i = $("#rooms").val();
  selectedRoom = myRoomTitles[i];
  if(typeof selectedRoom.teamId !== "undefined"){
  	exodusUsers.getTeamMembers(selectedRoom.teamId)
  	.then(function(userList){
  		exodusUsers.displayUsers(userList, myRoomTitles[i].title);
  	});
  }else{
  	exodusUsers.getUsers(myRoomTitles[i].id,myRoomTitles[i].title)
  	.then(function(userList){
  		exodusUsers.displayUsers(userList, myRoomTitles[i].title);
  	});
  }
});

$(document).on('click', '#removeUsersClick', function(e){
	e.preventDefault();
	exodusUsers.removeSelectedUsers(selectedRoom.title);
});

function startOver(){
	selected = [];
	myRooms = [];
	location.reload();
}

$(document).on('click', 'tr.preview.active', function(e){
	$(this).hide();
});

$(document).on('click', '#roomTable > tbody > tr > td.name', function(e){
	e.preventDefault();
	var id = $(this).parent().find("input").attr("id");
	var preview = $(this).parent().next(".preview");
	preview.show();
	console.log(preview);
	// pull last 4 messages
		$.ajax({
			url: 'https://api.ciscospark.com/v1/messages?roomId='+id+'&max=4',
			headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
			cache: false,
			method: "GET"
		}).done($.proxy(function(result){
			if(result.items.length === 0){
				preview.html('<td colspan="4">This room is empty</td>');
			}else{
				var msgPreview = "";
				for(var i = 0; i < result.items.length; i++){
					console.log(result.items[i].text);
					msgPreview += result.items[i].personEmail +' > '+result.items[i].text+ '<br>';
				}
				preview.html('<td colspan="4">'+msgPreview+'</td>');
			}
		}, this));
});