var d = document;

var Game = {
	currentLevel: null,
	wordsInGame: null,
	T: null,
	init: function() {
		this.currentLevel = 0;
		this.wordsInGame = [];
		this.T = 0;
	},
	main: function() {
		this.wordsInGame.forEach(function(w) {
			w.animate();
		});
		// increment counter
		this.T++;
		// generate new word every 2 seconds
		if (this.T % 120 == 0) {
			this.getRandomWord();
		}
		setTimeout(function() {
			Game.main();
		}, 1000/30);
	},
	addNewWord: function(word, velocity) {
		var newWord = new Word(word, velocity, this.wordsInGame);
		newWord.addToPage("game-container");
	},
	getRandomWord: function() {
		var requestStr = "http://randomword.setgetgo.com/get.php";

		$.ajax({
			type: "GET",
			url: requestStr,
			dataType: "jsonp",
			jsonpCallback: 'Game.randomWordReceived'
		});
	},
	randomWordReceived: function(data) {
		Game.addNewWord(data.Word.toLowerCase(), 2);
	}
};

// array holding all the words in the game
Game.init();

// add a word to the words array
Game.addNewWord("hello", 2);

// start the game
Game.main();
