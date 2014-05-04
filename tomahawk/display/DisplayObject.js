/*
* Visit http://the-tiny-spark.com/tomahawk/ for documentation, updates and examples.
*
* Copyright (c) 2014 the-tiny-spark.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.

* @author The Tiny Spark
*/

(function() {

	/**
	 * @abstract
	 * @class DisplayObject
	 * @memberOf tomahawk_ns
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 * @description The DisplayObject class is the base class for all objects that can be placed on the display list.
	 * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced properties of the object such as its transformation matrix. DisplayObject is an abstract base class; therefore, you cannot call DisplayObject directly. All display objects inherit from the DisplayObject class.
	 **/
	function DisplayObject()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		this.matrix = new tomahawk_ns.Matrix2D();
		this._concatenedMatrix = new tomahawk_ns.Matrix2D();
		this.bounds = new tomahawk_ns.Rectangle();
	}

	Tomahawk.registerClass( DisplayObject, "DisplayObject" );
	Tomahawk.extend( "DisplayObject", "EventDispatcher" );

	/**
	* @member name
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {String}
	* @description Indicates the instance name of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.name 				= null;
	
	/**
	* @member parent
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.DisplayObjectContainer}
	* @description Indicates the DisplayObjectContainer object that contains this display object.
	* @default null
	**/
	DisplayObject.prototype.parent 				= null;
	
	/**
	* @member x
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	DisplayObject.prototype.x 					= 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	DisplayObject.prototype.y 					= 0;
	
	/**
	* @member pivotX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the x coordinate of the DisplayObject instance registration point
	**/
	DisplayObject.prototype.pivotX 				= 0;
	
	/**
	* @member pivotY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the y coordinate of the DisplayObject instance registration point
	**/
	DisplayObject.prototype.pivotY 				= 0;
	
	/**
	* @member skewX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the skew on the x axis of the DisplayObject instance
	**/
	DisplayObject.prototype.skewX 				= 0;
	
	/**
	* @member skewY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the skew on the y axis of the DisplayObject instance
	**/
	DisplayObject.prototype.skewY 				= 0;
	
	/**
	* @member scaleX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the horizontal scale (percentage) of the object as applied from the registration point.
	* @default 1
	**/
	DisplayObject.prototype.scaleX 				= 1;
	
	/**
	* @member scaleY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 1
	* @description Indicates the vertical scale (percentage) of the object as applied from the registration point.
	**/
	DisplayObject.prototype.scaleY 				= 1;
	
	/**
	* @default 0
	* @member width
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the width of the display object, in pixels.
	**/
	DisplayObject.prototype.width 				= 0;
	
	/**
	* @default 0
	* @member height
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the height of the display object, in pixels.
	**/
	DisplayObject.prototype.height 				= 0;
	
	/**
	* @member rotation
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation.
	* @default 0
	**/
	DisplayObject.prototype.rotation 			= 0;
	
	/**
	* @member stage
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Stage}
	* @description The Stage of the display object.
	* @default null
	**/
	DisplayObject.prototype.stage 				= null;
	
	/**
	* @member alpha
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the alpha transparency value of the object specified.
	* @default 1
	**/
	DisplayObject.prototype.alpha 				= 1;
	
	/**
	* @member mouseEnabled
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Specifies whether this object receives mouse, or other user input, messages.
	* @default true
	**/
	DisplayObject.prototype.mouseEnabled 		= true;
	
	/**
	* @member handCursor
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description A Boolean value that indicates whether the pointing hand (hand cursor) appears when the pointer rolls over this sprite
	* @default false
	**/
	DisplayObject.prototype.handCursor 			= false;
	
	/**
	* @member visible
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Whether or not the display object is visible.
	* @default true
	**/
	DisplayObject.prototype.visible 			= true;
	
	/**
	* @member isMask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Defines if the current DisplayObject is masking another one
	* @default false
	**/
	DisplayObject.prototype.isMask				= false;
	
	/**
	* @member filters
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Array}
	* @description An indexed array that contains each filter object currently associated with the display object.
	* @default null
	**/
	DisplayObject.prototype.filters 			= null;
	
	/**
	* @member mask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.DisplayObject}
	* @description The calling display object is masked by the specified mask object.
	* @default null
	**/
	DisplayObject.prototype.mask 				= null;
	
	/**
	* @member matrix
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Matrix2D}
	* @description The transformation matrix of the DisplayObject
	* @default null
	**/
	DisplayObject.prototype.matrix 				= null;
	
	/**
	* @member bounds
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Rectangle}
	* @description Indicates a rectangle that defines the area of the display object relative to his parent coordinate system. You must set the updateNextFrame ( or the autoUpdate ) property to true and call the updateBounds method to actualize this Rectangle.
	* @default null
	**/
	DisplayObject.prototype.bounds 				= null;
	
	/**
	* @member cacheAsBitmap
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description If set to true, the object is caching an internal representation of the display object.
	* @default true
	**/
	DisplayObject.prototype.cacheAsBitmap		= false;
	
	/**
	* @member autoUpdate
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description If set to true, the matrix of the DisplayObject will be computed every frame, if not, the matrix will not change.
	* @default true
	**/
	DisplayObject.prototype.autoUpdate			= true;
	
	/**
	* @member updateNextFrame
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @default true
	* @description If set to true, the transformation matrix will be update at next frame.
	**/
	DisplayObject.prototype.updateNextFrame		= true;
	
	DisplayObject.prototype._concatenedMatrix 	= null;
	DisplayObject.prototype._cache 				= null;
	DisplayObject.prototype._cacheOffsetX 		= 0;
	DisplayObject.prototype._cacheOffsetY 		= 0;
	
	/**
	* @method updateBounds
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Updates the bounds of the current DisplayObject if his updateNextFrame || autoUpdate = true
	**/
	DisplayObject.prototype.updateBounds = function()
	{		
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		var mat = this.matrix;
	
		points.push(mat.transformPoint(0,0));
		points.push(mat.transformPoint(this.width,0));
		points.push(mat.transformPoint(0,this.height));
		points.push(mat.transformPoint(this.width, this.height));
	
		rect.left = 2147483648;
		rect.top = 2147483648;
		rect.bottom = -2147483648;
		rect.right = -2147483648;
	
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
		
		this.bounds = rect;
	};
	
	/**
	* @method setMask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} the new mask of the current DisplayObject
	* @description Defines the DisplayObject passed in param as the mask of the current DisplayObject 
	**/
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

	/**
	* @method updateMatrix
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Updates the matrix of the DisplayObject if his updateNextFrame || autoUpdate = true
	**/
	DisplayObject.prototype.updateMatrix = function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
			
		var mat = this.matrix;
		
		mat.d = mat.a = 1;
		mat.b = mat.c = mat.tx = mat.ty = 0;
		
		
		mat.appendTransform(	this.x, 
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

	/**
	* @description Updates the cache of the DisplayObject instance and returns it.
	* @method updateCache
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @returns {HTMLCanvasElement} the cache canvas of the DisplayObject
	**/
	DisplayObject.prototype.updateCache = function()
	{	
		var buffer = null;
		var context = null;
		var filters = this.filters;
		var i = 0;
		var offX = 0;
		var offY = 0;
		var bounds = this.getBoundingRectIn(this);
		var cacheAsBitmap = this.cacheAsBitmap;
		
		if( this._cache == null )
		{
			buffer = document.createElement("canvas");
		}
		else
		{
			buffer = this._cache;
		}
		
		buffer.width = ( bounds.width < 1 ) ? 1 : bounds.width ;
		buffer.height = ( bounds.height < 1 ) ? 1 : bounds.height ;

		
		offX = bounds.left;
		offY = bounds.top;
		
		context = buffer.getContext("2d");
		
		
		// before drawing filters
		if( filters != null )
		{		
			//i = filters.length;
			//
			//while( --i > -1 )
			//{
				//buffer.width += filters[i].getOffsetX();
				//buffer.height += filters[i].getOffsetY();
			//}
			
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
			this.cacheAsBitmap = false;
			this.draw(context);
			this.cacheAsBitmap = cacheAsBitmap;
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
		return buffer;
	};
	
	/**
	* @method drawComposite
	* @description Draw the DisplayObject instance into the specified context with mask and filters.
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {CanvasRenderingContext2D} drawContext the CanvasRenderingContext2D context on which you want to draw.
	**/
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

	/**
	* @method draw
	* @description Draws the DisplayObject instance into the specified context
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {CanvasRenderingContext2D} drawContext the CanvasRenderingContext2D context on which you want to draw.
	**/
	DisplayObject.prototype.draw = function(context)
	{
	};
	
	/**
	* @method getConcatenedMatrix
	* @description Returns the combined transformation matrixes of the DisplayObject instance and all of its parent objects, back to the stage level.
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Boolean} forceUpdate Forces the update of the current DisplayObject and all his parents
	**/
	DisplayObject.prototype.getConcatenedMatrix = function(forceUpdate)
	{
		var current = this;
		var mat = new tomahawk_ns.Matrix2D();
		
		while( current != null )
		{
			if( forceUpdate == true )
			{
				current.updateNextFrame = true;
				current.updateMatrix();
			}
			mat.prependMatrix(current.matrix );
			current = current.parent;
		}
		
		this._concatenedMatrix = mat;
		return this._concatenedMatrix;
	};

	/**
	* @method localToGlobal
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Number} x
	* @param {Number} y
	* @returns {tomahawk_ns.Point}
	* @description Converts the point object specified by x,y parameters from the DisplayObject's (local) coordinates to the Stage (global) coordinates.
	**/
	DisplayObject.prototype.localToGlobal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix();
		var pt = matrix.transformPoint(x,y);
		return new tomahawk_ns.Point(pt.x,pt.y);
	};

	/**
	* @method globalToLocal
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Number} x
	* @param {Number} y
	* @returns {tomahawk_ns.Point}
	* @description Converts the point object specified by x,y parameters from the Stage (global) coordinates to the DisplayObject's (local) coordinates.
	**/
	DisplayObject.prototype.globalToLocal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix().clone().invert();
		var pt = matrix.transformPoint(x,y);
		return new tomahawk_ns.Point(pt.x,pt.y);
	};

	/**
	* @method hitTest
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Number} x
	* @param {Number} y
	* @returns {Boolean}
	* @description Evaluates the DisplayObject instance to see if it overlaps or intersects with the point specified by the x and y parameters. The x and y parameters specify a point in the coordinate space of the Stage, not the display object container that contains the display object (unless that display object container is the Stage).
	**/
	DisplayObject.prototype.hitTest = function(x,y)
	{		
		var pt1 = this.globalToLocal(x,y);
		
		if( pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height )
			return false;
		else
			return true;
	};

	/**
	* @method isChildOf
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} obj
	* @returns {Boolean}
	* @description Indicates if the DisplayObject "obj" is a child of the DisplayObject instance
	**/
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

	/**
	* @method getBoundingRectIn
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} spaceCoordinates
	* @returns {tomahawk_ns.Rectangle}
	* @description Returns a rectangle that defines the area of the display object relative to the coordinate system of the spaceCoordinates object.
	**/
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
		
		rect.left = 2147483648;
		rect.top = 2147483648;
		rect.bottom = -2147483648;
		rect.right = -2147483648;
		
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

	/**
	* @method snapshot
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.Matrix2D} [transformMatrix=undefined] The transformation matrix to apply
	* @returns {HTMLCanvasElement}
	* @description Returns a snapshot of the DisplayObject instance, applying the transformMatrix
	**/
	DisplayObject.prototype.snapshot = function(transformMatrix)
	{
		var mat = transformMatrix || new tomahawk_ns.Matrix2D();
		var oldMat = this.matrix.clone();
		
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		this.matrix = mat;
		
		this.updateNextFrame = true;
		this.updateBounds();
		
		canvas.width = this.bounds.width;
		canvas.height = this.bounds.height;
		
		context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		this.draw(context);
		
		this.matrix = oldMat;
		this.updateNextFrame = true;
		this.updateBounds();
		
		return canvas;
	};
	
	/**
	* @method destroy
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Kill the DisplayObject instance and free all his ressources
	**/
	DisplayObject.prototype.destroy = function()
	{
		this._cache = null;
		this.setMask(null);
		
		if( this.parent != null )
		{
			this.parent.removeChild(this);
		}
		
		tomahawk_ns.EventDispatcher.prototype.destroy.apply(this);
	};
	
	tomahawk_ns.DisplayObject = DisplayObject;

})();



