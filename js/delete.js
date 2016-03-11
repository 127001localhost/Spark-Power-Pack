var myRooms = [];
var sparkToken = localStorage.getItem("sparkToken");

console.log(sparkToken);

//////////////////////////////////////
// Site Layout Control
/////////////////////////////////////


function roomsClick(){
	$("#listRooms").toggleClass('active');
	var HTML = "<table class=\"table table-striped\" id=\"roomList\"><thead><th></th><th>Room Name</th><th>Created</th><th>Last Activity</th></thead>";
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			if (xhttp.status == 200) {
				var rooms = JSON.parse(xhttp.responseText);
				for(var i = 0; i < rooms['items'].length; i++){
					console.log(rooms['items'][i].title);
					myRooms.push(rooms['items'][i]);
					var roomName = rooms['items'][i].title;
					var roomId = rooms['items'][i].id;
					HTML += "<tr><td><input type=\"checkbox\" name=\"checkboxes\" id=\"roomIndex\""+i+" value=\""+i+"\"><td>"+roomName+"</td><td>"+rooms['items'][i].created+"</td><td>"+rooms['items'][i].lastActivity+"</td><td></tr>";
				}
				HTML += "</table>";
				$("#myRooms").show();
				$("#myRooms").html(HTML);
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
	var selected = [];
	$("#roomList :checked").each(function(){
		selected.push($(this).val());
		console.log(myRooms[$(this).val()].id);
	});
	console.log(selected);
}

function startOver(){
	location.reload();
}