<?php
  include 'includes/header.php';
?>
  <?= $header; ?>
	<div class="container">
		<div class="jumbotron" id="intro">
			<h2>Carbon Copy:</h2>
			<p>Send the same message to multiple rooms!<p>
			<button class="btn btn-warning has-spinner" id="listRooms" type="button" onClick="roomsClick()">List Rooms <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
		</div>
	    <div class="row" id="myRooms" hidden>
	    	<button class="btn btn-warning has-spinner" id="review" type="button" onClick="reviewSelected()">Review Selection <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
	    </div>
	    <div class="row" id="confirm" hidden>
         <form>
          <textarea cols="100" rows="5" id="myMessage" name="message" placeholder="Type your message here" ></textarea>
        </form> 


        <button class="btn btn-danger has-spinner" id="send" type="button" onClick="sendSelected()">Send Message <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
	    	<button class="btn btn-normal has-spinner" id="cancel" type="button" onClick="startOver()">Cancel <span class="spinner"><i class="icon-spin icon-refresh"></i></span></button>
	    </div>
	    <div class="row" id="complete">
	    </div>
	</div>
</body>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/jquery.csv.js"></script>
  <script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript" src="js/carboncpy.js"></script>
</html>