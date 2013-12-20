
/**
 * ...
 * @author HTML5
 */

function SelectableText()
{
	TextField.apply(this);
	this.mouseEnabled = true;
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler,true );
	Stage.getInstance().addEventListener( MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler,true );
	this.addEventListener( MouseEvent.CLICK, this, this._mouseEventHandler );
	this.addEventListener( MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_UP, this, this._mouseEventHandler, true );
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
}

Tomahawk.registerClass( SelectableText, "SelectableText" );
Tomahawk.extend( "SelectableText", "TextField" );



SelectableText.prototype._selectStart = -1;
SelectableText.prototype._selectEnd = -1;
SelectableText.prototype._lastTime = 0;
SelectableText.prototype.focused = false;
SelectableText.prototype.currentIndex = 0;
SelectableText.prototype._cursorVisible = false;
SelectableText.prototype._down = false;
SelectableText.prototype._ignoreNextClick = false;
SelectableText.prototype._startPoint = null;

SelectableText.prototype.getLettersIn = function(x,y,width,height)
{
	var i = 0;
	var letters = new Array();
	var max = this._letters.length;
	var letterObj = null;
	
	for( i = 0; i < max; i++ )
	{
		letterObj = this._letters[i];
		
		if( 
			letterObj.x > x + width ||
			letterObj.x + letterObj.width < x || 
			letterObj.y < y || 
			letterObj.y - letterObj.height > y + height 
		)
		{
			continue;
		}
		
		letters.push(letterObj);
	}
	
	return letters;
};

SelectableText.prototype.getSelectionRange = function()
{
	return {start:this._selectStart, end:this._selectEnd};
};

SelectableText.prototype.setSelection = function( start, end )
{
	this._selectStart = start;
	this._selectEnd = end;
};

SelectableText.prototype.isSelected = function()
{
	return this._selectStart != -1;
};

SelectableText.prototype._setIndexUnderMouse = function(x,y)
{
	var pt = this.globalToLocal(x, y);
	var letters = this.getLettersIn(pt.x,pt.y,1,1);
	this._selectStart = this._selectEnd = -1;
	
	if( letters.length > 0 )
	{
		this.currentIndex = letters[0].index;
	}
};

SelectableText.prototype._selectCurrentWord = function()
{
	var start = -1;
	var end = -1;
	var currentIndex = this.currentIndex;
	
	while( currentIndex-- > -1 )
	{
		if( this.text[currentIndex] == " " || this.text[currentIndex] == TextField.NEW_LINE_CHARACTER)
		{
			start = currentIndex;
			break;
		}
	}
	
	currentIndex = this.currentIndex;
	
	while( currentIndex++ < this.text.length )
	{
		if( this.text[currentIndex] == " "  || this.text[currentIndex] == TextField.NEW_LINE_CHARACTER)
		{
			end = currentIndex;
			break;
		}
	}
	
	if( start == -1 )
		start = 0;
		
	if( end == -1 )
		end = this.text.length - 1;
	
	this.setSelection( start, end );
	this._selectStart = start;
	this._selectEnd = end;
	this.currentIndex = start;
};

SelectableText.prototype._mouseEventHandler = function(event)
{
	if( event.type == MouseEvent.DOUBLE_CLICK )
	{
		this.setFocus(event.target == this);
	}
	
	if( event.type == MouseEvent.MOUSE_DOWN && this.focused == true && event.target != this )
	{
		this.setFocus(false);
	}
	
	// if non focused return
	if( this.focused == false )
	{
		this.setSelection(-1,-1);
		return;
	}
	
	if( event.type == MouseEvent.DOUBLE_CLICK )
	{
		if( this.focused == true )
		{
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._selectCurrentWord();
		}
	}
		
	if( event.type == MouseEvent.MOUSE_UP )
	{
		this._down = false;
	}
	
	if( event.type == MouseEvent.CLICK )
	{
		this._down = false;
		
		if( this._ignoreNextClick == true )
		{
			this._ignoreNextClick = false;
		}
		else
		{
			
			this._setIndexUnderMouse(event.stageX,event.stageY);
		}
	}
	
	if( event.type == MouseEvent.MOUSE_DOWN)
	{
		this._down = true;
		this._startPoint = this.globalToLocal(event.stageX, event.stageY);
		return;
	}
	
	if( event.type == MouseEvent.MOUSE_MOVE && this._down == true && this._startPoint != null)
	{
		var endPoint = this.globalToLocal(event.stageX, event.stageY);
		var x = ( endPoint.x < this._startPoint.x ) ? endPoint.x : this._startPoint.x;
		var x2 = ( endPoint.x < this._startPoint.x ) ? this._startPoint.x : endPoint.x;
		var y = ( endPoint.y < this._startPoint.y ) ? endPoint.y : this._startPoint.y;
		var y2 = ( endPoint.y < this._startPoint.y ) ? this._startPoint.y : endPoint.y;
		var width = x2 - x;
		var height = y2 - y;
		
		this._selectInto(x,y,width,height);
		this._ignoreNextClick = true;
	}
};

SelectableText.prototype._selectInto = function(x,y,width,height)
{
	var letters = this.getLettersIn(x,y,width,height);
	var start = -1;
	var end = -1;
	var i = letters.length;
	var letterObj = null;
	
	
	while( --i > -1 )
	{
		letterObj = letters[i];
		start = ( letterObj.index < start || start == -1 ) ? letterObj.index : start;
		end = ( letterObj.index > end || end == -1 ) ? letterObj.index : end;
	}
	
	this._selectStart = start;
	this._selectEnd = end;
};

SelectableText.prototype._drawText = function(context)
{
	
	TextField.prototype._drawText.apply( this, [context] );
	
	this.currentIndex = ( this.currentIndex > this._letters.length - 1 ) ? this._letters.length - 1 : this.currentIndex;
	this.currentIndex = ( this.currentIndex < 0 ) ? 0 : this.currentIndex;
	
	var letterObj = this._letters[this.currentIndex];
	var time = new Date().getTime();
	
	if( time - this._lastTime > 500 )
	{
		this._lastTime = time;
		this._cursorVisible =!this._cursorVisible;
	}
	
	if( this._cursorVisible == true && letterObj && this.focused)
	{
		var selected = ( this.currentIndex >= this._selectStart && this.currentIndex <= this._selectEnd ) ? true : false;
		context.save();
		context.beginPath();
		context.strokeStyle = ( selected ) ? "white":"black";
		context.moveTo( letterObj.x + letterObj.width, letterObj.y );
		context.lineTo( letterObj.x + letterObj.width, letterObj.y - letterObj.height );
		context.stroke();
		context.restore();
	}
	
};

SelectableText.prototype.setFocus = function( value )
{
	if( this.focused == value )
		return;
		
	this.focused = value;
	var type = ( this.focused == true ) ? Event.FOCUSED : Event.UNFOCUSED;
	var focusEvent = new Event( type, true, true );
	this.dispatchEvent(focusEvent);
};