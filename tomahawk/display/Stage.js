/**
 * @author The Tiny Spark
 */

(function() {
	

	function Stage()
	{
		tomahawk_ns.DisplayObject._collide = 0;
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
		
		this.stage = this;
	}

	Tomahawk.registerClass( Stage, "Stage" );
	Tomahawk.extend( "Stage", "DisplayObjectContainer" );

	Stage._instances = new Object();
	
	Stage.getInstance = function(stageName)
	{
		stageName = stageName || "defaultStage";
		
		if( !tomahawk_ns.Stage._instances[stageName] )
			tomahawk_ns.Stage._instances[stageName] = new tomahawk_ns.Stage();
			
		return tomahawk_ns.Stage._instances[stageName];
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
	Stage.prototype.background = false;
	Stage.prototype.backgroundColor = "#0080C0";
	Stage.prototype._stop = false;

	
	Stage.prototype._getContext  = function()
	{
		return this._canvas.getContext("2d");
	};

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
		this._context = this._getContext();
		this.addEventListener(tomahawk_ns.Event.ADDED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.FOCUSED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.UNFOCUSED, this, this._eventHandler,true);
		this._canvas.addEventListener("click",callback);
		this._canvas.addEventListener("touchstart",callback);
		this._canvas.addEventListener("touchmove",callback);
		this._canvas.addEventListener("touchend",callback);
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
		if( event.type == "keyup" )
			tomahawk_ns.Keyboard.toggleShift(event.keyCode);
		
		var keyboardEvent = tomahawk_ns.KeyEvent.fromNativeEvent(event, true, true);
		this.dispatchEvent(keyboardEvent);
	};

	Stage.prototype._mouseHandler = function(event)
	{
		
		var bounds = this._canvas.getBoundingClientRect();
		var x = 0;
		var y = 0;
		var touch = null;
		
		
		if( event.type == "touchstart" || 
			event.type == "touchmove" || 
			event.type == "touchend" 
		)
		{
			touch = event.touches[0];
			
			if( event.type == "touchmove" )
			{
				event.preventDefault();
				//event.stopImmediatePropagation();
				//event.stopPropagation();
			}
			
			
			if( event.type != "touchend" )
			{			
				x = parseInt(touch.clientX) - bounds.left;
				y = parseInt(touch.clientY) - bounds.top;
			}
			else
			{
				x = this.mouseX;
				y = this.mouseY;
			}
			
		}
		else
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			x = event.clientX - bounds.left;
			y = event.clientY - bounds.top;
		}
		var activeChild = this.getObjectUnder(x,y);
		var mouseEvent = null;
		var i = 0;
		this._lastMouseX = this.mouseX >> 0;
		this._lastMouseY = this.mouseY >> 0;
		this.mouseX = x >> 0;
		this.mouseY = y >> 0;
		
		if( activeChild == null )
			activeChild = this;
		
			
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
		
		var handCursor = false;
		var current = activeChild;
		
		while( current != null )
		{
			handCursor = handCursor || current.handCursor;
			current = current.parent;
		}
		
		if( activeChild != null && handCursor == true )
			tomahawk_ns.Mouse.setCursor(tomahawk_ns.Mouse.POINTER, this.getCanvas());
		else
			tomahawk_ns.Mouse.setCursor(tomahawk_ns.Mouse.DEFAULT, this.getCanvas());
		
		
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
		var list = null;
		var i = 0;
		var max = 0;
		var child = null;
		var type = null;
		
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
			case tomahawk_ns.Event.REMOVED: 
				
				list = event.target.getNestedChildren();
				list.push(event.target);
				max = list.length;
				
				for( i= 0; i < max; i++ )
				{
					list[i].stage = this;
				}
				
				type = ( event.type == tomahawk_ns.Event.ADDED ) ? tomahawk_ns.Event.ADDED_TO_STAGE : tomahawk_ns.Event.REMOVED_FROM_STAGE;
				
				for( i= 0; i < max; i++ )
				{
					list[i].dispatchEvent( new tomahawk_ns.Event(type, true, true) ); 
				}
				
				break;
		}
	};

	Stage.prototype.enterFrame = function()
	{
		var curTime = new Date().getTime();
		var scope = this;
		var context = this._context;
		var canvas = this._canvas;
		
		this.width = this._canvas.width;
		this.height = this._canvas.height;
		
		this._frameCount++;
		
		if( curTime - this._lastTime > 1000 )
		{
			this._fps = this._frameCount;
			this._frameCount = 0;
			this._lastTime = curTime;
		}
		
		if( this.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.backgroundColor;
			context.fillRect( 0, 0, canvas.width, canvas.height );
			context.fill();
			context.restore();
		}
		else
		{
			context.clearRect(0,0,canvas.width,canvas.height);
		}
		
		context.save();
		this.draw(context);
		context.restore();
		
		this.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		window.requestAnimationFrame(	function()
										{
											scope.enterFrame();
										}
		);
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


