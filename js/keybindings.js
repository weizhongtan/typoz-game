(function(){
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  // add event listeners to all alphabetical keys
  for (var i = 0; i < alphabet.length; i++) {
    (function() {
      var currKey = alphabet[i];
      Mousetrap.bind(currKey, function(e) {
        var isWordActive = false;
        var activeWord;

        // check if there is an active word currently in the game
        Game.wordsInGame.forEach(function(w) {
          if (w.active) {
            // set this word's active value to true
            isWordActive = true;
            activeWord = w;
            if (currKey == activeWord.activeLetter) {
              activeWord.changeActiveLetter();
            }
          }
        });

        // if no active word is found, start matching
        if (!isWordActive) {
          console.log("try to match to a word");
          // get each word that has matched the keystroke
          var matchedWords = [];
          Game.wordsInGame.forEach(function(w) {
            if (w.activeLetter == currKey) {
              matchedWords.push(w);
            }
          });
          // if any words are matched, set the word with the highest x value
          if (matchedWords.length > 0) {

            matchedWords.forEach(function(w) {
              if (w.active) {
                activeWord = w;
              }
            });
            if (!activeWord) {
              activeWord = matchedWords.reduce((a, b) => (b.x > a.x) ? b : a);
            }
            activeWord.active = true;
            activeWord.changeActiveLetter();
            console.log("active word: " + activeWord.remainingStr);
          }
        }
      });
    })();
  }
})();
