(function() {
	
	if( Tomahawk.glEnabled == false )
		return;
	
	tomahawk_ns.DisplayObject._buffer2D						= null;
	tomahawk_ns.DisplayObject.prototype.color 				= null;
	tomahawk_ns.DisplayObject.prototype.drawComposite 		= function(){};
	tomahawk_ns.DisplayObject.prototype.snapshot 			= function(transformMatrix){};
	tomahawk_ns.DisplayObject.prototype.updateCache 		= function(){};
	tomahawk_ns.DisplayObject.prototype.draw 				= function( renderTask ){};
	tomahawk_ns.DisplayObject.prototype.updateNextFrame		= true;
	tomahawk_ns.DisplayObject.prototype.autoUpdate			= false;
	
	
	tomahawk_ns.DisplayObject.prototype._x 							= 0;
	tomahawk_ns.DisplayObject.prototype._y 							= 0;
	tomahawk_ns.DisplayObject.prototype._pivotX 					= 0;
	tomahawk_ns.DisplayObject.prototype._pivotY 					= 0;
	tomahawk_ns.DisplayObject.prototype._skewX 						= 0;
	tomahawk_ns.DisplayObject.prototype._skewY 						= 0;
	tomahawk_ns.DisplayObject.prototype._scaleX 					= 1;
	tomahawk_ns.DisplayObject.prototype._scaleY 					= 1;
	tomahawk_ns.DisplayObject.prototype._width 						= 0;
	tomahawk_ns.DisplayObject.prototype._height 					= 0;
	tomahawk_ns.DisplayObject.prototype._rotation 					= 0;
	
	
	// reste à refaire le pixel perfect
	tomahawk_ns.DisplayObject.prototype.hitTest				= function(x,y)
	{
		var pt1 	= this.globalToLocal(x,y);
		var buffer 	= null;
		var mat 	= null;
		var pixels 	= null;
		var task 	= null;
		
		if( pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height )
			return false;
			
		if( this.pixelPerfect == false )
			return true;
		
		//mat = this.matrix.clone();
		//mat.identity();
		//mat.tx = -pt1.x;
		//mat.ty = -pt1.y;
		
		//
		//task = this.stage.getRenderTask();
		//pixels = task.getPixels(this, mat, this.width, this.height);
		
		
		//console.log(pixels);
		//pixels = context.getImageData(0,0,1,1).data;
		//
		//return ( pixels[3] > this.pixelAlphaLimit );
		
		
		return true;
	};
	
	tomahawk_ns.DisplayObject.prototype.updateMatrix 		= function()
	{
		var mat 	= this.matrix;
		var cmat	= this._concatenedMatrix;
		var pmat	= null;
		
		if( this.autoUpdate == true || this.updateNextFrame == true )
		{
			mat 	= this.matrix;
			mat.d 	= mat.a = 1;
			mat.b 	= mat.c = mat.tx = mat.ty = 0;
			
			
			mat.appendTransform(	this._x + this._pivotX, 
									this._y + this._pivotY, 
									this._scaleX, 
									this._scaleY, 
									this._rotation, 
									this._skewX, 
									this._skewY, 
									this._pivotX, 
									this._pivotY);
		
		}
		
		
		cmat.a 	= mat.a;
		cmat.b 	= mat.b;
		cmat.c 	= mat.c;
		cmat.d 	= mat.d;
		cmat.tx = mat.tx;
		cmat.ty = mat.ty;
		
		if( this.parent != null )
		{
			pmat = this.parent._concatenedMatrix;
			cmat.prepend(pmat.a, pmat.b, pmat.c, pmat.d, pmat.tx, pmat.ty);
		}
		
		this.updateNextFrame = false;
	};
	
	tomahawk_ns.DisplayObject.prototype.getConcatenedMatrix = function()
	{
		return this._concatenedMatrix;
	};
	
	
	
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"x", 
		{
			get: function(){return this._x;},
			set: function(value)
			{
				this._x = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"y", 
		{
			get: function(){return this._y;},
			set: function(value)
			{
				this._y = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"width", 
		{
			get: function(){return this._width;},
			set: function(value)
			{
				this._width = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"height", 
		{
			get: function(){return this._height;},
			set: function(value)
			{
				this._height = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"rotation", 
		{
			get: function(){return this._rotation;},
			set: function(value)
			{
				this._rotation = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"pivotX", 
		{
			get: function(){return this._pivotX;},
			set: function(value)
			{
				this._pivotX = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"pivotY", 
		{
			get: function(){return this._pivotY;},
			set: function(value)
			{
				this._pivotY = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"scaleX", 
		{
			get: function(){return this._scaleX;},
			set: function(value)
			{
				this._scaleX = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"scaleY", 
		{
			get: function(){return this._scaleY;},
			set: function(value)
			{
				this._scaleY = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"skewY", 
		{
			get: function(){return this._skewY;},
			set: function(value)
			{
				this._skewY = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
	Object.defineProperty(
		tomahawk_ns.DisplayObject.prototype, 
		"skewX", 
		{
			get: function(){return this._skewX;},
			set: function(value)
			{
				this._skewX = value; 
				this.updateNextFrame = true;
			}
		}
	);
	
})();