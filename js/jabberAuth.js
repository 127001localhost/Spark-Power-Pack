var sparkToken = "";
var clientId = "Cfad29d7cc842ef10a7679ca8e42826edd16abd241c46c9b43069087fd5d32e4f";
var appRedirectUri="http://spark.bdmcomputers.com/jabberTab.php";
var accessCode="";

// If so user has already authenticated, and  page has been reloaded via the Redirect URI
window.onload = function(e) {
	if (localStorage.getItem("sparkToken") != null) {
		window.location="jabberTab.php";
	}else{
		//document.getElementById('redirectUri').value=window.location.href.split("?")[0]; // Detect the current page's base URL
		var params = parseQueryStr(window.location.search.substring(1)); // Parse the query string params into a dictionary
		if (params['code']) { // If the query param 'code' exists, then...
			accessCode = params['code'];
			requestToken();
		}else if (params['error']) { // If the query param 'error' exists, then something went wrong...
			alert('Error requesting auth code: ' + params['error'] + ' / ' + params['error_description']);
		}else if (localStorage.getItem("sparkToken") == null) {
			requestToken();
		}

	}
}

var randomString = function(length) {
    var str = "";
    var range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        str += range.charAt(Math.floor(Math.random() * range.length));
    }
    return str;
}
// Helper function that parses a query string into a dictionary object
var parseQueryStr = function( queryString) {
    var params = {}, keyvals, temp, i, l;
    keyvals = queryString.split("&");  // Split out key/value pairs
    for ( i = 0, l = keyvals.length; i < l; i++ ) {  // Split key/value strings into a dictionary object
        tmp = keyvals[i].split('=');
        params[tmp[0]] = tmp[1];
    }
    return params;
};



// Step #1: Requests the users Auth Code
function requestCode() {
	var requestUrl = 'https://api.ciscospark.com/v1/authorize?' + //Spark OAuth2 base URL
		'client_id=' + encodeURIComponent(clientId) + '&' + // The custom app Client ID
		'response_type=code&' + // Requesting the OAuth2 'Authentication Code' flow
		'redirect_uri=' + encodeURIComponent(appRedirectUri) + '&' + // The custom app's Redirect URI
		'scope=spark%3Amessages_write%20spark%3Arooms_read%20spark%3Amemberships_read%20spark%3Amessages_read%20spark%3Arooms_write%20spark%3Apeople_read%20spark%3Amemberships_write&' + // Requested permission, i.e. Spark room info
		// The following items are provided by the developer in the source code/config or generated dynamically at run time
		'state=' + encodeURIComponent(randomString(63)) + '&' +	// Random string for OAuth2 nonce replay protection
		'service=spark';
	window.location = requestUrl; // Redirect the browser to the OAuth2 kickoff URL
}

// Step #2: Request a Token
function requestToken(){
		$.ajax({
		url: "http://api.bdmcomputers.com:8080/spark/token?accessCode="+accessCode,
		headers: {'Content-Type': 'application/json'},
		cache: false,
		type: "GET",
		dataType: 'json',
		statusCode: {
			200: function(data){
				console.log(data);
				sparkToken = "Bearer " + data['access_token'];
				var refresh = data['refresh_token'];
				var refreshExp = data['exires_in'];
				var refreshToken = data['refresh_token_expires'];
				localStorage.setItem("sparkToken", sparkToken);
				localStorage.setItem("refreshToken", refresh);
				localStorage.setItem("expires_in", refreshExp);
				localStorage.setItem("refresh_token_expres", refreshToken);
				me();
			}
		}
	}).done(function(){
		
	});
}

// this function stores the users profile information in localstorage.
function me(){
	$.ajax({
		url: "https://api.ciscospark.com/v1/people/me",
		headers: {'Content-Type': 'application/json; charset=utf-8', 'Authorization': sparkToken},
		cache: false,
		type: "GET"
	}).done(function(data){
		localStorage.setItem("myId", data.id);
		localStorage.setItem("myEmail", data.emails[0]);
		localStorage.setItem("displayName", data.displayName);
		localStorage.setItem("myAvatar", data.avatar);
		window.location = appRedirectUri;
	});
}