"use strict";

var bindKeys = {
    to: function(gameObj) {
        var alphabet = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ];

        // add event listeners to all alphabetical keyboard events (a-z)
        for (var i = 0; i < alphabet.length; i++) {
            (function() {
                var currKey = alphabet[i];
                // bind every keyboard event to this function
                Mousetrap.bind(currKey, function(e) {
                    if (gameObj.gameState === STATE_PLAY) {
                        var wordFound = false;
                        // check if there is an active word currently in the game
                        gameObj.wordsInGame.forEach(function(w) {
                            if (w.active) {
                                // decrement the word if the key was correct
                                if (w.activeLetter == currKey) {
                                    w.changeActiveLetter();
                                    // increment the players correct keystroke stats
                                    gameObj.player.correctKeystrokes++;
                                } else {
                                    // highlight the word to the player
                                    w.highlight();
                                    // reset the combo counter
                                    gameObj.player.combo = 0;
                                }
                                wordFound = true;
                            }
                        });
                        // if no active word is found (wordFound = false), look for other matches
                        if (!wordFound) {
                            console.log("try to match to a word");
                            // get each word whose activeLetter matches the keystroke
                            var matchedWords = [];
                            gameObj.wordsInGame.forEach(function(w) {
                                if (w.activeLetter == currKey) {
                                    matchedWords.push(w);
                                }
                            });
                            // get the word with the highest y value
                            if (matchedWords.length > 0) {
                                var activeWord = matchedWords.reduce((a, b) => (b.y > a.y) ? b : a);
                                activeWord.active = true;
                                activeWord.changeActiveLetter();
                                // increment the players keystroke stats
                                gameObj.player.correctKeystrokes++;
                            }
                        }
                        // increment total keystroke count
                        gameObj.player.totalKeystrokes++;
                        gameObj.player.updateStats();
                    }
                });
            })();
        }

        Mousetrap.bind("esc", function() {
            var s = gameObj.gameState;
            if (s === STATE_PLAY) {
                gameObj.gameState = STATE_PAUSED;
            } else if (s === STATE_PAUSED) {
                gameObj.gameState = STATE_PLAY;
            }
        });

        Mousetrap.bind("space", function() {
            if (gameObj.gameState === STATE_GAMEOVER) {
                gameObj.init(gameObj.volume);
            }
        })
    }
};
