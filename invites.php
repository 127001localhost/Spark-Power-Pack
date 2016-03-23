 <?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Invites:</h2>
			<p>This tool will allow you to invite contacts to your rooms in bulk. Would you like to add contacts to an existing room or create a new room?<p>
			<button class="btn btn-warning" id="existing" type="button">Existing Room</button>
			<button class="btn btn-success" id="new" type="button">Create Room</button>
		</div>
	    <div class="row" id="bread" hidden>
    		<h2>Invites</h2>
	        <div class="btn-group btn-breadcrumb">
	            <a href="#" class="btn btn-primary" id="startOver"><i class="glyphicon glyphicon-home"></i></a>
	            <a href="#" class="btn btn-primary" id="bread1">Select Room</a>
	            <a href="#" class="btn btn-primary" id="bread2">Select Contacts</a>
	            <a href="#" class="btn btn-primary" id="bread3">Create</a>
	        </div>
		</div>
		</br>
		<div class="row" id="step1a" hidden>
			<div class="col-md-4">
				<div class="form-group" id="roomForm" hidden>
				  <div>
				    <select name="rooms" id="rooms" class="form-control">
				    	<option value="">Select a room:</option>
				    </select>
				  </div>
				</div>

				<button class="btn btn-success has-spinner" id="roomButton" type="button" onClick="roomsClick()">List my rooms <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
			</div>
		</div>
		<div class="row" id="step1b" hidden>
			<div class="col-md-4">
				<h2>Create a Room</h2>
				<div class="form-group">
				  <div class="col-md-12">
				  	<input id="newRoom" name="newRoom" type="text" placeholder="Room Name" class="form-control input-md">
				  </div>
				</div>
				<div class="form-group">
					<div class="col-md-12">
			  			<button class="btn btn-success has-spinner" id="createRoom" type="button" onClick="createRoom()">Create Room <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
			  		</div>
				</div>
			</div>
		</div>
		<div class="row" id="step2" hidden>
			<h4>If you are unsure on how to format your .csv file, <a href="example.csv">Click HERE</a> to download a sample.</h4>
			<div id="dvImportSegments" class="fileupload" >
				<div class="form-group">
		        	<input type="file" name="File Upload" id="txtFileUpload" accept=".csv" />
		        	<h4></h4>
		        	<h4>Or input your contacts below</h4>
		        	<textarea cols="100" rows="5" id="myContacts" name="contacts" placeholder="Enter your contacts in here" ></textarea>
		        	<h4></h4>
		        	<button class="btn btn-success has-spinner" id="addContacts" type="button" onClick="parseContacts()">Submit Contacts <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
				</div>
			</div>
			<div id="displayContacts">
			</div>
		</div>
		<div class="row" id="step3" hidden>
			<h1>Your users have been added!</h1>
		</div>
	</div>
</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery.csv.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/invites.js"></script>
	<?php include_once("analyticstracking.php") ?>
</html>
