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

	MovieClip.prototype._enterFrameHandler = function(event)
	{
		this.currentFrame++;
		if( this.currentFrame >= this._frames.length )
			this.currentFrame = 0;
			
		if( this._frames[this.currentFrame] )
		{
			this.texture = this._frames[this.currentFrame];
		}
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
		
		if( this.stage == null )
			return;
			
		this.stage.addEventListener(tomahawk_ns.Event.ENTER_FRAME, this,this._enterFrameHandler); 
	};

	MovieClip.prototype.stop = function()
	{
		if( this.stage == null )
			return;
		this.stage.removeEventListener(tomahawk_ns.Event.ENTER_FRAME, this,this._enterFrameHandler); 
	};

	tomahawk_ns.MovieClip = MovieClip;

})();
