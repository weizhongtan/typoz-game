var Word = (function(Word) {
	function Word(word, arr) {
		var rand = Math.random() * 100;
		this.word = word;
		// the part of the word that has already been typed
		this.typedStr = "";
		// this is changed every time a correct letter is typed
		this.remainingStr = word;
		this.activeLetter = word[0];
		this.scale = Math.max(20, 2 * this.word.length);
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
		// returns the this word dom element
		return $("#" + this.word);
	}

	Word.prototype.changeActiveLetter = function() {
		// increments the active letter to the  next in the string, changes styling to account
		this.typedStr += this.remainingStr[0];
		this.remainingStr = this.remainingStr.slice(1);
		this.activeLetter = this.remainingStr[0];
		// change the dom element to mirror the changes
		this.getFromDom().html(
			"<span class='typed'>" + this.typedStr + "</span>"
			+ "<span>" + this.remainingStr + "</span>"
		);
		if (this.remainingStr.length == 0) this.removeWordFrom(this.container);
	}

	Word.prototype.removeWordFrom = function(arr) {
		// remove active so that a new word can be typed immediately
		this.active = false;
		// animated the word being removed, then remove from the dom
		var w = this.getFromDom();
		w.addClass('animated zoomOutUp');
		w.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
			console.log("removing");
			w.remove();
		});
		// immediately remove it from the words array so the next word can be typed
		arr.splice(arr.indexOf(this), 1);
	}

	Word.prototype.addToPage = function(classToAddTo) {
		var div = d.createElement("div");
		div.setAttribute("id", this.word);
		div.setAttribute("class", "game-word");
		div.appendChild(d.createTextNode(this.word));
		$("." + classToAddTo).append(div);
		this.getFromDom().textillate({
			in: {
				effect: 'bounceInDown'
			}
		});
	}

	Word.prototype.calculateVel = function() {
		return (this.word.length - this.remainingStr.length) + 1;
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
	}

	return Word;
})();
