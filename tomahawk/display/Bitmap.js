/**
 * ...
 * @author Thot
*/



function Bitmap()
{
	DisplayObject.apply(this);
}

Tomahawk.registerClass( Bitmap, "Bitmap" );
Tomahawk.extend( "Bitmap", "DisplayObject" );

Bitmap.prototype.texture = null;

Bitmap.prototype.draw = function( context )
{
	if( this.texture != null )
	{
		var rect = this.texture.rect;
		var data = this.texture.data;
		
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	}
};


