/**
 * ...
 * @author Hatshepsout
 */

function BaseTextField()
{
	DisplayObjectContainer.apply(this);
	this.defaultTextFormat = new TextFormat();
}

Tomahawk.registerClass(BaseTextField,"BaseTextField");
Tomahawk.extend("BaseTextField","DisplayObjectContainer");

BaseTextField.prototype.defaultTextFormat = null;
BaseTextField.prototype._focused = false;
BaseTextField.prototype._currentIndex = 0;
BaseTextField.prototype.background = true;
BaseTextField.prototype.border = true;
BaseTextField.prototype.backgroundColor = "white";
BaseTextField.prototype.borderColor = "black";

BaseTextField.prototype.setCurrentIndex = function(index)
{
	
	index = ( index < 0 ) ? 0 : index;
	index = ( index > this.children.length ) ? this.children.length : index;
	
	var current = this.getLetterAt(this._currentIndex);
	
	if( current == null )
		return;
	
	current.cursor = false;
	current = this.getChildAt(index);
	
	if( current == null )
		return;
		
	current.cursor = true;
	this._currentIndex = index;
};


BaseTextField.prototype.getWordRangeAt = function(index)
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
	
	i = index;
	
	while( i > -1 )
	{
		letter = this.getChildAt(i);
		if( letter == null )
			continue;
		
		if( letter.value == " " || letter.newline == true )
		{
			start = i + 1;
			break;
		}
		
		i--;
	}
	
	return {start: start, end: end};

};

BaseTextField.prototype.getCurrentIndex = function()
{
	return this._currentIndex;
};

BaseTextField.prototype._alignRow = function( row, textAlign )
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

BaseTextField.prototype.setFocus = function(value)
{
	if( this._focused == value )
		return;
		
	this._focused = value;
	var type = ( this._focused == true ) ? Event.FOCUSED : Event.UNFOCUSED;
	var focusEvent = new Event( type, true, true );
	this.dispatchEvent(focusEvent);
	this.setCurrentIndex(0);
};

BaseTextField.prototype.getFocus = function()
{
	return this._focused;
};

BaseTextField.prototype.setTextFormat = function( format, startIndex, endIndex )
{
	var end = ( endIndex == undefined ) ? startIndex : endIndex;
	var i = startIndex;
	var currentFormat = null;
	
	for( ; i <= end; i++ )
	{
		var letter = this.getChildAt(i);
		if( letter != null )
			letter.format = format;
	}
	
	if( letter != null )
		this._alignRow(letter.row,format.textAlign);
};

BaseTextField.prototype.getTextFormat = function(index)
{
	var letter = this.getChildAt(index);
	if( letter == null )
		return this.defaultTextFormat.clone();
		
	return letter.format.clone();
};

BaseTextField.prototype.getText = function()
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

BaseTextField.prototype.setText = function(value)
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

BaseTextField.prototype.getLetters = function()
{
	return this.children;
};

BaseTextField.prototype.getLetterAt = function(index)
{
	return this.getChildAt(index);
};

BaseTextField.prototype.addCharAt = function(value,index,isNewline)
{
	var previous = this.children[index-1];
	var letter = new Letter();
	letter.value = value;
	letter.index = index;
	letter.newline = ( isNewline == true ) ? true : false;
	letter.format = ( previous == undefined ) ? this.defaultTextFormat.clone() : previous.format.clone();
	this.addChildAt(letter,index);
};

BaseTextField.prototype.removeCharAt = function(index)
{
	this.setCurrentIndex(index-1);
	this.removeChildAt(index);
};

BaseTextField.prototype.addTextAt = function(value,index)
{
	var i = value.length;
	while( --i > -1 )
	{
		this.addCharAt(value[i],index);
	}
	
	this.setCurrentIndex(index);
};

BaseTextField.prototype.removeTextBetween = function(startIndex,endIndex)
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

BaseTextField.prototype.draw = function(context,transformMatrix)
{
	var i = 0;
	var max = this.children.length;
	var x = 0;
	var rowsHeight = new Array();
	var rowsWidth = new Array();
	var maxLineHeight = 0;
	var currentRow = 0;
	var rowY = 0;
	var offsetX = 0;
	
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
	
	for( i = 0; i < max; i++ )
	{
		letter = this.children[i];
		letter.x = x;
		letter.y = 0;
		letter.row = currentRow;
		maxLineHeight = ( maxLineHeight < letter.textHeight ) ? letter.textHeight : maxLineHeight;
		
		if( x + letter.textWidth > this.width || letter.newline == true )
		{			
			rowsWidth.push(x);
			rowsHeight.push(maxLineHeight);
			
			curLineHeight = 0;
			maxLineHeight = 0;
			x = 0;
			currentRow++;
		}
		else
		{
			x += letter.textWidth;
		}
	}
	
	rowsWidth.push(x);
	rowsHeight.push(maxLineHeight);
	
	rowY = 0;
	currentRow = -1;
	offsetX = 0;
	
	for( i = 0; i < max; i++ )
	{
		letter = this.children[i];
		
		if( currentRow != letter.row )
		{
			offsetX = (letter.format.textAlign == "left" ) ? 0 : 0;
			offsetX = (letter.format.textAlign == "center" ) ? ( this.width - rowsWidth[letter.row] ) * 0.5 : 0;
			offsetX = (letter.format.textAlign == "right" ) ? ( this.width - rowsWidth[letter.row] ) : 0;
			rowY += rowsHeight[letter.row];
			currentRow = letter.row;
		}
		
		letter.y = rowY - letter.textHeight;
		letter.x += offsetX;
	}
	
	DisplayObjectContainer.prototype.draw.apply(this, [context,transformMatrix]);
};

