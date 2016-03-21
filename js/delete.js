var page = 0;
var pageData = [];
var selected = []; // array for tracking item selections when moving between pages
var myRoomTitles = [];

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
		HTML += '<button class="btn btn-normal" type="button" onclick=\'window.location="powerpack.php"\'>Home</button>';
		$(".container").html(HTML);
	}
}	

function leaveSelected(){
	for(var i = 0; i < selected.length; i++){
		getMembershipId(selected[i].id, localStorage.getItem("myId"), (i+1));
	}
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

function listRooms(next="",url="https://api.ciscospark.com/v1/rooms"){
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
			// call the pagiation script
			pagination();
		}
	});
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
	var pageNav = "<div class='row'><div class='col-md-6'><span>Rooms per/page: <input type='text' placeholder=10 size='2' maxlength='2' id='max'> <button class='btn btn-normal' id='perPage' type='button' onClick='perPage()'>Update</button><h4 id='pageNav'>page(s): </h4></span></div><div>";
	$(".container").append(pageNav);	

	var totalRooms = pageData.length;
	//console.log(totalRooms);
	var numPages = (totalRooms / max);
	var HTML = "<h4 id='pageNav'>page(s): ";
	for(var i = 0; i < numPages; i++){
		var start = i * max;
		var stop = start + max-1;
		if(stop > totalRooms){
			stop = totalRooms - 1;
		}
		var pageDisplay = i + 1;
		HTML += " <a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a> ";
	}
	HTML += "</h4></span></div><div>";
	$("#pageNav").html(HTML);

	roomDisplay(0,max-1);
}

function roomDisplay(start,stop){
	checkSelected();

	var table = "<div class='row' id='roomList'><div class='col-md-12'><table class='table table-striped' id='roomTable'><thead><th></th><th>Room Name</th><th>Created</th><th>Last Activity</th></thead>";

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

			table += "<tr><td><input type='checkbox' name='checkboxes' id='"+data[i].id+"' value='"+data[i].title+"' checked><td>"+data[i].title+"</td><td>"+created.toLocaleString()+"</td><td>"+activity.toLocaleString()+"</td><td></tr>";
			checked = false;
		}else{
			table += "<tr><td><input type='checkbox' name='checkboxes' id='"+data[i].id+"' value='"+data[i].title+"'><td>"+data[i].title+"</td><td>"+created.toLocaleString()+"</td><td>"+activity.toLocaleString()+"</td><td></tr>";
		}
		
	}
		$("#roomList").remove();
		$(".container").append(table);

		var button = "</br><button class='btn btn-success' type='button' onclick='reviewSelected()'>Review Selection(s)</button>  <button class='btn btn-normal' type='button' onclick='window.location=\"delete.php\"'>Cancel</button>";
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

			//Only push the contact into usersList if the user's name is not Cisco Security or the moderator that is removing users
			//Can't remove Cisco Security user anyways from a room.
			if (name !="Cisco Security"){
				if (email != yourself){
					usersList.push(user);
				}//if (email != yourself)
			}//if (name !="Cisco Security")

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
	HTML += "</table><button class=\"btn btn-danger\" id=\"leave\" type=\"button\" onClick=\'reviewSelectedUsers(\""+roomTitle+"\")'>Remove Users</button>  <button class=\"btn btn-normal\" type=\"button\" onClick=\'window.location=\"delete.php\"\'>Cancel</button></div></div>";

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
	var HTML = "<h3>Successfully removed the following users from "+roomTitle+" Room</h3>";
	for(index in selected){
		HTML += "<p>"+selected[index].name+"</p>";
	};
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
		getRoomTitle(moderatorOfRoomId[i],(moderatorOfRoomId.length-i));
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
		var roomTitle = data;
		console.log("roomTitle: ", roomTitle);
		myRoomTitles.push(roomTitle);
		console.log("myRoomTitles.push(roomTitle) ", myRoomTitles);
		if (numCalls == 1){ 
			console.log("I'm Done");
			displayRoomTitles();
		}
	});

	
} //for main function


function displayRoomTitles(){
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