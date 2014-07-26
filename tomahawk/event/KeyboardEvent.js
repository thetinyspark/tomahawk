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
	 * @class KeyboardEvent
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function KeyboardEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( KeyboardEvent, "KeyboardEvent" );
	Tomahawk.extend( "KeyboardEvent", "Event" );

	/**
	* @member {String} value the value of the event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.value = "";
	
	/**
	* @member {Number} keyCode the keyCode of the event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.keyCode = 0;
	
	/**
	* @member {Boolean} isCharacter Indicates if the touch pressed corresponds to a character
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.isCharacter = false;
	
	/**
	* @member {Number} charCode the charCode of the event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.charCode = 0;
	
	/**
	* @member {Boolean} ctrlKey Indicates weither the ctrlKey is pressed or not
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.crtlKey = false;
	
	/**
	* @member {Boolean} shiftKey Indicates weither the shiftKey is pressed or not
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.shiftKey = false;
	
	/**
	* @member {Boolean} altKey Indicates weither the altKey is pressed or not
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.altKey = false;
	
	/**
	* @member {KeyboardEvent} nativeEvent the native javascript event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.nativeEvent = null;

	/**
	* @property {String} KEY_UP "keyup"
	* @memberOf tomahawk_ns.KeyboardEvent
	**/
	KeyboardEvent.KEY_UP = "keyup";
	
	/**
	* @property {String} KEY_DOWN "keydown"
	* @memberOf tomahawk_ns.KeyboardEvent
	**/
	KeyboardEvent.KEY_DOWN = "keydown";
	
	/**
	* @property {String} KEY_PRESS "keypress"
	* @memberOf tomahawk_ns.KeyboardEvent
	**/
	KeyboardEvent.KEY_PRESS = "keypress";

	tomahawk_ns.KeyboardEvent = KeyboardEvent;

})();







