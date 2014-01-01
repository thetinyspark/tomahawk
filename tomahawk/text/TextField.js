/**
 * ...
 * @author Hatshepsout
 */
(function() {
	
	function TextField()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.defaultTextFormat = new tomahawk_ns.TextFormat();
		this.width = this.height = 100;
	}

	Tomahawk.registerClass(TextField,"TextField");
	Tomahawk.extend("TextField","DisplayObjectContainer");

	TextField.prototype.defaultTextFormat = null;
	TextField.prototype._focused = false;
	TextField.prototype._selectedLetter = null;
	TextField.prototype.background = false;
	TextField.prototype.border = false;
	TextField.prototype.backgroundColor = "white";
	TextField.prototype.borderColor = "black";
	TextField.prototype.autoSize = false;
	TextField.prototype._lastWidth = 0;

	TextField.prototype.setCurrentIndex = function(index)
	{
		var current = null;
		
		if( this._selectedLetter != null )
		{
			this._selectedLetter.cursor = false;
		}
		
		current = this.getChildAt(index);
		
		if( current == null )
			return;
			
		current.cursor = true;	
		this._selectedLetter = current;
	};

	TextField.prototype.getWordRangeAt = function(index)
	{
		var letter = null;
		var i = index;
		var max = this.children.length;
		var end = -1;
		var start = -1;
		
		while( i < max )
		{
			letter = this.getChildAt(i);
			
			if( letter == null )
				continue;
				
			if( i == max - 1 )
			{
				end = i;
				break;
			}
			
			if( letter.value == " " || letter.newline == true )
			{
				end = i - 1;
				break;
			}
			
			i++;
		}
		
		
		i = index + 1;
		
		while( --i > -1 )
		{
			letter = this.getChildAt(i);
			if( letter == null )
				continue;
			
			if( letter.value == " " || letter.newline == true )
			{
				start = i + 1;
				break;
			}
		}
		
		return {start: start, end: end};

	};

	TextField.prototype.getCurrentIndex = function()
	{
		if( this._selectedLetter == null )
			return 0;
			
		return this._selectedLetter.index;
	};

	TextField.prototype._alignRow = function( row, textAlign )
	{
		var i = this.children[i];
		var letter = null;
		
		while( --i > -1 )
		{
			letter = this.children[i];
			if( letter.row == row )
			{
				letter.format.textAlign == textAlign;
			}
		}
	}

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

	TextField.prototype.getFocus = function()
	{
		return this._focused;
	};

	TextField.prototype.setTextFormat = function( format, startIndex, endIndex )
	{
		var end = ( endIndex == undefined ) ? startIndex : endIndex;
		var i = startIndex;
		var currentFormat = null;
		
		for( ; i <= end; i++ )
		{
			var letter = this.getChildAt(i);
			if( letter != null )
				letter.setTextFormat(format);
		}
		
		if( letter != null )
			this._alignRow(letter.row,format.textAlign);
	};

	TextField.prototype.getTextFormat = function(index)
	{
		var letter = this.getChildAt(index);
		if( letter == null )
			return this.defaultTextFormat.clone();
			
		return letter.format.clone();
	};

	TextField.prototype.getText = function()
	{
		var text = "";
		var i = 0;
		var max = this.children.length;
		
		for( i = 0; i < max; i++ )
		{
			letter = this.children[i];
			text += letter.value;
		}
		
		return text;
	};

	TextField.prototype.setText = function(value)
	{
		while( this.children.length > 0 )
			this.removeChildAt(0);
			
		var i = 0;
		var max = value.length;
		
		for( i = 0; i < max; i++ )
		{
			this.addCharAt(value[i],i);
		}
	};

	TextField.prototype.getLetters = function()
	{
		return this.children;
	};

	TextField.prototype.getLetterAt = function(index)
	{
		return this.getChildAt(index);
	};

	TextField.prototype.addCharAt = function(value,index,isNewline)
	{
		var previous = this.children[index-1];
		var letter = new tomahawk_ns.Letter();
		letter.value = value;
		letter.index = index;
		letter.newline = ( isNewline == true ) ? true : false;
		letter.format = ( !previous ) ? this.defaultTextFormat.clone() : previous.format.clone();
		this.addChildAt(letter,index);
		this.setCurrentIndex(index);
		this._repos();
	};

	TextField.prototype.removeCharAt = function(index)
	{
		this.removeChildAt(index);
		this.setCurrentIndex(index-1);
		this._repos();
	};

	TextField.prototype.addTextAt = function(value,index)
	{
		var i = value.length;
		while( --i > -1 )
		{
			this.addCharAt(value[i],index);
		}
		
		this.setCurrentIndex(index);
	};

	TextField.prototype.removeTextBetween = function(startIndex,endIndex)
	{
		var i = this.children.length;
		var letters = new Array();
		var letter = null;
		
		while( --i > -1 )
		{
			if( i >= startIndex && i <= endIndex )
			{
				letters.push( this.getChildAt(i) );
			}
		}
		
		while( letters.length > 0 )
		{
			letter = letters.shift();
			this.removeCharAt(letter.index);
		}
	};
	
	TextField.prototype._repos = function()
	{
		var i = 0;
		var max = this.children.length;
		var x = 0;
		var maxLineHeight = 0;
		var currentRow = 0;
		var rowY = 0;
		var offsetX = 0;
		var rowIndex = 0;
		var currentRow = new Array();
		var rowLetter = null;
		var j = 0;
		var y = 0;
		var textAlign = "left";
		
		for( i = 0; i < max; i++ )
		{		
			letter = this.children[i];
			letter.updateMetrics();
				
			letter.index = i;
			maxLineHeight = ( maxLineHeight < letter.textHeight ) ? letter.textHeight : maxLineHeight;
			
			if( x + letter.textWidth > this.width || letter.newline == true )
			{
				rowIndex++;
				y += maxLineHeight;
				
				textAlign = ( currentRow[0] != undefined ) ? currentRow[0].format.textAlign : "left";
				
				if( textAlign == "left" )
				{
					offsetX = 0;
				}
				if( textAlign == "center" )
				{
					offsetX = ( this.width - x ) * 0.5;
				}
				if( textAlign == "right" )
				{
					offsetX = this.width - x;
				}
				
				for( j = 0; j < currentRow.length; j++ )
				{
					rowLetter = currentRow[j];
					rowLetter.y = y - rowLetter.textHeight;
					rowLetter.x += offsetX;
				}
				
				x = 0;
				currentRow = new Array();
				maxLineHeight = letter.textHeight;
			}
			
			letter.row = rowIndex;
			letter.x = x;
			letter.y = 0;
			x += letter.textWidth;
			currentRow.push(letter);
		}
		
		y += maxLineHeight;
		textAlign = ( currentRow[0] != undefined ) ? currentRow[0].format.textAlign : "left";
		
		if( textAlign == "left" )
		{
			offsetX = 0;
		}
		if( textAlign == "center" )
		{
			offsetX = ( this.width - x ) * 0.5;
		}
		if( textAlign == "right" )
		{
			offsetX = this.width - x;
		}
		
		for( j = 0; j < currentRow.length; j++ )
		{
			rowLetter = currentRow[j];
			rowLetter.y = y - rowLetter.textHeight;
			rowLetter.x += offsetX;
		}
		
		if( this.autoSize == true && rowLetter != null )
		{
			this.height = rowLetter.y + rowLetter.textHeight;
		}
	};

	TextField.prototype.draw = function(context)
	{
		if( this._lastWidth != this.width )
		{
			this._repos();
			this._lastWidth = this.width;
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
			context.lineTo(0,this.height);
			context.lineTo(0,0);
			context.stroke();
			context.restore();
		}
		
		tomahawk_ns.DisplayObjectContainer.prototype.draw.apply(this, [context]);
	};

	tomahawk_ns.TextField = TextField;
})();
