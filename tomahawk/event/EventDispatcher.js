/**
 * ...
 * @author Thot
*/

function EventDispatcher(){}

Tomahawk.registerClass( EventDispatcher, "EventDispatcher" );

EventDispatcher.prototype.parent = null;
EventDispatcher.prototype._listeners = null;

EventDispatcher.prototype.addEventListener = function( type, scope, callback, useCapture )
{
	this._listeners = this._listeners || new Array();
	var obj = new Object();
	obj.type = type;
	obj.scope = scope;
	obj.callback = callback;
	obj.useCapture = useCapture;
	this._listeners.push(obj);
};

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
};

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

EventDispatcher.prototype.removeEventListener = function( type, scope, callback, useCapture )
{
	var obj = new Object();
	var i = this._listeners.length;
	var arr = new Array();
		
	while( --i > -1 )
	{
		obj = this._listeners[i];
		if( obj.type != type || obj.scope != scope || obj.callback != callback || obj.useCapture != useCapture )
			arr.push(obj);
	}
		
	this._listeners = arr;
};


