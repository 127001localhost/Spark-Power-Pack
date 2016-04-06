//Global variables
if(localStorage.getItem("sparkToken")){
	var sparkToken = localStorage.getItem("sparkToken");

	if(localStorage.getItem("myAvatar") != "undefined") {
		$("#profile").append("<img class=\"user dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" src=\""+localStorage.getItem("myAvatar")+"\">");
	}else{
		var displayName = localStorage.getItem("displayName");
		var initial = displayName[0].toUpperCase()
		$("#profile").append('<div class="user-text dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><p>'+initial+'</p></div>');
		console.log("no avatar");
	};

}else{
	window.location="index.html";
}

function refreshToken(){
	localStorage.clear();
	window.location="index.html";
}