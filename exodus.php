<?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Exodus:</h2>
			<p>Remove yourself from multiple rooms at one time!<p>
			<button class="btn btn-warning" id="listRooms" type="button">List Rooms</button>

			<p>Remove multiple users from a room at one time!<p>
			<button class="btn btn-warning" id="exodusUsers" value="removeOthers" type="button">List Rooms</button>
		</div>
	</div>

</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery.csv.js"></script>
  	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/lodash.js"></script>
	<script type="text/javascript" src="js/exodus.js"></script>
	<?php include_once("analyticstracking.php") ?>
</html>
