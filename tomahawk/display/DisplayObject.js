/**
 * @author The Tiny Spark
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
	DisplayObject.prototype.stage 				= null;

	DisplayObject.prototype.alpha 				= 1;
	DisplayObject.prototype.mouseEnabled 		= false;
	DisplayObject.prototype.handCursor 			= false;
	DisplayObject.prototype.visible 			= true;
	DisplayObject.prototype.isMask				= false;
	DisplayObject.prototype.filters 			= null;
	DisplayObject.prototype.mask 				= null;
	DisplayObject.prototype.matrix 				= null;
	DisplayObject.prototype._bounds 			= null;
	DisplayObject.prototype._concatenedMatrix 	= null;
	DisplayObject.prototype.cacheAsBitmap		= false;
	DisplayObject.prototype.autoUpdate			= true;
	DisplayObject.prototype.updateNextFrame		= true;
	
	DisplayObject.prototype._cache 				= null;
	DisplayObject.prototype._cacheOffsetX 		= 0;
	DisplayObject.prototype._cacheOffsetY 		= 0;
	

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
		var i = 0;
		var offX = 0;
		var offY = 0;
		var bounds = this.getBoundingRectIn(this);
		buffer = document.createElement("canvas");
		buffer.width = ( bounds.width < 1 ) ? 1 : bounds.width ;
		buffer.height = ( bounds.height < 1 ) ? 1 : bounds.height ;
		
		offX = bounds.left;
		offY = bounds.top;
		
		context = buffer.getContext("2d");
		
		
		// before drawing filters
		if( filters != null )
		{		
			i = filters.length;
			
			while( --i > -1 )
			{
				if( filters[i].type == tomahawk_ns.PixelFilter.BEFORE_DRAWING_FILTER )
					filters[i].apply(buffer,context,this);
			}
		}
		
		
		context.save();
			context.globalAlpha = this.alpha;
			context.translate( -offX, -offY );
			this.draw(context);
		context.restore();
		
		// after drawing filters
		if( filters != null )
		{		
			i = filters.length;
			
			while( --i > -1 )
			{
				if( filters[i].type == tomahawk_ns.PixelFilter.AFTER_DRAWING_FILTER )
					filters[i].apply(buffer,context,this);
			}
		}
		
		this._cache = buffer;
		this._cacheOffsetX = offX;
		this._cacheOffsetY = offY;
	};

	DisplayObject.prototype.drawComposite = function(drawContext)
	{
		if( this._cache == null || this.cacheAsBitmap == false )
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
				context.drawImage(	this._cache, this._cacheOffsetX , this._cacheOffsetY , this._cache.width , this._cache.height );
			context.restore();
			
			drawContext.drawImage(buffer,0, 0, buffer.width, buffer.height );
		}
		else
		{
			drawContext.drawImage(	buffer, this._cacheOffsetX, this._cacheOffsetY, buffer.width, buffer.height);	
		}
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
			current.updateNextFrame = true;
			current.updateMatrix();
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
		return new tomahawk_ns.Point(pt.x,pt.y);
	};

	DisplayObject.prototype.globalToLocal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix().clone().invert();
		var pt = matrix.transformPoint(x,y);
		return new tomahawk_ns.Point(pt.x,pt.y);
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

	DisplayObject.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		this.updateNextFrame = true;
		this.updateMatrix();
		
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		var pt1 = this.localToGlobal(0,0);
		var pt2 = this.localToGlobal(this.width,0);
		var pt3 = this.localToGlobal(0,this.height);
		var pt4 = this.localToGlobal(this.width,this.height);
		
		pt1 = spaceCoordinates.globalToLocal(pt1.x,pt1.y);
		pt2 = spaceCoordinates.globalToLocal(pt2.x,pt2.y);
		pt3 = spaceCoordinates.globalToLocal(pt3.x,pt3.y);
		pt4 = spaceCoordinates.globalToLocal(pt4.x,pt4.y);
		
		points.push(pt1,pt2,pt3,pt4);
		
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
	
	DisplayObject.prototype.getBoundingRect = function()
	{
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		
		this.updateNextFrame = true;
		this.updateMatrix();
		
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

	DisplayObject.prototype.getNestedChildren = function()
	{
		return new Array(this);
	}
	
	tomahawk_ns.DisplayObject = DisplayObject;

})();



