/**
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{
	
	if( Tomahawk.glEnabled == false )
		return;
		
	tomahawk_ns.Texture.prototype._glTexture 		= null;
	tomahawk_ns.Texture.prototype._lastDataId 		= null;

	tomahawk_ns.Texture.prototype._init = function(data,rect,name)
	{ 
		var width 	= 0;
		var height 	= 0;
		var canvas	= null;
		
		this.data = data || null;
		this.rect = rect || null;
		this.name = name || null;
		
		this.uvs = { 	x1:0, y1:0,
						x2:1, y2:0,
						x3:0, y3:1,
						x4:1, y4:1 
		};
		
		
		this._buildPowerOf2Data();
	};
	
	tomahawk_ns.Texture.prototype._buildPowerOf2Data = function()
	{
		var width 	= 0;
		var height 	= 0;
		var canvas	= null;
		
		if( this.rect != null && this.data != null)
		{
			width 	= this.rect[2];
			height 	= this.rect[3];
			width 	= tomahawk_ns.MathUtils.getNextPowerOf2( width );
			height 	= tomahawk_ns.MathUtils.getNextPowerOf2( height );
			
			this.rect[2] = width;
			this.rect[3] = height;
			
			canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.getContext("2d").drawImage(this.data, 0, 0);
			
			this.data = canvas;
			this.data.id = Tomahawk._UNIQUE_OBJECT_ID++;
		}
	};
	
	tomahawk_ns.Texture.prototype.getGLTexture = function(context)
	{
		if( this._glTexture == null || this._lastDataId != this.data.id )
		{
			this._buildPowerOf2Data();
			var texture = context.createTexture();
			
			context.activeTexture(context.TEXTURE0);
			context.bindTexture(context.TEXTURE_2D, texture);
			context.pixelStorei(context.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.data);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
			context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
			context.bindTexture(context.TEXTURE_2D, null);
			
			this._glTexture = texture;
			this._lastDataId = this.data.id;
			
			//context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
			//gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
			//context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR); 
			//Prevents s-coordinate wrapping (repeating).
			//context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE); 
			//Prevents t-coordinate wrapping (repeating).
			//context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
		}
		
		return this._glTexture;
	};

	
})();