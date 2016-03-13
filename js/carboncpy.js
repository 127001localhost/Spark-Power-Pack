var myRooms = [];
var selected = [];
var sparkToken = localStorage.getItem("sparkToken");

console.log(sparkToken);

//////////////////////////////////////
// Site Layout Control
/////////////////////////////////////

function sendSelected(){
	message = $("#myMessage").val()
	console.log(selected.length);
	console.log("message: ", message);
	//theFile = "http://exmoorpet.com/wp-content/uploads/2012/08/cat.png"
	for(i in selected){
		console.log("sending message to: "+myRooms[selected[i]].title);
		//getMembershipId(myRooms[selected[i]].id);
		sendMessage(myRooms[selected[i]].id,message);
	}
}


function getMembershipId(roomId){
	console.log("I'm in getMembershipId with roomId: ", roomId);
	$.ajax({
		url: "https://api.ciscospark.com/v1/messages?roomId="+roomId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		console.log(data);
		sendMessage(data.items[0].id,"Hello from from SparkPowerPAK");
	});
}


function sendMessage(roomId,theMessage){
	console.log("tried sending this message out: ", theMessage);
	console.log("roomId: ", roomId);
	var count = 0;
	$.ajax({
		url: "https://api.ciscospark.com/v1/messages",
		headers: {'Content-Type': 'application/json; charset=utf-8', 'Authorization': sparkToken},
		cache: false,
		type: "POST",
		dataType: 'json',
        data: JSON.stringify({roomId: roomId, text: theMessage}),
		statusCode: {
			200: function(){
				count++;
			}
		}
	});
	$("#confirm").empty();
	$("#complete").show();
	$("#complete").html("<h3>Success!</h3>");
}


function roomsClick(){
	$("#listRooms").toggleClass('active');
	var HTML = "<table class=\"table table-striped\" id=\"roomList\"><thead><th></th><th>Room Name</th><th>Created</th><th>Last Activity</th></thead>";
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			if (xhttp.status == 200) {
				var rooms = JSON.parse(xhttp.responseText);
				for(var i = 0; i < rooms['items'].length; i++){
					//console.log(rooms['items'][i].title);
					myRooms.push(rooms['items'][i]);
					var roomName = rooms['items'][i].title;
					var roomId = rooms['items'][i].id;
					HTML += "<tr><td><input type=\"checkbox\" name=\"checkboxes\" id=\"roomIndex\""+i+" value=\""+i+"\"><td>"+roomName+"</td><td>"+rooms['items'][i].created+"</td><td>"+rooms['items'][i].lastActivity+"</td><td></tr>";
				}
				HTML += "</table>";
				$("#myRooms").show();
				$("#myRooms").prepend(HTML);
				$("#intro").hide();
			}else{
				console.log('Error: ' + xhttp.statusText);
			}
		}
	}
	xhttp.open('GET', 'https://api.ciscospark.com/v1/rooms?max=50', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('Authorization', sparkToken);
	xhttp.send();
}

function refreshToken(){
	localStorage.removeItem("sparkToken");
	window.location="spark_auth.html";
}

function reviewSelected(){
	$("#myMessage").val("")
	$("#roomList :checked").each(function(){
		selected.push($(this).val());
	});
	$("#myRooms").hide();
	$("#confirm").show();
	var HTML = "<h2>Your message will be sent to these rooms</h2>";
	for(index in selected){
		HTML += "<p>"+myRooms[selected[index]].title+"</p>";
	};
	console.log(selected);
	$("#confirm").prepend(HTML);
}

function startOver(){
	selected = [];
	myRooms = [];
	location.reload();
}