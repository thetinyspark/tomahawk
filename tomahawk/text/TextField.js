/**
 * ...
 * @author Hatshepsout
 */

function TextField()
{
	DisplayObjectContainer.apply(this);
	this.defaultTextFormat = new TextFormat();
}

Tomahawk.registerClass(TextField,"TextField");
Tomahawk.extend("TextField","DisplayObjectContainer");

TextField.prototype.defaultTextFormat = null;
TextField.prototype._focused = false;
TextField.prototype._selectedLetter = null;
TextField.prototype.background = true;
TextField.prototype.border = true;
TextField.prototype.backgroundColor = "white";
TextField.prototype.borderColor = "black";

TextField.prototype.setCurrentIndex = function(index)
{
	var current = null;
	index = ( index < 0 ) ? 0 : index;
	index = ( index > this.children.length ) ? this.children.length : index;
	
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

TextField.prototype.getCurrentIndex = function()
{
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
	var type = ( this._focused == true ) ? Event.FOCUSED : Event.UNFOCUSED;
	var focusEvent = new Event( type, true, true );
	this.dispatchEvent(focusEvent);
	this.setCurrentIndex(0);
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
			letter.format = format;
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
	var letter = new Letter();
	letter.value = value;
	letter.index = index;
	letter.newline = ( isNewline == true ) ? true : false;
	letter.format = ( previous == undefined ) ? this.defaultTextFormat.clone() : previous.format.clone();
	this.addChildAt(letter,index);
	this.setCurrentIndex(index);
};

TextField.prototype.removeCharAt = function(index)
{
	this.removeChildAt(index);
	this.setCurrentIndex(index-1);
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

TextField.prototype.draw = function(context,contextMatrix)
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
	var rows = new Array();
	var currentRow = new Array();
	var rowLetter = null;
	var j = 0;
	var y = 0;
	var textAlign = "left";
	
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
		letter.index = i;
		maxLineHeight = ( maxLineHeight < letter.textHeight ) ? letter.textHeight : maxLineHeight;
		
		if( x + letter.textWidth > this.width || letter.newline == true )
		{
			y += maxLineHeight;
			
			textAlign = ( currentRow[0] != undefined ) ? currentRow[0].format.textAlign : "left";
			
			offsetX = (textAlign == "left" ) ? 0 : 0;
			offsetX = (textAlign == "center" ) ? ( this.width - x ) * 0.5 : 0;
			offsetX = (textAlign == "right" ) ? ( this.width - x ) : 0;
			
			for( j = 0; j < currentRow.length; j++ )
			{
				rowLetter = currentRow[j];
				rowLetter.y = y - rowLetter.textHeight;
				rowLetter.x += offsetX;
			}
			
			currentRow = new Array();
			x = 0;
			maxLineHeight = letter.textHeight;
		}
		
		letter.x = x;
		letter.y = 0;
		x += letter.textWidth;
		currentRow.push(letter);
	}
	
	y += maxLineHeight;
	textAlign = ( currentRow[0] != undefined ) ? currentRow[0].format.textAlign : "left";
			
	offsetX = (textAlign == "left" ) ? 0 : 0;
	offsetX = (textAlign == "center" ) ? ( this.width - x ) * 0.5 : 0;
	offsetX = (textAlign == "right" ) ? ( this.width - x ) : 0;
	
	for( j = 0; j < currentRow.length; j++ )
	{
		rowLetter = currentRow[j];
		rowLetter.y = y - rowLetter.textHeight;
		rowLetter.x += offsetX;
	}
	
	DisplayObjectContainer.prototype.draw.apply(this, [context,contextMatrix]);
};

