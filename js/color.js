'use strict';
$(document).ready(function() {
  // Poem Object and Display Data
  var poem = JSON.parse(sessionStorage.getItem("poem"));
  var title = $("#title").text(poem.title); // Poem <h1> title location
  var poet = $("#poet").text("By "+poem.author); // Poem <h2> author location
  var poemStanza = $("#stanza"); // Poem <p> stanza location
  var beginBtn = $("#beginBtn"); // Start button for poem reading
  var loader = $("#loader"); // Loading circle

  poemStanza.hide(); // Hidden so that it can fade in later

  beginBtn.on("click", function() {
    beginBtn.hide();
    poemStanza.html(stanzas[0]); // Set text of first stanza
    changeStanzaBackground(); // Change background to current tone
    poemStanza.fadeIn(3000); // Fade in first stanza

    // Add click events to arrows
    $(".next").on("click", function() {
      nextStanza();
    });

    $(".previous").on("click", function() {
      previousStanza();
    });

    // Add keyboard controls
    $(window).keydown(function(event) {
      switch (event.which) {
        case 37: // Left Arrow: Go one stanza back (if possible)
          previousStanza();
          break;
        case 39: // Right Arrow: Go one stanza forward (if possible)
          nextStanza();
          break;
      }
    });
  });

  // Stanza Display and Analysis Data
  var stanzaData = separateStanzas(poem.lines);
  var stanzas = stanzaData[0]; // Array of stanza strings formatted for HTML display
  var analyzeText = stanzaData[1]; // String of stanzas formatted for tone analysis

  // Poem tone analysis
  // var tones = $.getJSON("https://g-watson-aidanbaack.herokuapp.com/?text=" + analyzeText);
  var tones = $.post("https://undertone-watson.herokuapp.com/", {"text": analyzeText});

  var stanzaToneList, strongestDocTone, currentStanza = 0; // stanzaToneList is an array of tone analysis data indexed for each stanza, and currentStanza keeps track of the current displaying stanza

  tones.done(function (toneData) {
    loader.hide(); // Hide loading bar

    // Display poet, poem title, and begin button
    $("#poem").removeClass("hide");
    beginBtn.removeClass("hide");

    // docTones is a tone data object for the entire poem
    var docTones = toneData["document_tone"]["tone_categories"][0].tones;
    // strongestDocTone is a string of the strongest tone in the poem
    strongestDocTone = strongestTone(docTones);
    // stanzaToneList is an array of tone objects for each stanza
    stanzaToneList = toneData["sentences_tone"];

    particlesJS('particles-js', createParticlesObj(strongestDocTone)); // Display particles
    changeBackground(strongestDocTone, strongestDocTone); // Change background color to entire poem tone
  });

  tones.fail(function (err) {
    loader.hide();
    $("#error").removeClass("hide");
  });

  function previousStanza() {
    if (currentStanza > 0) {
      currentStanza--;
      changeStanzaBackground(); // Change background to current tone
    }
  }

  function nextStanza() {
    if (currentStanza < (stanzas.length-1)) {
      currentStanza++;
      changeStanzaBackground(); // Change background to current tone
    }
  }

  function changeStanzaBackground() {
    // Change background color to match stanza tone and display the stanza
    poemStanza.html(stanzas[currentStanza]); // Displays stanza
    if (stanzas.length > 1 && stanzaToneList[currentStanza].tone_categories.length !== 0) {
      var stanzaTone = strongestTone(stanzaToneList[currentStanza].tone_categories[0].tones);
      changeBackground(stanzaTone, strongestDocTone);
    }
  }

});

function strongestTone (toneData) {
  // RETURNS: string of the name of the strongest tone in toneData
  var strongest = [toneData[0].tone_name, toneData[0].score];
  for (var i = 1; i < toneData.length; i++) {
    if (toneData[i].score > strongest[1]) {
      strongest = [toneData[i].tone_name, toneData[i].score];
    }
  }
  return strongest[0];
}

function changeBackground(tone, docTone) {
  // Changes background color to the given tone
  var colorBackground;
  switch (docTone) {
    case "Sadness":
      colorBackground = {
        "Sadness": "#111650",
        "Anger": "#5f0606",
        "Fear": "#042a06", //#042a06, 032f15
        "Disgust": "#350146",
        "Joy": "#E9DD87"
      };
      break;
    case "Anger":
      colorBackground = {
        "Sadness": "#0a0e46",
        "Anger": "#460b0b",
        "Fear": "#0f2d0b",
        "Disgust": "#340f3c",
        "Joy": "#d29158"
      };
      break;
    case "Fear":
      colorBackground = {
        "Sadness": "#15184d",
        "Anger": "#410404",
        "Fear": "#0b2803",
        "Disgust": "#2b0039",
        "Joy": "#b18c6b"
      };
      break;
    case "Disgust":
      colorBackground = {
        "Sadness": "#040734",
        "Anger": "#370606",
        "Fear": "#0b1e0a",
        "Disgust": "#8c54b6", //#dbaaff
        "Joy": "#ffd2aa"
      };
      break;
    case "Joy":
      colorBackground = {
        "Sadness": "#15184a",
        "Anger": "#3e0808",
        "Fear": "#133910",
        "Disgust": "#2e1043",
        "Joy": "#938958" //8c6c34
      };
      break;
  }
  // var colorBackground = {
  //   "Sadness": ["#2c2e43", "#21277F", "#353FCC"],
  //   "Anger": ["#550808", "#6E2C2C", "#6E0003"],
  //   "Fear": ["#07461E", "#082D16", "#0E2D08"],
  //   "Disgust": ["#5C2A9B", "#3E1C68", "#6C0DAC"],
  //   "Joy": ["#939d7d"] //"#E9DD87", "#E9C873", "#E9CA0E"
  // };
  $(".tone-text").text(tone);
  var color = colorBackground[tone];
  $("#particles-js").css("background-color", color);
  $(document.body).css("background-color" , color);
}

function separateStanzas(poemLinesArr) {
  // Break poem lines into individual stanzas to be displayed on the html page, and create an analyzeText string to send for text analysis
  // analyzeText is structured as a single string of poetry text, where the end of each stanza of poetry is followed by a '.', so that Watson will analyze each stanza separately (by treating each one as a different sentence)
  // RETURNS:
  // stanzas (array) - array of stanza strings formatted for HTML displaying
  // analyzeText (string) - text to be analyzed for tone
  var stanzasArr = [], stanza = "", analyzeText = "";
  for (var i = 0; i < poemLinesArr.length; i++) {
    if (poemLinesArr[i] === "") {
      if (stanza !== "") {
        stanzasArr.push(stanza.trim());
        stanza = "";
        analyzeText+=". ";
      }
      continue;
    }
    stanza += poemLinesArr[i] + "<br>";
    analyzeText += poemLinesArr[i].replace(/[!.?]/g, " "); // Removes any character that Watson would count as the end of a sentence
  }
  stanzasArr.push(stanza); // Adds the final stanza to stanzas array
  analyzeText+="."; // Adds the last period to analyzedText
  return [stanzasArr, analyzeText];
}

function createParticlesObj(tone) {
  // Creates the particles object given the tone of the poem

  // Particles colors for each tone
  var colors = {
    "Sadness": {"color": "#4255e8", //#283593
                "size": 100 + Math.floor(Math.random() * 50),
                "randomSize": false,
                "amount": 10,
                "moveSpeed": 6,
                "moveDirection": "none",
                "shape": "polygon"},
    "Anger": {"color": "#c80729", //#b71c1c
                "size": 60 + Math.floor(Math.random() * 10),
                "randomSize": true,
                "amount": 20,
                "moveSpeed": 4,
                "moveDirection": "bottom-right",
                "shape": ["edge", "circle", "polygon"]},
    "Fear": {"color": "#1b5e20",
                "size": 100 + Math.floor(Math.random() * 30),
                "randomSize": false,
                "amount": 12,
                "moveSpeed": 7,
                "moveDirection": "none",
                "shape": "polygon"},
    "Disgust": {"color": "#6a1b9a",
                "size": 70 + Math.floor(Math.random() * 10),
                "randomSize": true,
                "amount": 45,
                "moveSpeed": 8,
                "moveDirection": "none",
                "shape": ["edge","polygon"]},
    "Joy": {"color": "#ffee58",
                "size": 30 + Math.floor(Math.random() * 10),
                "randomSize": true,
                "amount": 40,
                "moveSpeed": 4,
                "moveDirection": "top",
                "shape": ["circle", "edge", "polygon"]}
  };

  var colorObj = colors[tone];

  var colorJSON = {
    "particles": {
      "number": {
        "value": colorObj.amount
      },
      "shape": {
        "type": colorObj.shape,
        "polygon": {
          "nb_sides": 6
        }
      },
      "color": {
        "value": colorObj.color
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 0.5,
          "opacity_min": 0.4,
          "sync": false
        }
      },
      "size": {
        "value": colorObj.size,
        "random": colorObj.randomSize
      },
      "line_linked": {
        "enable": false
      },
      "move": {
        "enable": true,
        "speed": colorObj.moveSpeed,
        "direction": colorObj.moveDirection,
        "straight": false
      }
    },
    "interactivity": {
      "events": {
        "onhover": {
          "enable": false
        }
      }
    }
  };
  return colorJSON;
}
