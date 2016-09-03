<?php
  include 'includes/header.php';
?>
  <?= $header; ?>
  <div class="container">
    <div class="jumbotron" id="intro">
      <h2>Spark Power Pack</h2>
        <p>Using the Spark API's, we have created a collection of tools to enable repetitive tasks in bulk. </p>&nbsp;

        <div class="row">
            <a href="https://sparkpowerpack.com/invites.php"><div class="col-md-3"><center><i class="fa fa-plus-circle fa-3x" aria-hidden="true" style="color:#63B537" width="50"height="50"></i></center></div></a>
            <a href="https://sparkpowerpack.com/broadcast.php"><div class="col-md-3"><center><i class="fa fa-bullhorn fa-3x" aria-hidden="true" style="color:#1487CD" width="50"height="50"></i></center></div></a>
            <a href="https://sparkpowerpack.com/exodus.php"><div class="col-md-3"><center><i class="fa fa-minus-circle fa-3x" href="powerpack.php" aria-hidden="true" style="color:#9AD7F1" width="50" height="50"></i></center></div></a>
            <a href="https://sparkpowerpack.com/jabberAlerts.php"><div class="col-md-3"><center><i class="fa fa-exclamation-circle fa-3x" aria-hidden="true" style="color:red"width="50" height="50"></i></center></div></a>
            <div class="col-md-3"><h5 class="text-center"><strong>Invites</strong><br><br><i>invite 100's of people <br> to a Spark room </div>
            <div class="col-md-3"><h5 class="text-center"><strong>Broadcasts</strong> <br><br><i>send a message to multiple <br> Spark rooms</div>
            <div class="col-md-3"><h5 class="text-center"><strong>Exodus</strong><br><br><i>manage your Spark Room <br> memberships and the <br> users in them</div>
            <div class="col-md-3"><h5 class="text-center"><strong>Jabber Alerts</strong><br><br><i>receive Spark messages <br> in Jabber</div>    
        </div>
        <p>
  </div>
    <div class="text-center video">
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
      $('.video').append('<iframe width="640" height="360" src="https://ace-rev.cisco.com/embed?id=4e190f9d-be4f-46e7-a087-9eb4c1dade59" frameborder="0" allowfullscreen></iframe>');
    }else{
      $('.video').append(' <iframe width="420" height="315" src="https://www.youtube.com/embed/gBiYF5YX_Ug" frameborder="0" allowfullscreen></iframe>');
    }


  </script>
</html>