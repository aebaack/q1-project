'use strict';
$("#searchPoems").on("click", function() {
  var poemForm = document.forms["poems"];
  var poet = poemForm["poet"].value;
  var title = poemForm["title"].value;
  var length = poemForm["length"].value;
  if (poet.length === 0 && title.length === 0 && length === "any") {
    Materialize.toast('Enter more data!', 4000, 'red lighten-2');
  } else {
    var poem = $.getJSON("http://poetdb.herokuapp.com/author/"+poet);
    var ul = $("#poemList");
    poem.done(function(data) {
      $(ul).removeClass("hide");
      for (var i = 0; i < data.length; i++) {
        if (data[i].lines.length > 500) {
          continue;
        }
        var li = $("<li>");
        var divHeader = $("<div>"), divBody = $("<div>");
        divHeader.attr("class", "collapsible-header clearfix").html('<div class="left">' + data[i].title + '</div><a class="waves-effect waves-teal btn-flat right poemSelector" id="' + data[i].title + '">Select</a>');
        divBody.attr("class", "collapsible-body white");
        var poemLines = "";
        for (var j = 0; j < data[i].lines.length; j++) {
          poemLines += data[i].lines[j] + "<br>";
        }
        $(divBody).html(poemLines);
        li.append(divHeader).append(divBody);
        ul.append(li);
      }
      $(".preloader-wrapper").attr("class", "hide");
      $("#loadingPoems").text("Select a Poem");
      $(".poemSelector").on("click", selectPoem);
    });
    poem.fail(function(err) {
      console.log(err);
    });
  }
});

function selectPoem(event) {
  var title = $(event.target).attr("id");
  // var lines = $(event.target.parentElement.nextSibling).html();
  var poemData = $.getJSON("http://poetdb.herokuapp.com/title/" + title +":abs");
  poemData.done(function(data) {
    sessionStorage.setItem("poem", JSON.stringify(data));
    document.location.href = "color.html";
  });
}
