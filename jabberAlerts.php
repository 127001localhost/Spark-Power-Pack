 <?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Jabber Alerts:</h2>
			<p>Wouldn't it be nice to receive alerts in Jabber for important messages? Jabber Alerts pushe notifications to tabs within Jabber!<p>
			<button class="btn btn-warning" id="manage" type="button">Manage Alerts</button>
			<button class="btn btn-success" id="create" type="button">Create Alerts</button>
		</div>
	  </div>
</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/lodash.js"></script>
	<script type="text/javascript" src="js/jabberAlerts.js"></script>
	<?php include_once("analyticstracking.php") ?>
</html>
