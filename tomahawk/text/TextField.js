
/**
 * ...
 * @author HTML5
 */

function TextField()
{
	this.defaultTextFormat = new TextFormat();
	this._letters = new Array();
}

Tomahawk.registerClass( TextField, "TextField" );
Tomahawk.extend( "TextField", "DisplayObject" );

TextField.NEW_LINE_CHARACTER = "¤";

TextField.prototype._lineMetrics = null;
TextField.prototype._letters = null;
TextField.prototype._formats = null;
TextField.prototype._textHeight = 0;
TextField.prototype._selectStart = -1;
TextField.prototype._selectEnd = -1;

TextField.prototype.text = "";
TextField.prototype.padding = 5;
TextField.prototype.background = true;
TextField.prototype.backgroundColor = "#ffffff";
TextField.prototype.border = true;
TextField.prototype.borderColor = "#000000";
TextField.prototype.defaultTextFormat = null;


TextField.prototype.draw = function(context)
{
	context.save();
	
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
	
	
	this._drawText(context);
	context.restore();
};

TextField.prototype.pushTextFormat = function( format, index )
{
	var sub1 = this._formats.slice(0,index);
	var sub2 = this._formats.slice(index);
	sub1.push(format);
	sub1 = sub1.concat(sub2);
	this._formats = sub1;
};

TextField.prototype.removeTextFormatBetween = function( start, end )
{
	this._formats.splice(start,end-start);
};

TextField.prototype.setTextFormat = function( format, startIndex, endIndex )
{
	startIndex = startIndex || 0;
	endIndex = ( endIndex == undefined ) ? this.text.length : endIndex;
	
	var i = startIndex;
	var max = endIndex + 1;
	
	for( ; i < max; i++ )
	{
		this._formats[i] = format;
	}
	
};

TextField.prototype.getTextFormat = function(index)
{
	var format = this._formats[index] || this.defaultTextFormat;
	return format.clone();
};

TextField.prototype.getTextHeight = function()
{
	return this._textHeight;
};

TextField.prototype._updateMetrics = function(context)
{		
	var x = this.padding;
	var y = 0;
	var textWidth = 0;
	var lineHeight = 0 ;
	var curLineHeight = 0;
	var lines = new Array();
	var letters = new Array();
	var letterObj = null;
	var lineObj = null;
	var currentFormat = null;
	var i = 0;
	var max = this.text.length;
	var currentRow = 0;
	var currentChar = "";
	var offsetX = 0;
	var textAlign = "left";
	

	for( i = 0; i < max; i++ )
	{
		context.save();
		currentFormat = this._formats[i] || this.defaultTextFormat;
		currentFormat.updateContext(context);
		currentChar = this.text.charAt(i);
		
		textWidth = context.measureText(this.text.charAt(i)).width;
		curLineHeight = context.measureText('M').width;
		
		lineHeight = ( curLineHeight > lineHeight ) ? curLineHeight : lineHeight;
		
		if( x + textWidth > this.width || currentChar == TextField.NEW_LINE_CHARACTER)
		{
			y += lineHeight;
			
			lineObj = new Object();
			lineObj.height = lineHeight;
			lineObj.y = y;
			lineObj.x = 0;
			lineObj.width = x;
			lineObj.maxWidth = this.width;
			lineObj.align = textAlign;
			
			if( textAlign == "right" )
				lineObj.x = lineObj.maxWidth - lineObj.width;
				
			if( textAlign == "center" )
				lineObj.x = ( lineObj.maxWidth - lineObj.width )  * 0.5;
			
			lines.push(lineObj);
			
			x = 0;
			
			lineHeight = 0;
			
			if( currentChar == TextField.NEW_LINE_CHARACTER )
			{
				currentChar = "";
				textWidth = 0;
			}
		}
	
		letterObj = new Letter();
		letterObj.value = currentChar;
		letterObj.index = i;
		letterObj.row = lines.length;
		letterObj.x = x;
		letterObj.y = 0;
		letterObj.width = textWidth;
		letterObj.height = curLineHeight;
		letters.push(letterObj);
		
		x+=textWidth;
		textAlign = currentFormat.textAlign;
		
		context.restore();
	}
	
	lineObj = new Object();
	lineObj.height = (curLineHeight > lineHeight)?curLineHeight:lineHeight;
	lineObj.y = y + lineObj.height;
	lineObj.x = 0;
	lineObj.width = x;
	lineObj.maxWidth = this.width;
	lineObj.align = textAlign;
	
	if( textAlign == "right" )
		lineObj.x = lineObj.maxWidth - lineObj.width;
		
	if( textAlign == "center" )
		lineObj.x = ( lineObj.maxWidth - lineObj.width )  * 0.5;
	
	lines.push(lineObj);
	
	i = 0;
	max = letters.length;
	y = 0;
	currentRow = 0;
	
	for( ; i < max; i++ )
	{
		letterObj = letters[i];
		lineObj = lines[letterObj.row];
		letterObj.y = lineObj.y + letterObj.y;
		letterObj.x = lineObj.x + letterObj.x;
	}
	
	this._letters = letters;
	this._textHeight = y + this.padding;
};

TextField.prototype.getLetters = function(context)
{
	return this._letters;
};

TextField.prototype._drawText = function(context)
{
	this._updateMetrics(context);
	
	var metrics = this._letters;
	var letterObj = null;
	var currentFormat = null;
	var i = 0;
	var max = this._letters.length;
	var selected = false;
	
	for(  i = 0; i < max; i++ )
	{
		letterObj = metrics[i];
		context.save();
		currentFormat = this._formats[i] || this.defaultTextFormat;
		
		selected = ( i >= this._selectStart && i <= this._selectEnd );
		
		if( selected == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = "black";
			context.fillRect(letterObj.x, letterObj.y - letterObj.height, letterObj.width, letterObj.height);
			context.fill();
			context.restore();
		}
		
		currentFormat.updateContext(context);
		
		if( currentFormat.underline == true )
		{
			context.save();
			context.beginPath();
			context.moveTo(letterObj.x,letterObj.y + 2);
			context.lineTo(letterObj.x + letterObj.width,letterObj.y + 2);
			context.stroke();
			context.restore();
		}
		
		if( selected == true )
		{
			context.globalCompositeOperation = "xor";
		}
		
		context.fillText(letterObj.value, letterObj.x, letterObj.y );
		
		context.restore();
	}
};