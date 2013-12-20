/**
 * ...
 * @author Thot
*/

function MouseEvent(){}

Tomahawk.registerClass( MouseEvent, "MouseEvent" );
Tomahawk.extend( "MouseEvent", "Event" );

function MouseEvent(type, bubbles, cancelable)
{
	this.type = type;
	this.cancelable = cancelable;
	this.bubbles = bubbles;
}

MouseEvent.fromNativeMouseEvent = function(event,bubbles,cancelable,x,y)
{
	var type = "";
	var msevent = null;
	
	switch( event.type )
	{
		case "click": type = MouseEvent.CLICK; break;
		case "dblclick": type = MouseEvent.DOUBLE_CLICK; break;
		case "mousemove": type = MouseEvent.MOUSE_MOVE; break;
		case "mouseup": type = MouseEvent.MOUSE_UP; break;
		case "mousedown": type = MouseEvent.MOUSE_DOWN; break;
	}
	
	msevent = new MouseEvent(type,bubbles,cancelable);
	msevent.stageX = x;
	msevent.stageY = y;
	return msevent;
};

MouseEvent.CLICK 			= "click";
MouseEvent.DOUBLE_CLICK 	= "doubleClick";
MouseEvent.ROLL_OVER 		= "rollOver";
MouseEvent.ROLL_OUT 		= "rollOut";
MouseEvent.MOUSE_MOVE 		= "mouseMove";
MouseEvent.MOUSE_UP 		= "mouseUp";
MouseEvent.MOUSE_DOWN 		= "mouseDown";

