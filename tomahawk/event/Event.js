/*
* Event
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
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
	 * Contains properties and methods shared by all events for use with
	 * {{#crossLink "EventDispatcher"}}{{/crossLink}}.
	 * 
	 * @class Event
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

	Event.prototype.type = null;
	Event.prototype.bubbles = false;
	Event.prototype.cancelable = true;
	Event.prototype.data = null;
	Event.prototype.target = null;
	Event.prototype.currentTarget = null;

	Event.prototype.stopPropagation = function()
	{
		if( this.cancelable == true )
			this.bubbles = false;
	};


	Event.FOCUSED			= "focused"
	Event.UNFOCUSED			= "unfocused"
	Event.ADDED 			= "added";
	Event.ADDED_TO_STAGE 	= "addedToStage";
	Event.ENTER_FRAME 		= "enterFrame";
	Event.REMOVED 			= "removed";
	Event.REMOVED_FROM_STAGE= "removedFromStage";
	Event.IO_ERROR			= "ioError";
	Event.PROGRESS			= "progress";
	Event.COMPLETE			= "complete";
	
	
	tomahawk_ns.Event = Event;

})();