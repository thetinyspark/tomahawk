/**
 * @author The Tiny Spark
 */
(function() {	

	function KeyEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( KeyEvent, "KeyEvent" );
	Tomahawk.extend( "Keyboard", "Event" );

	KeyEvent.prototype.value = "";
	KeyEvent.prototype.keyCode = 0;
	KeyEvent.prototype.isCharacter = false;
	KeyEvent.prototype.charCode = 0;
	KeyEvent.prototype.crtlKey = false;
	KeyEvent.prototype.shiftKey = false;
	KeyEvent.prototype.altKey = false;
	KeyEvent.prototype.nativeEvent = null;

	KeyEvent.fromNativeEvent = function(event,bubbles,cancelable)
	{
		var type = "";
		var newEvent = null;
		var charCode = event.which || event.keyCode;
		
		switch( event.type )
		{
			case "keyup": type = KeyEvent.KEY_UP; break;
			case "keypress": type = KeyEvent.KEY_PRESS; break;
			case "keydown": type = KeyEvent.KEY_DOWN; break;
		}
		
		newEvent = new KeyEvent(type,bubbles,cancelable);
		newEvent.nativeEvent = event;
		newEvent.keyCode = event.keyCode;
		newEvent.charCode = event.charCode;
		newEvent.ctrlKey = event.ctrlKey;
		newEvent.shiftKey = event.shiftKey;
		newEvent.altKey = event.altKey;
		//newEvent.value = ( event.type == "keypress" ) ? String.fromCharCode(charCode) : tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode);
		newEvent.value = tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode);
		newEvent.isCharacter = tomahawk_ns.Keyboard.isMapped(event.keyCode);
		newEvent.which = event.which;
		return newEvent;
		
		//tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode, event.shiftKey, event.ctrlKey, event.altKey);
	};


	KeyEvent.KEY_UP = "keyup";
	KeyEvent.KEY_DOWN = "keydown";
	KeyEvent.KEY_PRESS = "keypress";

	tomahawk_ns.KeyEvent = KeyEvent;

})();







