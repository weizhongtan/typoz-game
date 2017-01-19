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
		// animate each word in the words in the game currently
		this.wordsInGame.forEach(function(w) {
			w.animate();
		});
		// increment counter
		this.T++;
		// generate new word every 4 seconds
		if (this.T % 120 == 0) {
			this.getRandomWord();
		}
		setTimeout(function() {
			Game.main();
		}, 1000/30);
	},
	addNewWord: function(word) {
		var newWord = new Word(word, this.wordsInGame);
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
		Game.addNewWord(data.Word.toLowerCase());
	}
};

// array holding all the words in the game
Game.init();

// add a word to the words array
Game.addNewWord("hello");

// start the game
Game.main();
