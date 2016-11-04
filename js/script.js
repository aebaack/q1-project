'use strict';

// ----- SEARCH ----- //
// Poem search form
var poemSearchForm = document.forms.poems;

// Poem search submit button
var poemSearchSubmit = $("#searchPoems");

// Poem Search data has changed
$(poemSearchForm).on("input", function() {
  // Keep Search button disabled when no text is present in inputs
  if (poemSearchForm.poet.value !== "" || poemSearchForm.title.value !== "") {
    poemSearchSubmit.removeAttr("disabled"); // Allow search
  } else {
    poemSearchSubmit.attr("disabled", "disabled"); // Disable search
  }
});

// Poem has been searched for
$(poemSearchSubmit).on("click", function() {
  // Search variables
  var poet = poemSearchForm.poet.value; // Name of the poet
  var title = poemSearchForm.title.value; // Title of the poem

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

  var poemList; // Holds poem data to use when result is selected
  poem.done(function(data) { // Poem search has finished
    poemList = data;

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

      // Add poem title
      divHeader.append($("<div>").attr("class", "left").text(data[i].title));

      // Select Button creation
      var selectBtn = $("<a>"); // Create new select button
      selectBtn.attr("class", "waves-effect waves-light btn-flat red lighten-2 right poemSelector"); // Style button
      selectBtn.attr("id", i).css("margin-top", "4px").text("Select"); // Add top margin and Select text
      divHeader.append(selectBtn);

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

  function selectPoem(event) {
    var index = $(event.target).attr("id"); // Finds poems location in poemList
    var poemData = poemList[index];
    sendPoemToColor(poemData);
  }

});


// ----- CUSTOM TEXT ----- //
// Custom text input box
var customTextInput = $("#customText");

// Custom text submit button
var customTextSubmit = $("#customTextSubmit");

// Input box data has changed
$(customTextInput).on("input", function() {
  // Keep Submit button disabled when text is too long or too short
  if (customTextInput.val().length > 5 && customTextInput.val().length <= customTextInput.attr("length")) {
    customTextSubmit.removeAttr("disabled"); // Allow search
  } else {
    customTextSubmit.attr("disabled", "disabled"); // Disable search
  }
});

// Custom text has been submitted
$(customTextSubmit).on("click", function() {
  var poet = "Anonymous Poet"; // Placeholder
  var title = "Anonymous Poem"; // Placeholder
  var text = customTextInput.val(); // Text in input field
  var lines = []; // Array of each line in the poem
  var currentLine = ""; // String that holds the current characters in the line
  for (var i = 0; i < text.length; i++) {
    if (text[i].match(/\n/)) { // Found a newline character
      lines.push(currentLine); // Add currentLine to lines
      currentLine = ""; // Reset currentLine
    } else {
      currentLine += text[i];
    }
  }
  lines.push(currentLine); // Add the last line
  var poemObj = {"author": poet, "title": title, "lines": lines}; // Structure poem data
  sendPoemToColor(poemObj);
});


// ----- RANDOM ----- //
$(".random").on("click", function() {
  // Random Poem
  var titles = $.getJSON("http://poetdb.herokuapp.com/title");
  titles.done(function(titleList) {
    var poemTitle = titleList.titles[Math.floor(Math.random() * titleList.titles.length)];
    var poem = $.getJSON("http://poetdb.herokuapp.com/title/"+poemTitle+":abs");
    poem.done(function(data) {
      sessionStorage.setItem("poem", JSON.stringify(data[0]));
      document.location.href = "color.html";
    });
  });
});


// ----- SEND POEM TO COLOR.HTML ---- //
function sendPoemToColor(poemObj) {
  // Receives poem object, puts it in sessionStorage, and goes to color.html
  sessionStorage.setItem("poem", JSON.stringify(poemObj)); // Puts poem in sessionStorage
  document.location.href = "color.html"; // Goes to color.html
}
