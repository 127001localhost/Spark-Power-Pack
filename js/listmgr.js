var emailNames = [];
var myRooms = [];
var newRoom = {};
var sparkToken = localStorage.getItem("sparkToken");

console.log(sparkToken);

$("#refreshToken").click(function(){
	refreshToken();
});

$('select[name="rooms"]').change(function() {
    var test = $("#rooms").val();
    console.log(test);
  });

function addContacts(){
	// capture new roomId
	roomId = newRoom.id;

	// loop through contacts and add them to room
	for (email in emailNames){
		personEmail = email;
		console.log(personEmail);
		var body = JSON.stringify({roomId: roomId, personEmail: personEmail});

		// setup HTTPS request
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if(xhttp.readyState == 4){
				if (xhttp.status == 200) {
					var response = JSON.parse(xhttp.responseText);
					newRoom = response;
					console.log(newRoom.id);
				}else{
					console.log('Error: ' + xhttp.statusText);
				}
				$("#createRoom").removeClass('active');
			}
		}
		xhttp.open('POST', 'https://api.ciscospark.com/v1/memberships', true);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.setRequestHeader('Authorization', sparkToken);
		xhttp.send(body);
	};
}

function createRoom(){
	$("#createRoom").toggleClass('active');
	var title = $("#newRoom").val();
	var body = JSON.stringify({title: title});
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			if (xhttp.status == 200) {
				var response = JSON.parse(xhttp.responseText);
				newRoom = response;
				console.log(newRoom.id);
			}else{
				console.log('Error: ' + xhttp.statusText);
			}
			$("#createRoom").removeClass('active');
		}
	}
	xhttp.open('POST', 'https://api.ciscospark.com/v1/rooms', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('Authorization', sparkToken);
	xhttp.send(body);
}

function roomsClick(){
	$("#roomButton").toggleClass('active');
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
					$("#rooms").append("<option value="+roomId+">"+roomName+"</option>");
				}
				$("#rooms").show();
				$("#roomButton").hide();
			}else{
				console.log('Error: ' + xhttp.statusText);
			}
		}
	}
	xhttp.open('GET', 'https://api.ciscospark.com/v1/rooms?max=10', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('Authorization', sparkToken);
	xhttp.send();
}

function refreshToken(){
	localStorage.removeItem("sparkToken");
	window.location="spark_auth.html";
}


///////////////////////////////////////
// File upload stuff

// The event listener for the file upload
document.getElementById('txtFileUpload').addEventListener('change', upload, false);

// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    isCompatible = true;
    }
    return isCompatible;
}

// Method that reads and processes the selected file
function upload(evt) {
	if (!browserSupportFileUpload()) {
	    alert('The File APIs are not fully supported in this browser!');
    } else {
    	console.log("upload triggered");
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            var csvData = event.target.result;
            if (csvData && csvData.length > 0) {
              emailNames = csvData.split("\n");
              console.log(emailNames);
            } else {
                alert('No data to import!');
            }
        	displayUserCount();
        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
	}
}
function displayUserCount() {
	numUsers = emailNames.length;
	$( "#blah" ).html("Read " + numUsers + " users from file");

}