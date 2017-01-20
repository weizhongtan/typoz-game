var Word = (function(Word) {
	function Word(word, arr) {
		this.word = word;
		// the part of the word that has already been typed
		this.typedStr = "";
		// the remaining string that needs to be typed
		this.remainingStr = word;
		// the current letter that needs to be typed
		this.activeLetter = word[0];
		//
		this.active = false;
		// the size of the word in the dom
		this.scale = Math.max(20, 2 * this.word.length);
		// vertical distance from the top
		this.y = 0;
		// randomized horizontal distance from the left
		var rand = Math.random() * 100;
		if (rand + (this.word.length * 2) > 100) {
			this.x = rand - this.word.length;
		} else {
			this.x = rand;
		}
		// the array that this word lives in
		this.container = arr;
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
			w.remove();
		});
		// immediately remove it from the words array so the next word can be typed
		arr.splice(arr.indexOf(this), 1);
	}

	Word.prototype.addToPage = function(classToAddTo) {
		// creates a new div element, and adds it to given class dom element
		var div = d.createElement("div");
		div.setAttribute("id", this.word);
		div.setAttribute("class", "game-word");
		div.appendChild(d.createTextNode(this.word));
		$("." + classToAddTo).append(div);
		this.getFromDom().textillate({ in: { effect: 'bounceInDown'	}	});
	}

	Word.prototype.calculateVel = function() {
		// returns the downwards velocity of the word
		return (this.word.length - this.remainingStr.length) + 1;
	}

	Word.prototype.animate = function() {
		// increments internal position properties
		this.y += 1;
		if (this.y > d.documentElement.clientHeight) {
			this.y = 0;
		}
		// translates these to changes in the dom
		var w = this.getFromDom();
		w.css("top", this.y + "px");
		w.css("left", this.x + "%");
		w.css("font-size", this.scale + "px");
	}

	return Word;
})();
