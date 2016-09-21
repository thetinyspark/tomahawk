
(function() {
	
	function FrameRenderer()
	{
		window.requestAnimationFrame = 	window.requestAnimationFrame       ||  //Chromium 
										window.webkitRequestAnimationFrame ||  //Webkit
										window.mozRequestAnimationFrame    || //Mozilla Geko
										window.oRequestAnimationFrame      || //Opera Presto
										window.msRequestAnimationFrame     || //IE Trident?
										null;
	}

	Tomahawk.registerClass( FrameRenderer, "FrameRenderer" );
	

	FrameRenderer.prototype._callback 	= null;
	FrameRenderer.prototype._playing 	= true;
	FrameRenderer.prototype._timeout 	= 0;
	FrameRenderer.prototype.fps			= 60;
	
	FrameRenderer.prototype.stop = function()
	{
		clearTimeout(this._timeout);
		this._playing = false;
	};
	
	FrameRenderer.prototype.resume = function()
	{
		this.stop();
		this._playing = true;
		this.nextFrame();
	};
	
	FrameRenderer.prototype.nextFrame = function()
	{
		if( this._playing != true )
			return;
			
		if( this._callback != null )
		{
			this._callback();
		}
					
		if( window.requestAnimationFrame == null )
		{
			clearTimeout(this._timeout);
			this._timeout = setTimeout( this.nextFrame.bind(this), 1000 / this.fps );
		}
		else
		{
			var toto = window.requestAnimationFrame(this.nextFrame.bind(this));
		}
	};
	
	FrameRenderer.prototype.setCallback = function(callback)
	{
		this._callback = callback;
	};
	
	FrameRenderer.prototype.destroy = function()
	{
		this.stop();
		this._callback = null;
	};
	
	tomahawk_ns.FrameRenderer = FrameRenderer;
	
	

})();


