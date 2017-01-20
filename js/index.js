"use strict";

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
	playerScore: null,
	T: null,
	init: function() {
		this.currentLevel = 0;
		this.wordsInGame = [];
		this.playerScore = 0;
		this.T = 0;
	},
	main: function() {
		// initialize Game variables
		this.init();
		// begin the animation loop
		this.renderFrame();
	},
	renderFrame: function () {
		// increment time counter (1/30th of a second)
		this.T++;
		// generate new word from api request every 2 seconds
		if (this.T % 120 == 60) {
			this.getRandomWord();
		}
		// animate each word in the words in the game currently
		this.wordsInGame.forEach(function(w) {
			w.update();
			w.animate();
		});
		// render score
		$("#player-score").text(Game.playerScore);
		// loop renderFrame function
		setTimeout(function() {
			Game.renderFrame();
		}, 1000 / 30);
	},
	addNewWord: function(word) {
		// create new word object, and add it to the dom
		var newWord = new Word(word, this.wordsInGame);
		newWord.addToPage("game-container");
	},
	getRandomWord: function() {
		// get random word from api
		$.ajax({
			type: "GET",
			url: "http://randomword.setgetgo.com/get.php",
			dataType: "jsonp",
			jsonpCallback: 'Game.randomWordReceived'
		});
	},
	randomWordReceived: function(data) {
		// add the new word when data is received from the api call
		this.addNewWord(data.Word.toLowerCase());
	},
	incrementScore: function(value) {
		this.playerScore += value;
		this.updateLevel();
	},
	updateLevel: function() {
		this.currentLevel = 1 - Math.pow(0.5, this.playerScore / 40);
		console.log("Current Level: ", this.currentLevel);
	}
};

// start the game
Game.main();

Game.addNewWord("hello", 1);

setTimeout(function() {
	Game.addNewWord("hear", 1)
}, 500);
