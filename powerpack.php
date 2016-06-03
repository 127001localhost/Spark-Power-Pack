<?php
  include 'includes/header.php';
?>
  <?= $header; ?>
  <div class="container">
    <div class="jumbotron" id="intro">
      <h2>Welcome to the Spark Power Pack!</h2>
      <p>We have created a collection of tools to enable repetitive tasks in bulk. Click Tools in the upper right to get started.</p>
      <ul>
        <li>Need to update multiple team rooms at the same time with an important message or an alert? Try <a href="broadcast.php">Broadcast</a></li>
        <li>Need to create a room for a special event? <a href="invites.php">Invites</a> can be used to quickly create and add 100s of users to a room. </li>
        <li>Been using Spark for a while? Use <a href="exodus.php">Exodus</a> to remove yourself and others from rooms in bulk.</li>
        <li>Get the best of Jabber & Spark with <a href="jabberAlerts.php">Jabber Alerts</a>. Setup alerts to send a notification to Jabber when an important conversation in Cisco Spark is happening and quickly reply without leaving Jabber!</li>
      </ul>
      <h2>*** UPDATES ***</h2>
      <p>The Spark Power Pack has been a huge success! We are averaging 50 sessions per day. We recently fixed an issue with invites that prevented email addresses with certain characters from being added. Some users reported that large imports didn't also work properly. This is due to throttling by the Spark API. Enhancements have been made on our side to properly handle this. Please keep the feedback coming and let us know if you run into any issues.</p>

    </div>
    <div class="text-center">
      <iframe width="420" height="315" src="https://www.youtube.com/embed/gBiYF5YX_Ug" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</body>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <script type="text/javascript" src="js/common.js"></script>
</html>