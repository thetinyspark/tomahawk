/**
 * ...
 * @author Hatshepsout
 */

function BaseInputTextField()
{
	BaseSelectableTextField.apply(this);
	Stage.getInstance().addEventListener( KeyEvent.KEY_DOWN, this, this._keyHandler );
}

Tomahawk.registerClass(BaseInputTextField,"BaseInputTextField");
Tomahawk.extend("BaseInputTextField","BaseSelectableTextField");


BaseInputTextField.prototype._keyHandler = function(event)
{
	var range = this.getSelectionRange();
	
	if( this._focused == false )
		return;
	
	if( this.isSelected() && event.keyCode != Keyboard.LEFT && event.keyCode != Keyboard.RIGHT )
	{
		this.removeTextBetween( range.start, range.end );
	}
		
	if( event.keyCode == Keyboard.BACKSPACE )
	{
		this.removeCharAt(this.getCurrentIndex() - 1);
	}
	else if( event.keyCode = Keyboard.SUPPR )
	{
		this.removeCharAt(this.getCurrentIndex());
	}
	else if( event.keyCode == Keyboard.LEFT || event.keyCode == Keyboard.RIGHT)
	{
		var step = ( event.keyCode == Keyboard.LEFT ) ? -1 : 1;
		this.setCurrentIndex(this.getCurrentIndex()+step);
	}
	else if( event.isCharacter == true )
	{
		// special select all
		if( event.keyCode == Keyboard.A && event.ctrlKey )
		{
			this.selectAll();
			return;
		}
		
		var text = event.value;
		this.removeTextBetween( range.start, range.end );
		
		if( event.keyCode == Keyboard.V && event.ctrlKey )
		{
			text = window.prompt ("Copy to clipboard: Ctrl+C, Enter", "");
		}
		
		this.addTextAt(text,this.getCurrentIndex() + 1);
	}
};

