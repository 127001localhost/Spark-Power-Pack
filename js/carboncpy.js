var page = 0;
var pageData = [];
var myRooms = [];
var selected = []; // array for tracking item selections when moving between pages
var sparkToken = localStorage.getItem("sparkToken");
var sortMethod = {"id": "created"};
var sortDir = 1; // Ascending

/*
$("#listRooms").on('click', function(){
	$("#intro").remove();
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(); // list my rooms
});
*/

function sendSelected(){
	message = $("#myMessage").val();
	for(i in selected){
		sendMessage(selected[i].id,message);
	}
}


function getMembershipId(roomId){
	$.ajax({
		url: "https://api.ciscospark.com/v1/messages?roomId="+roomId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		sendMessage(data.items[0].id,"Hello from from SparkPowerPAK");
	});
}


function sendMessage(roomId,theMessage){
	var count = 0;
	$.ajax({
		url: "https://api.ciscospark.com/v1/messages",
		headers: {'Content-Type': 'application/json; charset=utf-8', 'Authorization': sparkToken},
		cache: false,
		type: "POST",
		dataType: 'json',
        data: JSON.stringify({roomId: roomId, text: theMessage}),
		statusCode: {
			200: function(){
				count++;
			}
		}
	});
	$(".container").html('<div class="jumbotron"><h3>Success!</h3><p>Your message have been broadcasted!</p><button class="btn btn-normal" type="button" onClick="window.location=\'powerpack.php\'"">Home</button></div>');
}

function refreshRooms(){
	pageData = [];
	localStorage.removeItem("roomList");
	$(".container").html('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms();
}

function listRooms(next="",url="https://api.ciscospark.com/v1/rooms"){
	// check for cached data
	if (localStorage.getItem("roomList")){
		pageData = JSON.parse(localStorage.getItem("roomList"));
		page = localStorage.getItem("page");
		pagination();
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
				listRooms(match[1]);
			}else{
				//flatten the pageData array 
				pageData = _.flatten(pageData);
				pageData = sortObjectBy(pageData,"title","A");
				localStorage.setItem("roomList", JSON.stringify(pageData));
				localStorage.setItem("page", page);
				// call the pagiation script
				pagination();
			}
		});
	}
}

function sortObjectBy(myData, srtValue, srtOrder){
	//Sort ascending order
	console.log("srtValue: ", srtValue);
	console.log("srtOrder: ", srtOrder);
	console.log("myData passed: ", myData);
	if (srtOrder == "A"){
		console.log("srtOrder by ascending values")
		if (srtValue == "title"){		
			myData.sort((a,b) =>a.title.localeCompare(b.title));
			console.log("myData is now: ",myData);
			} //(srtValue == "title")
		if (srtValue == "created"){		
			myData.sort((a,b) =>a.created.localeCompare(b.created));
			console.log("myData is now: ",myData);
			} //(srtValue == "created")
		if (srtValue == "lastActivity"){		
			myData.sort((a,b) =>a.lastActivity.localeCompare(b.lastActivity));
			console.log("myData is now: ",myData);
			} //(srtValue == "lastActivity")
	} //(srtOrder == "A")
	if (srtOrder == "D"){
		console.log("srtOrder by descending values")
		if (srtValue == "title"){		
			myData.sort((a,b) =>b.title.localeCompare(a.title));
			console.log("myData is now: ",myData);
			} //(srtValue == "title")
		if (srtValue == "created"){		
			myData.sort((a,b) =>b.created.localeCompare(a.created));
			console.log("myData is now: ",myData);
			} //(srtValue == "created")
		if (srtValue == "lastActivity"){		
			myData.sort((a,b) =>b.lastActivity.localeCompare(a.lastActivity));
			console.log("myData is now: ",myData);
			} //(srtValue == "lastActivity")
	} //(srtOrder == "D")
	console.log("------------------------")
	return myData;
}

function sortBy(srtValue, srtOrder){
	pageData = sortObjectBy(pageData,srtValue,srtOrder);
	pagination();
}



function perPage(){
	if($("#max").val() > 10){
		max = parseInt($("#max").val());
	}else{
		max = 10;
	}
	pagination(max);
}

/* Original
function pagination(max=10){
	$("#progress").remove();
	//setup page navigation
	var HTML = "<div class='row'><div class='col-md-6'><h3>Select the rooms you want to broadcast to</h3></div></div>";
	$(".container").html(HTML);
	var pageNav = "<div class='row'><div class='col-md-6'><span>Rooms per/page: <input type='text' placeholder=10 size='2' maxlength='2' id='max'> <button class='btn btn-normal' id='perPage' type='button' onClick='perPage()'>Update</button><h4 id='pageNav'>page(s): </h4></span></div><div>";
	$(".container").append(pageNav);	

	var totalRooms = pageData.length;
	var numPages = (totalRooms / max);
	var HTML = "<h4 id='pageNav' style='display: inline-block;'>page(s): ";
	for(var i = 0; i < numPages; i++){
		var start = i * max;
		var stop = start + max-1;
		if(stop > totalRooms){
			stop = totalRooms - 1;
		}
		var pageDisplay = i + 1;
		HTML += " <a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a> ";
	}
	HTML += "</h4> <a onClick='refreshRooms()' alt='click to refresh rooms'><i class='glyphicon glyphicon-refresh'></i></a></span></div><div>";
	$("#pageNav").html(HTML);

	roomDisplay(0,max-1);
}
*/

function pagination(max=10){
	$("#progress").remove();
	//setup page navigation
	var HTML = "<div class='row'><div class='col-md-6'><h3>Select the rooms you want to broadcast to</h3></div></div>";
	$(".container").html(HTML);
	var pageNav = '<div class="row"><div class="col-md-6"><span>Rooms per/page: <input type="text" placeholder=10 size="2" maxlength="2" id="max"> <button class="btn btn-normal" id="perPage" type="button" onClick=\'perPage()\'>Update</button></span></div><div>';
	$(".container").append(pageNav);	

	var totalRooms = pageData.length;
	//console.log(totalRooms);
	var numPages = (totalRooms / max);
	//var HTML = '<nav><ul class="pagination"><li><a href="" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
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

function roomDisplay(start,stop){
	checkSelected();

	var table = '<div class="row" id="roomList"><div class="col-md-12"><table class="table table-striped" id="roomTable"><thead><th></th><th>Room Name <a class="glyphicon glyphicon-sort" id="title"></a></th><th>Created <a class="glyphicon glyphicon-sort" id="created"></a></th><th>Last Activity <a class="glyphicon glyphicon-sort" id="lastActivity"></a></th></thead>';

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

		var created = new Date(data[i].created);
		var activity = new Date(data[i].lastActivity);
		if(checked){
			console.log("no selections have been made yet");

			table += '<tr><td><input type="checkbox" name="checkboxes" id="'+data[i].id+'" value="'+data[i].title+'" checked><td>'+data[i].title+'</td><td>'+created.toLocaleString()+'</td><td>'+activity.toLocaleString()+'</td><td></tr>';
			checked = false;
		}else{
			table += '<tr><td><input type="checkbox" name="checkboxes" id="'+data[i].id+'" value="'+data[i].title+'"><td>'+data[i].title+'</td><td>'+created.toLocaleString()+'</td><td>'+activity.toLocaleString()+'</td><td></tr>';
		}
		
	}
		$("#roomList").remove();
		$(".container").append(table);

		var button = "</br><button class='btn btn-success' type='button' onclick='reviewSelected()'>Review Selection(s)</button>  <button class='btn btn-normal' type='button' onclick='window.location=\"delete.php\"'>Cancel</button>";
		$("#roomTable").after(button);
}

/* Original
function roomDisplay(start,stop){
	checkSelected();

	var table = "<div class='row' id='roomList'><div class='col-md-12'><table class='table table-striped' id='roomTable'><thead><th></th><th>Room Name</th><th>Created</th><th>Last Activity</th></thead>";

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

		var created = new Date(data[i].created);
		var activity = new Date(data[i].lastActivity);
		if(checked){
			console.log("no selections have been made yet");

			table += "<tr><td><input type='checkbox' name='checkboxes' id='"+data[i].id+"' value='"+data[i].title+"' checked><td>"+data[i].title+"</td><td>"+created.toLocaleString()+"</td><td>"+activity.toLocaleString()+"</td><td></tr>";
			checked = false;
		}else{
			table += "<tr><td><input type='checkbox' name='checkboxes' id='"+data[i].id+"' value='"+data[i].title+"'><td>"+data[i].title+"</td><td>"+created.toLocaleString()+"</td><td>"+activity.toLocaleString()+"</td><td></tr>";
		}
		
	}
		$("#roomList").remove();
		$(".container").append(table);

		var button = "</br><button class='btn btn-success' type='button' onclick='reviewSelected()'>Review Selection(s)</button>  <button class='btn btn-normal' type='button' onclick='window.location=\"delete.php\"'>Cancel</button>";
		$("#roomTable").after(button);
}
*/


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

function reviewSelected(){
	$("#myMessage").val("")
	checkSelected();

	var HTML = "<h2>Your message will be broadcasted to these rooms</h2>";
	for(index in selected){
		HTML += "<p>"+selected[index].value+"</p>";
	};
	HTML += '<div class="row" id="confirm"><form><textarea cols="100" rows="5" id="myMessage" name="message" placeholder="Type your message here" ></textarea></form><button class="btn btn-success has-spinner" id="send" type="button" onClick="sendSelected()">Send Message</button>  <button class="btn btn-warning has-spinner" id="cancel" type="button" onClick="startOver()">Cancel</button></div>';
	$(".container").html(HTML);
}

function startOver(){
	selected = [];
	myRooms = [];
	location.reload();
}