var Word = (function(Word) {
	function Word(word, arr) {
		var rand = Math.random() * 100;
		this.word = word;
		this.currentString = word;
		this.activeLetter = word[0];
		this.scale = ((25 - word.length) > 12) ? (25 - word.length) : 12;
		this.active = false;
		this.x = 0;
		if (rand + (this.word.length * 2) > 100) {
			this.y = rand - this.word.length;
		} else {
			this.y = rand;
		}
		this.container = arr;
		arr.push(this);
	}

	Word.prototype.getFromDom = function() {
		return $("#" + this.word);
	}

	Word.prototype.removeFirstLetter = function() {
		this.currentString = this.currentString.slice(1);
		this.activeLetter = this.currentString[0];
		this.getFromDom().text(this.currentString);
		if (this.currentString.length == 0) this.removeWordFrom(this.container);
	}

	Word.prototype.removeWordFrom = function(arr) {
		this.getFromDom().remove();
		arr.splice(arr.indexOf(this), 1);
	}

	Word.prototype.addToPage = function(classToAddTo) {
		var div = d.createElement("div");
		div.setAttribute("id", this.word);
		div.setAttribute("class", "game-word");
		div.appendChild(d.createTextNode(this.word));
		$("." + classToAddTo).append(div);
	}

	Word.prototype.calculateVel = function() {
		return (this.word.length - this.currentString.length) + 1;
	}

	Word.prototype.animate = function() {
		var w = this.getFromDom();
		this.x += 1;
		if (this.x > d.documentElement.clientHeight) {
			this.x = 0;
		}
		w.css("top", this.x + "px");
		w.css("left", this.y + "%");
		w.css("font-size", this.scale + "px");

		if (this.active) {
			w.addClass("first");
		}
	}

	return Word;
})();
