if(localStorage.getItem("sparkToken") != null){
  var count = 0;
  var sparkToken = localStorage.getItem("sparkToken");
  var myId = localStorage.getItem("myId");
  var activeId = "";
  var cachedMessages = [];
  var totalMessages = 0;

    $("#profile").append("<img class=\"user dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" src=\""+localStorage.getItem("myAvatar")+"\">");

  function refreshToken(){
    localStorage.clear();
    window.location="jabberTab.php";
  }

  var socket = io.connect('https://sparkpowerpack.com:8443');
  socket.emit('join', {sparkUserId: myId});
  socket.on('news', function (){
    if(activeId == ""){
      loadAlerts();
    }
  });

  function loadAlerts(){
    $.ajax({
      url: "https://sparkpowerpack.com:8443/spark?id="+myId,
      headers: {'Content-Type': 'application/json'},
      cache: false,
      method: "GET"
      }).done(function(data){
        displayAlert(data);
    });
  }

  function displayAlert(data){
    var count = 0;
    var HTML = '';
    for (var i = 0; i < data.length; i++){
          var created = new Date(data[i].created);

          HTML += '<div class="alert-box" id="'+data[i].roomId+'"><div class="alert-header"><i class="badge" style="float: left;  background-color: red;">'+data[i].count+'</i><div class="quick-title">'+data[i].title+'</div><i class="glyphicon glyphicon-remove ack" style="float: right; color: red; display: inline-block;"></i></div><hr style="margin: 0px;">';

          var messages = data[i].msgs;
          var displayMsg = messages.length - 1;

          //for(index in data[i].msgs){
            HTML += '<p class="alert-from">'+data[i].personEmail+'</p><p class="alert-time"> - '+created.toLocaleTimeString()+'</p>';
            HTML += '<div><p class="alert-msg" id="'+data[i].msgs[displayMsg].msgId+'-preview" hidden></p></div>';
           // totalMessages++;
          //}

          HTML += '<div class="quick alert-reply">Reply</div><div class="quick-box" id="qb'+i+'"><div class="form-group">  <label class="col-md-12 control-label" for=""></label>  <div class="col-md-12"> <textarea class="form-control" name="text" placeholder="Type a response here."></textarea> </div></div><div class="col-md-8 text-center"><div class="quick-buttons send">Send</div>  <div class="quick-buttons cancel">Cancel</div></div></div></div><br/>';

          count += data[i].count;
        }
        if(count == 0){
          HTML += "<h3>You do not have any alerts.</h3>";
        };

        $("#alerts").html(HTML);
        
        // pull last messages
        for(var i = 0; i < data.length; i++){
                var messages = data[i].msgs
                var displayMsg = messages.length - 1;
                $.ajax({
                  url: 'https://api.ciscospark.com/v1/messages/'+data[i].msgs[displayMsg].msgId,
                  headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
                  cache: false,
                  method: "GET",
                  statusCode: {
                    502: function(){
                      $(".container").html("<h2>Sorry, we could not access the API. Check the <a href='http://status.ciscospark.com' target='_blank'>Spark Status</a> and try again later.</h2>")

                    }
                  }
                }).done(function(data, status, xhr){
                  console.log(data);
                    $("#"+data.id+"-preview").append("<p>"+data.text+"</p>");
                    $("#"+data.id+"-preview").show();

                //if(cachedMessages.length == totalMessages) displayMsg();
              });      
        }


        // updates the Jabber Badge
        console.log(count);
        window.external.SetNotificationBadge(count);

  }

  function displayMsg(){
    console.log("display some messages" + cachedMessages);
    for(i in cachedMessages){
      $("#"+cachedMessages[i].id+"-preview").append("<p>"+cachedMessages[i].text+"</p>");
      $("#"+cachedMessages[i].id+"-preview").show();
    }
  }

  // Clear active alerts
  $(document).on("click", ".ack", function(){
    // grab roomId
    var roomId = $(this).closest(".alert-box").attr("id");
    $("#"+roomId).remove();


    $.ajax({
      url: "https://sparkpowerpack.com:8443/spark",
      headers: {'Content-Type': 'application/json'},
      cache: false,
      method: "DELETE",
      dataType: 'json',
      data: JSON.stringify({roomId: roomId, id: myId}),
      statusCode: {
        200: function(){
          // loadAlerts will reset the badge counter
          loadAlerts();
        }
      }
    });
  });

  //Handle reply press
  $(document).on("click", ".quick", function(){
   $(this).hide();
    activeId = $(this).next(".quick-box").attr("id");

    $("#"+activeId).slideDown("fast");
  });

  //Handle Send Press
    $(document).on("click", ".send", function(){
    var roomId = $(this).closest(".alert-box").attr("id");
    var text = $("#"+activeId).find("textarea").val();
    
    $.ajax({
      url: "https://api.ciscospark.com/v1/messages",
      headers: {'Content-Type': 'application/json', 'Authorization': sparkToken},
      cache: false,
      method: "POST",
      dataType: 'json',
      data: JSON.stringify({roomId: roomId, text: text})
    }).done(function(data){
      $("#"+activeId).slideUp("fast");
    });
    
    activeId = "";

  });

    $(document).on("click", ".cancel", function(){
      var text = $("#"+activeId).find("textarea");
      $("#"+activeId).parent().find(".quick").show()
      text.val("");
      $("#"+activeId).slideUp("fast");
      activeId = "";
    });


} 