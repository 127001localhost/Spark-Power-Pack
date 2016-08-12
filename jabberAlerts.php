 <?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Jabber Alerts:</h2>
			<p>Wouldn't it be nice to receive alerts in Jabber for important messages? Jabber Alerts pushes notifications to a custom tab within Jabber!<p>
			<button class="btn btn-warning" id="manage" type="button">Manage Alerts</button>
			<button class="btn btn-success" id="create" type="button">Create Alerts</button>
			<p>In order to see these alerts in Jabber, follow these simple steps.<h4> Jabber for Mac & Windows:</h4> <ul><li> Mac: Open Jabber and click File -> New Custom Tab. Windows: Open Jabber and click File -> New -> Custom Tab.</li><li>"Create a new custom tab" will pop up. Provide a name for the tab (Spark Alerts). Copy and Paste the following in the page URL https://sparkpowerpack.com/jabberTab.php and click Create!</li><li>You will now see a new icon near the lower left of the Jabber screen. </li></ul><img src="images/tab3.jpg"></p>
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
