/**
 * ...
 * @author Thot
*/

function DisplayObject()
{
	EventDispatcher.apply(this);
	this._matrix = new Matrix2D();
}

Tomahawk.registerClass( DisplayObject, "DisplayObject" );
Tomahawk.extend( "DisplayObject", "EventDispatcher" );

DisplayObject.prototype.name = null;
DisplayObject.prototype.parent = null;
DisplayObject.prototype.x = 0;
DisplayObject.prototype.y = 0;
DisplayObject.prototype.pivotX = 0;
DisplayObject.prototype.pivotY = 0;
DisplayObject.prototype.skewX = 0;
DisplayObject.prototype.skewY = 0;
DisplayObject.prototype.scaleX = 1;
DisplayObject.prototype.scaleY = 1;
DisplayObject.prototype.width = 0;
DisplayObject.prototype.height = 0;
DisplayObject.prototype.rotation = 0;
DisplayObject.prototype.alpha = 1;
DisplayObject.prototype.mouseEnabled = false;
DisplayObject.prototype.visible = true;
DisplayObject.prototype.handCursor = false;
DisplayObject.prototype._matrix = null;
DisplayObject.prototype._cache = null;
DisplayObject.prototype._update = false;
DisplayObject.prototype.filters = null;

DisplayObject._toRadians = Math.PI / 180;

DisplayObject.prototype._applyFilters = function()
{
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = this.width;
	canvas.height = this.height;
	
	this.draw(context);
	var i = 0;
	var max = this.filters.length;
	var filter = null;
	for( ; i < max; i++ )
	{
		filter = this.filters[i];
		filter.apply(canvas,context);
	}
	
	return canvas;
};

DisplayObject.prototype.render = function( context, transformMatrix )
{	
	
	if( this.visible == false )
		return;
		
	var mat = this._matrix;
		
	context.save();
	
	transformMatrix.save();
	transformMatrix.appendTransform(	this.x, 
										this.y, 
										this.scaleX, 
										this.scaleY, 
										this.rotation, 
										this.skewX, 
										this.skewY, 
										this.pivotX, 
										this.pivotY);
									
	mat.a = transformMatrix.a;
	mat.b = transformMatrix.b;
	mat.c = transformMatrix.c;
	mat.d = transformMatrix.d;
	mat.tx = transformMatrix.tx;
	mat.ty = transformMatrix.ty;

	if( this._cache == null )
	{
		context.globalAlpha = this.alpha;
		context.setTransform(	mat.a,
								mat.b,
								mat.c,
								mat.d,
								mat.tx,
								mat.ty);
		
		if( this.filters != null )
		{
			var canvas = this._applyFilters();
			context.drawImage(canvas, 0, 0, canvas.width, canvas.height );
		}
		else
		{
			this.draw(context,transformMatrix);
		}
	}
	else
	{
		context.drawImage(this._cache,0,0,this._cache.width, this._cache.height);
	}
	
	
	transformMatrix.restore();
	context.restore();
};


DisplayObject.prototype.forceRefresh = function()
{
	var current = this;
	
	while( current != null )
	{
		if( current._cache != null )
			current.setCache(true);
			
		current = current.parent;
	}
};

DisplayObject.prototype.draw = function(context)
{
	return;
}

DisplayObject.prototype.setCache = function( value )
{
	if( value == true )
	{
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var stageCanvas = Stage.getInstance().getCanvas();
		canvas.width = stageCanvas.width;
		canvas.height = stageCanvas.height;
		this.draw(context);
		
		this._cache = canvas;
	}
	else
	{
		this._cache = null;
	}
};

DisplayObject.prototype.getConcatenedMatrix = function()
{
	var current = this;
	var mat = new Matrix2D();
	
	while( current != null ){
	
		mat.prependTransform(current.x, 
					current.y, 
					current.scaleX, 
					current.scaleY, 
					current.rotation,
					current.skewX,
					current.skewY,
					current.pivotX,
					current.pivotY);
					
		current = current.parent;
	}
	
	return mat;
};

DisplayObject.prototype.localToGlobal = function(x,y)
{
	var matrix = this.getConcatenedMatrix();
	var pt = matrix.transformPoint(x,y);
	return pt;
};

DisplayObject.prototype.globalToLocal = function(x,y)
{
	var matrix = this.getConcatenedMatrix().invert();
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
	var matrix = this._matrix;
	var pt1 = matrix.transformPoint(0, 0);
	var pt2 = matrix.transformPoint(this.width,this.height);
	var rect = new Object();
	rect.left = pt1.x;
	rect.right = pt2.x;
	rect.top = pt1.y;
	rect.bottom = pt2.y;
	rect.x = pt1.x;
	rect.y = pt1.y;
	rect.width = pt2.x - pt1.x;
	rect.height = pt2.y - pt1.y;
	return rect;
};





