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
	 * @class TextField
	 * @memberOf tomahawk_ns
	 * @description The TextField class is used to create display objects for text display.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function TextField()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.defaultTextFormat = new tomahawk_ns.TextFormat();
		this.width = this.height = 100;
		this._letters = new Array();
		this._text = "";
	}

	Tomahawk.registerClass(TextField,"TextField");
	Tomahawk.extend("TextField","DisplayObjectContainer");

	/**
	* @member forceRefresh
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Forces the refresh of the TextField at every frame.
	**/
	TextField.prototype.forceRefresh		= false;		
	
	/**
	* @member defaultTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {tomahawk_ns.TextFormat}
	* @default null
	* @description Specifies the format applied to newly inserted text.
	**/
	TextField.prototype.defaultTextFormat 	= null;
	
	/**
	* @member currentIndex
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Number}
	* @default 0
	* @description The index of the insertion point (caret) position.
	**/
	TextField.prototype.currentIndex 		= 0;
	
	/**
	* @member background
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the text field has a background fill. If true, the text field has a background fill. If false, the text field has no background fill. Use the backgroundColor property to set the background color of a text field.
	**/
	TextField.prototype.background 			= false;
	
	/**
	* @member border
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the text field has a border. If true, the text field has a border. If false, the text field has no border. Use the borderColor property to set the border color.
	**/
	TextField.prototype.border 				= false;
	
	/**
	* @member padding
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Number}
	* @default 0
	* @description Specifies the internal padding of the text field. 
	**/
	TextField.prototype.padding 			= 0;
	
	/**
	* @member backgroundColor
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {string}
	* @description The color of the text field background.
	* @default "#ffffff"
	**/
	TextField.prototype.backgroundColor 	= "#ffffff";
	
	/**
	* @member borderColor
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {string}
	* @description The color of the text field border.
	* @default "#000000"
	**/
	TextField.prototype.borderColor 		= "#000000";
	
	/**
	* @member autoSize
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @description Specifies if the text field height will match the real text height.
	* @default false
	**/
	TextField.prototype.autoSize 			= false;
	
	/**
	* @member focusable
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @description Specifies if the current display object can have the focus or not.
	* @default true
	**/
	TextField.prototype.focusable			= true;
	
	
	TextField.prototype._focused 			= false;
	TextField.prototype._lastWidth 			= 0;
	TextField.prototype._refreshNextFrame 	= true;
	TextField.prototype._textAlign 			= "left";
	TextField.prototype._text 				= null;
	TextField.prototype._drawCursor	 		= false;
	TextField.prototype._drawCursorTime 	= 0;
	TextField.prototype._letters 			= null;
	
	
	/**
	* @property {String} ALIGN_LEFT left
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant aligns text to the left within the text field.
	**/
	TextField.ALIGN_LEFT 					= "left";

	/**
	* @property {String} ALIGN_CENTER center
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant centers the text in the text field.
	**/
	TextField.ALIGN_CENTER 					= "center";
	
	/**
	* @property {String} ALIGN_RIGHT right
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant aligns text to the right within the text field.
	**/
	TextField.ALIGN_RIGHT 					= "right";
	
	/**
	* @property {String} ALIGN_JUSTIFY justify
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant justifies text within the text field.
	**/
	TextField.ALIGN_JUSTIFY 				= "justify";

	/**
	* @method getTextAlign
	* @description Returns the current text align
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {String} the current text align
	**/
	TextField.prototype.getTextAlign = function()
	{
		return this._textAlign;
	};
	
	/**
	* @method setTextAlign
	* @description Sets the current text align
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value the text align
	**/
	TextField.prototype.setTextAlign = function(value)
	{
		if( this._textAlign == value )
			return;
			
		this._textAlign = value;
		this._refreshNextFrame = true;
	};
	
	/**
	* @method setCurrentIndex
	* @description Sets the index of the insertion point (caret) position.
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the new index of the insertion point
	**/
	TextField.prototype.setCurrentIndex = function(index)
	{
		if( this.currentIndex == index || index > this._letters.length)
			return;
			
		this.currentIndex = index;
		this._refreshNextFrame = true;
	};
	
	/**
	* @method getCurrentIndex
	* @description Returns the index of the insertion point (caret) position.
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Number} the index of the insertion point (caret) position
	**/
	TextField.prototype.getCurrentIndex = function()
	{
		return this.currentIndex;
	};
	
	/**
	* @method setFocus
	* @description Gives focus to the text field, specified by the value parameter. If value != true the current focus is removed.
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Boolean} value
	**/
	TextField.prototype.setFocus = function(value)
	{
		if( this._focused == value )
			return;
			
		this._focused = value;
		var type = ( this._focused == true ) ? tomahawk_ns.Event.FOCUSED : tomahawk_ns.Event.UNFOCUSED;
		var focusEvent = new tomahawk_ns.Event( type, true, true );
		this.dispatchEvent(focusEvent);
		
		if( this._focused == false )
		{
			this.setCurrentIndex(-1);
		}
		else
		{
			this.setCurrentIndex(0);
		}
	};

	/**
	* @method getFocus
	* @description Specifies whether the current text field has the focus 
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Boolean} the value of the current focus
	**/
	TextField.prototype.getFocus = function()
	{
		return this._focused;
	};

	/**
	* @method setTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @description Applies the text formatting that the format parameter specifies to the specified text in a text field.
	* @param {tomahawk_ns.TextFormat} format A TextFormat object that contains character and paragraph formatting information
	* @param {Number} startIndex an integer that specifies the zero-based index position specifying the first character of the desired range of text.
	* @param {Number} [endIndex=undefined] An integer that specifies the first character after the desired text span. As designed, if you specify startIndex and endIndex values, the text from beginIndex to endIndex-1 is updated.
	**/
	TextField.prototype.setTextFormat = function( format, startIndex, endIndex )
	{
		var end = ( endIndex == undefined ) ? startIndex : endIndex;
		var i = startIndex;
		var letter = null;
		var word = null;
		var currentWord = null;
		
		for( ; i <= end; i++ )
		{
			letter = this.getLetterAt(i);
			if( letter != null )
			{
				this._refreshNextFrame = true;
				letter.setTextFormat(format);
				if( letter.parent != null )
					letter.parent.needRefresh = true;
			}
		}
	};

	/**
	* @method getTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @description Returns a TextFormat object containing a copy of the text format of the character at the index position.
	* @param {Number} index An integer that specifies the location of a letter within the text field.
	* @returns {tomahawk_ns.TextFormat}
	**/
	TextField.prototype.getTextFormat = function(index)
	{
		var letter = this.getLetterAt(index);
		if( letter == null )
			return this.defaultTextFormat.clone();
			
		return letter.format.clone();
	};

	/**
	* @method getText
	* @description Returns a string that is the current text in the text field.
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {String} the current text in the text field
	**/
	TextField.prototype.getText = function()
	{
		return this._text;
	};

	/**
	* @description Set the current text of the text field specified by the "value" parameter
	* @method setText
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value the new text of the text field
	**/
	TextField.prototype.setText = function(value)
	{
		if( this._text == value )
			return;
			
		this._text = "";
		
		while( this.children.length > 0 )
			this.removeChildAt(0);
			
		this._letters = new Array();
			
		var i = 0;
		var max = value.length;
		
		for( i = 0; i < max; i++ )
		{
			this.addCharAt(value[i], i );
		}
	};

	/**
	* @description Returns all the letters objects of the text field
	* @method getLetters
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Array} all the letters of the text field
	**/
	TextField.prototype.getLetters = function()
	{
		return this._letters;
	};

	/**
	* @description Returns the letter object at the index specified by the "index" parameter.
	* @method getLetterAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the index of the letter you want to retrieve
	* @returns {tomahawk_ns.Letter} A Letter object
	**/
	TextField.prototype.getLetterAt = function(index)
	{
		var letters = this.getLetters();
		return letters[index] || null;
	};
	
	/**
	* @description Returns the word object at the index specified by the "index" parameter within the text field
	* @method getLetterAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the index
	* @returns {tomahawk_ns.Word} A Word object
	**/
	TextField.prototype.getWordAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var word = null;
		
		if( letter == null )
			return null;
			
		word = letter.parent;
		
		return word;
	};

	/**
	* @method addCharAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @param {Number} index The index position to which the character is added.
	* @description Adds a character to this text field instance at the index specified by the index parameter The character is added at the index position specified. If you specify a currently occupied index position, the character that exists at that position and all higher positions are moved up one position in the text.
	**/
	TextField.prototype.addCharAt = function(value,index)
	{
		var wordIndex =  ( index == 0 ) ? 0 : index - 1 ;
		var letter = new tomahawk_ns.Letter();
		var previous = this.getLetterAt(index-1);
		var currentWord = this.getWordAt(wordIndex);
		var tab1 = this._letters.slice(0,index);
		var tab2 = this._letters.slice(index);
		
		//create letter
		isNewline = ( value == "\n" );
		letter.value = value;
		letter.newline = isNewline;
		letter.setTextFormat( ( previous == null ) ? this.defaultTextFormat.clone() : previous.format.clone() );
		
		//rebuild letters array
		tab1.push(letter);
		this._letters = tab1.concat(tab2);
		
		this.setCurrentIndex(index); //set current index
		this._refreshNextFrame = true; //refresh textfield at next frame
		this._text = this._text.substr(0,index) + value + this._text.substr(index); // rebuild text value
		
		if( currentWord == null )
		{
			currentWord = new tomahawk_ns.Word();
		}
		
		this.addChild(currentWord);
		currentWord.needRefresh = true;
		currentWord.addLetterAt(letter,index - currentWord.getStartIndex());
		
		this._resetLettersIndex(); // reset letters index
		this._cutWord(currentWord); // cut the word if necessary
	};
	
	/**
	* @method removeCharAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index The index of the character to remove.
	* @returns {tomahawk_ns.Letter} The Letter instance that was removed.
	* @description Removes a character from the specified index position in the text of the text field.
	**/
	TextField.prototype.removeCharAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var previous = this.getLetterAt(index-1);
		
		if( letter == null )
			return;
			
		var currentWord = letter.parent;
		
		this._letters.splice(index,1);
		this.setCurrentIndex(index-1);
		this._refreshNextFrame = true;
	
		//this._text = this._text.substr(0,index-1) + this._text.substr(index+1);
		this._text = this._text.substr(0,index) + this._text.substr(index+1);
		
		currentWord.removeLetterAt( index - currentWord.getStartIndex() );
		
		if( currentWord.getNumLetters() == 0 )
			this.removeChild(currentWord);
			
		this._resetLettersIndex();
	};

	/**
	* @description Adds the text specified by the "value" parameter at the index specified by the "index" parameter to the text field.
	* @method addTextAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {string} value the text you want to add
	* @param {string} index the index at which you want to insert your text
	**/
	TextField.prototype.addTextAt = function(value,index)
	{
		var i = value.length;
		while( --i > -1 )
		{
			this.addCharAt(value[i],index);
		}
		
		this.setCurrentIndex(index);
	};
	
	/**
	* @description Removes the text between the indexes specified by the "startIndex" and the "endIndex" parameters within the text field.
	* @method removeTextBetween
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} startIndex the index from which you want to remove the text
	* @param {Number} endIndex the index to which you want to remove the text
	**/
	TextField.prototype.removeTextBetween = function(startIndex,endIndex)
	{
		var i = this.getLetters().length;
		var letters = new Array();
		var letter = null;
		
		while( --i > -1 )
		{
			if( i >= startIndex && i <= endIndex )
			{
				letters.push( this.getLetterAt(i) );
			}
		}
		
		while( letters.length > 0 )
		{
			letter = letters.shift();
			this.removeCharAt(letter.index);
		}
	};
	
	
	TextField.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		var width = this.width;
		var height = this.height;
		var bounds = tomahawk_ns.DisplayObjectContainer.prototype.getBoundingRectIn.apply(this,[spaceCoordinates]);
		
		if( bounds.width < width ) 
			bounds.width = width;
			
		if( bounds.height < height ) 
			bounds.height = height;
			
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		return bounds;
	};	
	
	TextField.prototype.updateBounds = function()
	{
		var width = this.width;
		var height = this.height;
		tomahawk_ns.DisplayObjectContainer.prototype.updateBounds.apply(this);
		
		var bounds = this.bounds;
		
		if( bounds.width < width ) 
			bounds.width = width;
			
		if( bounds.height < height ) 
			bounds.height = height;
			
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		
		this.width = bounds.width;
		this.height = bounds.height;
	};
	
	TextField.prototype.draw = function(context)
	{
		var currentIndexLetter = this.getLetterAt(this.currentIndex);
		var bounds = null;
		var time = null;
		
		if( this._lastWidth != this.width || this._refreshNextFrame == true || this.forceRefresh == true )
		{
			this._refresh();	
			this._lastWidth = this.width;
			this._refreshNextFrame = false;
		}
		
		if( this.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.backgroundColor;
			context.fillRect(0,0,this.width,this.height);
			context.fill();
			context.restore();
		}
		
		if( this.border == true )
		{
			context.save();
			context.beginPath();
			context.strokeStyle = this.borderColor;
			context.moveTo(0,0);
			context.lineTo(this.width,0);
			context.lineTo(this.width,this.height);
			context.lineTo( 0,this.height);
			context.lineTo(0,0);
			context.stroke();
			context.restore();
		}
		
		tomahawk_ns.DisplayObjectContainer.prototype.draw.apply(this, [context]);		
		
		if( this._focused == true)
		{
			time = new Date().getTime();
			
			if( currentIndexLetter != null )
			{
				bounds = currentIndexLetter.getBoundingRectIn(this);
			}
			else
			{
				bounds = new tomahawk_ns.Rectangle();
				bounds.left = bounds.x = 0;
				bounds.width = bounds.right = 5;
				bounds.top = bounds.y = 0;
				bounds.bottom = bounds.height = 10;
			}
			
			if( time - this._drawCursorTime > 500 )
			{
				this._drawCursor = ( this._drawCursor == true ) ? false: true;
				this._drawCursorTime = time;
			}
			
			if( this._drawCursor == true )
			{
				context.save();
				context.beginPath();
				context.strokeStyle = "black";
				context.moveTo(	bounds.right,bounds.top);
				context.lineTo(	bounds.right,bounds.bottom );
				context.stroke();
				context.restore();
			}
		}
	};


	TextField.prototype._cutWord = function(word)
	{
		var letters = 0;
		var i = 0;
		var nextWord = null;
		var cut = true;
		var currentLetter = null;
		
		while( cut == true )
		{
			cut = false;
			letters = word.getLetters();
			i = letters.length;
			
			while( --i > -1 )
			{
				currentLetter = letters[i];
				if( ( currentLetter.value == " " || currentLetter.newline == true ) && i > 0 )
				{
					nextWord = word.cut(i);
					cut = true;
					this.addChild( nextWord );
					
					nextWord.newline = currentLetter.newline;
					nextWord.needRefresh = word.needRefresh = true;
					break;
				}
			}
		}
		
		if( word.text.length == 0 )
			this.removeChild(word);
	};

	TextField.prototype._resetLettersIndex = function(start)
	{
		var letters = this.getLetters();
		var i = 0;
		var max = letters.length;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = letters[i];
			currentLetter.index = i;
		}
	};
	
	TextField.prototype._sortWords = function(a,b)
	{
		return ( a.getStartIndex() < b.getStartIndex() ) ? -1 : 1;
	};
	
	TextField.prototype._refresh = function()
	{
		var rowIndex = 0;
		var currentRow = new Array();
		var rowWord = null;
		var word = null;
		var i = 0;
		var max = this.children.length;
		var lineY = this.padding;
		var lineX = this.padding;
		var lineHeight = 0;
		var lineWidth = 0;
		var maxWidth = this.padding + ( this.width - this.padding * 2 );
		var textWidth = 0;
		
		this.children.sort( this._sortWords );
		
		for( i = 0; i < max; i++ )
		{		
			word = this.children[i];
			word.index = i;
			word.forceRefresh = this.forceRefresh;
			word.refresh();
			lineHeight = ( lineHeight < word.height ) ? word.height : lineHeight;
			
			if( i != 0 && ( lineWidth + word.width > maxWidth || word.newline == true ) )
			{
				lineY += lineHeight;
				this._alignRow( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight );
			
				rowIndex++;
				lineWidth = 0;
				currentRow = new Array();
				lineHeight = word.height;
			}
			
			lineWidth += word.width;
			currentRow.push(word);
			
			if( i == max - 1 )
			{
				lineY += lineHeight;
				this._alignRow( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight );
			}
		}
		
		if( this.autoSize == true && word != null )
		{
			this.height = word.y + ( word.height );
		}
		
		this._lastWidth = this.width;
	};
	
	TextField.prototype._alignRow = function( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight )
	{
		if( currentRow.length == 0 )
			return;
			
		var maxWidth = this.width - ( this.padding * 2 );
		var word = currentRow[0];
		var offsetX = lineX;
		var marginLeft = 0;
		var textAlign = this._textAlign;
		var i = 0;
		var max = currentRow.length;
		var currentX = 0;
				
		if( textAlign == tomahawk_ns.TextField.ALIGN_LEFT )
		{
			offsetX = lineX;
		}
		
		if( textAlign == tomahawk_ns.TextField.ALIGN_CENTER )
		{
			offsetX = lineX + ( ( maxWidth - lineWidth ) * 0.5 );
		}
			
		if( textAlign == tomahawk_ns.TextField.ALIGN_RIGHT )
		{
			offsetX = lineX + ( maxWidth - lineWidth );
		}
		
		// on ne justifie que si la ligne est occupée à minimum 70% sinon c'est aligné à gauche
		if( textAlign == tomahawk_ns.TextField.ALIGN_JUSTIFY && lineWidth >= ( maxWidth * 0.7 ) )
		{
			offsetX = lineX;
			marginLeft = ( maxWidth - lineWidth ) / ( currentRow.length - 1 );
		}
		
		currentX = offsetX;
		
		for( i = 0; i < max; i++ )
		{
			word = currentRow[i];
			word.y = lineY - word.height;
			word.x = currentX;
			
			currentX += word.width + marginLeft;
		}
	};
	

	tomahawk_ns.TextField = TextField;
})();
