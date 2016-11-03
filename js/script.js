'use strict';

$(".random").on("click", function() {
  // Random Poem
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

// Poem search form
var poemForm = document.forms["poems"];

// Poem Search data has changed
$(poemForm).on("input", function() {
  // Keep Search button disabled when no text is present in inputs
  if (poemForm.poet.value !== "" || poemForm.title.value !== "") {
    $("#searchPoems").removeAttr("disabled"); // Allow search
  } else {
    $("#searchPoems").attr("disabled", "disabled"); // Disable search
  }
});

// Poem has been searched for
$("#searchPoems").on("click", function(event) {
  // Search variables
  var poet = poemForm["poet"].value; // Name of the poet
  var title = poemForm["title"].value; // Title of the poem
  var length = poemForm["length"].value; // Length of the poem

  var ul = $("#poemList"); // Collapsible list holder
  $(ul).children().remove(); // Remove past searches from displaying upon a new search
  $(".preloader-wrapper").removeClass("hide"); // Make sure the loader displays on a new search

  // Search poetryDB based on search inputs
  var poem; // Holds search results
  if (poet.length && title.length) { // Poet and Title
      poem = $.getJSON("http://poetdb.herokuapp.com/title,author/"+title+";"+poet);
  } else if (poet.length) { // Just Poet
    poem = $.getJSON("http://poetdb.herokuapp.com/author/"+poet);
  } else if (title.length) { // Just Title
    poem = $.getJSON("http://poetdb.herokuapp.com/title/"+title);
  }

  poem.done(function(data) { // Poem search has finished
    $(".preloader-wrapper").addClass("hide"); // Hide the loading circle

    if (data.status) { // Poem not found or other error
      $("#notFound").removeClass("hide"); // Display Not Found text
      return;
    }

    ul.removeClass("hide"); // Display blank list
    $("#notFound").addClass("hide"); // Hide Not Found text in case it is still displayed from a past search

    // Traverse poem data
    for (var i = 0; i < data.length; i++) {
      if (data[i].lines.length > 500) { // Ignore poems with more than 500 lines
        continue;
      }

      // Create Poem List Elements
      var li = $("<li>");
      var divHeader = $("<div>"), divBody = $("<div>");

      // Set Materialize collapsible attributes
      divHeader.attr("class", "collapsible-header clearfix");
      divBody.attr("class", "collapsible-body grey lighten-5");

      // Add poem title and select button
      divHeader.append($("<div>").attr("class", "left").text(data[i].title)); divHeader.append($("<a>").attr("class", "waves-effect waves-light btn-flat red lighten-2 right poemSelector").attr("id", data[i].title).css("margin-top", "4px").text("Select"));

      // Create lines to display in collapsible text (author and text)
      var poemLines = data[i].author + "<br><br>";
      for (var j = 0; j < data[i].lines.length; j++) {
        poemLines += data[i].lines[j] + "<br>";
      }

      $(divBody).html(poemLines + "<br>"); // Add poemLines to collapsible text

      // Add elements to the list
      li.append(divHeader).append(divBody);
      ul.append(li);
    }

    $("#loadingPoems").text("Select a Poem"); // Add text above search results

    $(".poemSelector").on("click", selectPoem); // Add click event to select buttons
  });

  poem.fail(function(err) {
    $("#notFound").removeClass("hide"); // Display Not Found text
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
