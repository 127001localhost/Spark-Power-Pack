//Global variables
var sparkToken = localStorage.getItem("sparkToken");

$("#profile").append("<img class=\"user dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" src=\""+localStorage.getItem("myAvatar")+"\">");

function refreshToken(){
	localStorage.removeItem("sparkToken");
	window.location="index.html";
}