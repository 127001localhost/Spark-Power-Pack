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
