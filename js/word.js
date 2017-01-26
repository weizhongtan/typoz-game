"use strict";
var DEFAULT_Y_VEL = 1;

var Word = (function(Word) {
	function Word(word, arr) {
		this.word = word;
		// the part of the word that has already been typed
		this.typedStr = "";
		// the remaining string that needs to be typed
		this.remainingStr = word;
		// the current letter that needs to be typed
		this.activeLetter = word[0];
		// denotes if this word is currently being typed
		this.active = false;
		// the size of the word in the dom
		this.scale = Math.max(30, Math.pow(3 * this.word.length, 0.5));
		// generate random color (hsl color from 0-360)
		var randHue = Math.floor(Math.random() * 360);
		this.color = 'hsl(' + randHue + ', 100%, 70%)';
		// generate opposite color for highlight color
		this.highlightColor = 'hsl(' + (255 - randHue) + ', 30%, 80%)';
		// vertical distance from the top
		this.y = 0;
		// randomized horizontal distance from the left, taking into account word length
		var _randX = (Math.random() - 0.5) * (100 - this.word.length * 5);
		this.x = 40 + _randX;
		// speed at which the word moves
		this.speed = DEFAULT_Y_VEL + Game.currentLevel;
		// the array that this word lives in
		this.container = arr;
		// automatically push this word to the array when it is instantiated
		arr.push(this);
	}

	Word.prototype.getFromDom = function() {
		// returns this dom element
		return $("#" + this.word);
	}

	Word.prototype.changeActiveLetter = function() {
		// increments the active letter to the  next in the string, changes styling to account
		this.typedStr += this.remainingStr[0];
		this.remainingStr = this.remainingStr.slice(1);
		this.activeLetter = this.remainingStr[0];
		// change the dom element to mirror the changes
		this.getFromDom().html(
			"<span style='color:" + this.highlightColor + "'>" + this.typedStr + "</span>"
			+ "<span>" + this.remainingStr + "</span>"
		);
		this.speed *= 0.95;
		// check if word should be removed
		if (this.remainingStr.length == 0) {
			// trigger game score event
			Game.player.incrementScore(this.word.length);
			Game.playSound();
			Game.player.updateStats(this.word);
			this.removeWordFrom(this.container, "zoomOutUp");
		}
	}

	Word.prototype.removeWordFrom = function(arr, animation) {
		// remove active so that a new word can be typed immediately
		this.active = false;
		var w = this.getFromDom();
		// check if animation arg was given
		if (animation) {
			$("#player-score").css("color", this.color);
			$(".pause-screen").css("color", this.color);
			w.addClass('animated ' + animation);
			w.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				w.remove();
			});
		} else {
			w.remove();
		}
		// immediately remove it from the words array so the next word can be typed
		arr.splice(arr.indexOf(this), 1);
	}

	Word.prototype.highlight = function() {
		this.getFromDom().addClass('animated pulse highlighted').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			$(this).removeClass('animated pulse highlighted');
		});
	}

	Word.prototype.addToPage = function(classToAddTo) {
		// creates a new div element, and adds it to given class dom element
		var div = d.createElement("div");
		div.setAttribute("id", this.word);
		div.setAttribute("class", "game-word");
		div.appendChild(d.createTextNode(this.word));
		$("." + classToAddTo).append(div);
		// add animation and coloring
		var w = this.getFromDom()
		w.textillate({ in: { effect: 'bounceInDown'	}	});
		w.css("color", this.color);
	}

	Word.prototype.update = function() {
		// increments internal position properties
		this.y += this.speed;
		// decrement lives if the word reaches the bottom of the screen
		if (this.y > $(".game-container").height()) {
			Game.player.loseLife();
			this.removeWordFrom(this.container);
		}
	}

	Word.prototype.animate = function() {
		// translates these to changes in the dom
		var w = this.getFromDom();
		w.css("top", this.y + "px");
		w.css("left", this.x + "%");
		w.css("font-size", this.scale + "px");
	}

	return Word;
})();
