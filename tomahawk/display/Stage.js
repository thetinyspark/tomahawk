/**
 * ...
 * @author Thot
*/

(function() {
	

	function Stage()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
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
	Stage.prototype._lastActiveChild = null;
	Stage.prototype.mouseX = 0;
	Stage.prototype.mouseY = 0;
	Stage.prototype._focused = false;
	Stage.prototype._focusedElement = null;
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
		
		this._canvas = canvas;
		this._context = canvas.getContext("2d");
		this.addEventListener(tomahawk_ns.Event.ADDED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.FOCUSED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.UNFOCUSED, this, this._eventHandler,true);
		this._canvas.addEventListener("click",callback);
		this._canvas.addEventListener("mousemove",callback);
		this._canvas.addEventListener("mousedown",callback);
		this._canvas.addEventListener("mouseup",callback);
		this._canvas.addEventListener("dblclick",callback);
		
		
		window.addEventListener("keyup",callbackKey);
		window.addEventListener("keydown",callbackKey);
		window.addEventListener("keypress",callbackKey);
		this.enterFrame();		
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
			tomahawk_ns.Keyboard.toggleShift(event.keyCode);
		
		var keyboardEvent = tomahawk_ns.KeyEvent.fromNativeEvent(event, true, true);
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
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
				mouseEvent.type = tomahawk_ns.MouseEvent.ROLL_OVER;
				activeChild.dispatchEvent(mouseEvent);
			}
			
			if( this._lastActiveChild != null )
			{		
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
				mouseEvent.type = tomahawk_ns.MouseEvent.ROLL_OUT;
				this._lastActiveChild.dispatchEvent(mouseEvent);
			}
		}
		else
		{
			if( activeChild != null )
			{
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);			
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
			mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);	
			mouseEvent.type == tomahawk_ns.MouseEvent.RELEASE_OUTSIDE;
			this._lastMouseDownChild.dispatchEvent(mouseEvent);
			this._lastMouseDownChild = null;
		}
		
		this._lastActiveChild = activeChild;
		
		if( event.type != "mousemove" && this._focusedElement != null && activeChild != this._focusedElement )
		{
			this._focusedElement.setFocus(false);
			this._focusedElement = null;
			this._focused = false;
		}
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
			case tomahawk_ns.Event.FOCUSED: 
				this._focused = true;
				this._focusedElement = event.target;
				break;
				
			case tomahawk_ns.Event.UNFOCUSED: 
				this._focused = false;
				break;
				
			case tomahawk_ns.Event.ADDED: 
				event.target.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED_TO_STAGE, true, true) ); 
				break;
				
			case tomahawk_ns.Event.REMOVED: 
				event.target.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.REMOVED_FROM_STAGE, true, true) ); 
				break;
		}
	};

	Stage.prototype.enterFrame = function()
	{
		var curTime = new Date().getTime();
		var scope = Stage.getInstance();
		var context = scope._context;
		var canvas = scope._canvas;
		
		scope._frameCount++;
		
		if( curTime - scope._lastTime > 1000 )
		{
			scope._fps = scope._frameCount;
			scope._frameCount = 0;
			scope._lastTime = curTime;
		}
		
		context.clearRect(0,0,canvas.width,canvas.height);
		context.save();
		scope.draw(context);
		context.restore();
		
		scope.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		window.requestAnimationFrame(scope.enterFrame);
	};

	Stage.prototype.setFPS = function(value)
	{
		this._fps = value;
	};

	Stage.prototype.drawFPS = function()
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "black";
		this._context.fillRect(0,0,50,15);
		this._context.fill();
		this._context.fillStyle = "red";
		this._context.font = '10pt Arial';
		this._context.fillText("fps: "+this._fps, 0,15);
		this._context.restore();
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


	tomahawk_ns.Stage = Stage;

})();


