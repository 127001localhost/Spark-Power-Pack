var emailNames = [];
var myRooms = [];
var selectedRoom = {};
var sparkToken = localStorage.getItem("sparkToken");
console.log(sparkToken);

//////////////////////////////////////
// Site Layout Control
/////////////////////////////////////
var importType = 0;
// 1 = existing room 
// 2 = new room

$("#existing").click(function() {
	importType = 1;
	bread(1);
	$("#step1a").show();
});

$("#new").click(function() {
	importType = 2;
	bread(1);
	$("#step1b").show();
});

$("#refreshToken").click(function(){
	refreshToken();
});

$("#startOver").click(function(){
	startOver();
});

$('select[name="rooms"]').change(function() {
	bread(2);
    var i = $("#rooms").val();
    console.log(myRooms[i]);
    selectedRoom = myRooms[i];
	$("#dvImportSegments").prepend("<h3>Select a list of contacts to add to the "+myRooms[i].title+" room.</h3>");
  });

function bread(step){
	switch(step) {
		case 1:
			$("#intro").hide();
			$("#bread").show();
			$("#bread1").addClass("active");
			$("#bread2").removeClass("active");
			$("#bread3").removeClass("active");
			break;
		case 2:
   			$("#step1a").hide();
			$("#step1b").hide();
			$("#bread1").removeClass("active");
			$("#bread2").addClass("active");
			$("#bread3").removeClass("active");
			$("#step2").show();
			break;
		case 3:
			$("#bread").show();
			$("#bread1").removeClass("active");
			$("#bread2").removeClass("active");
			$("#bread3").addClass("active");
			break;
		default:
			$("#bread").hide();
			$("#bread1").removeClass("active");
			$("#bread2").removeClass("active");
			$("#bread3").removeClass("active");
			break;
	};
}

//////////////////////////////////////

function add(){
	// loop through contacts and add them to room
	//var roomOwner = localStorage.getItem("myEmail");
	//console.log("RoomOwner: ", roomOwner);
	for (var i = 0; i < emailNames.length; i++){
		personEmail = emailNames[i];
		addContact(selectedRoom.id, emailNames[i]);
		console.log(emailNames[i] + " Added to room");
		/*
		if (personEmail == roomOwner){
			console.log("RoomOwner: " + personEmail + " Not added to the room");
		}else{
			addContact(selectedRoom.id, emailNames[i]);
			console.log(emailNames[i] + " Added to room");

		};*/
		
	}
	$("#step2").hide();
	$("#step3").show();
	bread(3);
}

function addContact(roomId, personEmail){
	var body = JSON.stringify({roomId: roomId, personEmail: personEmail});
	var sucess = 0;
	// setup HTTPS request
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			if (xhttp.status == 200) {
				//var response = JSON.parse(xhttp.responseText);
				console.log(xhttp.status);
			}else{
				console.log('Error: ' + xhttp.statusText);
			}
		}
	}
	xhttp.open('POST', 'https://api.ciscospark.com/v1/memberships', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('Authorization', sparkToken);
	xhttp.send(body);
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
				selectedRoom = response;
				console.log(newRoom.id);
			}else{
				console.log('Error: ' + xhttp.statusText);
			}
			$("#createRoom").removeClass('active');
			bread(2);
			$("#dvImportSegments").prepend("<h3>Select a list of contacts to add to the "+title+" room.</h3>");

		}
	}
	xhttp.open('POST', 'https://api.ciscospark.com/v1/rooms', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('Authorization', sparkToken);
	xhttp.send(body);
}

function roomsClick(){
	$("#roomButton").toggleClass('active');
	var i = 0;
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
					$("#rooms").append("<option value="+i+">"+roomName+"</option>");
				}
				i++
				$("#roomForm").show();
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
	window.location="index.html";
}

function startOver(){
	location.reload();
};


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
	var csvDataList = [];
    var emailUser =[];
	var roomOwner = localStorage.getItem("myEmail");
	console.log("RoomOwner: ", roomOwner);
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
              console.log("csvData: " + csvData);
              csvDataList = csvData.split("\n");
			  for (var i = 0; i < csvDataList.length; i++){
			  	email = csvDataList[i].replace(/\s+/g, '');
			  	if (roomOwner != email){  //if email does not belong to the roomOwner
			  	emailUser.push(email);
			  	console.log("emailUser: " + emailUser);
			  	};
			  }
			  emailUser.push("") //push an empty email record at the end
			  emailNames = emailUser;
			  console.log("emailNames after removing empty space: ", emailNames);
			  console.log("completed emailUser: ", emailUser);
              console.log("all emails: " + "'" + emailNames + "'");
              emailNames = findUnique(emailNames);  //remove any duplicate emails
              emailNames = emailNames.slice(0,-1);	//remove the empty field at the end of the array
              console.log("unique emails only from uniqueEmailName : ", emailNames);
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
	var HTML = "<h3>Read " + numUsers + " unique users from file</h3>";
	if (numUsers > 1){
		HTML += "<table class=\"table table-condensed\"><th>Email Address</th>";
		for(i in emailNames){
			HTML += "<tr><td>"+emailNames[i]+"</td></tr>";
		};
		HTML += "</table>";
		HTML += "<button id=\"addContacts\" class=\"btn btn-success\" type=\"button\" onClick=\"add()\">Add Contacts</button>";
	};
	$("#dvImportSegments").hide();
	$( "#displayContacts" ).html(HTML);

}

function findUnique(arr) {
    var result = [];
    arr.forEach(function (d) {
        if (result.indexOf(d) === -1)
            result.push(d);
    });
    return result;
}


