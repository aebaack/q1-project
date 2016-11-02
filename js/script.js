'use strict';

$(".random").on("click", function() {
  console.log("ran");
  var titles = $.getJSON("http://poetdb.herokuapp.com/title");
  titles.done(function(titleList) {
    console.log(titleList);
    var poemTitle = titleList.titles[Math.floor(Math.random() * titleList.titles.length)];
    console.log(poemTitle);
    var poem = $.getJSON("http://poetdb.herokuapp.com/title/"+poemTitle+":abs");
    poem.done(function(data) {
      sessionStorage.setItem("poem", JSON.stringify(data));
      document.location.href = "color.html";
    });
  });
});

var poemForm = document.forms["poems"];

$(poemForm).on("input", function() {
  if (poemForm.poet.value !== "" || poemForm.title.value !== "") {
    $("#searchPoems").removeAttr("disabled");
  } else {
    $("#searchPoems").attr("disabled", "disabled");
  }
});

$("#searchPoems").on("click", function(event) {
  var poet = poemForm["poet"].value;
  var title = poemForm["title"].value;
  var length = poemForm["length"].value;

  var poem;
  if (poet.length && title.length) {
      poem = $.getJSON("http://poetdb.herokuapp.com/title,author/"+title+";"+poet);
  } else if (poet.length) {
    poem = $.getJSON("http://poetdb.herokuapp.com/author/"+poet);
  } else if (title.length) {
    poem = $.getJSON("http://poetdb.herokuapp.com/title/"+title);
  }

  var ul = $("#poemList");
  $(ul).children().remove(); // Remove past searches from displaying upon a new search
  $(".preloader-wrapper").removeClass("hide"); // Make sure the loader displays on a new search
  poem.done(function(data) {
    $(".preloader-wrapper").addClass("hide");
    if (data.status) {
      $("#notFound").removeClass("hide");
      return;
    }
    $(ul).removeClass("hide");
    $("#notFound").addClass("hide");
    for (var i = 0; i < data.length; i++) {
      if (data[i].lines.length > 500) {
        continue;
      }
      var li = $("<li>");
      var divHeader = $("<div>"), divBody = $("<div>");
      divHeader.attr("class", "collapsible-header clearfix");
      divHeader.append($("<div>").attr("class", "left").text(data[i].title)); divHeader.append($("<a>").attr("class", "waves-effect waves-light btn-flat red lighten-2 right poemSelector").attr("id", data[i].title).css("margin-top", "4px").text("Select"));
      divBody.attr("class", "collapsible-body grey lighten-5");
      var poemLines = data[i].author + "<br><br>";
      for (var j = 0; j < data[i].lines.length; j++) {
        poemLines += data[i].lines[j] + "<br>";
      }
      $(divBody).html(poemLines + "<br>");
      li.append(divHeader).append(divBody);
      ul.append(li);
    }
    $("#loadingPoems").text("Select a Poem");
    $(".poemSelector").on("click", selectPoem);
  });
  poem.fail(function(err) {
    console.log(err);
  });
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
