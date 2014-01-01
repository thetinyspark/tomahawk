/**
 * ...
 * @author Thot
*/

(function() {
	
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		this.texture = texture;
		this.width = this.texture.rect[2];
		this.height = this.texture.rect[3];
	}

	Tomahawk.registerClass( Bitmap, "Bitmap" );
	Tomahawk.extend( "Bitmap", "DisplayObject" );

	Bitmap.prototype.texture = null;

	Bitmap.prototype.draw = function( context )
	{	
		var rect = this.texture.rect;
		var data = this.texture.data;
			
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	};

	tomahawk_ns.Bitmap = Bitmap;

})();


