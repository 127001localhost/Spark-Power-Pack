
  
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="font-awesome/font-awesome-4.6.3 3/css/font-awesome.min.css">
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
  <div class="container">
    <div class="jumbotron" id="intro">
      <h2>Spark Power Pack</h2>
        <p><tab>Using the Spark APIs, we have created a collection of tools to enable repetitive tasks in bulk. </p>&nbsp;

        <div class="row">
            <a href="invites.php"><div class="col-md-3"><center><div class="fa fa-plus-circle fa-3x" aria-hidden="true" style="color:#63B537" width="50"height="50"></div></center></a><h5 class="text-center"><strong>Invites</strong><br><br><i>invite 100s of people <br> to a Spark room</i></div>
            <a href="broadcast.php"><div class="col-md-3"><center><div class="fa fa-bullhorn fa-3x" aria-hidden="true" style="color:#1487CD" width="50"height="50"></div></center></a><h5 class="text-center"><strong>Broadcasts</strong> <br><br><i>send a message to multiple <br> Spark rooms</i></div>
            <a href="exodus.php"><div class="col-md-3"><center><div class="fa fa-minus-circle fa-3x" aria-hidden="true" style="color:#9AD7F1" width="50" height="50"></div></center></a><h5 class="text-center"><strong>Exodus</strong><br><br><i>manage your Spark Room <br> memberships and the <br> users in them</i></div>
            <a href="jabberAlerts.php"><div class="col-md-3"><center><div class="fa fa-exclamation-circle fa-3x" aria-hidden="true" style="color:red"width="50" height="50"></div></center></a><h5 class="text-center"><strong>Jabber Alerts</strong><br><br><i>receive Spark messages <br> in Jabber</i></div> 
        </div>
        <p>
    </div>
  </div>
<div class="container">
        <div class="col-md-6" style="height: 300PX; width: 500px; "><h2>Power Pack Log</h2>
          <div style="height: 300px; width: 500px; ">
            <div>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>10/17/16</td><td>Added message previews after clicking a room in Exodus</td></tr>
                  <tr><td>10/17/16</td><td>Added search to Broadcast, Exodus, Jabber Alerts!</td></tr>
                  <tr><td>10/17/16</td><td>Improved invites error handling</td></tr>
                  <tr><td>8/9/16</td><td>website makeover</td></tr>
                  <tr><td>8/2/16</td><td>sparkpowerpack.com was registered</td></tr>
                  <tr><td>4/1/16</td><td>Hackathon Celebration - 2nd place - we demand a recount!</td></tr>
                  <tr><td>3/25/16</td><td>Power Pack is adopted immedietly into our peer community</td></tr>
                  <tr><td>3/25/16</td><td>Power Pack was submitted as our final project</td></tr>
                  <tr><td>3/22/16</td><td>Invites: first successful beta customer - 500 SE's added to a Spark room!</td></tr>
                  <tr><td>3/20/16</td><td>Power Pack applications: Invites, Broadcast, Exodus, Jabber Alerts are created</td></tr>
                  <tr><td>3/18/16</td><td>Team Power Pack is created</td></tr>
                  <tr><td>3/17/16</td><td>Hackathon Kickoff</td></tr>
                </tbody>
              </table>
            </div>     
            </div>
          </div>
      
        <div class="text-center video"></div>
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
                  $('.video').append('<iframe width="480" height="320" src="https://ace-rev.cisco.com/embed?id=4e190f9d-be4f-46e7-a087-9eb4c1dade59" frameborder="0" allowfullscreen></iframe>');
                }else{
                  $('.video').append(' <iframe width="420" height="315" src="https://www.youtube.com/embed/gBiYF5YX_Ug" frameborder="0" allowfullscreen></iframe>');
                } </script>   
        
</html>