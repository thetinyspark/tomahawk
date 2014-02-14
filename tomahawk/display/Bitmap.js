/**
 * @author The Tiny Spark
 */

(function() {
	
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		
		if( texture == undefined )
			return;
			
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
	
	// a vertex is an array with: x, y, u, v
	Bitmap.prototype.drawTriangles = function( context, vertices )
	{
		var max = vertices.length;
		var i = 0;
		var rect = this.texture.rect;
		var data = this.texture.data;
		
		for( ; i < max; i++ )
		{
			this._drawTriangle( vertices[i], context, data, rect.width, rect.height );
		}
	};
	
	Bitmap.prototype._drawTriangle = function(vertices, ctx, texture, texW, texH ) 
	{
        var x0 = vertices[0][0], x1 = vertices[1][0], x2 = vertices[2][0];
        var y0 = vertices[0][1], y1 = vertices[1][1], y2 = vertices[2][1];
        var u0 = vertices[0][2], u1 = vertices[1][2], u2 = vertices[2][2];
        var v0 = vertices[0][3], v1 = vertices[1][3], v2 = vertices[2][3];
		
		u0 *= texW;
		u1 *= texW;
		u2 *= texW;
		v0 *= texH;
		v1 *= texH;
		v2 *= texH;

        // Set clipping area so that only pixels inside the triangle will
        // be affected by the image drawing operation
        ctx.save(); 
		ctx.beginPath(); 
		ctx.moveTo(x0, y0); 
		ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2); 
		ctx.closePath(); 
		ctx.clip();

        // Compute matrix transform
        var delta 	= u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

        // Draw the transformed image
        ctx.transform(delta_a/delta, delta_d/delta,
                      delta_b/delta, delta_e/delta,
                      delta_c/delta, delta_f/delta);
        ctx.drawImage(texture, 0, 0,texW,texH);
        ctx.restore();
	};

	tomahawk_ns.Bitmap = Bitmap;

})();


