$(document).ready(function(){
  getIssues();
});

function getIssues(){
  $.ajax({
    url: "https://api.github.com/repos/bdm1981/Spark-Power-Pack/issues",
    cache: false,
    method: "GET"
  }).done(function(data){
    console.log(data);
    var HTML = '<table class="table table-striped" id="gitHub"><thead><th>ID</th><th>Description</th></thead>';
    for(var i = 0; i < data.length; i++){
      HTML += '<tr><td><a href="'+data[i].html_url+'" target="_blank">'+data[i].id+'</a></td><td>'+data[i].title+'</td></tr>';
    }
    HTML += '</table>';
    $("#gitHub").html(HTML);
  });
}

$(document).on('click', '#joinSupport', function(e) {
  e.preventDefault();
  var personEmail = localStorage.getItem("myEmail");
  $.ajax({
    type: "POST",
    cache: false,
    url: 'http://api.bdmcomputers.com:8080/support',
    dataType: 'json',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({'personEmail': personEmail})
  }).done(function(data){
    $('#joinSupport').hide();
    
    if(data.success){
      $('.results').append("<h4 style='color: green'>"+data.success+"</h4>");
    }else{
      $('.results').append("<h4 style='color: red'>"+data.error+"</h4>");
    }
  });
});