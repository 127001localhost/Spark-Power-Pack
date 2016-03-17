<?php
$header = '
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/3.0.2/css/font-awesome.css">
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
  <title>List Manager</title>
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
            <li><a href="carboncpy.php">Carbon Copy</a></li>
            <li><a href="delete.php">Exodus</a></li>
            <li><a href="listManager.php">List Manager</a></li>
            <li><a href="tabManager.php">Tab Manager</a></li>
          </ul>
        </li>
         <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Resources <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="https://collab-tme.cisco.com/spark/publicrooms/" target="_blank">Public Rooms</a></li>
            <li><a href="#">About Us</a></li>
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