var Word = (function(Word) {
	function Word(word, arr) {
		this.word = word;
		this.currentString = word;
		this.activeLetter = word[0];
		this.x = 0;
		this.y = 0;
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
		this.x += this.calculateVel();
		if (this.x > d.documentElement.clientHeight) {
			this.x = 0;
		}
		this.getFromDom().css("top", this.x + "px");
		this.getFromDom().css("font-size", this.scale + "em");
	}

	return Word;
})();
