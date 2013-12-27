/**
 * ...
 * @author Thot
*/

function Stage()
{
	DisplayObjectContainer.apply(this);
		// useful
	window.requestAnimationFrame = (function()
	{
		
		return  window.requestAnimationFrame       ||  //Chromium 
				window.webkitRequestAnimationFrame ||  //Webkit
				window.mozRequestAnimationFrame    || //Mozilla Geko
				window.oRequestAnimationFrame      || //Opera Presto
				window.msRequestAnimationFrame     || //IE Trident?
				function(callback, element){ //Fallback function
					window.setTimeout(callback, 10);                
				}
		 
	})();
}

Tomahawk.registerClass( Stage, "Stage" );
Tomahawk.extend( "Stage", "DisplayObjectContainer" );

Stage._instance = null;
Stage.getInstance = function()
{
	if( Stage._instance == null )
		Stage._instance = new Stage();
		
	return Stage._instance;
};


Stage.prototype._lastTime = 0;
Stage.prototype._frameCount = 0;
Stage.prototype._fps = 0;
Stage.prototype._canvas = null;
Stage.prototype._context = null;
Stage.prototype._debug = false;
Stage.prototype._lastActiveChild = null;
Stage.prototype.displayMouseCoordinates = false;
Stage.prototype.mouseX = 0;
Stage.prototype.mouseY = 0;
Stage.prototype._input = null;
Stage.prototype._focused = false;
Stage.prototype._cache = null;


Stage.prototype.init = function(canvas)
{
	var scope = this;
	var callback = function(event)
	{
		scope._mouseHandler(event);
	};
	
	var callbackKey = function(event)
	{
		scope._keyboardHandler(event);
	};
	
	this._input = document.createElement("input");
	this._input.type = "text";
	this._canvas = canvas;
	this._context = canvas.getContext("2d");
	this.addEventListener(Event.ADDED, this, this._eventHandler,true);
	this.addEventListener(Event.FOCUSED, this, this._eventHandler,true);
	this.addEventListener(Event.UNFOCUSED, this, this._eventHandler,true);
	this._canvas.addEventListener("click",callback);
	this._canvas.addEventListener("mousemove",callback);
	this._canvas.addEventListener("mousedown",callback);
	this._canvas.addEventListener("mouseup",callback);
	this._canvas.addEventListener("dblclick",callback);
	
	
	window.addEventListener("keyup",callbackKey);
	window.addEventListener("keydown",callbackKey);
	window.addEventListener("keypress",callbackKey);
	this._enterFrame();		
};

Stage.prototype._keyboardHandler = function(event)
{
	if( this._focused == true )
	{
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	if( event.type == "keyup" )
		Keyboard.toggleShift(event.keyCode);
	
	var keyboardEvent = KeyEvent.fromNativeMouseEvent(event, true, true);
	this.dispatchEvent(keyboardEvent);
};

Stage.prototype._mouseHandler = function(event)
{
	event.preventDefault();
	event.stopImmediatePropagation();
	event.stopPropagation();
	
	var bounds = this._canvas.getBoundingClientRect();
	var x = event.clientX - bounds.left;
	var y = event.clientY - bounds.top;
	var activeChild = this.getObjectUnder(x,y);
	var mouseEvent = null;
	var i = 0;
	this._lastMouseX = this.mouseX >> 0;
	this._lastMouseY = this.mouseY >> 0;
	this.mouseX = x >> 0;
	this.mouseY = y >> 0;
	
		
	if( event.type == "mousemove" && this._lastActiveChild != activeChild )
	{
		if( activeChild != null )
		{		
			mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
			mouseEvent.type = MouseEvent.ROLL_OVER;
			activeChild.dispatchEvent(mouseEvent);
		}
		
		if( this._lastActiveChild != null )
		{		
			mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
			mouseEvent.type = MouseEvent.ROLL_OUT;
			this._lastActiveChild.dispatchEvent(mouseEvent);
		}
	}
	else
	{
		if( activeChild != null )
		{
			mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);			
			activeChild.dispatchEvent(mouseEvent);
		}
	}
	
	if( event.type == "mousedown" )
	{
		this._lastMouseDownChild = activeChild;
	}
	
	if( 	event.type == "mouseup" && 
			activeChild != this._lastMouseDownChild && 
			this._lastMouseDownChild != null
	)
	{
		mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);	
		mouseEvent.type == MouseEvent.RELEASE_OUTSIDE;
		this._lastMouseDownChild.dispatchEvent(mouseEvent);
		this._lastMouseDownChild = null;
	}
	
	this._lastActiveChild = activeChild;
};

Stage.prototype.getMovement = function()
{
	var pt = new Object();
	pt.x = this.mouseX - this._lastMouseX;
	pt.y = this.mouseY - this._lastMouseY;
	
	return pt;
};


Stage.prototype._eventHandler = function(event)
{
	switch( event.type )
	{
		case Event.FOCUSED: 
			this._focused = true;
			break;
			
		case Event.UNFOCUSED: 
			this._focused = false;
			break;
			
		case Event.ADDED: 
			event.target.dispatchEvent( new Event(Event.ADDED_TO_STAGE, true, true) ); 
			break;
			
		case Event.REMOVED: 
			event.target.dispatchEvent( new Event(Event.REMOVED_FROM_STAGE, true, true) ); 
			break;
	}
};

Stage.prototype._enterFrame = function()
{
	this.dispatchEvent(new Event(Event.ENTER_FRAME,true,true));
	var curTime = new Date().getTime();
	var scope = this;
	
	this._frameCount++;
	
	if( curTime - this._lastTime >= 1000 )
	{
		this._fps = this._frameCount;
		this._frameCount = 0;
		this._lastTime = curTime;
	}
	
	this._context.clearRect(0,0,this._canvas.width,this._canvas.height);
	this._context.save();
	this.render(this._context);
	this._context.restore();
	
	if( this._debug == true )
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "black";
		this._context.fillRect(0,0,100,30);
		this._context.fill();
		this._context.fillStyle = "red";
		this._context.font = 'italic 20pt Calibri';
		this._context.fillText("fps: "+this._fps, 0,30);
		this._context.restore();
	}
	
	if( this.displayMouseCoordinates == true )
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "green";
		this._context.fillRect(this.mouseX - 2,this.mouseY - 2,4,4);
		this._context.fill();
		this._context.restore();
	}
	
	window.requestAnimationFrame(
		function()
		{
			scope._enterFrame();
		}
	);
};

Stage.prototype.getCanvas = function()
{
	return this._canvas;
};

Stage.prototype.getContext = function()
{
	return this._context;
};

Stage.prototype.getFPS = function()
{
	return this._fps;
};

Stage.prototype.setDebug = function( debug )
{
	this._debug = debug;
};






