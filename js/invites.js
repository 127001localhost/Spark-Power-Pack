var emailNames = [];
var myRooms = [];
var selectedRoom = {};
var addFailure = [];
var pageData = [];
var page = 0;
var retry = 0;
var finalEmailNames;


$("#existing").click(function() {
	$('#intro').hide();
	importType = 1;
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data (this may take some time)...</h3></div></div>');

	//retreive room list
	getRooms();	
});

var getRooms = function(){
	// pull a list of rooms
	var dfd = $.Deferred();
	listRooms(dfd, "10000");
	dfd.fail(function(data){
		handleError(data);
	});
	dfd.done(function(data){
		$("#progress").remove();
		roomDisplay();
	});
};

$("#new").click(function() {
	$('#intro').hide();
	$("#step1b").show();
});

$(document).on('click', '#refreshRooms', function(){
	refreshRooms();
});

$('#createRoom').click(function(){
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Creating Room...</h3></div></div>');
	var title = $("#newRoom").val();
	var dfd = $.Deferred();
	createARoom(dfd, title);
	dfd.done(function(data){
		if(data.xhr.status == 200){
			selectedRoom = JSON.parse(data.xhr.responseText);
			$('#progress').remove();
			$('#step1b').remove();
			$('#step2').show();
			$('.container').prepend('<h3>Upload or input a list of contacts (500 names or less) to add to: ' + title + '</h3>');
		};
	});
});

$("#refreshToken").click(function(){
	refreshToken();
});

$("#startOver").click(function(){
	startOver();
});

$(document).on('change', '#rooms', function() {
    var i = $("#rooms").val();
    selectedRoom = pageData[i];
    $('#selectRoom').remove();
    $('#step2').show();
	$('.container').prepend("<h3>Upload or input a list of contacts to add to: "+pageData[i].title+"</h3>");
  });


//////////////////////////////////////

function add(finalEmailNames){
	$("#validatedContacts").hide();
	$("#myContacts").val("");
	$('.container').append('<div class="row" id="progress"><div class="col-md-12 text-center"><h3>Adding contacts to Room: '+selectedRoom.title+'</h3><img src="images/progress-ring.gif"><h4>Depending on the number of contacts you are adding to the room, this may take up to 5 minutes. A message will appear below once the process is complete.</h4></div></div>');
	// clear the addFailure array
	addFailure = [];
	// loop through contacts and add them to room
	console.log("finalEmailNames: ", finalEmailNames);
	
$.ajax({
    type: "POST",
    cache: false,
    url: 'http://api.bdmcomputers.com:8080/inviteContacts',
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({'inviteList': finalEmailNames, 'roomId': selectedRoom.id, 'token': sparkToken})
  }).done(function(data){
  	console.log(data);
  	if(data.success){
  		$('.container').html('<h4>Your contacts have been added!<br><br><button class="btn btn-success" type="button" onclick=\'window.location="powerpack.php"\'>Home</button>');
  	};
  });
};

$(document).on('click', '#addContacts', function(e){
	e.preventDefault();
	add(finalEmailNames);
});

function roomDisplay(){
	var HTML = "<div id='selectRoom'><div class='row'><div class='col-md-12'><h2>Select the room you wish to invite people to.</h2></div></div>";
	HTML += "<div class='row'><div class='col-md-6'><div class='form-group' id='roomForm' hidden><select name='rooms' id='rooms' class='form-control'><option value=''>Select a room:</option></select><span id='refreshRooms'><h4 style='display: inline-block;'><i class='glyphicon glyphicon-refresh'></i> Click here to refresh your rooms</h4></span></div>";

	$(".container").append(HTML);

	for(var i = 0; i < pageData.length; i++){
		var roomName = pageData[i].title;
		var roomId = pageData[i].id;

		$("#rooms").append("<option value="+i+">"+roomName+"</option>");
	}
	$("#progress").remove();
	$("#step1a").show();
	$("#roomForm").show();
}

function refreshRooms(){
	$("#selectRoom").remove();
	$("#roomForm").hide();
	pageData = [];
	localStorage.removeItem("roomList");
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data (this may take some time)...</h3></div></div>');

	getRooms();
};

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
              //parse the contacts
              parseContacts(csvData);

            } else {
                alert('No data to import!');
            }

        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
	}
}

//Parse the contacts from the user
function parseContacts(csvData){
	
	var roomOwner = localStorage.getItem("myEmail");
	console.log("Parsing contacts from user input");
	
	//get contacts from input textbox
	var userContacts = $("#myContacts").val();
	console.log("user contacts: ", userContacts);
	
	//get contacts from user file
	if (csvData && csvData.length>0){
		userContacts = csvData;
		}

	//create a list of contacts	
	var userContactsListCR = userContacts.split("\n");
	var userContactsListSP = userContacts.split(" ");
	var userContactsListComma = userContacts.split(",");

	//determine how the user contacts are inputted. 1 user per line? space between each user? comma between each user?
	if (userContactsListSP.length<2 || userContactsListCR.length>2) {
		console.log("userContactsListCR: ", userContactsListCR);
		emailNames = findUnique(userContactsListCR);  //remove any duplicate emails
		console.log("unique emailNames: ", emailNames);
	};
	if (userContactsListSP.length>1 || userContactsListCR.length<2) {
		console.log("userContactsListSP: ", userContactsListSP);
		emailNames = findUnique(userContactsListSP);  //remove any duplicate emails
		console.log("unique emailNames: ", emailNames);
	};
	console.log("userContactsListComma: ", userContactsListComma);
	if (userContactsListSP.length <2 && userContactsListCR.length<2){
		emailNames = findUnique(userContactsListComma);
		}

	//check if emails are valid and get valid email list and invalid email list
	var results = validEmail(emailNames,roomOwner);
	console.log("retuned validEmailList: ", results.validUsersList);
	console.log("returned invalidEmailList: ", results.invalidUsersList);
	
	//Remove the owner of the room from the list since they're already in the room 
	var indexRoomOwner = results.validUsersList.indexOf(roomOwner);
	if (indexRoomOwner > -1) {
		results.validUsersList.splice(indexRoomOwner, 1);
	}

	console.log("Room Owner Removed: ", results.validUsersList);
	var RoomMembershipData;
   	
  //Get existing Room members and eliminate them from the new email list if they are already in an existing member
  var dfd = $.Deferred();
  listMemberships(dfd, selectedRoom.id, null, null, 1000);

  dfd.done(function(data){
  	RoomMembershipData = data.results;
  	console.log(RoomMembershipData);
  	finalEmailNames = newEmails(results.validUsersList,RoomMembershipData);
  	console.log("returned finalEmailNames: ", finalEmailNames);
  	//truncate list
  	finalEmailNames = finalEmailNames.splice(0, 950);
  	
  	//display the valid new users
  	displayUserCount(finalEmailNames,results.invalidUsersList);
  });
  	
}

//check to make sure the user input are valid email addresses
function validEmail(usersList,roomOwner){
	var validUsersList = [];
	var invalidUsersList = [];
	//console.log("in validEmail() RoomOwner: ", roomOwner);
	userDomain = "@" + roomOwner.substring(roomOwner.indexOf("@") + 1);
	console.log("userDomain: ", userDomain);

	//used to test for a valid email
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	//console.log("number of users: ", usersList);
	console.log("in validEmail() - usersList", usersList.length);
	
	//loop through each user and test for valid email.
	for (var i = 0; i < usersList.length; i++){
		var user = usersList[i];
		console.log("before applying a filter: " + "'" + user + "'");
		user = user.replace(/[^a-zA-Z0-9@.\-\+\_]/g, '');
		console.log("user after filtering out special characters and spaces: " + "'" + user + "'");
		var goodEmail = re.test(user);
		console.log("loop # ", i);
		
			//Make sure the user does not start out with ^group. and user does not already have @cisco.com and user not empty
			if (user.search('^group.') == -1 && user.search(userDomain) == -1 && user !="" && !goodEmail){
				//user = user+"@cisco.com";
				user = user+userDomain;
				console.log("user is now: ", user);
				validUsersList.push(user);

			}
			else{
				if (goodEmail){
					console.log("That is a valid email: ", user);
					validUsersList.push(user);
					}
				else{
					console.log("That is an invalid email:", user);
					invalidUsersList.push(user);
				}
			}

		}
	return {validUsersList: validUsersList,
			invalidUsersList: invalidUsersList};
};


function displayUserCount(myemails,invalidUsersList) {
	console.log("in displayUserCount() now: ");
	numUsers = myemails.length;
	console.log("in displayUserCount: finalEmailNames are: ", myemails);
	var HTML = '<h3>' + numUsers + ' new valid users to add to room: ' +selectedRoom.title+ ' </h3>';
	if (numUsers > 0){
		HTML += "<table class=\"table table-condensed\"><th>Email Address</th>";
		for(i in myemails){
			HTML += "<tr><td>"+myemails[i].personEmail+"</td></tr>";
		};
		HTML += "</table>";
		HTML += "<button id=\"addContacts\" class=\"btn btn-success\" type=\"button\">Add Contacts</button>   ";
		HTML += '<button class="btn btn-normal" type="button" onClick="startOver()">Cancel</button>';
	};

	$("#step2").hide();
	$('.container > h3').remove();
	$('#validatedContacts').show();
	$( "#validatedContacts" ).html(HTML);
	
}

//compare new list of users with existing users and return only new users.
function newEmails(emailNames,existingMembers) {
	var existingEmails = [];
	console.log("new unique emails: ", emailNames);
	console.log("existingMembers: ",existingMembers);
	for(var i = 0; i < Object.keys(existingMembers).length; i++){
		console.log("Existing Members: ",existingMembers[i].personEmail);
		if (existingMembers[i].personEmail != ""){
		existingEmails.push(existingMembers[i].personEmail);
		}
	}
	console.log("existingEmails: ", existingEmails);
	//var counter = emailNames.length;
	var tmpEmailNames = [];
	for(var i = 0; i <=emailNames.length; i++){
		var myemails = "";
		
		myemails = emailNames[i];
		console.log("myemails: ", myemails);
		if ($.inArray(myemails,existingEmails) != -1) {
			console.log (emailNames[i] + "is already a member");
			//emailNames.splice(i,1);
			//console.log("emailNames is now: ", emailNames);
		} else{
		tmpEmailNames.push({"personEmail" : myemails});
		}
	}
	tmpEmailNames.pop(); // the last email is undefined, so we need to remove it

	console.log("final tmpEmailNames to add to the room: ", tmpEmailNames);
	return tmpEmailNames;
}


function findUnique(arr) {
    var result = [];
    arr.forEach(function (d) {
        if (result.indexOf(d) === -1)
            result.push(d);
    });
    return result;
}