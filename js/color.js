'use strict';
$(document).ready(function() {
  var poem = JSON.parse(sessionStorage.getItem("poem"))[0];
  // ParticlesJS
  var tempJSON = {"particles":{"number":{"value":24,"density":{"enable":true,"value_area":800}},"color":{"value":"#9d2f49"},"shape":{"type":"polygon","stroke":{"width":0,"color":"#000"},"polygon":{"nb_sides":6},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":0.3,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":31.565905665290902,"random":false,"anim":{"enable":true,"speed":10,"size_min":40,"sync":false}},"line_linked":{"enable":false,"distance":200,"color":"#ffffff","opacity":1,"width":2},"move":{"enable":true,"speed":8,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"grab"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true};
  particlesJS('particles-js', tempJSON);

  // Separate poem by stanzas
  var stanzas = [], stanza = "";
  for (var i = 0; i < poem.lines.length; i++) {
    if (poem.lines[i] === "" && i > 0) {
      stanzas.push(stanza);
      stanza = "";
      continue;
    }
    stanza += poem.lines[i] + "<br>";
  }

  var title = $("#title").text(poem.title); // Poem title location
  var poet = $("#poet").text("By "+poem.author); // Poem author location
  var poemStanza = $("#stanza"); // Poem stanza location
  var beginBtn = $("#beginBtn");

  poemStanza.hide(); // Hidden so that it can fade in later

  beginBtn.on("click", function() {
    title.hide();
    poet.hide();
    beginBtn.hide();
    poemStanza.html(stanzas[0]);
    poemStanza.fadeIn(3000);
  });
});
