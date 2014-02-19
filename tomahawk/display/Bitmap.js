/**
 * @author The Tiny Spark
 */

(function() {
	
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		
		if( texture == undefined )
			return;
			
		this.setTexture(texture);
	}

	Tomahawk.registerClass( Bitmap, "Bitmap" );
	Tomahawk.extend( "Bitmap", "DisplayObject" );

	Bitmap.prototype.texture = null;
	
	Bitmap.prototype.setTexture = function(texture)
	{
		this.texture = texture;
		this.width = this.texture.rect[2];
		this.height = this.texture.rect[3];
	};

	Bitmap.prototype.draw = function( context )
	{	
		var rect = this.texture.rect;
		var data = this.texture.data;
			
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	};
	
	// a vertex is an array with: x, y, u, v
	Bitmap.prototype.drawTriangles = function( context, vertices, indices, uvtData )
	{
		var max = indices.length;
		var i = 0;
		var rect = this.texture.rect;
		var data = this.texture.data;
		var vertex1 = null;
		var vertex2 = null;
		var vertex3 = null;
		var uv1 = null;
		var uv2 = null;
		var uv3 = null;
		
		for( i = 0; i < max; i+=3 )
		{
			vertex1 = vertices[i*3];
			vertex2 = vertices[i*3 + 1];
			vertex3 = vertices[i*3 + 2];
			uv1 = uvtData[i*3];
			uv2 = uvtData[i*3 + 1];
			uv3 = uvtData[i*3 + 2];
			this._drawTriangle( vertex1,vertex2,vertex2,uv1,uv2,uv3, context, data, rect.width, rect.height );
		}
	};
	
	Bitmap.prototype._drawTriangle = function(v1,v2,v3,uv1,uv2,uv3, ctx, texture, texW, texH ) 
	{
        var x0 = v1[0], x1 = v2[0], x2 = v3[0];
        var y0 = v1[1], y1 = v2[1], y2 = v3[1];
		
        var u0 = uv1[0], u1 = uv2[0], u2 = uv3[0];
        var v0 = uv1[1], v1 = uv2[1], v2 = uv3[1];
		
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


