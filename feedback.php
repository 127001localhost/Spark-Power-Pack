<?php
  include 'includes/header.php';

  	if ($_GET['thank']) {
  		echo $header;
  		echo '<div class="container">
  				<div class="jumbotron">
  					<h3>Thank you for the feedback!</h3>
  				</div>
  			</div>
  		</body>
		  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
		  <script type="text/javascript" src="js/bootstrap.min.js"></script>
		  <script type="text/javascript" src="js/common.js"></script>
		</html>';

  	}else{
  		echo $header;
  		echo '<div class="container">
        <div class="row">
          <div class="col-md-6">
            <h3>Open Issues on Github</h3>
            <div id="gitHub"></div>
          </div>
          <div class="col-md-6">
            <h3>Power Pack Support</h3>
            <h4>If you have questions or a problem when using the Power Pack, click the button below to join our spark room for support.</h4>
            <button id="joinSupport" class="btn btn-success" type="button">Join: Power Pack Support</button>
            <div class="results"></div>
          </div>
        </div>



    	</div>
	</body>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <script type="text/javascript" src="js/common.js"></script>
  <script type="text/javascript" src="js/feedback.js"></script>
 </html>';
}
?>
