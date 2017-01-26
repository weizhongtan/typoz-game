"use strict";

/* TO DO LIST

* add sound effects and music
* fix bug of words going off the sides
* make movement more dynamic
* implement score system
* online multiplayer / leaderboards

*/
var d = document;

var STATE_PAUSED = 0, STATE_PLAY = 1, STATE_GAMEOVER = 2;

var Game = {
	gameState: null,
	currentLevel: null,
	newWordIncrement: null,
	wordsInGame: null,
	player: {
		score: null,
		lives: null,
		correctKeystrokes: null,
		totalKeystrokes: null,
		stats: {
			longestWord: null,
			typingAccuracy: null,
			wordsTyped: null
		},
		// update all stats
		updateStats: function(wordStr) {
			var s = this.stats;
			if (wordStr.length > s.longestWord.length) {
				s.longestWord = wordStr;
			}
			if (this.totalKeystrokes !== 0) {
				s.typingAccuracy = this.correctKeystrokes / this.totalKeystrokes;
			}
			s.wordsTyped++;
		}
	},
	T: null,
	init: function() {
		// clear the DOM
		$(".game-word").empty();
		this.gameState = STATE_PLAY;
		this.currentLevel = 0;
		this.wordsPerTenSecs = 2;
		this.wordsInGame = [];
		this.player.score = 0;
		this.player.lives = 5;
		this.player.correctKeystrokes = 0;
		this.player.totalKeystrokes = 0;
		this.player.stats.longestWord = "";
		this.player.stats.typingAccuracy = 0;
		this.player.stats.wordsTyped = 0;
		this.T = 0;
	},
	main: function() {
		// initialize Game variables
		this.init();
		// begin the animation loop
		this.renderFrame();
	},
	renderFrame: function () {
		switch (this.gameState) {
			case STATE_PLAY:
				// hide pause and gameover screen
				$(".pause-screen, .gameover-screen").css("visibility", "hidden");
				// increment time counter (1/30th of a second)
				this.T++;
				// generate new word from api request every 4 seconds
				if (this.T % Math.floor(300 * (1 / this.wordsPerTenSecs)) === 0) {
					console.log("getting word");
					this.getRandomWord();
				}
				// animate each word in the words in the game currently
				this.wordsInGame.forEach(function(w) {
					w.update();
					w.animate();
				});
				// render score
				$("#player-score").text(Game.player.score);
				$("#player-lives").text(Game.player.lives);
				break;
			case STATE_PAUSED:
				$(".pause-screen").css("visibility", "visible");
				break;
			case STATE_GAMEOVER:
				var s = this.player.stats;
				var view = {
					longestWord: s.longestWord,
					typingAccuracy: (s.typingAccuracy * 100).toFixed(1) + "%",
					wordsTyped: s.wordsTyped + " " + ((s.wordsTyped === 1) ? "word" : "words")
				};
				$("ul").html(Mustache.render($("#stats-template").html(), view));
				$(".gameover-screen").css("visibility", "visible");
				break;
		}
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
		this.player.score += value;
		this.updateLevel();
	},
	updateLevel: function() {
		this.currentLevel = 1 - Math.pow(0.3, this.player.score / 50);
		this.wordsPerTenSecs = 2 + Math.floor(this.currentLevel * 3);
		console.log("Current Level: ", this.currentLevel, " WPS: ", this.wordsPerTenSecs);
	},
	losePlayerLife: function() {
		console.log("losing life");
		this.player.lives--;
		if (this.player.lives === 0) {
			Game.gameState = STATE_GAMEOVER;
		}
	},
	playSound: function() {
		(new Audio("sounds/correct_sound.wav")).play();
	}
};

// load sounds
var Sounds = {};

// start the game
Game.main();

Game.addNewWord("hello", 1);
// TESTING
Game.addNewWord("hello", 1);
Game.addNewWord("hello", 1);
Game.addNewWord("hello", 1);

setTimeout(function() {
	Game.addNewWord("hear", 1)
}, 500);
