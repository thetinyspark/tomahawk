/**
 * @author The Tiny Spark
 */
(function() {
	
	function InputTextField()
	{
		tomahawk_ns.SelectableTextField.apply(this);
		this.addEventListener( tomahawk_ns.Event.ADDED_TO_STAGE, this, this._inputTextFieldAddedHandler );
	}

	Tomahawk.registerClass(InputTextField,"InputTextField");
	Tomahawk.extend("InputTextField","SelectableTextField");

	InputTextField.prototype._inputTextFieldAddedHandler = function(event)
	{
		this.removeEventListener( tomahawk_ns.Event.ADDED_TO_STAGE, this, this._inputTextFieldAddedHandler );
		this.stage.addEventListener( tomahawk_ns.KeyEvent.KEY_DOWN, this, this._keyHandler );
	};
	
	InputTextField.prototype._keyHandler = function(event)
	{
		var range = this.getSelectionRange();
		
		if( this.getFocus() == false )
			return;
			
		if( this.isSelected() == true && event.keyCode != tomahawk_ns.Keyboard.LEFT && event.keyCode != tomahawk_ns.Keyboard.RIGHT )
		{
			this.removeTextBetween( range.start, range.end );
		}
		
		if( event.keyCode == tomahawk_ns.Keyboard.BACKSPACE )
		{
			this.removeCharAt(this.getCurrentIndex());
		}
		else if( event.keyCode == tomahawk_ns.Keyboard.SUPPR )
		{
			this.removeCharAt(this.getCurrentIndex() + 1);
		}
		else if( event.keyCode == tomahawk_ns.Keyboard.LEFT || event.keyCode == tomahawk_ns.Keyboard.RIGHT)
		{
			var step = ( event.keyCode == tomahawk_ns.Keyboard.LEFT ) ? -1 : 1;
			this.setCurrentIndex(this.getCurrentIndex()+step);
		}
		else if( event.isCharacter == true )
		{
			var newline = false;
			 //special select all
			if( event.keyCode == tomahawk_ns.Keyboard.A && event.ctrlKey )
			{
				this.selectAll();
				return;
			}
			
			var text = event.value;
			
			if( event.keyCode == tomahawk_ns.Keyboard.V && event.ctrlKey )
			{
				text = window.prompt ("Copy to clipboard: Ctrl+C, Enter", "");
				this.addTextAt(text,this.getCurrentIndex() + 1);
			}
			else
			{
				if( event.keyCode == tomahawk_ns.Keyboard.ENTER )
				{
					text = "";
					newline = true;
				}
				
				this.addCharAt(text,this.getCurrentIndex() + 1, newline);
			}
		}
	};

	tomahawk_ns.InputTextField = InputTextField;
})();