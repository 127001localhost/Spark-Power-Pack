var page = 0;
var pageData = [];
var selected = []; // array for tracking item selections when moving between pages

$("#listRooms").on('click', function(){
	$("#intro").remove();
	$(".container").append('<div class="row" id="progress"><div class="col-md-12 text-center"><img src="images/progress-ring.gif"><h3>Loading Data...</h3></div></div>');
	listRooms(); // list my rooms
});

function getMembershipId(roomId, personId, num){
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships?roomId="+roomId+"&personId="+personId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "GET"
	}).done(function(data){
		//console.log(data);
		leaveRoom(data.items[0].id, num);
	});
}

function leaveRoom(membershipId, num){
	$.ajax({
		url: "https://api.ciscospark.com/v1/memberships/"+membershipId,
		headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
		cache: false,
		method: "DELETE",
		statusCode: {
			204: function(){
			}
		}
	});
	if(num == selected.length){
		var HTML = '<div class="jumbotron"><h2>You left the following rooms:</h2>';
		for(var i = 0; i < selected.length; i++){
			HTML += "<p>"+selected[i].value+"</p>";
		}
		HTML += '<button class="btn btn-normal" type="button" onclick=\'window.location="powerpack.php"\'>Home</button>';
		$(".container").html(HTML);
	}
}	

function leaveSelected(){
	for(var i = 0; i < selected.length; i++){
		getMembershipId(selected[i].id, localStorage.getItem("myId"), (i+1));
	}
}

function reviewSelected(){
	checkSelected(); // check to see what is selected
	
	var HTML = '<div class="row" id="confirm"><div class="col-md-6"><h2>Are you sure you wish to leave the following rooms?</h2>';
	
	for(var i = 0; i < selected.length; i++){
		HTML += "<p>"+selected[i].value+"</p>";
	};
	HTML += '<button class="btn btn-danger has-spinner" id="leave" type="button" onClick="leaveSelected()">Leave Rooms <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>  <button class="btn btn-normal has-spinner" id="cancel" type="button" onClick="startOver()">Cancel <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button></div></div>';

	$(".container").html(HTML);
	console.log(selected);
}

function listRooms(next="",url="https://api.ciscospark.com/v1/rooms"){
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
			// call the pagiation script
			pagination();
		}
	});
}

function perPage(){
	if($("#max").val() > 10){
		max = parseInt($("#max").val());
	}else{
		max = 10;
	}
	pagination(max);
}

function pagination(max=10){
	$("#progress").remove();
	//setup page navigation
	var HTML = "<div class='row'><div class='col-md-6'><h2>Select the rooms you want to leave</h2></div></div>";
	$(".container").html(HTML);
	var pageNav = "<div class='row'><div class='col-md-6'><span>Rooms per/page: <input type='text' placeholder=10 size='2' maxlength='2' id='max'> <button class='btn btn-normal' id='perPage' type='button' onClick='perPage()'>Update</button><h4 id='pageNav'>page(s): </h4></span></div><div>";
	$(".container").append(pageNav);	

	var totalRooms = pageData.length;
	//console.log(totalRooms);
	var numPages = (totalRooms / max);
	var HTML = "<h4 id='pageNav'>page(s): ";
	for(var i = 0; i < numPages; i++){
		var start = i * max;
		var stop = start + max-1;
		if(stop > totalRooms){
			stop = totalRooms - 1;
		}
		var pageDisplay = i + 1;
		HTML += " <a onClick='roomDisplay("+start+","+stop+")'>"+pageDisplay+"</a> ";
	}
	HTML += "</h4></span></div><div>";
	$("#pageNav").html(HTML);

	roomDisplay(0,max-1);
}

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


function startOver(){
	selected = [];
	myRooms = [];
	location.reload();
}