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
	 * @class KeyEvent
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function KeyEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( KeyEvent, "KeyEvent" );
	Tomahawk.extend( "Keyboard", "Event" );

	/**
	* @member {String} value the value of the event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.value = "";
	
	/**
	* @member {Number} keyCode the keyCode of the event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.keyCode = 0;
	
	/**
	* @member {Boolean} isCharacter Indicates if the touch pressed corresponds to a character
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.isCharacter = false;
	
	/**
	* @member {Number} charCode the charCode of the event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.charCode = 0;
	
	/**
	* @member {Boolean} ctrlKey Indicates weither the ctrlKey is pressed or not
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.crtlKey = false;
	
	/**
	* @member {Boolean} shiftKey Indicates weither the shiftKey is pressed or not
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.shiftKey = false;
	
	/**
	* @member {Boolean} altKey Indicates weither the altKey is pressed or not
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.altKey = false;
	
	/**
	* @member {KeyboardEvent} nativeEvent the native javascript event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.nativeEvent = null;

	/**
	* @method fromNativeEvent
	* @memberOf tomahawk_ns.KeyEvent
	* @description converts the native javascript event to a regular tomahawk_ns.KeyEvent one.
	* @param {String} type The event type.
	* @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	* @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	* @eturns {tomahawk_ns.KeyEvent}
	**/
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


	/**
	* @property {String} KEY_UP "keyup"
	* @memberOf tomahawk_ns.KeyEvent
	**/
	KeyEvent.KEY_UP = "keyup";
	
	/**
	* @property {String} KEY_DOWN "keydown"
	* @memberOf tomahawk_ns.KeyEvent
	**/
	KeyEvent.KEY_DOWN = "keydown";
	
	/**
	* @property {String} KEY_PRESS "keypress"
	* @memberOf tomahawk_ns.KeyEvent
	**/
	KeyEvent.KEY_PRESS = "keypress";

	tomahawk_ns.KeyEvent = KeyEvent;

})();







