/*
* Visit http://the-tiny-spark.com/tomahawk/ for documentation, updates and examples.
*
* Copyright (c) 2014 the-tiny-spark.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.

* @author The Tiny Spark
*/

(function() {
	
	/**
	 * @class MouseEvent
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function MouseEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( MouseEvent, "MouseEvent" );
	Tomahawk.extend( "MouseEvent", "Event" );


	/**
	* @method {Object} fromNativeMouseEvent converts an original MouseEvent into a regular tomahawk_ns.MouseEvent one
	* @memberOf tomahawk_ns.MouseEvent
	* @returns {tomahawk_ns.MouseEvent}
	**/
	MouseEvent.fromNativeMouseEvent = function(event,bubbles,cancelable,x,y)
	{
		var type = "";
		var msevent = null;
		
		
		
		switch( event.type )
		{
			case "touchend": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "click": type = tomahawk_ns.MouseEvent.CLICK; break;
			case "dblclick": type = tomahawk_ns.MouseEvent.DOUBLE_CLICK; break;
			case "mousemove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "touchmove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "mouseup": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "mousedown": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
			case "touchstart": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
		}
		
		msevent = new tomahawk_ns.MouseEvent(type,bubbles,cancelable);
		msevent.stageX = x;
		msevent.stageY = y;
		return msevent;
	};

	/**
	* @property {Object} CLICK
	* @memberOf tomahawk_ns.MouseEvent click
	**/
	MouseEvent.CLICK 			= "click";
	/**
	* @property {Object} DOUBLE_CLICK doubleClick
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.DOUBLE_CLICK 	= "doubleClick";
	/**
	* @property {Object} ROLL_OVER rollOver
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.ROLL_OVER 		= "rollOver";
	/**
	* @property {Object} ROLL_OUT rollOut
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.ROLL_OUT 		= "rollOut";
	/**
	* @property {Object} MOUSE_MOVE mouseMove
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_MOVE 		= "mouseMove";
	/**
	* @property {Object} MOUSE_UP mouseUp
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_UP 		= "mouseUp";
	/**
	* @property {Object} MOUSE_DOWN mouseDown
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_DOWN 		= "mouseDown";

	tomahawk_ns.MouseEvent = MouseEvent;

})();