<?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Broadcast:</h2>
			<p>Send the same message to multiple rooms!<p>
			<button class="btn btn-warning" id="listRooms" type="button" onClick="listRooms()">List Rooms</button>
		</div>

	</div>
</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery.csv.js"></script>
	<script type="text/javascript" src="js/lodash.js"></script>
  <script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/carboncpy.js"></script>
</html>