/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function MovieClip(texture)
	{
		tomahawk_ns.Bitmap.apply(this, [texture]);
		this._frames = new Array();
	}

	Tomahawk.registerClass( MovieClip, "MovieClip" );
	Tomahawk.extend( "MovieClip", "Bitmap" );

	MovieClip.prototype._frames = null;
	MovieClip.prototype.currentFrame = 0;
	MovieClip.prototype._enterFrameHandler = null;
	MovieClip.prototype.fps = 1;
	MovieClip.prototype._timer = 0;

	MovieClip.prototype._enterFrameHandler = function(event)
	{
		this.currentFrame++;
		
		if( this.currentFrame >= this._frames.length )
			this.currentFrame = 0;
			
		if( this._frames[this.currentFrame] )
		{
			this.texture = this._frames[this.currentFrame];
		}
		
		this._timer = setTimeout(this._enterFrameHandler.bind(this), 1000 / this.fps );
	};

	MovieClip.prototype.setFrame = function( frameIndex, texture )
	{
		if( this.texture == null)
		{
			this.setTexture(texture);
		}
		
		this._frames[frameIndex] = texture;
	};

	MovieClip.prototype.play = function()
	{
		this.stop();
		this._enterFrameHandler();
	};

	MovieClip.prototype.stop = function()
	{
		clearTimeout(this._timer); 
	};
	
	MovieClip.prototype.destroy = function()
	{
		this.stop();
		tomahawk_ns.Bitmap.prototype.destroy.apply(this);
	};

	tomahawk_ns.MovieClip = MovieClip;

})();
