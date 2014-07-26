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
	 * @class EventDispatcher
	 * @memberOf tomahawk_ns
	 * @constructor
	 **/
	function EventDispatcher()
	{
		this._listeners = new Array();
	}

	Tomahawk.registerClass( EventDispatcher, "EventDispatcher" );

	/**
	* @member {tomahawk_ns.EventDispatcher} parent the parent of the current EventDispatcher
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.parent = null;
	EventDispatcher.prototype._listeners = null;

	/**
	* Add an event listener to the current EventDispatcher
	* @method addEventListener
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @param {String} type The event type.
	* @param {Object} scope the scope of the callback function
	* @param {Function} a callback function which will be called when a matching event will be dispatch.
	**/
	EventDispatcher.prototype.addEventListener = function( type, scope, callback, useCapture )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		
		useCapture = (useCapture == true);
		obj.type = type;
		obj.scope = scope;
		obj.callback = callback;
		obj.useCapture = useCapture;
		this._listeners.push(obj);
	};
	
	/**
	* @description indicates if the current EventDispatcher has an event listener for the type passed in parameter.
	* @method hasEventListener 
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @returns {Boolean}
	* @params {String} type the type of the event listener
	**/
	EventDispatcher.prototype.hasEventListener = function(type)
	{
		if( this._listeners == null )
			return false;
			
		var obj = new Object();
		var i = this._listeners.length;
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type == type )
				return true;
		}
		
		return false;
	};

	/**
	* @description send an event trought all the Display list from the current EventDispatcher to the stage
	* @method dispatchEvent 
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @returns {Boolean}
	* @param {tomahawk_ns.Event} event the event to dispatch
	**/
	EventDispatcher.prototype.dispatchEvent = function( event )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		var i = this._listeners.length;
		var toDispatch = new Array();
		
		if( event.target == null )
			event.target = this;
			
		event.currentTarget = this;
		
		while( --i > -1 )
		{
			obj = this._listeners[i];
			
			if( obj.type == event.type )
			{
				if( event.target != this && obj.useCapture == false )
				{
					continue;
				}
				
				toDispatch.push(obj);
			}
		}
		
		i = toDispatch.length;
		
		while( --i > -1 )
		{
			obj = toDispatch[i];
			obj.callback.apply( obj.scope, [event] );
		}
		
		if( event.bubbles == true && this.parent != null && this.parent.dispatchEvent )
		{
			this.parent.dispatchEvent(event);
		}
	};

	/**
	* Remove ( if exists ) an event listener to the current EventDispatcher
	* @method removeEventListener
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @param {String} type The event type.
	* @param {Object} scope the scope of the callback function
	* @param {Function} a callback function which will be called when a matching event will be dispatch.
	**/
	EventDispatcher.prototype.removeEventListener = function( type, scope, callback, useCapture )
	{
		var obj = new Object();
		var i = this._listeners.length;
		var arr = new Array();
		
		useCapture = (useCapture == true);
			
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type != type || 
				obj.scope != scope || 
				obj.callback != callback || 
				obj.useCapture != useCapture 
			)
			{
				arr.push(obj);
			}
		}
			
		this._listeners = arr;
	};

	/**
	* Remove all event listeners of the current EventDispatcher
	* @method removeEventListeners
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.removeEventListeners = function()
	{
		this._listeners = new Array();
	};
	
	/**
	* Destroy properly the current EventDispatcher
	* @method destroy
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.destroy = function()
	{
		this.removeEventListeners();
		this.parent = null;
		this._listeners = null;
	};
	
	tomahawk_ns.EventDispatcher = EventDispatcher;

})();
