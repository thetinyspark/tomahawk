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
	 * @class Stage
	 * @memberOf tomahawk_ns
	 * @description The Stage class represents the main drawing area, it is the top of the display list.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Stage()
	{
		tomahawk_ns.DisplayObject._collide = 0;
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.setFPS(60);
		this.stage = this;
	}

	Tomahawk.registerClass( Stage, "Stage" );
	Tomahawk.extend( "Stage", "DisplayObjectContainer" );

	Stage._instances = new Object();
	
	/**
	* @method getInstance
	* @memberOf tomahawk_ns.Stage
	* @param {string} stageName 
	* @returns {tomahawk_ns.Stage} returns a Stage object that matches the "stageName" parameter. If none of the Stage instances corresponds to the "stageName" parameter, one is automatically created and returned. It is a (Multiton || Factory) implementation of the Stage class.
	**/
	Stage.getInstance = function(stageName)
	{
		stageName = stageName || "defaultStage";
		
		if( !tomahawk_ns.Stage._instances[stageName] )
			tomahawk_ns.Stage._instances[stageName] = new tomahawk_ns.Stage();
			
		return tomahawk_ns.Stage._instances[stageName];
	};

	/**
	* @member mouseX
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description the x mouse coordinates on the stage.
	**/
	Stage.prototype.mouseX = 0;
	
	/**
	* @member mouseY
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description the y mouse coordinates on the stage.
	**/
	Stage.prototype.mouseY = 0;
	
	/**
	* @member background
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the stage has a background fill. If true, the stage has a background fill. If false, stage has no background fill. Use the backgroundColor property to set the background color of the stage instance.
	**/
	Stage.prototype.background = false;
	
	/**
	* @member backgroundColor
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {string}
	* @description The color of the stage background.
	* @default "#0080C0"
	**/
	Stage.prototype.backgroundColor = "#0080C0";
	
	Stage.prototype._lastTime = 0;
	Stage.prototype._frameCount = 0;
	Stage.prototype._fps = 0;
	Stage.prototype._canvas = null;
	Stage.prototype._context = null;
	Stage.prototype._lastActiveChild = null;
	Stage.prototype._focused = false;
	Stage.prototype._focusedElement = null;
	Stage.prototype._cache = null;
	Stage.prototype._stop = false;

	/**
	* @description  Associates the canvas element specified by the "canvas" parameter  to this stage and runs the rendering loop.
	* @method init
	* @memberOf tomahawk_ns.Stage.prototype
	* @param {HTMLCanvasElement} canvas the HTMLCanvasElement element associated to this stage object.
	**/
	Stage.prototype.init = function(canvas)
	{
		var callback = this._mouseHandler.bind(this);
		
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
		
		this._enterFrame = this.enterFrame.bind(this);
		this.enterFrame();		
	};
	
	/**
	* @description Returns a point object which determines the movement on x and y axises since the last frame ( in local stage coordinates system ).
	* @method getMovement
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {tomahawk_ns.Point} a Point object
	**/
	Stage.prototype.getMovement = function()
	{
		var pt = new Object();
		pt.x = this.mouseX - this._lastMouseX;
		pt.y = this.mouseY - this._lastMouseY;
		
		return pt;
	};

	/**
	* @description The main rendering loop, automatically called at each frame.
	* @method enterFrame
	* @memberOf tomahawk_ns.Stage.prototype
	**/
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
			canvas.width = canvas.width;
		}
		
		context.save();
		this.draw(context);
		context.restore();
		
		this.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		window.requestAnimationFrame(this._enterFrame);
	};

	/**
	* @description Sets the current fps but only if the browser doesn't have a valid implementation of window.requestAnimationFrame or equivalent. If there's one, it will be used instead even if you specify another fps value.
	* @method setFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @param {Number} value the new current fps
	**/
	Stage.prototype.setFPS = function(value)
	{
		this._fps = value;
		
		window.requestAnimationFrame = (function()
		{
			
			return  window.requestAnimationFrame       ||  //Chromium 
					window.webkitRequestAnimationFrame ||  //Webkit
					window.mozRequestAnimationFrame    || //Mozilla Geko
					window.oRequestAnimationFrame      || //Opera Presto
					window.msRequestAnimationFrame     || //IE Trident?
					function(callback, element){ //Fallback function
						window.setTimeout(callback, parseInt(1000/value));                
					}
			 
		})();
	};

	/**
	* @method drawFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Draws the current fps on the top left corner of the stage.
	**/
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

	/**
	* @method getCanvas
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {HTMLCanvasElement} An HTMLCanvasElement DOM object
	* @description Returns the HTMLCanvasElement associated to this stage.
	**/
	Stage.prototype.getCanvas = function()
	{
		return this._canvas;
	};
	
	/**
	* @method getContext
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {CanvasRenderingContext2D} A CanvasRenderingContext2D object
	* @description Returns the CanvasRenderingContext2D associated to this stage's canvas.
	**/
	Stage.prototype.getContext = function()
	{
		return this._context;
	};

	/**
	* @member getFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Returns the current fps.
	* @returns {Number} the current fps
	**/
	Stage.prototype.getFPS = function()
	{
		return this._fps;
	};

	
	Stage.prototype._getContext  = function()
	{
		return this._canvas.getContext("2d");
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
				
				
				if( event.target.isContainer == true )
				{
					list = event.target.getNestedChildren();
				}
				else
				{
					list = new Array();
				}
				
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


	tomahawk_ns.Stage = Stage;

})();


