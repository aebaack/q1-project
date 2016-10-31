'use strict';
$("#searchPoems").on("click", function() {
  // var poemForm = $("form[name='poems']").serializeArray();
  var poemForm = document.forms["poems"];
  var poet = poemForm["poet"].value;
  var title = poemForm["title"].value;
  var length = poemForm["length"].value;
  if (poet.length === 0 && title.length === 0 && length === "any") {
    Materialize.toast('Enter more data!', 4000, 'red lighten-2');
  }
});
