//Global variables
var currentTime = new Date().getTime() / 1000;
var expiresIn = localStorage.getItem("expires_in");

if(localStorage.getItem("sparkToken") && currentTime < expiresIn){
	var sparkToken = localStorage.getItem("sparkToken");

	if(localStorage.getItem("myAvatar") != "undefined") {
		$("#profile").append("<img class=\"user dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" src=\""+localStorage.getItem("myAvatar")+"\">");
	}else{
		var displayName = localStorage.getItem("displayName");
		var initial = displayName[0].toUpperCase();
		$("#profile").append('<div class="user-text dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><p>'+initial+'</p></div>');
		console.log("no avatar");
	}

}else{
	window.location="index.html";
}

function refreshToken(){
	localStorage.clear();
	window.location="index.html";
}

function handleError(error){
	var statusCode = error.status;
	var displayError = "";
	var cont = true;

	switch(statusCode) {
		case 401:
			// Authentication credentials were missing or incorrect.
			displayError = 'There is a problem with your authorization token. Please <a href="#" class="alert-link", onCLick="refreshToken();">click here</a> to re-authorize the Spark Power Pack.';
			cont = false;
		break;
		/*
		case 400:
			//The request was invalid or cannot be otherwise served. An accompanying error message will explain further.
		break;
		case 403:
			// The request is understood, but it has been refused or access is not allowed.
		break;
		case 404: 
			// The URI requested is invalid or the resource requested, such as a user, does not exist. Also returned when the requested format is not supported by the requested method.
		break;
		case 409:
			// The request could not be processed because it conflicts with some established rule of the system. For example, a person may not be added to a room more than once.
		break;
		*/
		case 429:
			// too many requests
			displayError = statusCode + ' : ' +error.statusText;
			cont = true;
		break;
		case 500:
			// Something went wrong on the server.
			displayError = statusCode + ' : ' +error.statusText;
			cont = true;
		break;
		case 502:
			// Something went wrong on the server.
			displayError = statusCode + ' : ' +error.statusText;
			cont = true;
		break;
		case 503:
			// Server is overloaded with requests. Try again later.
			displayError = statusCode + ' : ' +error.statusText;
			cont = true;
		break;
		default:
			displayError = statusCode + ' : ' +error.statusText;
			cont = true;
		break;
	}
		var HTML = '<div id="alert", class="alert alert-danger alert-dismissible" role="alert">';
		HTML += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	  HTML += displayError+'</div>';
	
	if($('#alert').length === 0) {
		$('.container').prepend(HTML);
	}else{
		$('#alert').remove();
		$('.container').prepend(HTML);
	}

	return cont;
}

// Live Search
$(document).on('click', '#liveSearch', function(e){
  e.preventDefault();
  liveSearch();
});

$(document).on('keypress', '#search', function(e){
  if(e.which === 13){
  	liveSearch();
  }
});

var liveSearch = function(e){
	var searchString = $('#searchString').val();
  search = true;

	searchString = searchString.toLowerCase();
	console.log(searchString);
	var tempData = [];
	for(var i = 0; i < pageData.length; i++){
		var room = pageData[i].title;
		room = room.toLowerCase();
		if(room.indexOf(searchString) >= 0){
			tempData.push(pageData[i]);
		}
	}
	// recreate page data
	pageData = [];
	pageData = tempData;
	perPage();
}

$(document).on('click', '#clearSearch', function(e){
	checkSelected();
	search = false;
	max = parseInt(localStorage.getItem("max"));
	pageData = [];
	pageData = JSON.parse(localStorage.getItem("roomList"));
	listRooms();
});