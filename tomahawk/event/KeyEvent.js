/**
 * ...
 * @author Thot
*/

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

KeyEvent.fromNativeMouseEvent = function(event,bubbles,cancelable)
{
	var type = "";
	var newEvent = null;
	
	switch( event.type )
	{
		case "keyup": type = KeyEvent.KEY_UP; break;
		case "keypress": type = KeyEvent.KEY_PRESS; break;
		case "keydown": type = KeyEvent.KEY_DOWN; break;
	}
	
	newEvent = new KeyEvent(type,bubbles,cancelable);
	newEvent.keyCode = event.keyCode;
	newEvent.charCode = event.charCode;
	newEvent.ctrlKey = event.ctrlKey;
	newEvent.shiftKey = event.shiftKey;
	newEvent.altKey = event.altKey;
	newEvent.value = Keyboard.keyCodeToChar(event.keyCode, event.shiftKey, event.ctrlKey, event.altKey);
	newEvent.isCharacter = Keyboard.isMapped(event.keyCode);
	newEvent.which = event.which;
	return newEvent;
};


KeyEvent.KEY_UP = "keyup";
KeyEvent.KEY_DOWN = "keydown";
KeyEvent.KEY_PRESS = "keypress";







