var myId = localStorage.getItem("myId");
var page = 0;
var pageData = [];
var selected = []; // array for tracking item selections when moving between pages 
var sortMethod = {"id": "title"};
var sortDir = 1; // Ascending
var max = 10;

$("#create").on("click", function(){
	$("#intro").remove();
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(next, url); // list my rooms
});

$("#manage").on("click", function(){
	$("#intro").remove();
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	getHooks(); // list the current webhooks

});

function createHook(){
	checkSelected();
	for( var i = 0; i < selected.length; i++){

		$.ajax({
			url: "https://api.ciscospark.com/v1/webhooks",
			headers: {'Content-Type': 'application/json; charset=utf-8', 'Authorization': sparkToken},
			cache: false,
			type: "POST",
			dataType: 'json',
	        data: JSON.stringify({name: selected[i].value, targetUrl: 'http://api.bdmcomputers.com:8080/spark/'+myId, resource: 'messages', event: 'created', filter: 'roomId='+selected[i].id}),
			statusCode: {
				200: function(){
					$(".container").html('<div class="jumbotron"><h2>Your Jabber Alerts have been created!</h2><p>In order to see these alerts in Jabber, follow these simple steps.<h4> Jabber for Mac & Windows:</h4> <ul><li> Mac: Open Jabber and click File -> New Custom Tab. Windows: Open Jabber and click File -> New -> Custom Tab.</li><li>"Create a new custom tab" will pop up. Provide a name for the tab (Spark Alerts). Copy and Paste the following in the page URL http://spark.bdmcomputers.com/jabberTab.php and click Create!</li><li>You will now see a new icon near the lower left of the Jabber screen. </li></ul><img src="images/tab3.jpg"></p><button class="btn btn-success" type="button" onclick=\'window.location="powerpack.php"\'>Home</button></div>');
				}
			}
		});
	}
}

function getHooks(){
	$.ajax({
		url: "https://api.ciscospark.com/v1/webhooks",
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET",
		statusCode: {
			502: function(){
				$(".container").append("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>")

			}
		}
	}).done(function(data){
		var alertUrl = "http://api.bdmcomputers.com:8080/spark/";
		var HTML= "<div class='row'><div class='col-md-6'><h2>Current Jabber Alerts</h2></div></div><div class='row'><div class='col-md-6'><table class='table table-striped' id='currentAlerts'><thead><th>Remove</th><th>Room Name</th></thead>";
		if(data){
			for(var alert in data['items']){
				if(data['items'][alert].targetUrl.indexOf(alertUrl) > -1){
					HTML += "<tr><td><input type='checkbox' name='checkboxes' id='"+data['items'][alert].id+"' value='"+data['items'][alert].id+"'><td>"+data['items'][alert].name+"</td></tr>";
				}
			}
		}
			var button = "</br><button class='btn btn-danger' id='removeHook' type='button' onclick='removeHook()'>Remove Selected Alerts</button>  <button class='btn btn-normal' type='button' onclick='window.location=\"jabberAlerts.php\"'>Cancel</button>";
			HTML += "</div></div>";
			$(".container").html(HTML);
			$(".table").after(button);

	});
}

function refreshRooms(){
	pageData = [];
	localStorage.removeItem("roomList");
	$(".container").html('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(next, url);
}

var next = "";
var url = "https://api.ciscospark.com/v1/rooms";

function listRooms(next,url){
	// check for cached data
	if (localStorage.getItem("roomList")){
		pageData = JSON.parse(localStorage.getItem("roomList"));
		page = localStorage.getItem("page");
		pagination(max);
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

			//parse the next link from the respone header
			var link = xhr.getResponseHeader('Link');
			if(link){
				var myRegexp = /(http.+)(>)/g;
				var match = myRegexp.exec(link);
				page++;
				// call listRooms again with the next link
				listRooms(match[1], url);
			}else{
				//flatten the pageData array and store in localStorage
				pageData = _.flatten(pageData);
				pageData = sortObjectBy(pageData,"title","A");
				localStorage.setItem("roomList", JSON.stringify(pageData));
				localStorage.setItem("page", page);
				// call the pagiation script
				pagination(max);
			}
		});
	}
}

function sortObjectBy(array, srtKey, srtOrder){
    if (srtOrder =="A"){
        if (srtKey =="title"){
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
        if (srtKey =="title"){
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

function sortBy(srtValue, srtOrder){
	pageData = sortObjectBy(pageData,srtValue,srtOrder);
	checkSelected();
	pagination(max);
}

function perPage(){
	checkSelected();
	if($("#max").val() > 10){
		max = parseInt($("#max").val());
	}else{
		max = 10;
	}
	pagination(max);
}


function pagination(max){
	$("#progress").remove();
	//setup page navigation
	var HTML = "<div class='row'><div class='col-md-6'><h2>Select rooms to receive alerts on</h2></div></div>";
	$(".container").html(HTML);
	var pageNav = '<div class="row"><div class="col-md-6"><span>Rooms per/page: <input type="text" placeholder=10 size="2" maxlength="2" id="max"> <button class="btn btn-normal" id="perPage" type="button" onClick=\'perPage()\'>Update</button></span></div><div>';
	$(".container").append(pageNav);	

	var totalRooms = pageData.length;
	//console.log(totalRooms);
	var numPages = (totalRooms / max);

	var HTML = '<nav><ul class="pagination">';
	for(var i = 0; i < numPages; i++){
		var start = i * max;
		var stop = start + max-1;
		if(stop > totalRooms){
			stop = totalRooms - 1;
		}
		var pageDisplay = i + 1;
		if (pageDisplay == 1){
			HTML += "<li class='active'><a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a></li>";
		}else{
			HTML += "<li><a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a></li>";
		}
		
	}

	//HTML += '<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
	HTML += '<li><a onClick=\'refreshRooms()\'><i class="glyphicon glyphicon-refresh"></i></a></span></li></ul></nav></div><div>';
	$(".container").append(HTML);

	roomDisplay(0,max-1);
}

function checkSelected(){
		$("input:not(:checked)").each(function(){
		if(selected.length >= 1){
			for(var i = 0; i < selected.length; i++){
				if(selected[i].id == this.id){
					selected.splice(i, 1);
				}
			}
		}
	});
	// record any selected
	$("input:checked").each(function(){
		var addItem = true;
		if(selected.length > 0){
			for(var i = 0; i < selected.length; i++){
				if(selected[i].id == this.id){
					addItem = false
				}	
			}
		}

		if(addItem){
			selected.push(this);
		}
	});
}

// handle the active page
$(document).on('click', 'li', function() {
   $("li").removeClass("active");
   $(this).addClass("active");
});

$(document).on('click', 'th a', function() {
	if(sortMethod.id == $(this).attr("id") && sortDir == 0){
		sortBy($(this).attr("id"), "A");
		sortDir = 1;
	}else{
		sortBy($(this).attr("id"), "D");
		sortMethod.id = $(this).attr("id");
		sortDir = 0;
	}
});

function roomDisplay(start,stop){
	checkSelected();

	var table = '<div class="row" id="roomList"><div class="col-md-6"><table class="table table-striped" id="roomTable"><thead><th>Add</th><th>Room Name <a class="glyphicon glyphicon-sort" id="title"></a></th></thead>';

	var data = pageData;
	for(var i = start; i <= stop; i++){
		var checked = false;
		if(selected.length > 0){
			for(var index in selected){
				if(data[i].id == selected[index].id){
					checked = true;
					console.log("checked item");
					break;
				}
			}
		}

		if(checked){
			console.log("no selections have been made yet");
			table += "<tr><td><input class='target'type='checkbox' name='checkboxes' id='"+data[i].id+"' value='"+data[i].title+"' checked><td>"+data[i].title+"</td></tr>";
			checked = false;
		}else{
			table += "<tr><td><input class='target' type='checkbox' name='checkboxes' id='"+data[i].id+"' value='"+data[i].title+"'><td>"+data[i].title+"</td></tr>";
		}
		
	}
		$("#roomList").remove();
		$(".container").append(table);

		var button = "</br><button class='btn btn-success' id='createHook' type='button' onclick='createHook()'>Create Jabber Alerts</button>  <button class='btn btn-normal' type='button' onclick='window.location=\"jabberAlerts.php\"'>Cancel</button>";
		$("#roomTable").after(button);
}

function removeHook(){
	var selected = [];
	$("input:checked").each(function(){
		selected.push($(this).val());
	});

	for( var i in selected){
		// first remove the webhook
		$.ajax({
		url: "https://api.ciscospark.com/v1/webhooks/"+selected[i],
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "DELETE",
		statusCode: {
			204: function(){
				console.log("webhook removed");
				getHooks();
			},
			502: function(){
				$("#roomButton").hide();
				$("#step1a").append("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>")

			}
			}
		});

		// then remove any active alerts that might be in the DB
		$.ajax({
			url: "http://api.bdmcomputers.com:8080/spark",
			headers: {'Content-Type': 'application/json'},
			cache: false,
			method: "DELETE",
			dataType: 'json',
			data: JSON.stringify({roomId: selected[i], id: myId}),
		});
	}
}