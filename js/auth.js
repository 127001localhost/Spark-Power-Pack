//Sample application demonstrating how to perform a Spark OAuth2 authentication and Spark API access token request
//Note: this page must be accessed from a web server, Step #3 below may fail if loaded from the file system
// Helper function that generates a random alpha/numeric string
var sparkToken = "";
var clientId = "Cfad29d7cc842ef10a7679ca8e42826edd16abd241c46c9b43069087fd5d32e4f";
var clientSecret = "3ece20091f18e64dc9adbc8a3b30e4d0c0bebce1e8e53a902a0e1bf68881122a";
var appRedirectUri="http://me.bmcallister.com/spark/spark_auth.html";
var accessCode="";

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
// Step #1: Fires when the user clicks the 'Request Auth Code' button
function codeClick() {
	var appClientId=clientId;
	//Build the request URL.  The base URL and next 4 items are typically always the same for Spark web apps
	var requestUrl = 'https://api.ciscospark.com/v1/authorize?' + //Spark OAuth2 base URL
		'response_type=code&' + // Requesting the OAuth2 'Authentication Code' flow
		'scope='+ encodeURIComponent('spark:rooms_read') + '&' + // Requested permission, i.e. Spark room info
		// The following items are provided by the developer in the source code/config or generated dynamically at run time
		'state=' + encodeURIComponent(randomString(63)) + '&' +	// Random string for OAuth2 nonce replay protection
		'client_id=' + encodeURIComponent(appClientId) + '&' + // The custom app Client ID
		'redirect_uri=' + encodeURIComponent(appRedirectUri); // The custom app's Redirect URI
	window.location = requestUrl; // Redirect the browser to the OAuth2 kickoff URL
}
// Step #2: On page load, check if the 'code=' query param is present
// If so user has already authenticated, and  page has been reloaded via the Redirect URI
window.onload = function(e) {
	if (localStorage.getItem("sparkToken") != null) {
		window.location="myrooms.html";
	}else{
		//document.getElementById('redirectUri').value=window.location.href.split("?")[0]; // Detect the current page's base URL
		var params = parseQueryStr(window.location.search.substring(1)); // Parse the query string params into a dictionary
		if (params['code']) { // If the query param 'code' exists, then...
			accessCode = params['code'];
		console.log(accessCode);
			tokenClick();
		}
		if (params['error']) { // If the query param 'error' exists, then something went wrong...
			alert('Error requesting auth code: ' + params['error'] + ' / ' + params['error_description']);
		}
	}
}
// Step #3: Fires when the user clicks the 'Request Access Token' button
// Takes the auth code and requests an access token
function tokenClick() {
	xhttp = new XMLHttpRequest(); // Create an AJAX HTTP request object
	xhttp.onreadystatechange = function() {  // Define a handler, which fires when the request completes
		if (xhttp.readyState == 4) { // If the request state = 4 (completed)...
			if (xhttp.status == 200) { // And the status = 200 (OK), then...
				var authInfo = JSON.parse(xhttp.responseText); // Parse the JSON response into an object
				//document.getElementById('token').value = authInfo['access_token']; // Retrieve the access_token field, and display it
				sparkToken = "Bearer " + authInfo['access_token'];
				localStorage.setItem("sparkToken", sparkToken);
				localStorage.setItem("refreshToken", authInfo['refresh_token']);
				localStorage.setItem("expires_in", authInfo['exires_in']);
				localStorage.setItem("refresh_token_expres", authInfo['refresh_token_expires']);
				window.location="myrooms.html";
			} else alert('Error requesting access token: ' + xhttp.statusText)
 		}
	}
	xhttp.open('POST', 'https://api.ciscospark.com/v1/access_token', true); // Initialize the HTTP request object for POST to the access token URL
	// Build the HTML form request body 
	var body = 'grant_type=authorization_code&'+  // This is an OAuth2 Authorization Code request
		'redirect_uri='+encodeURIComponent(appRedirectUri)+'&'+ // Same custom app Redirect URI 
		'code='+encodeURIComponent(accessCode)+'&'+ // User auth code retrieved previously
		'client_id='+encodeURIComponent(clientId)+'&'+ // The custom app Client ID
		'client_secret='+encodeURIComponent(clientSecret); // The custom app Client Secret
	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // Sending the content as URL-encoded form data
	xhttp.send(body); // Execute the AJAX HTTP request
}