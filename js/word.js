var Word = (function(Word) {
	function Word(word, velocity, arr) {
		this.word = word;
		this.currentString = word;
		this.activeLetter = word[0];
		this.speed = velocity;
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
		var text = d.createTextNode(this.word);
		div.appendChild(text);
		$("." + classToAddTo).append(div);
	}

	Word.prototype.checkRemoveCondition = function() {

	}

	Word.prototype.animate = function() {
		this.x += this.speed;
		if (this.x > d.documentElement.clientHeight) this.removeWordFrom(this.container);
		this.getFromDom().css("top", this.x + "px");
	}

	return Word;
})();
