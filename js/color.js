'use strict';
$(document).ready(function() {
  var poem = JSON.parse(sessionStorage.getItem("poem"))[0];
  var title = $("#title").text(poem.title); // Poem title location
  var poet = $("#poet").text("By "+poem.author); // Poem author location

  var stanzas = [], stanza = "", analyzeText = "";
  for (var i = 0; i < poem.lines.length; i++) {
    if (poem.lines[i] === "" && stanza !== "") {
      stanzas.push(stanza);
      stanza = "";
      analyzeText+=". ";
      continue;
    }
    stanza += poem.lines[i] + "<br>";
    // analyzeText += poem.lines[i].replace("!", " ").replace(".", " ").replace("?"," ") + " ";
    analyzeText += poem.lines[i].replace(/[!.?'"]/g, " ");
  }
  stanzas.push(stanza);
  analyzeText+=". ";

  var tones = $.get("https://g-watson-aidanbaack.herokuapp.com/?text=" + analyzeText);

  var poemStanza = $("#stanza"); // Poem stanza location
  poemStanza.hide(); // Hidden so that it can fade in later

  var beginBtn = $("#beginBtn");

  var loader = $(".progress");

  beginBtn.on("click", function() {
    beginBtn.hide();
    poemStanza.html(stanzas[currentStanza++]);
    //currentStanza will break if only one stanza
    poemStanza.fadeIn(3000);
  });

  var stanzaToneList, currentStanza = 0;
  tones.done(function (data) {
    loader.hide();
    poet.removeClass("hide");
    title.removeClass("hide");
    beginBtn.removeClass("hide");
    var docTones = data["document_tone"]["tone_categories"][0].tones;
    var strongest = strongestTone(docTones);
    stanzaToneList = data["sentences_tone"];

    var colors = {
      "Sadness": "#283593",
      "Anger": "#b71c1c",
      "Fear": "#1b5e20",
      "Disgust": "#6a1b9a",
      "Joy": "#ffee58"
    };

    var tempJSON = {"particles":{"number":{"value":24,"density":{"enable":true,"value_area":800}},"color":{"value":colors[strongest]},"shape":{"type":"polygon","stroke":{"width":0,"color":"#000"},"polygon":{"nb_sides":6},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.3,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":31.565905665290902,"random":false,"anim":{"enable":true,"speed":10,"size_min":40,"sync":false}},"line_linked":{"enable":false,"distance":200,"color":"#ffffff","opacity":1,"width":2},"move":{"enable":true,"speed":8,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"roittateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"grab"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true};
    particlesJS('particles-js', tempJSON);
    changeBackground(strongest);
  });

  $(window).keydown(function(event) {
    switch (event.which) {
      case 37:
        if (currentStanza > 0) {
          currentStanza--;
          poemStanza.html(stanzas[currentStanza]);
          if (stanzaToneList[currentStanza].tone_categories.length !== 0) {
            var stanzaTone = strongestTone(stanzaToneList[currentStanza].tone_categories[0].tones);
            changeBackground(stanzaTone);
          }
        }
        break;
      case 39:
        if (currentStanza < (stanzas.length-1)) {
          currentStanza++;
          poemStanza.html(stanzas[currentStanza]);
          if (stanzaToneList[currentStanza].tone_categories.length !== 0) {
            var stanzaTone = strongestTone(stanzaToneList[currentStanza].tone_categories[0].tones);
            changeBackground(stanzaTone);
          }
        }
        break;
    }
  });
});

function strongestTone (toneData) {
  var strongest = [toneData[0].tone_name, toneData[0].score];
  for (var i = 1; i < toneData.length; i++) {
    if (toneData[i].score > strongest[1]) {
      strongest = [toneData[i].tone_name, toneData[i].score];
    }
  }
  return strongest[0];
}

function changeBackground(tone) {
  var colorBackground = {
    "Sadness": "#2c2e43",
    "Anger": "#550808",
    "Fear": "#1e2d12",
    "Disgust": "#9b9b79",
    "Joy": "#939d7d"
  };
  $("#particles-js").css("background-color", colorBackground[tone]);
  $(document.body).css("background-color" , colorBackground[tone]);
}
