/* TO DO LIST

* add sound effects and music
* fix bug of words going off the sides
* make movement more dynamic
* implement score system
* online multiplayer / leaderboards

*/
var d = document;

var Game = {
	currentLevel: null,
	wordsInGame: null,
	score: null,
	T: null,
	init: function() {
		this.currentLevel = 0;
		this.wordsInGame = [];
		this.score = 0;
		this.T = 0;
	},
	main: function() {
		// initialize Game variables
		this.init();

		// begin the animation loop
		this.renderFrame();
	},
	renderFrame: function () {
		// animate each word in the words in the game currently
		this.wordsInGame.forEach(function(w) {
			w.animate();
		});
		// increment counter
		this.T++;
		// generate new word every 2 seconds
		if (this.T % 120 == 60) {
			this.getRandomWord();
		}
		setTimeout(function() {
			Game.renderFrame();
		}, 1000/30);
	},
	addNewWord: function(word) {
		var newWord = new Word(word, this.wordsInGame);
		newWord.addToPage("game-container");
	},
	getRandomWord: function() {
		$.ajax({
			type: "GET",
			url: "http://randomword.setgetgo.com/get.php",
			dataType: "jsonp",
			jsonpCallback: 'Game.randomWordReceived'
		});
	},
	randomWordReceived: function(data) {
		Game.addNewWord(data.Word.toLowerCase());
	}
};

// start the game
Game.main();

Game.addNewWord("hello");

setTimeout(function() {
	Game.addNewWord("hear")
}, 500);
