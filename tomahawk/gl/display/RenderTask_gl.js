/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function RenderTask (){}
	
	RenderTask.prototype._currentTexture 		= null;
	RenderTask.prototype._vertexArray 			= null;
	RenderTask.prototype._indexArray 			= null;
	RenderTask.prototype._maxSpritePerSession 	= 2730;
	RenderTask.prototype.currentShader 			= null;
	RenderTask.prototype.context 				= null;
	RenderTask.prototype.counter 				= 0;
	RenderTask.prototype._numQuads 				= 0;
	
	
	RenderTask.prototype.init 					= function(context)
	{
		var vertPerQuad = 4;
		var vertSize = tomahawk_ns.DefaultShader.VERTEX_SIZE;
		var numIndices = 6;
		
		var verticesSize = this._maxSpritePerSession * vertPerQuad * vertSize;
		var indicesSize = this._maxSpritePerSession * numIndices;
		
		var i = 0;
		var j = 0;
		var max = indicesSize;
		
		this.context = context;
		
		this._vertexArray = new Float32Array(verticesSize);
		this._indexArray = new Uint16Array(indicesSize);
		
		this._vertexBuffer = context.createBuffer();
		this._indexBuffer = context.createBuffer();
		
		for( i = 0; i < indicesSize; i+=6 )
		{
			this._indexArray[i+0] = 0+j;
			this._indexArray[i+1] = 1+j;
			this._indexArray[i+2] = 2+j;
			this._indexArray[i+3] = 1+j;
			this._indexArray[i+4] = 2+j;
			this._indexArray[i+5] = 3+j;
			j+=4;
		}
		
		
		context.bindBuffer(context.ARRAY_BUFFER, this._vertexBuffer);
		context.bufferData(context.ARRAY_BUFFER, this._vertexArray, context.DYNAMIC_DRAW );
		
		context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this._indexBuffer );
		context.bufferData(context.ELEMENT_ARRAY_BUFFER, this._indexArray, context.STATIC_DRAW);
	};
	
	RenderTask.prototype.start 					= function(projectionVector)
	{
		var context = this.context;
		var shader = new tomahawk_ns.DefaultShader();
		
		this._numQuads = 0;
		this.counter = 0;
		
		this.currentShader = shader;
		shader.init(this.context);
		context.uniform2f( this.currentShader.projectionPointer, projectionVector.x, projectionVector.y );
	};
	
	RenderTask.prototype.end 					= function()
	{
		this.flush();
	};
	
	
	RenderTask.prototype.renderToTexture 		= function(quad, transformMatrix, width, height)
	{
		var ctx = this.context;
		var texture = ctx.createTexture();
		var frameBuffer = ctx.createFramebuffer();
		var renderBuffer = ctx.createRenderbuffer();
		
		ctx.bindFramebuffer(ctx.FRAMEBUFFER, frameBuffer);
		
		ctx.bindTexture(ctx.TEXTURE_2D, texture);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_NEAREST);
		ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, width, height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null)
		
		ctx.bindRenderbuffer(ctx.RENDERBUFFER, renderBuffer);
		ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, width, height);
		
		ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, texture, 0);
		ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, renderBuffer);
		
		quad.draw(this, transformMatrix);
		
		ctx.bindTexture(ctx.TEXTURE_2D, texture);
		ctx.generateMipmap(ctx.TEXTURE_2D);
		
		ctx.bindTexture(ctx.TEXTURE_2D, null);
		ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
		ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
		
		return texture;
	};
	
	RenderTask.prototype.getPixels 				= function(quad, transformMatrix, width, height)
	{
		var ctx = this.context;
		var texture = ctx.createTexture();
		var frameBuffer = ctx.createFramebuffer();
		var renderBuffer = ctx.createRenderbuffer();
		var pixels = new Uint8Array(width * height * 4);
		
		ctx.bindFramebuffer(ctx.FRAMEBUFFER, frameBuffer);
		
		ctx.bindTexture(ctx.TEXTURE_2D, texture);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_NEAREST);
		ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, width, height, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null)
		
		ctx.bindRenderbuffer(ctx.RENDERBUFFER, renderBuffer);
		ctx.renderbufferStorage(ctx.RENDERBUFFER, ctx.DEPTH_COMPONENT16, width, height);
		
		ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, texture, 0);
		ctx.framebufferRenderbuffer(ctx.FRAMEBUFFER, ctx.DEPTH_ATTACHMENT, ctx.RENDERBUFFER, renderBuffer);
		
		ctx.bindTexture(ctx.TEXTURE_2D, texture);
		ctx.generateMipmap(ctx.TEXTURE_2D);
		
		quad.draw(this, transformMatrix);
		
		ctx.readPixels(0,0,width,height,ctx.RGBA, ctx.UNSIGNED_BYTE,pixels);
		
		ctx.bindTexture(ctx.TEXTURE_2D, null);
		ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
		ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
		
		return pixels;
	};
	
	RenderTask.prototype.flush 					= function()
	{
		var context = this.context;		
		
		if( this._numQuads == 0 )
			return;
		
		context.activeTexture(context.TEXTURE0);
		context.bindTexture(context.TEXTURE_2D, this._currentTexture.getGLTexture(context));
			
		if( this._numQuads > this._maxSpritePerSession >> 1 )
		{
			context.bufferSubData(context.ARRAY_BUFFER, 0, this._vertexArray);
		}
		else
		{
			var view = this._vertexArray.subarray(0, this._numQuads * 4 * tomahawk_ns.DefaultShader.VERTEX_SIZE);
			context.bufferSubData(context.ARRAY_BUFFER, 0, view);
		}
		
		//
		context.drawElements(context.TRIANGLES, this._numQuads * 6, context.UNSIGNED_SHORT, 0 );

		this.counter++;
		this._numQuads = 0;
	}
	
	RenderTask.prototype.batchQuad 				= function(quad, transformMatrix)
	{
		//var m = quad.concatenedMatrix;
		var m = transformMatrix;
		var x = 0;
		var y = 0;
		var a = m.a;
		var b = m.b;
		var c = m.c;
		var d = m.d;
		var width = quad.width;
		var height = quad.height;
		var tx = m.tx;
		var ty = m.ty;
		var i = 0;
		var tint = quad.color;
		var alpha = quad.alpha;
		var texture = quad.texture;
		var uvs = texture.uvs;
		var index = 0;
		var vertices = this._vertexArray;
		var context = this.context;
		
		if( this._currentTexture == null 			|| 
			this._currentTexture.id != texture.id 	|| 
			this._numQuads >= this._maxSpritePerSession 
		)
		{
			this._currentTexture = texture;
			this.flush();
		}
		
		index = this._numQuads * 4 * tomahawk_ns.DefaultShader.VERTEX_SIZE;
	
		vertices[index++] = x * a + y * c + tx;
		vertices[index++] = x * b + y * d + ty;
		vertices[index++] = tint;
		vertices[index++] = alpha;
		vertices[index++] = uvs.x1;
		vertices[index++] = uvs.y1;
		
		x = width;
		y = 0.0;
		
		vertices[index++] = x * a + y * c + tx;
		vertices[index++] = x * b + y * d + ty;
		vertices[index++] = tint;
		vertices[index++] = alpha;
		

		vertices[index++] = uvs.x2;
		vertices[index++] = uvs.y2;
		
		x = 0.0;
		y = height;
		
		vertices[index++] = x * a + y * c + tx;
		vertices[index++] = x * b + y * d + ty;
		vertices[index++] = tint;
		vertices[index++] = alpha;
		
		vertices[index++] = uvs.x3;
		vertices[index++] = uvs.y3;
		
		x = width;
		y = height;
		
		
		vertices[index++] = x * a + y * c + tx;
		vertices[index++] = x * b + y * d + ty;
		vertices[index++] = tint;
		vertices[index++] = alpha;
		
		vertices[index++] = uvs.x4;
		vertices[index++] = uvs.y4;
		
		this._numQuads++;
	};
	
	
	tomahawk_ns.RenderTask = RenderTask;
	
})();

	
	
