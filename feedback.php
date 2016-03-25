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
    
			<form class="form-horizontal" method="post" action="contact.php">
			<fieldset>
			<!-- Text input-->
			<div class="form-group">
			  <label class="col-md-4 control-label" for="name"></label>  
			  <div class="col-md-4">
			  <input id="name" name="name" type="text" placeholder="name" class="form-control input-md" required="">
			    
			  </div>
			</div>

			<!-- Text input-->
			<div class="form-group">
			  <label class="col-md-4 control-label" for=""></label>  
			  <div class="col-md-4">
			  <input id="" name="email" type="text" placeholder="email" class="form-control input-md">
			    
			  </div>
			</div>

			<!-- Select Basic -->
			<div class="form-group">
			  <label class="col-md-4 control-label" for="selectbasic"></label>
			  <div class="col-md-4">
			    <select id="type" name="type" class="form-control">
			      <option value="feature">Feature request</option>
			      <option value="bug">I found a Bug</option>
			      <option value="help">Help</option>
			      <option value="misc">Misc</option>
			    </select>
			  </div>
			</div>

			<!-- Textarea -->
			<div class="form-group">
			  <label class="col-md-4 control-label" for="comment"></label>
			  <div class="col-md-4">                     
			    <textarea class="form-control" id="comment" name="comment" placeholder="Enter your feedback, bug, etc"></textarea>
			  </div>
			</div>

			<!-- Button -->
			<div class="form-group">
			  <label class="col-md-4 control-label" for="send"></label>
			  <div class="col-md-4">
			    <button id="send" name="send" class="btn btn-success">Send</button>
			  </div>
			</div>

			</fieldset>
			</form>



    	</div>
	</body>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.min.js"></script>
  <script type="text/javascript" src="js/common.js"></script>
 </html>';
}
?>
