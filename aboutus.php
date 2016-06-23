 <?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
	<div class="row">
		<div class="col-md-4"><div style="text-align: center;"><h3>Ang Tan</h3><h4>WI-IL Territory - SE</h4><img class="profile-large" src="https://1efa7a94ed216783e352-c62266528714497a17239ececf39e9e2.ssl.cf1.rackcdn.com/V1~913794648422a7a613b164f2b21ec5f5~cyOT4UDOSPiV8Xk7_0akzg==~1600" height="100px">
		<h4>Software Developer</h4><a href="https://www.linkedin.com/in/antan"><img src="images/linkedin.png" width="40px"></a><a href="tel:+14088943509"><img src="images/phone.png" width="35px"></a></div></div>
		
		<div class="col-md-4"><div style="text-align: center;"><h3>Brad McAllister</h3><h4>Collaboration - CSE</h4><img class="profile-large" src="https://1efa7a94ed216783e352-c62266528714497a17239ececf39e9e2.ssl.cf1.rackcdn.com/V1~10d413100dd1b83b9dc0dc1a36ad81c8~ej_yZ9Y4Rb--e8CTc9yb-A==~1600" height="100px">
		<h4>Software Developer</h4><a href="https://www.linkedin.com/in/bmcallis"><img src="images/linkedin.png" width="40px"></a><a href="http://www.twitter.com/bmcallister"><img src="images/twitter.png" width="40px"></a><a href="tel:+18476786776"><img src="images/phone.png" width="35px"></a></div></div>

		<div class="col-md-4"><div style="text-align: center;"><h3>Jim Matthews</h3><h4>CH-IN Territory - SE</h4><img class="profile-large" src="https://1efa7a94ed216783e352-c62266528714497a17239ececf39e9e2.ssl.cf1.rackcdn.com/V1~e27a398d57b03c0c7b3c0b2568161b06~Z42bkfnyTC2S_xwnKsp3_Q==~1600" height="100px">
		<h4>Marketing Engineer</h4><img src="images/linkedin.png" width="40px"></a><a href="http://www.twitter.com/jamesm81"><img src="images/twitter.png" width="40px"></a><a href="tel:+18476786250"><img src="images/phone.png" width="35px"></a></div></div>

	</div>
		<br/>
		<div class="row">
		<div class="jumbotron">
			<p>Thank you for using the Spark Power Pack. We are constantly enhancing the existing tools and on the lookout for new features that can be added. Please use the feedback form to let us know how you are using the tools, features you would like to see, or issues you are running into.</p>
		</div>

	</div>

	</div>
</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript">
		var emailAddress = localStorage.getItem('myEmail');
		var idx = emailAddress.indexOf('@cisco.com');
		if (idx > -1) {
		  console.log("cisco employee");
		  $('.jumbotron').append('<h3>We hope our tools have made you a more productive Cisco Employee! Thank our team members with <a target="_blank", href="http://wwwin.cisco.com/HR/compensation/recognition">Connected Recognition!</a></h3>');
		}else{
			console.log("external users");
		}


	</script>
</html>


