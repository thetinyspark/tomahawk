(function() {
	
	function BitmapMesh(texture)
	{
		tomahawk_ns.Bitmap.apply(this,[texture]);
		this._canvas = document.createElement("canvas");
	}

	Tomahawk.registerClass( BitmapMesh, "BitmapMesh" );
	Tomahawk.extend( "BitmapMesh", "Bitmap" );
	
	BitmapMesh.prototype.vertices = null;
	BitmapMesh.prototype.uvs = null;
	BitmapMesh.prototype.indices = null;
	BitmapMesh.prototype.showLines = false;
	
	BitmapMesh.prototype.setTexture = function(texture)
	{
		tomahawk_ns.Bitmap.prototype.setTexture.apply(this,[texture]);
		this.vertices = [[0,0],[this.width,0],[0,this.height],[this.width,this.height]];
		this.uvs = [[0,0],[1,0],[0,1],[1,1]];
		this.indices = [0,1,2,1,2,3];
	};

	BitmapMesh.prototype.draw = function(context)
	{
		var vertices = this.vertices;
		var uvtData = this.uvs;
		var indices = this.indices;
		var max = indices.length;
		var i = 0;
		var width = this.texture.rect[2];
		var height = this.texture.rect[3];
		var data = this.texture.data;
		var vertex1 = null;
		var vertex2 = null;
		var vertex3 = null;
		var index1 = 0;
		var index2 = 0;
		var index3 = 0;
		var uv1 = null;
		var uv2 = null;
		var uv3 = null;
		
		for( i = 0; i < max; i+=3 )
		{
			index1 = indices[i];
			index2 = indices[i + 1];
			index3 = indices[i + 2];
			vertex1 = vertices[index1];
			vertex2 = vertices[index2];
			vertex3 = vertices[index3];
			
			uv1 = uvtData[index1];
			uv2 = uvtData[index2];
			uv3 = uvtData[index3];
			this._drawTriangle( vertex1,vertex2,vertex3,uv1,uv2,uv3, context, data, width, height );
		}
	};
	
	BitmapMesh.prototype._drawTriangle = function(v1,v2,v3,uv1,uv2,uv3, ctx, texture, texW, texH ) 
	{
        ctx.save(); 
		
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
        
		
		ctx.beginPath(); 
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;
		
		ctx.moveTo(x0, y0 ); 
		ctx.lineTo(x1, y1 );
        ctx.lineTo(x2, y2 ); 
		ctx.lineTo(x0,y0);
		
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
					  
        ctx.drawImage(texture, 0,0,texW,texH );
		
        ctx.restore();
		
		if( this.showLines == true )
		{
			ctx.save();
			ctx.beginPath(); 
			ctx.strokeStyle = "black";
			ctx.lineWidth = 1;
			ctx.moveTo(x0, y0 ); 
			ctx.lineTo(x1, y1 );
			ctx.lineTo(x2, y2 ); 
			ctx.lineTo(x0,y0);
			ctx.stroke();
			ctx.closePath(); 
			ctx.restore();
		}
	};

	tomahawk_ns.BitmapMesh = BitmapMesh;

})();
