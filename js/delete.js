var myRooms = [];
var selected = [];

function getMembershipId(roomId, personId){
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships?roomId="+roomId+"&personId="+personId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		console.log(data);
		leaveRoom(data.items[0].id);
	});
}

function leaveRoom(membershipId){
	var count = 0;
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
	});
	$("#confirm").empty();
	$("#complete").show();
	var HTML = "<h3>Successfully left the following rooms:</h3>";
	for(index in selected){
		HTML += "<p>"+myRooms[selected[index]].title+"</p>";
	};
	$("#complete").html(HTML);
}

function leaveSelected(){
	for(i in selected){
		getMembershipId(myRooms[selected[i]].id, localStorage.getItem("myId"));
	}
}

function reviewSelected(){
	$("#roomList :checked").each(function(){
		selected.push($(this).val());
	});
	$("#myRooms").hide();
	$("#confirm").show();
	var HTML = "<h2>Are you sure you wish to leave the following rooms?</h2>";
	for(index in selected){
		HTML += "<p>"+myRooms[selected[index]].title+"</p>";
	};
	//console.log(selected);
	$("#confirm").prepend(HTML);
}

function roomsClick(){
	$("#listRooms").toggleClass('active');
	var HTML = "<table class=\"table table-striped\" id=\"roomList\"><thead><th></th><th>Room Name</th><th>Created</th><th>Last Activity</th></thead>";

	$.ajax({
		url: "https://api.ciscospark.com/v1/rooms?max=50",
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
		for(var i = 0; i < rooms['items'].length; i++){
			//console.log(rooms['items'][i].title);
			myRooms.push(rooms['items'][i]);
			var roomName = rooms['items'][i].title;
			var roomId = rooms['items'][i].id;
			var created = new Date(rooms['items'][i].created);
			var activity = new Date(rooms['items'][i].lastActivity);
			HTML += "<tr><td><input type=\"checkbox\" name=\"checkboxes\" id=\"roomIndex\""+i+" value=\""+i+"\"><td>"+roomName+"</td><td>"+created.toLocaleString()+"</td><td>"+activity.toLocaleString()+"</td><td></tr>";
		}
		HTML += "</table>";
		$("#myRooms").show();
		$("#myRooms").prepend(HTML);
		$("#intro").hide();
	});

}

function startOver(){
	selected = [];
	myRooms = [];
	location.reload();
}