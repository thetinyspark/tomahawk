/*
* Visit http://the-tiny-spark.com/tomahawk/ for documentation, updates and examples.
*
* Copyright (c) 2014 the-tiny-spark.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.

* @author The Tiny Spark
*/

(function() {
	
	/**
	 * @class Word
	 * @memberOf tomahawk_ns
	 * @description The Word object is a DisplayObjectContainer that contains several Letter objects in order to display a word.
	 * @augments tomahawk_ns.DisplayObjectContainer
	 * @constructor
	 **/
	function Word()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.mouseEnabled = true;
	}
	
	Tomahawk.registerClass(Word,"Word");
	Tomahawk.extend("Word","DisplayObjectContainer");
	
	/**
	* @member row
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Number}
	* @description The row index of this word
	**/
	Word.prototype.row = 0;
	Word.prototype.newline = false;
	Word.prototype.marginLeft = 0;
	
	/**
	* @member index
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Number}
	* @description The index of this word
	**/
	Word.prototype.index = 0;
	
	/**
	* @member text
	* @memberOf tomahawk_ns.Word.prototype
	* @type {String}
	* @description the text of this word
	**/
	Word.prototype.text = "";
	
	/**
	* @member needRefresh
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Boolean}
	* @description forces the refresh of the word at next frame
	**/
	Word.prototype.needRefresh = false;
	
	/**
	* @member forceRefresh
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Boolean}
	* @description forces the refresh of the word at every frame
	**/
	Word.prototype.forceRefresh = true;
	
	/**
	* @description Returns the length of the word
	* @method getNumLetters
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number} returns the word length
	**/
	Word.prototype.getNumLetters = function()
	{
		return this.children.length;
	};
	
	/**
	* @description Returns the index of the first letter
	* @method getStartIndex
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number}
	**/
	Word.prototype.getStartIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt(0).index;
	};
	
	/**
	* @description Returns the index of the last letter
	* @method getEndIndex
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number}
	**/
	Word.prototype.getEndIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt( this.children.length - 1 ).index;
	};
	
	/**
	* @description Appends a letter to the word
	* @method addLetter
	* @param {tomahawk_ns.Letter} letter an instance of a Letter Object
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.addLetter = function(letter)
	{
		this.text = this.text + letter.value;
		this.needRefresh = true;
		return this.addChild(letter);
	};
	
	/**
	* @description Removes a letter in the word at the corresponding index 
	* @method removeLetterAt
	* @param {Number} The letter index
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.removeLetterAt = function(index)
	{
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		this.needRefresh = true;
		return this.removeChildAt(index);
	};
	
	/**
	* @description Removes the corresponding letter in the word
	* @method removeLetter
	* @param {tomahawk_ns.Letter} letter an instance of a Letter Object
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.removeLetter = function(letter)
	{
		var index = this.getChildIndex(letter);
		
		if( index == -1 )
			return letter;
	
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		return this.removeChild(letter);
	};
	
	/**
	* @description Returns the letter at the corresponding index in the word
	* @method getLetterAt
	* @param {Number} the index of the letter
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.getLetterAt = function(index)
	{
		return this.getChildAt(index);
	};
		
	/**
	* @description Adds the letter "letter" at the specified index in the word.
	* @method addLetterAt
	* @param {tomahawk_ns.Letter} the letter you want to add
	* @param {Number} the index of the letter
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.addLetterAt = function(letter,index)
	{
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + letter.value + this.text.substr(index);
		this.addChildAt(letter,index);
	};
	
	/**
	* @description Returns all the letters of the word
	* @method getLetters
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Array} 
	**/
	Word.prototype.getLetters = function()
	{
		return this.children;
	};
	
	/**
	* @description Actualize the appearance of the word
	* @method refresh
	* @memberOf tomahawk_ns.Word.prototype
	**/
	Word.prototype.refresh = function()
	{
		if( this.needRefresh != true && this.forceRefresh != true)
			return;
			
		var max = this.children.length;
		var i = 0;
		var currentX = 0;
		this.height = 0;
		this.width = 0;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			
			if( currentLetter.value == " " && i == 0)
			{
				this.marginLeft = currentLetter.width;
			}
			
			currentLetter.updateMetrics();
			currentLetter.x = currentX;
			currentX += currentLetter.width;
			this.height = ( this.height < currentLetter.textHeight ) ? currentLetter.textHeight : this.height;
		}
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			currentLetter.y = this.height - currentLetter.textHeight;
		}
		
		this.width = currentX;
		
		this.needRefresh = false;
		
		if( this.forceRefresh == false )
		{
			this._cache = null;
			this.updateCache();
			this.cacheAsBitmap = true;
		}
	};
	
	/**
	* @description Split the word in two, the cutting point is specified by the "index" parameter. Returns the second Word.
	* @method cut
	* @param {Number} the index form which you want to cut the word
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Word}
	**/
	Word.prototype.cut = function(index)
	{
		var word = new tomahawk_ns.Word();
		var i = index;
		var max = this.children.length;
		
		for( i = index; i < max; i++ )
		{
			word.addLetter(this.removeLetterAt(index));
		}
		
		word.needRefresh = this.needRefresh = true;
		return word;
	};
	
	tomahawk_ns.Word = Word;
})();