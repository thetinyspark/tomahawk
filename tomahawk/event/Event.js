/**
 * @author The Tiny Spark
 */

(function() {	
	
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