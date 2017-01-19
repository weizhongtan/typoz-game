(function(){
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  // add event listeners to all alphabetical keys
  for (var i = 0; i < alphabet.length; i++) {
    (function() {
      var currKey = alphabet[i];
      Mousetrap.bind(currKey, function(e) {
        Game.wordsInGame.forEach(function(w) {
          if (w.activeLetter == currKey) {
            w.removeFirstLetter();
          }
        });
      });
    })();
  }
})();
