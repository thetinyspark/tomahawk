/**
 * ...
 * @author Thot
*/

(function() {

	
	function DisplayObject()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		this.matrix = new tomahawk_ns.Matrix2D();
		this._concatenedMatrix = new tomahawk_ns.Matrix2D();
		this._bounds = new tomahawk_ns.Rectangle();
	}

	Tomahawk.registerClass( DisplayObject, "DisplayObject" );
	Tomahawk.extend( "DisplayObject", "EventDispatcher" );

	DisplayObject.prototype.name 				= null;
	DisplayObject.prototype.parent 				= null;
	DisplayObject.prototype.x 					= 0;
	DisplayObject.prototype.y 					= 0;
	DisplayObject.prototype.pivotX 				= 0;
	DisplayObject.prototype.pivotY 				= 0;
	DisplayObject.prototype.skewX 				= 0;
	DisplayObject.prototype.skewY 				= 0;
	DisplayObject.prototype.scaleX 				= 1;
	DisplayObject.prototype.scaleY 				= 1;
	DisplayObject.prototype.width 				= 0;
	DisplayObject.prototype.height 				= 0;
	DisplayObject.prototype.rotation 			= 0;

	DisplayObject.prototype.alpha 				= 1;
	DisplayObject.prototype.mouseEnabled 		= false;
	DisplayObject.prototype.visible 			= true;
	DisplayObject.prototype.isMask				= false;
	DisplayObject.prototype.filters 			= null;
	DisplayObject.prototype.mask 				= null;
	DisplayObject.prototype.matrix 				= null;
	DisplayObject.prototype._bounds 			= null;
	DisplayObject.prototype._cache 				= null;
	DisplayObject.prototype._concatenedMatrix 	= null;
	DisplayObject.prototype.cacheAsBitmap		= false;
	DisplayObject.prototype.autoUpdate			= true;
	DisplayObject.prototype.updateNextFrame		= true;

	DisplayObject._toRadians = Math.PI / 180;

	DisplayObject.prototype.setMask = function( mask )
	{
		if( this.mask != null )
		{
			this.mask.isMask = false;
		}
		
		this.mask = mask;
		
		if( this.mask != null )
		{
			this.mask.isMask = true;
		}
	};

	DisplayObject.prototype.updateMatrix = function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
		
		this.matrix.d = this.matrix.a = 1;
		this.matrix.b = this.matrix.c = this.matrix.tx = this.matrix.ty = 0;
		this.matrix.appendTransform(	this.x, 
										this.y, 
										this.scaleX, 
										this.scaleY, 
										this.rotation, 
										this.skewX, 
										this.skewY, 
										this.pivotX, 
										this.pivotY);
										
		this.updateNextFrame = false;
	};

	DisplayObject.prototype.updateCache = function()
	{	
		var buffer = null;
		var context = null;
		var filters = this.filters;
		var bounds = this.getBoundingRect();
		var i = 0;
		
		buffer = document.createElement("canvas");
		buffer.width = bounds.width;
		buffer.height = bounds.height;
		
		context = buffer.getContext("2d");
		
		context.save();
		context.globalAlpha = this.alpha;
		this.draw(context);
		context.restore();
		
		if( filters != null )
		{		
			i = filters.length;
			
			while( --i > -1 )
			{
				filters[i].apply(buffer,context,this);
			}
		}
		
		this._cache = buffer;
	};

	DisplayObject.prototype.drawComposite = function(drawContext)
	{
		if( this._cache == null || this.cacheAsBitmap == false)
			this.updateCache();
			
		var buffer = this._cache;
		var context = null;
		var mat = null;
		var i = 0;
		var mask = this.mask;
		
		if( mask != null )
		{
			buffer = document.createElement("canvas");
			buffer.width = this._cache.width;
			buffer.height = this._cache.height;
			context = buffer.getContext("2d");
			
			mat = mask.getConcatenedMatrix().prependMatrix( this.getConcatenedMatrix().invert() );
			context.save();

			context.globalAlpha = mask.alpha;
			context.setTransform(	mat.a,
									mat.b,
									mat.c,
									mat.d,
									mat.tx,
									mat.ty);
										
			mask.draw(context);
			
			context.restore();
			context.save();
			context.globalCompositeOperation = "source-in";
			context.drawImage(this._cache, 0, 0, this._cache.width, this._cache.height );
			context.restore();
		}
		
		drawContext.drawImage(buffer,0, 0, buffer.width, buffer.height );	
	};

	DisplayObject.prototype.draw = function(context)
	{
		return;
	};

	DisplayObject.prototype.getConcatenedMatrix = function()
	{
		this.updateNextFrame = true;
		this.updateMatrix();
		var current = this.parent;
		var mat = this.matrix.clone();
		
		while( current != null )
		{
			mat.prependMatrix(current.matrix );
			current = current.parent;
		}
		
		this._concatenedMatrix = mat;
		return this._concatenedMatrix;
	};

	DisplayObject.prototype.localToGlobal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix();
		var pt = matrix.transformPoint(x,y);
		return pt;
	};

	DisplayObject.prototype.globalToLocal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix().clone().invert();
		var pt = matrix.transformPoint(x,y);
		return pt;
	};

	DisplayObject.prototype.hitTest = function(x,y)
	{		
		var pt1 = this.globalToLocal(x,y);
		
		if( pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height )
			return false;
		else
			return true;
	};

	DisplayObject.prototype.isChildOf = function( obj )
	{
		var curParent = this.parent;
		while( curParent != null )
		{
			if( curParent == obj )
				return true;
				
			curParent = curParent.parent;
		}
		
		return false;
	};

	DisplayObject.prototype.getBoundingRect = function()
	{
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		points.push(this.localToGlobal(0,0));
		points.push(this.localToGlobal(this.width,0));
		points.push(this.localToGlobal(0,this.height));
		points.push(this.localToGlobal(this.width, this.height));
		
		rect.left = 0xFFFFFFFF;
		rect.top = 0xFFFFFFFF;
		
		var i = points.length;
		while( --i > -1 )
		{
			rect.left = ( points[i].x < rect.left ) ? points[i].x : rect.left;
			rect.right = ( points[i].x > rect.right ) ? points[i].x : rect.right;
			rect.top = ( points[i].y < rect.top ) ? points[i].y : rect.top;
			rect.bottom = ( points[i].y > rect.bottom ) ? points[i].y : rect.bottom;
		}
		
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		this._bounds = rect;
		return rect;
	};

	tomahawk_ns.DisplayObject = DisplayObject;

})();



