var emailNames = [];
var myRooms = [];
var selectedRoom = {};
var page = 0;
var pageData = [];
var sparkToken = localStorage.getItem("sparkToken");
var url = "https://api.ciscospark.com/v1/rooms";
var next = "";
var max = 10;

//////////////////////////////////////
// Site Layout Control
/////////////////////////////////////
var importType = 0;
// 1 = existing room 
// 2 = new room

$("#existing").click(function() {
	importType = 1;
	bread(1);
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(next,url);
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
    selectedRoom = pageData[i];
	$("#dvImportSegments").prepend("<h3>Upload a list of contacts to add to the "+pageData[i].title+" room.</h3>");
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

function add(finalEmailNames){
	// loop through contacts and add them to room
	console.log("finalEmailNames: ", finalEmailNames);
	//need to convert it back to a list, since html changed it from a list back to a string
	finalEmailNames = finalEmailNames.split(",")
	console.log("finalEmailNames back to list: ", finalEmailNames)
	for(i in finalEmailNames){
		personEmail = finalEmailNames[i];
		console.log("personEmail in add(): ", personEmail);
		addContact(selectedRoom.id, personEmail);
		console.log(personEmail + " Added to room");
	}
	$("#step2").hide();
	$("#myContacts").val("");
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

function listRooms(next,url){
		$("#roomButton").hide();
	
	// check for cached data
	if (localStorage.getItem("roomList")){
		pageData = JSON.parse(localStorage.getItem("roomList"));
		page = localStorage.getItem("page");
		roomDisplay();
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
				listRooms(match[1], url);
			}else{
				//flatten the pageData array 
				pageData = _.flatten(pageData);
				pageData = sortObjectBy(pageData,"title","A");
				localStorage.setItem("roomList", JSON.stringify(pageData));
				localStorage.setItem("page", page);
				// call the pagiation script
				roomDisplay();
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

function roomDisplay(){
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
	$("#step1a").hide();
	$("#roomForm").hide();
	pageData = [];
	localStorage.removeItem("roomList");
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(next,url);
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
   	var finalEmailNames;
   	
   	//Get existing Room members and eliminate them from the new email list if they are already in an existing member
   	getExistingMembership(selectedRoom.id,function(returnedData){
   	RoomMembershipData = returnedData;
  	console.log("What am I getting for RoomMembershipData: ",RoomMembershipData);

  	//compare inputted users to existing users already in the room and return only the new users
  	finalEmailNames = newEmails(results.validUsersList,RoomMembershipData);
  	console.log("returned finalEmailNames: ", finalEmailNames);
  	
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
		user = user.replace(/[^a-zA-Z0-9@.]/g, '');
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
	var HTML = "<h3>" + numUsers + " new valid users to add to the room</h3>";
	if (numUsers > 0){
		HTML += "<table class=\"table table-condensed\"><th>Email Address</th>";
		for(i in myemails){
			HTML += "<tr><td>"+myemails[i]+"</td></tr>";
		};
		HTML += "</table>";
		HTML += "<button id=\"addContacts\" class=\"btn btn-success\" type=\"button\" onClick=\'add(\"" + myemails + "\")'>Add Contacts</button>";
	};

	$("#dvImportSegments").hide();
	$( "#displayContacts" ).html(HTML);
	
	/*
	//Display the invalid email addresses entered/read from file.
	console.log("invalidUsersList.length: ", invalidUsersList.length);
	if (invalidUsersList.length>0){
		console.log("invalidUsersList.length: ", invalidUsersList.length);
		var invalHTML = "<h3>" + invalidUsersList.length + " invalid user email addresses</h3>";	
		invalHTML += "<table class=\"table table-condensed\"><th>Not valid Email Address</th>";
		for (i in invalidUsersList){
			invalHTML += "<tr><td>"+invalidUsersList[i]+"</td></tr>";
		};
		invalHTML += "</table>";
	};
	
	$("#dvImportSegments").hide();
	$( "#displayContacts" ).html(invalHTML);
	*/
}


function getExistingMembership(roomId,callback){

	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships?roomId="+roomId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		console.log("membership: ",data);
		console.log("Membership Email[0]", data.items[0].personEmail);
		console.log("data.items: ", data.items);
		callback(data);
	});
}

//compare new list of users with existing users and return only new users.
function newEmails(emailNames,existingMembers) {
	var existingEmails = [];
	console.log("new unique emails: ", emailNames);
	console.log("existingMembers: ",existingMembers);
	for(var i = 0; i < Object.keys(existingMembers.items).length; i++){
		console.log("Existing Members: ",existingMembers.items[i].personEmail);
		if (existingMembers.items[i].personEmail != ""){
		existingEmails.push(existingMembers.items[i].personEmail);
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
		tmpEmailNames.push(myemails);
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