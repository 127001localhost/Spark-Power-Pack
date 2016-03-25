<?php
$header = '
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/font-awesome.css">
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
  <title>Spark Power Pack</title>
</head>
<body>

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="powerpack.php"> <span><img src="images/logo_spark_256px.png" height="30px"> Power Pack</span></a>
    </div>

      
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tools <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="broadcast.php">Broadcast</a></li>
            <li><a href="exodus.php">Exodus</a></li>
            <li><a href="invites.php">Invites</a></li>
            <li><a href="jabberAlerts.php">Jabber Alerts</a></li>
          </ul>
        </li>
         <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Resources <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="aboutus.php">About Us</a></li>
             <li><a href="feedback.php">Feedback</a></li>
          </ul>
        </li>
        <li class="dropdown" id="profile">
          <ul class="dropdown-menu">
            <li><a href="#" id="refreshToken" onclick="refreshToken()">Log Out</a></li>
          </ul>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
'
?>