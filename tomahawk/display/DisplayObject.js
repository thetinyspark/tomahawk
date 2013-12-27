/**
 * ...
 * @author Thot
*/

function DisplayObject()
{
	EventDispatcher.apply(this);
	this._matrix = new Matrix2D();
	this._concatenedMatrix = new Matrix2D();
	this._bounds = new Rectangle();
}

Tomahawk.registerClass( DisplayObject, "DisplayObject" );
Tomahawk.extend( "DisplayObject", "EventDispatcher" );

DisplayObject.prototype.name 			= null;
DisplayObject.prototype.parent 			= null;
DisplayObject.prototype._x 				= 0;
DisplayObject.prototype._y 				= 0;
DisplayObject.prototype._pivotX 		= 0;
DisplayObject.prototype._pivotY 		= 0;
DisplayObject.prototype._skewX 			= 0;
DisplayObject.prototype._skewY 			= 0;
DisplayObject.prototype._scaleX 		= 1;
DisplayObject.prototype._scaleY 		= 1;
DisplayObject.prototype._width 			= 0;
DisplayObject.prototype._height 		= 0;
DisplayObject.prototype._rotation 		= 0;

DisplayObject.prototype.alpha 			= 1;
DisplayObject.prototype.mouseEnabled 	= false;
DisplayObject.prototype.visible 		= true;
DisplayObject.prototype.handCursor 		= false;
DisplayObject.prototype.isMask			= false;
DisplayObject.prototype.filters 		= null;
DisplayObject.prototype.mask 			= null;
DisplayObject.prototype.updateNextFrame = true;
DisplayObject.prototype._matrix 		= null;
DisplayObject.prototype._bounds 		= null;
DisplayObject.prototype._outOfScreen 	= false;
DisplayObject.prototype._concatenedMatrix = null;

DisplayObject._toRadians = Math.PI / 180;


DisplayObject.prototype._update = function()
{
	var current = this;
	
	this._matrix.identity();
	this._matrix.appendTransform(	this._x, 
									this._y, 
									this._scaleX, 
									this._scaleY, 
									this._rotation, 
									this._skewX, 
									this._skewY, 
									this._pivotX, 
									this._pivotY);
									
									
	this._concatenedMatrix.identity();
	
	if( this.parent == null )
	{
		this._concatenedMatrix = this._matrix.clone();
	}
	else
	{
		this._concatenedMatrix = this.parent.getMatrix().clone().appendTransform(	this._x, 
																					this._y, 
																					this._scaleX, 
																					this._scaleY, 
																					this._rotation, 
																					this._skewX, 
																					this._skewY, 
																					this._pivotX, 
																					this._pivotY );
	}
	
	this._bounds = this.getBoundingRect();
	
	if( this._bounds.right < 0|| this._bounds.left > 800 || this._bounds.top > 600 || this._bounds.bottom < 0 )
	{
		this._outOfScreen = true;
	}
	else
	{
		this._outOfScreen = true;
	}
};

DisplayObject.prototype.setMask = function( mask )
{
	if( this._mask != null )
	{
		this._mask.isMask = false;
	}
	
	this._mask = mask;
	
	if( this._mask != null )
	{
		this._mask.isMask = true;
	}
};

DisplayObject.prototype.render = function( context )
{	
	if( this.updateNextFrame == true )
	{
		this._update();
		this.updateNextFrame = false;
	}
	
	if( this.visible == false || this._outOfScreen == true )
		return;
		
	var mat = this._concatenedMatrix;
	var cache = null;
	var redraw = false;
	
	context.save();
	
	if( this.isMask == true )
	{
		return;
	}
	
	if( this._mask != null || this.filters != null )
	{
		cache = DrawUtils.getCanvas();
		
		if( this._mask != null )
		{
			DrawUtils.drawMask(cache,this,this._mask);
		}
		
		if( this.filters != null )
		{
			DrawUtils.drawFilters(cache,this)
		}
	}
	
	if( cache == null )
	{
		context.setTransform(	mat.a,
								mat.b,
								mat.c,
								mat.d,
								mat.tx,
								mat.ty);				
		this.draw(context);
	}
	else
	{
		context.drawImage(cache,0,0,cache.width,cache.height);
		DrawUtils.recycleCanvas(cache);
	}

	context.restore();
};

DisplayObject.prototype.draw = function(context)
{
	return;
};

DisplayObject.prototype.getMatrix = function()
{
	return this._matrix;
};

DisplayObject.prototype.getConcatenedMatrix = function()
{
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
	var rect = new Rectangle();
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
	return rect;
};



DisplayObject.prototype.getX = function()
{
	return this._x;
};

DisplayObject.prototype.getY = function()
{
	return this._y;
};

DisplayObject.prototype.getWidth = function()
{
	return this._width;
};

DisplayObject.prototype.getHeight = function()
{
	return this._height;
};

DisplayObject.prototype.getPivotX = function()
{
	return this._pivotX;
};

DisplayObject.prototype.getPivotY = function()
{
	return this._pivotY;
};

DisplayObject.prototype.getScaleX = function()
{
	return this._scaleX;
};

DisplayObject.prototype.getScaleY = function()
{
	return this._scaleY;
};

DisplayObject.prototype.getSkewX = function()
{
	return this._skewX;
};

DisplayObject.prototype.getSkewY = function()
{
	return this._skewY;
};

DisplayObject.prototype.getRotation = function()
{
	return this._rotation;
};


DisplayObject.prototype.setX = function(value)
{
	this._x = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setY = function(value)
{
	this._y = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setWidth = function(value)
{
	this._width = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setHeight = function(value)
{
	this._height = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setPivotX = function(value)
{
	this._pivotX = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setPivotY = function(value)
{
	this._pivotY = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setScaleX = function(value)
{
	this._scaleX = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setScaleY = function(value)
{
	this._scaleY = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setSkewX = function(value)
{
	this._skewX = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setSkewY = function(value)
{
	this._skewY = value;
	this.updateNextFrame = true;
};

DisplayObject.prototype.setRotation = function(value)
{
	this._rotation = value;
	this.updateNextFrame = true;
};


Object.defineProperty(DisplayObject.prototype, "x", {	get: DisplayObject.prototype.getX,
														set: DisplayObject.prototype.setX, 
														enumerable: true });
														
Object.defineProperty(DisplayObject.prototype, "y", {	get: DisplayObject.prototype.getY,
														set: DisplayObject.prototype.setY, 
														enumerable: true });
														
Object.defineProperty(DisplayObject.prototype, "width", {	get: DisplayObject.prototype.getWidth,
															set: DisplayObject.prototype.setWidth, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "height", {	get: DisplayObject.prototype.getHeight,
															set: DisplayObject.prototype.setHeight, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "skewX", {	get: DisplayObject.prototype.getSkewX,
															set: DisplayObject.prototype.setSkewX, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "skewY", {	get: DisplayObject.prototype.getSkewY,
															set: DisplayObject.prototype.setSkewY, 
															enumerable: true });

Object.defineProperty(DisplayObject.prototype, "scaleX", {	get: DisplayObject.prototype.getScaleX,
															set: DisplayObject.prototype.setScaleX, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "scaleY", {	get: DisplayObject.prototype.getScaleY,
															set: DisplayObject.prototype.setScaleY, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "pivotX", {	get: DisplayObject.prototype.getPivotX,
															set: DisplayObject.prototype.setPivotX, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "pivotY", {	get: DisplayObject.prototype.getPivotY,
															set: DisplayObject.prototype.setPivotY, 
															enumerable: true });
															
Object.defineProperty(DisplayObject.prototype, "rotation", {get: DisplayObject.prototype.getRotation,
															set: DisplayObject.prototype.setRotation, 
															enumerable: true });





