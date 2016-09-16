(function() {

	if( Tomahawk.glEnabled == false )
		return;
		
	tomahawk_ns.Stage.prototype.backgroundColor = 0xFF0080C0;
	tomahawk_ns.Stage.prototype._renderTask 	= null;
		
	tomahawk_ns.Stage.prototype.getRenderTask	= function()
	{
		return this._renderTask;
	};
	
	tomahawk_ns.Stage.prototype.init 			= function(canvas)
	{
		var callback = this._mouseHandler.smartBind(this);
		
		this._renderTask = new tomahawk_ns.RenderTask();
		this._canvas = canvas;
		this._context = this._getContext();
		this._renderTask.init(this._context);
		
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
		
		window.addEventListener("resize",this._resizeHandler.smartBind(this));
		
		
		tomahawk_ns.BlendMode.init(this._context);		
		this._context.clearColor(0,0,0,1);
		this._context.disable(this._context.DEPTH_TEST);
		this._context.disable(this._context.CULL_FACE);
		this._context.blendFunc( tomahawk_ns.BlendMode.NORMAL[0], tomahawk_ns.BlendMode.NORMAL[1] );
		this._context.enable(this._context.BLEND);
		
		this.enterFrame();		
	};
	
	tomahawk_ns.Stage.prototype._getContext 	= function(canvas)
	{
		return this._canvas.getContext("experimental-webgl");
	};
	
	tomahawk_ns.Stage.prototype.drawFPS 		= function()
	{
		console.log(this._fps);
	};
	
	tomahawk_ns.Stage.prototype.enterFrame 		= function()
	{
		var curTime 	= new Date().getTime();
		var scope 		= this;
		var context 	= this._context;
		var canvas 		= this._canvas;
		var renderTask 	= this._renderTask;
		var unit 		= 1/255;
		var a 			= ( this.backgroundColor >> 24 ) & 0xFF;
		var r 			= ( this.backgroundColor >> 16 ) & 0xFF;
		var g 			= ( this.backgroundColor >> 8 ) & 0xFF;
		var b 			= ( this.backgroundColor >> 0 ) & 0xFF;
		
		
		
		this.width 		= canvas.width;
		this.height 	= canvas.height;
		
		this._frameCount++;
		
		if( curTime - this._lastTime > 1000 )
		{
			this._fps = this._frameCount;
			this._frameCount = 0;
			this._lastTime = curTime;
		}
		

		context.clearColor(r*unit,g*unit,b*unit,a*unit);
		context.viewport(0, 0, canvas.width, canvas.height);
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
		
		
		renderTask.start( new tomahawk_ns.Point(this.width/2,  -this.height/2 ) );
		
		this.draw(renderTask);
		
		renderTask.end();
		
		this.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		
		if( this.debug == true )
		{
			this.drawFPS();
		}
		
		if( this._stop != true )
			window.requestAnimationFrame(this.enterFrame.smartBind(this));
	};

})();