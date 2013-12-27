/**
 * ...
 * @author Thot
*/

function MovieClip()
{
	Bitmap.apply(this);
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
	this._frames[frameIndex] = texture;
};

MovieClip.prototype.play = function()
{
	this.stop();
	Stage.getInstance().addEventListener(Event.ENTER_FRAME, this,this._enterFrameHandler); 
};

MovieClip.prototype.stop = function()
{
	Stage.getInstance().removeEventListener(Event.ENTER_FRAME, this,this._enterFrameHandler); 
};


