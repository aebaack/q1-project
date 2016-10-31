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
    $(ul).attr("class", "collapsible");
    poem.done(function(data) {
      for (var i = 0; i < data.length; i++) {
        var li = $("<li>");
        var divHeader = $("<div>"), divBody = $("<div>");
        divHeader.attr("class", "collapsible-header").html(data[i].title + '<a class="waves-effect waves-teal btn-flat poemSelector">Select</a>');
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
  console.log(event);
}
