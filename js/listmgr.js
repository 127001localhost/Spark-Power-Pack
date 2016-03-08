var sparkToken = localStorage.getItem("sparkToken");

console.log(sparkToken);

function roomsClick(){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4){
			if (xhttp.status == 200) {
				var rooms = JSON.parse(xhttp.responseText);
				for(var i = 0; i < rooms['items'].length; i++){
					console.log(rooms['items'][i].title);
					var roomName = rooms['items'][i].title;
					$("#rooms").append("<option value="+roomName +">"+roomName+"</option>");
				}
				$("#rooms").show();
				$("#roomButton").hide();
			}else{
				console.log('Error: ' + xhttp.statusText);
			}
		}
	}
	xhttp.open('GET', 'https://api.ciscospark.com/v1/rooms?max=10', true);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader('Authorization', sparkToken);
	xhttp.send();
}

function refreshToken(){
	localStorage.removeItem("sparkToken");
	window.location="spark_auth.html";
}

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
	if (!browserSupportFileUpload()) {
	    alert('The File APIs are not fully supported in this browser!');
	    } else {
	    	console.log("upload triggered");
	        var data = null;
	        var file = evt.target.files[0];
	        var reader = new FileReader();
	        reader.readAsText(file);
	        reader.onload = function(event) {
	            var csvData = event.target.result;
	            data = $.csv.toArrays(csvData);
	            if (data && data.length > 0) {
	              //lert('Imported -' + data.length + '- rows successfully!');
	              console.log(data);
	            } else {
	                alert('No data to import!');
	            }
	        };
	        reader.onerror = function() {
	            alert('Unable to read ' + file.fileName);
	        };
	    }
	}