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
	 * @class Event
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	 
	function Event(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( Event, "Event" );

	/**
	* @member {String} type the type of the event.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.type = null;
	
	/**
	* @member {Boolean} bubbles indicates if the event can "bubble" or not.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.bubbles = false;
	
	/**
	* @member {Boolean} cancelable indicates if the event is cancelable or not.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.cancelable = true;
	
	/**
	* @member {Object} data an object attached to the event.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.data = null;
	
	/**
	* @member {tomahawk_ns.EventDispatcher} target the original dispatcher of the event
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.target = null;
	
	/**
	* @member {tomahawk_ns.EventDispatcher} currentTarget the actual dispatcher of the event
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.currentTarget = null;

	/**
	* @method stopPropagation stop the bubbling phase
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.stopPropagation = function()
	{
		if( this.cancelable == true )
			this.bubbles = false;
	};

	/**
	* @property {String} FOCUSED focused
	* @memberOf tomahawk_ns.Event
	**/
	Event.FOCUSED			= "focused";
	/**
	* @property {String} UNFOCUSED unfocused
	* @memberOf tomahawk_ns.Event
	**/
	Event.UNFOCUSED			= "unfocused";
	/**
	* @property {String} ADDED added
	* @memberOf tomahawk_ns.Event
	**/
	Event.ADDED 			= "added";
	/**
	* @property {String} ADDED_TO_STAGE addedToStage
	* @memberOf tomahawk_ns.Event
	**/
	Event.ADDED_TO_STAGE 	= "addedToStage";
	/**
	* @property {String} ENTER_FRAME enterFrame
	* @memberOf tomahawk_ns.Event
	**/
	Event.ENTER_FRAME 		= "enterFrame";
	/**
	* @property {String} REMOVED removed
	* @memberOf tomahawk_ns.Event
	**/
	Event.REMOVED 			= "removed";
	/**
	* @property {String} REMOVED_FROM_STAGE removedFromStage
	* @memberOf tomahawk_ns.Event
	**/
	Event.REMOVED_FROM_STAGE= "removedFromStage";
	/**
	* @property {String} IO_ERROR ioError
	* @memberOf tomahawk_ns.Event
	**/
	Event.IO_ERROR			= "ioError";
	/**
	* @property {String} PROGRESS progress
	* @memberOf tomahawk_ns.Event
	**/
	Event.PROGRESS			= "progress";
	/**
	* @property {String} COMPLETE complete
	* @memberOf tomahawk_ns.Event
	**/
	Event.COMPLETE			= "complete";
	
	
	tomahawk_ns.Event = Event;

})();