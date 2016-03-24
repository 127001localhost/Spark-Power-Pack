var page = 0;
var pageData = [];
var selected = []; // array for tracking item selections when moving between pages
var myRoomTitles = [];
var sortMethod = {"id": "created"};
var sortDir = 1; // Ascending

$("#listRooms").on('click', function(){
	$("#intro").remove();
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(); // list my rooms
});

$(document.body).on('change', '#rooms' ,function(){
    var i = $("#rooms").val();
    console.log("myRoom Info is: ", myRoomTitles[i]);
    selectedRoom = myRoomTitles[i];
	//$("#dvImportSegments").prepend("<h3>Upload a list of contacts to add to the "+myRooms[i].title+" room.</h3>");
  	getUsers(myRoomTitles[i].id,myRoomTitles[i].title);
  });

function getMembershipId(roomId, personId, num){
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships?roomId="+roomId+"&personId="+personId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		//console.log(data);
		leaveRoom(data.items[0].id, num);
	});
}

function leaveRoom(membershipId, num){
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships/"+membershipId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "DELETE",
		statusCode: {
			204: function(){
			}
		}
	});
	if(num == selected.length){
		var HTML = '<div class="jumbotron"><h2>You left the following rooms:</h2>';
		for(var i = 0; i < selected.length; i++){
			HTML += "<p>"+selected[i].value+"</p>";
		}
		HTML += '<button class="btn btn-success" type="button" onclick=\'window.location="powerpack.php"\'>Home</button>';
		$(".container").html(HTML);
	}
}	

function leaveSelected(){
	for(var i = 0; i < selected.length; i++){
		// clean up locate data
		for(j in pageData){
			if (selected[i].id == pageData[j].id){
				pageData.splice(j, 1);
			}
		}
		getMembershipId(selected[i].id, localStorage.getItem("myId"), (i+1));
	}
	localStorage.setItem("roomList", JSON.stringify(pageData));
}

function reviewSelected(){
	checkSelected(); // check to see what is selected
	
	var HTML = '<div class="row" id="confirm"><div class="col-md-6"><h2>Are you sure you wish to leave the following rooms?</h2>';
	
	for(var i = 0; i < selected.length; i++){
		HTML += "<p>"+selected[i].value+"</p>";
	};
	HTML += '<button class="btn btn-danger has-spinner" id="leave" type="button" onClick="leaveSelected()">Leave Rooms <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>  <button class="btn btn-normal has-spinner" id="cancel" type="button" onClick="startOver()">Cancel <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button></div></div>';

	$(".container").html(HTML);
	console.log(selected);
}

function refreshRooms(){
	pageData = [];
	localStorage.removeItem("roomList");
	$(".container").html('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms();
}

function listRooms(next="",url="https://api.ciscospark.com/v1/rooms"){
	// check for cached data
	if (localStorage.getItem("roomList")){
		pageData = JSON.parse(localStorage.getItem("roomList"));
		page = localStorage.getItem("page");
		pagination();
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
					$("#step1a").append("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>")

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
				listRooms(match[1]);
			}else{
				//flatten the pageData array 
				pageData = _.flatten(pageData);
				console.log("pageData after flattening, unsorted" , pageData);
				//pageData.sort((a,b) =>a.title.localeCompare(b.title));
				pageData = sortObjectBy(pageData,"lastActivity","D");
				console.log("pageData after flattening, sorted" , pageData);
				localStorage.setItem("roomList", JSON.stringify(pageData));
				localStorage.setItem("page", page);
				// call the pagiation script
				pagination();
			}
		});
	}
}

function sortObjectBy(myData, srtValue, srtOrder){
	//Sort ascending order
	console.log("srtValue: ", srtValue);
	console.log("srtOrder: ", srtOrder);
	console.log("myData passed: ", myData);
	if (srtOrder == "A"){
		if (srtValue == "title"){		
			myData.sort((a,b) =>a.title.localeCompare(b.title));
			console.log("myData is now: ",myData);
			} //(srtValue == "title")
		if (srtValue == "created"){		
			myData.sort((a,b) =>a.created.localeCompare(b.created));
			console.log("myData is now: ",myData);
			} //(srtValue == "created")
		if (srtValue == "lastActivity"){		
			myData.sort((a,b) =>a.lastActivity.localeCompare(b.lastActivity));
			console.log("myData is now: ",myData);
			} //(srtValue == "lastActivity")
	} //(srtOrder == "A")
	if (srtOrder == "D"){
		if (srtValue == "title"){		
			myData.sort((a,b) =>b.title.localeCompare(a.title));
			console.log("myData is now: ",myData);
			} //(srtValue == "title")
		if (srtValue == "created"){		
			myData.sort((a,b) =>b.created.localeCompare(a.created));
			console.log("myData is now: ",myData);
			} //(srtValue == "created")
		if (srtValue == "lastActivity"){		
			myData.sort((a,b) =>b.lastActivity.localeCompare(a.lastActivity));
			console.log("myData is now: ",myData);
			} //(srtValue == "lastActivity")
	} //(srtOrder == "D")
	
	return myData;
}

function sortBy(srtValue, srtOrder){
	pageData = sortObjectBy(pageData,srtValue,srtOrder);
	checkSelected();
	pagination();
}

function perPage(){
	if($("#max").val() > 10){
		max = parseInt($("#max").val());
	}else{
		max = 10;
	}
	pagination(max);
}

function pagination(max=10){
	$("#progress").remove();
	//setup page navigation
	var HTML = "<div class='row'><div class='col-md-6'><h2>Select the rooms you want to leave</h2></div></div>";
	$(".container").html(HTML);
	var pageNav = '<div class="row"><div class="col-md-6"><span>Rooms per/page: <input type="text" placeholder=10 size="2" maxlength="2" id="max"> <button class="btn btn-normal" id="perPage" type="button" onClick=\'perPage()\'>Update</button></span></div><div>';
	$(".container").append(pageNav);	

	var totalRooms = pageData.length;
	//console.log(totalRooms);
	var numPages = (totalRooms / max);
	//var HTML = '<nav><ul class="pagination"><li><a href="" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
	var HTML = '<nav><ul class="pagination">';
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

	//HTML += '<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
	HTML += '<li><a onClick=\'refreshRooms()\'><i class="glyphicon glyphicon-refresh"></i></a></span></li></ul></nav></div><div>';
	$(".container").append(HTML);

	roomDisplay(0,max-1);
}


// handle the active page
$(document).on('click', 'li', function() {
   $("li").removeClass("active");
   $(this).addClass("active");
});

$(document).on('click', 'th a', function() {
	if(sortMethod.id == $(this).attr("id") && sortDir == 0){
		sortBy($(this).attr("id"), "A");
		sortDir = 1;
	}else{
		sortBy($(this).attr("id"), "D");
		sortMethod.id = $(this).attr("id");
		sortDir = 0;
	}
});

function roomDisplay(start,stop){
	checkSelected();

	var table = '<div class="row" id="roomList"><div class="col-md-12"><table class="table table-striped" id="roomTable"><thead><th></th><th>Room Name <a class="glyphicon glyphicon-sort" id="title"></a></th><th>Created <a class="glyphicon glyphicon-sort" id="created"></a></th><th>Last Activity <a class="glyphicon glyphicon-sort" id="lastActivity"></a></th></thead>';

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

			table += '<tr><td><input type="checkbox" name="checkboxes" id="'+data[i].id+'" value="'+data[i].title+'" checked><td>'+data[i].title+'</td><td>'+created.toLocaleString()+'</td><td>'+activity.toLocaleString()+'</td><td></tr>';
			checked = false;
		}else{
			table += '<tr><td><input type="checkbox" name="checkboxes" id="'+data[i].id+'" value="'+data[i].title+'"><td>'+data[i].title+'</td><td>'+created.toLocaleString()+'</td><td>'+activity.toLocaleString()+'</td><td></tr>';
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


function getUsers(roomId,roomTitle){
	console.log("Your selected RoomId is: ", roomId);
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships?roomId="+roomId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		console.log("got Users: ",data);
		var usersList = [];
		var name = "";
		var id = "";
		var email = "";
		var user = {};
		console.log("length of data: ", data['items'].length);
		var yourself = localStorage.getItem("myEmail");
		console.log("yourself",yourself);
		for (var i = 0; i< data['items'].length; i++){
			console.log("do I make it in here?");
			name = data['items'][i].personDisplayName;
			id = data['items'][i].id;
			email = data['items'][i].personEmail;
			user = {name: name, email: email, id: id};

			//Only push the contact if their email does not contain "bot@" which would indicate this is not a regular user, but a bot such as Cisco Security bot monitoring the room	
			if (email.indexOf("bot@") ==-1){
				if (email != yourself){
					usersList.push(user);
				}//if (email != yourself)
			}//(email.indexOf("bot@") ==-1)

		} //for (var i = 0; i< data.length; i++)
		console.log("UsersList from the room before sorting is: ", usersList);
		usersList.sort((a,b) =>a.name.localeCompare(b.name));
		console.log("UsersList from the room after sorting is: ", usersList);
		displayUsers(usersList,roomTitle);
	});
}

function displayUsers(usersList,roomTitle){

	var HTML = "<div class=\"row\"><div class=\"col-md-6\"><h3>Select Users to Remove from "+roomTitle+" Room</h3>";
	HTML += "<table class=\"table table-striped\" id=\"roomList\"><thead><th></th><th>Name</th><th>Email</th></thead>";
	var removeUsers = {};
	HTML += '<p><label><input type="checkbox" id="checkAll"/> Select all</label></p>';
	for (var i = 0; i < usersList.length ; i++){
		removeUsers = {name: usersList[i].name, id: usersList[i].id};
		//HTML += "<tr><td><input type=\"checkbox\" name=\"checkboxes\" id=\"users\""+i+" value=\""+usersList[i].id+"\"><td>"+usersList[i].name+"</td><td>"+usersList[i].email+"</td></tr>";
		HTML += "<tr><td><input type=\"checkbox\" name=\""+usersList[i].name+"\" id=\"users\""+i+" value=\""+usersList[i].id+"\"><td>"+usersList[i].name+"</td><td>"+usersList[i].email+"</td></tr>";

	} //for (var i = 0; i < usersList.length ; i++)
		
	//HTML += '</table><button class="btn btn-danger" id="leave" type="button" onClick="reviewSelectedUsers()">Remove Users</button>  <button class="btn btn-normal" type="button" onClick=\'window.location="delete.php"\'>Cancel</button></div></div>';
	HTML += "</table><button class=\"btn btn-danger\" id=\"leave\" type=\"button\" onClick=\'reviewSelectedUsers(\""+roomTitle+"\")'>Remove Users</button>  <button class=\"btn btn-normal\" type=\"button\" onClick=\'window.location=\"exodus.php\"\'>Cancel</button></div></div>";

	$(".container").html(HTML);

	$("#checkAll").change(function () {
    $("input:checkbox").prop('checked', $(this).prop("checked"));
		});

	console.log("HTML: ",HTML);

}

function reviewSelectedUsers(roomTitle){
	console.log("DId I pass roomTitle properly?", roomTitle);
	// record any selected
	$("input:checked").each(function(){
		selected.push(this);
	});
	console.log("selected users: ", selected);
	var HTML = "<div class=\"row\" id=\"confirm\"><div class=\"col-md-6\"><h3>Are you sure you want to remove these users from "+roomTitle+"</h3>";
	
	for(var i = 0; i < selected.length; i++){
		HTML += "<p>"+selected[i].name+"</p>";
	};
	//HTML += "<button class=\"btn btn-danger has-spinner\" id=\"leave\" type=\"button\" onClick=\'removeUsers(\"" + selected[i].id + "\")'>Submit <span class=\"spinner\"><i class=\"icon-spin icon-refresh\"></i></span></button>  <button class=\"btn btn-normal has-spinner\" id=\"cancel\" type=\"button\" onClick=\"startOver()\">Cancel <span class=\"spinner\"><i class=\"icon-spin icon-refresh\"></i></span></button></div></div>";
	HTML += "<button class=\"btn btn-danger has-spinner\" id=\"leave\" type=\"button\" onClick=\'removeUsers(\""+roomTitle+"\")'>Remove Users <span class=\"spinner\"><i class=\"icon-spin icon-refresh\"></i></span></button>  <button class=\"btn btn-normal has-spinner\" id=\"cancel\" type=\"button\" onClick=\"startOver()\">Cancel <span class=\"spinner\"><i class=\"icon-spin icon-refresh\"></i></span></button></div></div>";

	$(".container").html(HTML);
}

function removeUsers(roomTitle){
	console.log("selected passed to here: ", selected);
	var count = 0;
	var membershipId;
	for (index in selected){
		console.log("id: ", selected[index].value)
		membershipId = selected[index].value;
		$.ajax({
			url: "https://api.ciscospark.com/v1/memberships/"+membershipId,
			headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
			cache: false,
			method: "DELETE",
			statusCode: {
				204: function(){
					count++;
				}
			}
		}); //function() 
	} //for (index in selected)

	$("#complete").show();
	var HTML = "<div class=\"jumbotron\"><h3>Successfully removed the following users from "+roomTitle+" Room</h3><h5></h5>";
	for(index in selected){
		HTML += "<p>"+selected[index].name+"</p>";
	};
	HTML += '<button class="btn btn-success" type="button" onclick=\'window.location="powerpack.php"\'>Home</button>';
	//$("#complete").html(HTML);
	$(".container").html(HTML);
}




function listRoomsOthers(idTagVal){
	var roomTitleList = [];
	var HTML = '<div class="row"><div class="col-md-6"><h2>Select Room to Remove Users from</h2><div class="form-group" id="roomForm" hidden><div><select name="rooms" id="rooms" class="form-control"><option value="">Select a room:</option></select></div></div>'
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships",
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET",
		statusCode: {
			502: function(){
				$("#roomButton").hide();
				$("#step1a").append("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>")

			}
		}
	}).done(function(rooms){
		console.log("returned data:", rooms);
		var moderatorOfRoomId = [];
		for(var i = 0; i < rooms['items'].length; i++){
			console.log("Room Titles are: ",rooms['items'][i].title);
			if (rooms['items'][i].isModerator){
				moderatorOfRoomId.push(rooms['items'][i].roomId);
			} // if (rooms['items'][i].isModerator)

		 }// for(var i = 0; i < rooms['items'].length; i++)

		console.log("You are the moderator of these rooms: ",moderatorOfRoomId);
		$(".container").html(HTML);
		doSomething(moderatorOfRoomId);
	 });// done(function(rooms)

}

function doSomething(moderatorOfRoomId){
	console.log("I'm in here: ", moderatorOfRoomId);

	for(var i = 0; i < moderatorOfRoomId.length; i++){
		//getRoomTitle(moderatorOfRoomId[i],(moderatorOfRoomId.length-i));
		getRoomTitle(moderatorOfRoomId[i],(moderatorOfRoomId.length));
		console.log("in here: ", myRoomTitles);

	}

}


function getRoomTitle(roomID,numCalls){
	console.log("moderatorOfRoomId passed: ", roomID);
	

	$.ajax({
	url: "https://api.ciscospark.com/v1/rooms/"+roomID,
	headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
	cache: false,
	method: "GET",
	statusCode: {
		502: function(){
			//$("#roomButton").hide();
			$("#step1a").append("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>")

		}
		}
	}).done(function(data){ 
		console.log("numCalls passed: ", numCalls);
		var roomTitle = data;
		console.log("roomTitle: ", roomTitle);
		myRoomTitles.push(roomTitle);
		console.log("myRoomTitles.push(roomTitle) ", myRoomTitles);
		//if (numCalls == 1){
		console.log("myRoomTitles.length: ", myRoomTitles.length);
		//make sure we have the number of roomTitles equaling the number of RoomId before we display the room Titles
		if (myRoomTitles.length == numCalls){ 
			console.log("I'm Done");
			displayRoomTitles();
		}
	});

	
} //for main function


function displayRoomTitles(){
	console.log("myRoomTitles.push(roomTitle) in displayRoomTitles()", myRoomTitles);

	$("#removesel").hide();
	//$("#listRoomsOthers").hide();
	$("#listRoomsSelf").hide();
	$("#roomButton").toggleClass('active');
	$("#step1a").show();
	$("#listRoomsOthers").removeClass("active");
	console.log("myRoomTitles before sorting: ", myRoomTitles);
	myRoomTitles.sort((a,b) =>a.title.localeCompare(b.title));
	console.log("myRoomTitles after sorting: ", myRoomTitles);
	for (var i =0; i < myRoomTitles.length; i++){
		var roomName = myRoomTitles[i].title;
		//var roomId = rooms['items'][i].id;
		var created = new Date(myRoomTitles[i].created);
		var activity = new Date(myRoomTitles[i].lastActivity);
		$("#rooms").append("<option value="+i+">"+roomName+"</option>");
		} // for (var i =0; i < myRoomTitles.length; i++)
		
	$("#roomForm").show();
	$("#roomButton").hide();

}

function roomsClickOthers(){
	//$("#listRoomsOthers").toggleClass('active');
	$("#intro").remove();
	var idTagVal = $("#listRoomsOthers").val();
	console.log("idTagVal", idTagVal);
	listRoomsOthers(idTagVal);

}




function startOver(){
	selected = [];
	myRooms = [];
	location.reload();

}