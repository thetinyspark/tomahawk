/**
 * note
 * @author Thot
 */

function InputText()
{
	SelectableText.apply(this);
	Stage.getInstance().addEventListener( KeyEvent.KEY_DOWN, this, this._keyHandler );
}

Tomahawk.registerClass( InputText, "InputText" );
Tomahawk.extend( "InputText","SelectableText" );


InputText.prototype._addTextAt = function(value,index)
{
	var sub1 = this.text.substr(0,index + 1);
	var sub2 = this.text.substr(index + 1);
	var format = this.getTextFormat(index );
	var max = value.length;
	
	this.text = sub1 + value + sub2;
	
	while( --max > -1 )
		this.pushTextFormat(format,index);
	
	this.currentIndex = index += value.length;
};

InputText.prototype._deleteTextBetween = function(start,end)
{
	var sub1 = this.text.substr(0,start);
	var sub2 = this.text.substr(end);
	this.removeTextFormatBetween(start,end);
	this.text = sub1 + sub2;
	this.currentIndex = start - 1;
};

InputText.prototype._deleteSelectedText = function()
{
	if( this._selectStart != -1 )
	{
		this._deleteTextBetween(this._selectStart,this._selectEnd + 1);
		this._selectStart = this._selectEnd = -1;
		return true;
	}
	return false;
};

InputText.prototype._keyHandler = function(event)
{
	if( this.focused == false )
		return;
	
	if( event.keyCode == Keyboard.BACKSPACE || event.keyCode == Keyboard.SUPPR)
	{
		var deleted = this._deleteSelectedText();
		
		if( deleted == false )
		{
			var step = ( event.keyCode == Keyboard.BACKSPACE ) ? 0 : 1;
			var start = this.currentIndex + step;
			var end = start + 1;
			this._deleteTextBetween(start,end);
		}
	}
	else if( event.keyCode == Keyboard.LEFT || event.keyCode == Keyboard.RIGHT)
	{
		var step = ( event.keyCode == Keyboard.LEFT ) ? -1 : 1;
		
		if( event.shiftKey == true )
		{
			if( this._selectEnd == -1 )
				this._selectEnd = this.currentIndex;
			
			this._selectStart = this.currentIndex;
			if( this._selectEnd < this._selectStart )
			{
				this._selectStart = this._selectEnd;
				this._selectEnd = this.currentIndex;
			}
		}
		
		this.currentIndex += step;
	}
	else if( event.isCharacter == true )
	{
		// special select all
		if( event.keyCode == Keyboard.A && event.ctrlKey )
		{
			this.setSelection(0,this.text.length);
			return;
		}
		
		var text = event.value;
		this._deleteSelectedText();
		
		if( event.keyCode == Keyboard.V && event.ctrlKey )
		{
			text = window.prompt ("Copy to clipboard: Ctrl+C, Enter", "");
		}
		
		this._addTextAt(text,this.currentIndex);
	}
};


