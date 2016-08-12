 <?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Invites:</h2>
			<h3 style="color: red;">Major changes have been made to the invites tool on 8/12/16. If you have not already done so, please log out and re-authorize the app.</h3>
			<p>This tool will allow you to invite contacts to your rooms in bulk. Would you like to add contacts to an existing room or create a new room?<p>
			<button class="btn btn-warning" id="existing" type="button">Existing Room</button>
			<button class="btn btn-success" id="new" type="button">Create Room</button>
		</div>
		<div class="row" id="step1b" hidden>
			<div class="col-md-6">
				<h2>Create a new room to invite people to.</h2>
				<div class="form-group">
				  <div class="col-md-12">
				  	<input id="newRoom" name="newRoom" type="text" placeholder="Room Name" class="form-control input-md"><br/>
				  </div>
				</div>
				<div class="form-group">
					<div class="col-md-12">
			  			<button class="btn btn-success" id="createRoom" type="button">Create Room</button>
			  			<button class="btn btn-normal" type="button" onClick="startOver()">Cancel</button>
			  		</div>
				</div>
			</div>
		</div>
		<div class="row" id="step2" hidden>
			<div class="col-md-6">
				<div id="dvImportSegments" class="fileupload" >
					<div class="form-group">
			        	<input type="file" name="File Upload" id="txtFileUpload" accept=".csv" />
			        	<h4></h4>
			        	<h4>Or input your contacts below</h4>
			        	<textarea cols="70" rows="5" id="myContacts" name="contacts" placeholder="Enter your contacts in here" ></textarea>
			        	<h4></h4>
			        	<button class="btn btn-success" type="button" onClick="parseContacts()">Submit Contacts</button>
				  			<button class="btn btn-normal" type="button" onClick="startOver()">Cancel</button>
					</div>
				</div>
			</div>
				<div class="col-md-6">
					<p>Valid methods of contact entry using file method or in input dialog box.
		If you omit the @aaa.com, it will auto populate the @aaa.com based on your own email domain. See Examples below:</p>
					<img src="images/contactinput1.png" width="500px">
					<img src="images/contactinput2.png" width="500px">
			</div>
		</div>
		<div class="row" id="validatedContacts" hidden>
		</div>

		<div class="row" id="step3" hidden>
			<h1>Your users have been added!</h1>
			<button class="btn btn-success" type="button" onclick='window.location="powerpack.php"'>Home</button>
		</div>
	</div>
</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery.csv.js"></script>
	<script type="text/javascript" src="js/lodash.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/roomsAPI.js"></script>
	<script type="text/javascript" src="js/membershipsAPI.js"></script>
	<script type="text/javascript" src="js/invites.js"></script>
	<?php include_once("analyticstracking.php") ?>
</html>
