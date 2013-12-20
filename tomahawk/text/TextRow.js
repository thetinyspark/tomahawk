/**
 * ...
 * @author Hatshepsout
 */

function TextRow()
{
	DisplayObjectContainer.apply(this);
}

Tomahawk.registerClass(TextRow,"TextRow");
Tomahawk.extend("TextRow","DisplayObjectContainer");

TextRow.prototype.align 		= "left";
TextRow.prototype.index 		= 0;	
TextRow.prototype.textWidth 	= 0;	
TextRow.prototype.textHeight 	= 0;	
TextRow.prototype.maxWidth 		= 0;	
TextRow.prototype.startIndex	= 0;
TextRow.prototype.endIndex		= 0;


TextRow.prototype.addLetter = function(letter)
{
	this.addChild(letter);
};

TextRow.prototype.removeLetter = function(letter)
{
	this.removeChild(letter);
};

TextRow.prototype.getLetterAt = function(index)
{
	return this.getChildAt(index);
};

TextRow.prototype.getLetters = function()
{
	return this.children;
};

TextRow.prototype.getLettersIn = function(x,y)
{
	var i = this.children.length;
	var currentLetter = null;
	var lettersIn = new Array();
	
	while( --i > -1 )
	{
		currentLetter = this.children[i];
		
		if( currentLetter.hitTest(x,y) == true)
			lettersIn.push(currentLetter);
	}
	
	return lettersIn;
};

TextRow.prototype.addLetterAt = function(letter,index)
{
	this.addChildAt(letter,index);
};

TextRow.prototype.draw = function(context,transformMatrix)
{
	var i = 0;
	var max = this.children.length
	var currentLetter = null;
	var lineHeight = 0;
	var x = 0;
	var offsetX = 0;
	
	if( this.align == "center" )
		offsetX = ( this.maxWidth - this.textWidth ) * 0.5;
		
	if( this.align == "right" )
		offsetX = ( this.maxWidth - this.textWidth );
	
	for( i = 0; i < max; i++ )
	{
		currentLetter = this.children[i];		
		currentLetter.x = x;
		currentLetter.y = ( this.textHeight - currentLetter.textHeight );
		lineHeight = ( currentLetter.textHeight > lineHeight ) ? currentLetter.textHeight : lineHeight;
		
		if( x + currentLetter.textWidth > this.maxWidth )
		{
			currentLetter.alpha = 0.5;
		}
		else
		{
			x += currentLetter.textWidth;
		}
	}
	
	this.textWidth 	= x;
	this.textHeight = lineHeight;
	
	DisplayObjectContainer.prototype.draw.apply(this, [context,transformMatrix]);
};