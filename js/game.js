"use strict";

/* TO DO LIST

* add sound effects and music
* make movement more dynamic
* online multiplayer / leaderboards
* remove all Game references from word.js (so it's actually independent)
* improve difficulty scaling

*/
var d = document;

// game states
var STATE_PAUSED = 0, STATE_PLAY = 1, STATE_GAMEOVER = 2;

var Game = {
	gameState: null,
	currentLevel: null,
	newWordIncrement: null,
	wordsInGame: null,
	volume: null,
	T: null,
	player: {
		score: null,
		combo: null,
		comboMultiplier: null,
		lives: null,
		correctKeystrokes: null,
		totalKeystrokes: null,
		stats: {
			longestWord: null,
			typingAccuracy: null,
			wordsTyped: null
		},
		incrementScore: function(value) {
			// apply combo to score and increment
			this.score += value * this.comboMultiplier;
			Game.updateLevel();
		},
		incrementCombo: function(value) {
			this.combo += value;
			this.comboMultiplier = 1 + Math.floor(this.combo / 30);
		},
		loseLife: function() {
			this.lives--;
			if (this.lives === 0) {
				this.updateStats();
				Game.gameState = STATE_GAMEOVER;
			}
		},
		// update all stats for gameover screen
		updateStats: function(wordStr) {
			var s = this.stats;
			// if this function is called with zero arguments, dont change words typed stats
			if (wordStr) {
				if (wordStr.length > s.longestWord.length) {
					s.longestWord = wordStr;
				}
				s.wordsTyped++;
			}
			if (this.totalKeystrokes !== 0) {
				s.typingAccuracy = this.correctKeystrokes / this.totalKeystrokes;
			}
			// render stats list to gameover-screen
			var view = {
				finalScore: this.score,
				longestWord: s.longestWord,
				lwShow: (s.longestWord.length > 0) ? "initial" : "none",
				typingAccuracy: (s.typingAccuracy * 100).toFixed(1) + "%",
				wordsTyped: s.wordsTyped + " " + ((s.wordsTyped === 1) ? "word" : "words")
			};
			$(".gameover-screen").html(Mustache.render($("#gameover-template").html(), view));
		}
	},
	init: function(vol) {
		// clear the DOM
		$(".game-word").empty();
		this.gameState = STATE_PLAY;
		// initial game difficulty levels
		this.currentLevel = 0;
		this.wordsPerTenSecs = 2;
		this.wordsInGame = [];
		this.volume = vol || 0.2;
		this.T = 0;
		this.player.score = 0;
		this.player.combo = 0;
		this.player.comboMultiplier = 1;
		this.player.lives = 5;
		this.player.correctKeystrokes = 0;
		this.player.totalKeystrokes = 0;
		// initialize stats starting values
		this.player.stats.longestWord = "";
		this.player.stats.typingAccuracy = 0;
		this.player.stats.wordsTyped = 0;
	},
	main: function() {
		// initialize Game variables
		this.init();
		// begin the animation loop
		this.renderFrame();
	},
	renderFrame: function () {
		// determine which frame to render according to current game state
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
				// render volume controls
				$("#volume-level").text("Volume: " + (Game.volume * 100) + "%");
				break;
			case STATE_PAUSED:
				$(".pause-screen").css("visibility", "visible");
				break;
			case STATE_GAMEOVER:
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
	updateLevel: function() {
		this.currentLevel = 1 - Math.pow(0.3, this.player.score / 50);
		this.wordsPerTenSecs = 2 + Math.floor(this.currentLevel * 3);
		console.log("Current Level: ", this.currentLevel, " WPS: ", this.wordsPerTenSecs);
	},
	playSound: function() {
		const sound = new Audio("sounds/correct_sound.wav")
		sound.volume = this.volume;
		sound.play();
	},
	adjustVolume: function(amount) {
		this.volume = (this.volume < 1) ? Math.floor((this.volume + amount) * 10) / 10 : 0;
	}
};

// add click listener
$("#volume-level").on("click", function() {
	Game.adjustVolume(+0.2);
});

// start the game
Game.main();

Game.addNewWord("hello", 1);
// TESTING
// Game.addNewWord("hello", 1);
// Game.addNewWord("hello", 1);
// Game.addNewWord("hello", 1);
//
// setTimeout(function() {
// 	Game.addNewWord("hear", 1)
// }, 500);
