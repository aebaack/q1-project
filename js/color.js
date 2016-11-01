'use strict';
$(document).ready(function() {
  var poem = JSON.parse(sessionStorage.getItem("poem"))[0];
  var title = $("#title").text(poem.title); // Poem title location
  var poet = $("#poet").text("By "+poem.author); // Poem author location

  var stanzas = [], stanza = "", analyzeText = "";
  for (var i = 0; i < poem.lines.length; i++) {
    if (poem.lines[i] === "" && i > 0) {
      stanzas.push(stanza);
      stanza = "";
      continue;
    }
    stanza += poem.lines[i] + "<br>";
    analyzeText += poem.lines[i] + "\n";
  }
  if (stanzas.length === 0) {
    stanzas.push(stanza);
  }

  // var tones = $.get("https://g-watson-aidanbaack.herokuapp.com/?text=" + analyzeText);
  var tones = $.get("http://poetdb.herokuapp.com/author/Shakespeare")

  var poemStanza = $("#stanza"); // Poem stanza location
  poemStanza.hide(); // Hidden so that it can fade in later

  var beginBtn = $("#beginBtn");

  var loader = $(".progress");

  beginBtn.on("click", function() {
    beginBtn.hide();
    poemStanza.html(stanzas[0]);
    poemStanza.fadeIn(3000);
  });

  tones.done(function (data) {
    loader.hide();
    beginBtn.removeClass("hide");
    // var analyzedTones = data["document_tone"]["tone_categories"][0].tones;
    // var strongestTone = [analyzedTones[0].tone_name, analyzedTones[0].score];
    // for (var i = 1; i < analyzedTones.length; i++) {
    //   if (analyzedTones[i].score > strongestTone[1]) {
    //     strongestTone = [analyzedTones[i].tone_name, analyzedTones[i].score];
    //   }
    // }

    var strongestTone = ["Anger"];
    var colors = {
      "Sadness": "#283593",
      "Anger": "#b71c1c",
      "Fear": "#1b5e20",
      "Disgust": "#6a1b9a",
      "Joy": "#ffee58"
    };

    var colorBackground = {
      "Sadness": "#2c2e43",
      "Anger": "#550808",
      "Fear": "#111805",
      "Disgust": "#9b9b79",
      "Joy": "#939d7d"
    }

    var tempJSON = {"particles":{"number":{"value":24,"density":{"enable":true,"value_area":800}},"color":{"value":colors[strongestTone[0]]},"shape":{"type":"polygon","stroke":{"width":0,"color":"#000"},"polygon":{"nb_sides":6},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.3,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":31.565905665290902,"random":false,"anim":{"enable":true,"speed":10,"size_min":40,"sync":false}},"line_linked":{"enable":false,"distance":200,"color":"#ffffff","opacity":1,"width":2},"move":{"enable":true,"speed":8,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"roittateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"grab"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true};
    particlesJS('particles-js', tempJSON);
    $("#particles-js").css("background-color", colorBackground[strongestTone[0]]);
    $(document.body).css("background-color", colorBackground[strongestTone[0]]);
  });
});
