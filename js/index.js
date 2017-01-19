var d = document;

var Game = {
	currentLevel: null,
	wordsInGame: null,
	init: function() {
		this.currentLevel = 0;
		this.wordsInGame = [];
	},
	main: function() {
		this.wordsInGame.forEach(function(w) {
			w.animate();
		});
		setTimeout(function() {
			Game.main();
		}, 1000/30);
	},
	addNewWord: function(word, velocity) {
		new Word(word, velocity, this.wordsInGame);
	},
	insertWords: function() {
		this.wordsInGame.forEach(function(word) {
			word.addToPage("game-container");
		});
	}
};
// array holding all the words in the game
Game.init();

// add a word to the words array
Game.addNewWord("hello", 2);

// iterate over all items in words and add them to the page
Game.insertWords();

Game.main();

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
