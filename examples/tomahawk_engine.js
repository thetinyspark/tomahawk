

/**
 * @author The Tiny Spark
 */
var tomahawk_ns = new Object();

function Tomahawk(){}

Tomahawk._classes = new Object();
Tomahawk._extends = new Array();
	

	Tomahawk._funcTab = null;

	Tomahawk.registerClass = function( classDef, className )
	{
		Tomahawk._classes[className] = classDef;
	};

	Tomahawk.extend = function( p_child, p_ancestor )
	{
		Tomahawk._extends.push({"child":p_child,"ancestor":p_ancestor,"done":false});
	};

	Tomahawk.run = function()
	{
		var obj = null;
		var i = 0;
		var max = Tomahawk._extends.length;
		
		Tomahawk._funcTab = new Object();
		
		for (i = 0; i < max; i++ )
		{
			obj = Tomahawk._extends[i];
			Tomahawk._inherits( obj );
		}
	}
	
	Tomahawk._getParentClass = function(child)
	{
		var i = 0;
		var max = Tomahawk._extends.length;
		
		for (i = 0; i < max; i++ )
		{
			obj = Tomahawk._extends[i];
			if( obj["child"] == child )
				return obj;
		}
		return null;
	};
	
	Tomahawk._inherits = function( obj )
	{
		var child = null;
		var ancestor = null;
		var superParent = Tomahawk._getParentClass(obj["ancestor"]);
		
		if( superParent != null && superParent.done == false)
			Tomahawk._inherits(superParent);

		child = Tomahawk._classes[obj["child"]];
		ancestor = Tomahawk._classes[obj["ancestor"]];
		obj.done = true;
		
		var func = new Object();
	
		if( child != null && ancestor != null )
		{	
			for( var prop in ancestor.prototype )
			{
				func[prop] = ancestor.prototype[prop];
			}
			
			for( var prop in child.prototype )
			{
				func[prop] = child.prototype[prop];
			}
		}
		
		child.prototype = func;
	};





/**
 * @author The Tiny Spark
 */
 
 (function() {
	

function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );
Tomahawk.extend("AssetsLoader", "EventDispatcher" );

// singleton
AssetsLoader._instance = null;

AssetsLoader.getInstance = function()
{
	if( tomahawk_ns.AssetsLoader._instance == null )
		tomahawk_ns.AssetsLoader._instance = new tomahawk_ns.AssetsLoader();
		
	return tomahawk_ns.AssetsLoader._instance;
};

AssetsLoader.prototype.onComplete = null;
AssetsLoader.prototype._loadingList = null;
AssetsLoader.prototype._data = null;

AssetsLoader.prototype.getData = function()
{
	return this._data;
};

AssetsLoader.prototype.clean = function()
{
	this._data = new Object();
};

AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this.clean();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
};

AssetsLoader.prototype.load = function()
{
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete != null )
		{
			this.onComplete();
		}
		
		this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.COMPLETE, true, true) );
	}
	else
	{
		var obj = this._loadingList.shift();
		var scope = this;
		var image = new Image();
		image.onload = function()
		{
			scope._progressHandler(image, obj.alias);
		};
		
		image.src = obj.url;
	}
};

AssetsLoader.prototype._progressHandler = function(image,alias)
{
	this._data[alias] = image;
	this.load();
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
};

tomahawk_ns.AssetsLoader = AssetsLoader;
})();




/**
 * @author The Tiny Spark
 */

(function() {
	
		
	function AssetsManager()
	{
		this._images = new Object();
		this._atlases = new Object();
		this._textures = new Object();
	};

	Tomahawk.registerClass( AssetsManager, "AssetsManager" );

	// singleton
	AssetsManager._instance = null;
	AssetsManager.getInstance = function()
	{
		if( tomahawk_ns.AssetsManager._instance == null )
			tomahawk_ns.AssetsManager._instance = new tomahawk_ns.AssetsManager();
			
		return tomahawk_ns.AssetsManager._instance;
	};

	AssetsManager.prototype._images = null;
	AssetsManager.prototype._atlases = null;
	AssetsManager.prototype._textures = null;


	// images
	AssetsManager.prototype.getImages = function()
	{
		return this._images;
	};

	AssetsManager.prototype.getImageByAlias = function(alias)
	{
		if( this._images[alias] )
			return this._images[alias];
			
		return null;
	};

	AssetsManager.prototype.addImage = function(image, alias)
	{
		this._images[alias] = image;
	};

	//atlases
	AssetsManager.prototype.addAtlas = function(atlas, alias)
	{
		this._atlases[alias] = atlas;
	};

	AssetsManager.prototype.getAtlases = function()
	{
		return this._atlases;
	};

	AssetsManager.prototype.getAtlasByAlias = function(alias)
	{
		if( this._atlases[alias] )
			return this._atlases[alias];
			
		return null;
	};

	//textures
	AssetsManager.prototype.addTexture = function(texture, alias)
	{
		this._textures[alias] = texture;
	};

	AssetsManager.prototype.getTextures = function()
	{
		return this._textures;
	};

	AssetsManager.prototype.getTextureByAlias = function(alias)
	{
		if( this._textures[alias] )
			return this._textures[alias];
			
		return null;
	};


	tomahawk_ns.AssetsManager = AssetsManager;
})();





/**
 * @author The Tiny Spark
 */
 
 (function() {
	 
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	Screen.getInnerWidth = function(stage)
	{
		return stage.getCanvas().parent.offsetWidth;
	};

	Screen.getInnerHeight = function(stage)
	{
		return stage.getCanvas().parent.offsetHeight;
	};

	Screen.getWindowWidth = function()
	{
		return window.innerWidth;
	};

	Screen.getWindowHeight = function()
	{
		return window.innerHeight;
	};
	
	tomahawk_ns.Screen = Screen;
})();



/**
 * @author The Tiny Spark
 */

(function() {
	
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		
		if( texture == undefined )
			return;
			
		this.texture = texture;
		this.width = this.texture.rect[2];
		this.height = this.texture.rect[3];
	}

	Tomahawk.registerClass( Bitmap, "Bitmap" );
	Tomahawk.extend( "Bitmap", "DisplayObject" );

	Bitmap.prototype.texture = null;

	Bitmap.prototype.draw = function( context )
	{	
		var rect = this.texture.rect;
		var data = this.texture.data;
			
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	};
	
	// a vertex is an array with: x, y, u, v
	Bitmap.prototype.drawTriangles = function( context, vertices )
	{
		var max = vertices.length;
		var i = 0;
		var rect = this.texture.rect;
		var data = this.texture.data;
		
		for( ; i < max; i++ )
		{
			this._drawTriangle( vertices[i], context, data, rect.width, rect.height );
		}
	};
	
	Bitmap.prototype._drawTriangle = function(vertices, ctx, texture, texW, texH ) 
	{
        var x0 = vertices[0][0], x1 = vertices[1][0], x2 = vertices[2][0];
        var y0 = vertices[0][1], y1 = vertices[1][1], y2 = vertices[2][1];
        var u0 = vertices[0][2], u1 = vertices[1][2], u2 = vertices[2][2];
        var v0 = vertices[0][3], v1 = vertices[1][3], v2 = vertices[2][3];
		
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






/**
 * @author The Tiny Spark
 */

(function() {

	
	function DisplayObject()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		this.matrix = new tomahawk_ns.Matrix2D();
		this._concatenedMatrix = new tomahawk_ns.Matrix2D();
		this.bounds = new tomahawk_ns.Rectangle();
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
	DisplayObject.prototype.mouseEnabled 		= true;
	DisplayObject.prototype.handCursor 			= false;
	DisplayObject.prototype.visible 			= true;
	DisplayObject.prototype.isMask				= false;
	DisplayObject.prototype.filters 			= null;
	DisplayObject.prototype.mask 				= null;
	DisplayObject.prototype.matrix 				= null;
	DisplayObject.prototype.bounds 				= null;
	DisplayObject.prototype._concatenedMatrix 	= null;
	DisplayObject.prototype.cacheAsBitmap		= false;
	DisplayObject.prototype.autoUpdate			= true;
	DisplayObject.prototype.updateNextFrame		= true;
	
	DisplayObject.prototype._cache 				= null;
	DisplayObject.prototype._cacheOffsetX 		= 0;
	DisplayObject.prototype._cacheOffsetY 		= 0;
	

	DisplayObject.prototype.updateBounds = function()
	{		
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		var mat = this.matrix;
	
		points.push(mat.transformPoint(0,0));
		points.push(mat.transformPoint(this.width,0));
		points.push(mat.transformPoint(0,this.height));
		points.push(mat.transformPoint(this.width, this.height));
	
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
		
		this.bounds = rect;
	};
	
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
	};
	
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
		//var pt1 = null;
		//var current = this;
		//var mat = this.matrix.clone();
		//
		//while( current != null )
		//{
			//mat.prependMatrix(current.matrix );
			//current = current.parent;
		//}
		//
		//mat = mat.clone().invert();
		//
		//pt1 = mat.transformPoint(x,y);
		
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
		return rect;
	};
	
	DisplayObject.prototype.getNestedChildren = function()
	{
		return new Array(this);
	}
	
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







/**
 * @author The Tiny Spark
 */
(function() {
	
	function DisplayObjectContainer()
	{
		tomahawk_ns.DisplayObject.apply(this);
		this.children = new Array();
	}

	Tomahawk.registerClass( DisplayObjectContainer, "DisplayObjectContainer" );
	Tomahawk.extend( "DisplayObjectContainer", "DisplayObject" );

	DisplayObjectContainer.prototype.children = null;
	DisplayObjectContainer.prototype.isContainer = true;

	
	DisplayObjectContainer.prototype.setChildIndex = function(child,index)
	{
		this.addChildAt(child,index);
	};
	
	DisplayObjectContainer.prototype.addChild = function(child)
	{
		if( child.parent )
		{
			child.parent.removeChild(child);
		}
		
		child.parent = this;
		this.children.push(child);
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED, true, true) );
	};

	DisplayObjectContainer.prototype.getChildAt = function (index)
	{
		return this.children[index];
	};

	DisplayObjectContainer.prototype.getChildByName = function(name)
	{
		var children = this.children;
		var i = children.length;
		
		while( --i > -1 )
		{
			if( children[i].name == name )
				return children[i];
		}
		
		return null;
	};

	DisplayObjectContainer.prototype.hitTest = function(x,y)
	{
		var children = this.children;
		var i = children.length;
		var child = null;
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.hitTest(x,y) )
				return true;
		}
		
		return false;
	};

	DisplayObjectContainer.prototype.addChildAt = function(child, index)
	{
		var children = this.children;
		var tab1 = this.children.slice(0,index);
		var tab2 = this.children.slice(index);
		this.children = tab1.concat([child]).concat(tab2);
		
		child.parent = this;
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED, true, true) );
	};
	
	DisplayObjectContainer.prototype.getChildIndex = function(child)
	{
		return this.children.indexOf(child);
	};

	DisplayObjectContainer.prototype.removeChildAt = function(index)
	{
		var child = this.children[index];
		if( child == undefined )
			return null;
			
		child.parent = null;
		this.children.splice(index,1);
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.REMOVED, true, true) );
		return child;
	};

	DisplayObjectContainer.prototype.removeChildren = function()
	{
		while( this.children.length > 0 )
		{
			this.removeChildAt(0);
		}
	};
	
	DisplayObjectContainer.prototype.removeChild = function(child)
	{
		var index = this.children.indexOf(child);
		var child = null;
		
		if( index > -1 )
		{
			child = this.children[index];
			this.children.splice(index,1);
			child.parent = null;
			child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.REMOVED, true, true) );
		}
		
		return child;
	};

	DisplayObjectContainer.prototype.draw = function( context )
	{	
		var children = this.children;
		var i = 0;
		var max = children.length;
		var child = null;
		var mat = null;
		
		for( ; i < max; i++ )
		{
			child = children[i];
			
			if( !child.visible || child.isMask == true )
				continue;
			
			child.updateMatrix();
			mat = child.matrix;
			
			context.save();
			context.globalAlpha *= child.alpha;
			context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			
			if( child.cacheAsBitmap == true || child.mask != null || child.filters != null )
			{
				child.drawComposite(context);
			}
			else
			{
				child.draw(context);
			}
			
			context.restore();
		}
	};

	DisplayObjectContainer.prototype.updateBounds = function()
	{
		var children = this.children;
		var i = children.length;
		var child = null;
		var rect = new tomahawk_ns.Rectangle();
		var childRect = null;
		var mat = this.matrix;
		var points = new Array();
		
		i = children.length;
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.updateNextFrame == true || child.autoUpdate == true )
			{
				child.updateMatrix();
				child.updateBounds();
			}
			
			childRect = child.bounds;
			rect.left = ( childRect.left < rect.left ) ? childRect.left : rect.left;
			rect.right = ( childRect.right > rect.right ) ? childRect.right : rect.right;
			rect.top = ( childRect.top < rect.top ) ? childRect.top : rect.top;
			rect.bottom = ( childRect.bottom > rect.bottom ) ? childRect.bottom : rect.bottom;
		}
		
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		this.width = rect.width;
		this.height = rect.height;
		
		tomahawk_ns.DisplayObject.prototype.updateBounds.apply(this);
	};	
	
	DisplayObjectContainer.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		var children = this.children;
		var i = children.length;
		var child = null;
		var rect = new tomahawk_ns.Rectangle();
		var childRect = null;
		
		i = children.length;
		
		while( --i > -1 )
		{
			child = children[i];
			childRect = child.getBoundingRectIn(spaceCoordinates);
			rect.left = ( childRect.left < rect.left ) ? childRect.left : rect.left;
			rect.right = ( childRect.right > rect.right ) ? childRect.right : rect.right;
			rect.top = ( childRect.top < rect.top ) ? childRect.top : rect.top;
			rect.bottom = ( childRect.bottom > rect.bottom ) ? childRect.bottom : rect.bottom;
		}
		
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		return rect;
	};

	DisplayObjectContainer.prototype.getObjectUnder = function(x,y)
	{
		var under = null;
		var children = this.children;
		var i = children.length;
		var child = null;
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.mouseEnabled == false )
				continue;
					
			if( child.isContainer )
			{				
				under = child.getObjectUnder(x,y);
				
				if( under != null )
				{
					return under;
				}
			}
			else
			{	
				if( child.hitTest(x,y) == true )
				{
					return child;
				}
			}
		}
		
		return null;
	};

	DisplayObjectContainer.prototype.getNestedChildren = function()
	{
		var list = new Array();
		var subChild = null;
		var i = this.children.length;
		
		while( --i > -1 )
		{
			subChild = this.children[i];
			if( subChild.isContainer == true )
			{
				list = list.concat(subChild.getNestedChildren());
			}
			
			list.push(subChild);
		}
		
		return list;
	}

	DisplayObjectContainer.prototype.destroy = function()
	{
		var child = null;
		
		while( this.children.length > 0 )
		{
			child = this.getChildAt(0);
			child.destroy();
		}
		
		tomahawk_ns.DisplayObject.prototype.destroy.apply(this);
	};
	
	tomahawk_ns.DisplayObjectContainer = DisplayObjectContainer;
})();



/**
 * @author The Tiny Spark
 */
(function() {
	
	function Mouse(){}

	Tomahawk.registerClass( Mouse, "Mouse" );
	
	Mouse.RESIZE = "se-resize";
	Mouse.MOVE = "move";
	Mouse.POINTER = "pointer";
	Mouse.DEFAULT = "default";

	Mouse.setCursor = function(value,domElement)
	{
		domElement.style.cursor = value;
	};
	
	tomahawk_ns.Mouse = Mouse;
	
})();



/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function MovieClip(texture)
	{
		tomahawk_ns.Bitmap.apply(this, [texture]);
		this._frames = new Array();
	}

	Tomahawk.registerClass( MovieClip, "MovieClip" );
	Tomahawk.extend( "MovieClip", "Bitmap" );

	MovieClip.prototype._frames = null;
	MovieClip.prototype.currentFrame = 0;
	MovieClip.prototype._enterFrameHandler = null;

	MovieClip.prototype._enterFrameHandler = function(event)
	{
		this.currentFrame++;
		if( this.currentFrame >= this._frames.length )
			this.currentFrame = 0;
			
		if( this._frames[this.currentFrame] )
		{
			this.texture = this._frames[this.currentFrame];
		}
	};

	MovieClip.prototype.setFrame = function( frameIndex, texture )
	{
		this._frames[frameIndex] = texture;
	};

	MovieClip.prototype.play = function()
	{
		this.stop();
		
		if( this.stage == null )
			return;
			
		this.stage.addEventListener(Event.ENTER_FRAME, this,this._enterFrameHandler); 
	};

	MovieClip.prototype.stop = function()
	{
		if( this.stage == null )
			return;
		this.stage.removeEventListener(Event.ENTER_FRAME, this,this._enterFrameHandler); 
	};

	tomahawk_ns.MovieClip = MovieClip;

})();




/**
 * @author The Tiny Spark
 */
(function() {
		
	function Shape()
	{
		tomahawk_ns.DisplayObject.apply(this);
	}

	Tomahawk.registerClass( Shape, "Shape" );
	Tomahawk.extend( "Shape", "DisplayObject" );


	Shape.prototype._commands = null;

	Shape.prototype._getCommands = function()
	{
		if( this._commands == null )
			this._commands = new Array();
			
		return this._commands;
	};

	Shape.prototype.clear = function()
	{
		this._commands = new Array();
	};

	Shape.prototype.stroke = function()
	{
		this._getCommands().push( [1,"stroke",null] ); 
	};

	Shape.prototype.fill = function()
	{
		this._getCommands().push( [1,"fill",null] ); 
	};

	Shape.prototype.beginPath = function()
	{
		this._getCommands().push( [1,"beginPath",null] ); 
	};

	Shape.prototype.closePath = function()
	{
		this._getCommands().push( [1,"closePath",null] );
	};

	Shape.prototype.rect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"rect",[x, y, width, height]] );
	};

	Shape.prototype.fillRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"fillRect",[x, y, width, height]] );
	};

	Shape.prototype.clearRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"clearRect",[x, y, width, height]] );
	};

	Shape.prototype.strokeRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"strokeRect",[x, y, width, height]] );
	};

	Shape.prototype.moveTo = function(x,y)
	{
		this._getCommands().push( [1,"moveTo",[x,y]] );
	};

	Shape.prototype.lineTo = function(x,y)
	{
		this._getCommands().push( [1,"lineTo",[x,y]] );
	};

	Shape.prototype.arc = function(x, y, radius, startAngle, endAngle, antiClockwise)
	{
		this._getCommands().push( [1,"arc",[x, y, radius, startAngle, endAngle, antiClockwise]] );
	};

	Shape.prototype.arcTo = function(controlX,controlY,endX,endY,radius)
	{
		this._getCommands().push( [1,"arcTo",[controlX,controlY,endX,endY,radius]] );
	};

	Shape.prototype.quadraticCurveTo = function(controlX, controlY, endX, endY)
	{
		this._getCommands().push( [1,"quadraticCurveTo",[controlX, controlY, endX, endY]] );
	};

	Shape.prototype.bezierCurveTo = function(controlX1, controlY1, controlX2, controlY2, endX, endY)
	{
		this._getCommands().push( [1,"bezierCurveTo",[controlX1, controlY1, controlX2, controlY2, endX, endY]] );
	};

	Shape.prototype.fillWithCurrentGradient = function()
	{
		this._getCommands().push( [1,"fillWithCurrentGradient",null] );
	};
	
	Shape.prototype.addColorStop = function(offset, color)
	{
		this._getCommands().push( [1,"addColorStop",[offset, color]] );
	};

	Shape.prototype.createLinearGradient = function(startX, startY, endX, endY)
	{
		this._getCommands().push( [1,"createLinearGradient",[startX, startY, endX, endY]] );
	};

	Shape.prototype.createRadialGradient = function(startX, startY, startRadius, endX, endY, endRadius)
	{
		this._getCommands().push( [1,"createRadialGradient",[startX, startY, startRadius, endX, endY, endRadius]] );
	};
	
	Shape.prototype.lineWidth = function(value)
	{
		this._getCommands().push( [0,"lineWidth",value] );
	};

	Shape.prototype.lineColor = function(value)
	{
		this._getCommands().push( [0,"lineColor",value] );
	};

	Shape.prototype.lineCap = function(value)
	{
		this._getCommands().push( [0,"lineCap",value] );
	};

	Shape.prototype.lineJoin = function(value)
	{
		this._getCommands().push( [0,"lineJoin",value] );
	};

	Shape.prototype.strokeStyle = function(value)
	{
		this._getCommands().push( [0,"strokeStyle",value] );
	};

	Shape.prototype.fillStyle = function(value)
	{
		this._getCommands().push( [0,"fillStyle",value] );
	};

	Shape.prototype.draw = function(context)
	{
		var commands = this._getCommands();
		var command = null;
		var i = 0;
		var max = commands.length;
		var type = null;
		var prop = null;
		var args = null;
		var gradient = null;
		
		//type = 0 : set; type = 1 : method
		
		for (i = 0; i < max; i++ )
		{
			command = commands[i];
			type = command[0];
			prop = command[1];
			args = command[2];
			
			if( type == 0 )
			{
				if( context[prop] )
				{
					context[prop] = args;				
				}
				else if( gradient != null )
				{
					if( gradient[prop] )
						gradient[prop] = args;
				}
			}
			else
			{
				if( prop == "createLinearGradient" || prop == "createRadialGradient" )
				{
					gradient = context[prop].apply(context,args);
				}
				else if( prop == "fillWithCurrentGradient" )
				{
					context.fillStyle = gradient;
				}
				else
				{
					if( context[prop] )
					{
						context[prop].apply(context,args);
					}
					else if( gradient != null )
					{
						if( gradient[prop] )
							gradient[prop].apply(gradient,args);
					}
				}
			}
			
			
		}
		
	};

	
	tomahawk_ns.Shape = Shape;

})();



/**
 * @author The Tiny Spark
 */

(function() {

	function Sprite()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
	}
	
	Tomahawk.registerClass( Sprite, "Sprite" );
	Tomahawk.extend( "Sprite", "DisplayObjectContainer" );
	
	Sprite.prototype.___lastPoint = null;
	Sprite.prototype.___dragging = false;
	
	Sprite.prototype.___getDragDropMovement___ 		= function(event)
	{
		this.___lastPoint = this.___lastPoint || new tomahawk_ns.Point(0,0);
		
		var newPoint = new tomahawk_ns.Point(event.stageX, event.stageY);
		var movement = new tomahawk_ns.Point(0,0);
		
		if( this.parent != null )
		{
			newPoint = this.parent.globalToLocal(event.stageX, event.stageY);
		}
		
		movement.x = newPoint.x - this.___lastPoint.x;
		movement.y = newPoint.y - this.___lastPoint.y;
		
		this.___lastPoint.x = newPoint.x;
		this.___lastPoint.y = newPoint.y;
		
		return movement;
	};
	
	Sprite.prototype.___dragDropHandler___ 			= function(event)
	{
		if( this.___dragging == false )
			return;

		var movement = this.___getDragDropMovement___(event);
		
		this.x += movement.x;
		this.y += movement.y;
	};
	
	Sprite.prototype.___toggleDragDropHandler___ 	= function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN )
		{
			this.___dragging = true;
			this.startDrag();
		}
		else
		{
			this.___dragging = false;
			this.stopDrag();
		}
		
		this.___getDragDropMovement___(event);
	};
	
	Sprite.prototype.enableDragAndDrop 				= function(value)
	{
		this.stopDrag();
		
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		
		if( value == true )
		{
			this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
			this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		}
		
		this.mouseEnabled = true;
	};
	
	Sprite.prototype.startDrag 						= function()
	{
		this.stopDrag();
		this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___ );
		this.mouseEnabled = true;
	};
	
	Sprite.prototype.stopDrag 						= function()
	{
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___, true );
	};

	tomahawk_ns.Sprite = Sprite;
})();





/**
 * @author The Tiny Spark
 */

(function() {
	

	function Stage()
	{
		tomahawk_ns.DisplayObject._collide = 0;
		tomahawk_ns.DisplayObjectContainer.apply(this);
			// useful
		window.requestAnimationFrame = (function()
		{
			
			return  window.requestAnimationFrame       ||  //Chromium 
					window.webkitRequestAnimationFrame ||  //Webkit
					window.mozRequestAnimationFrame    || //Mozilla Geko
					window.oRequestAnimationFrame      || //Opera Presto
					window.msRequestAnimationFrame     || //IE Trident?
					function(callback, element){ //Fallback function
						window.setTimeout(callback, 10);                
					}
			 
		})();
		
		this.stage = this;
	}

	Tomahawk.registerClass( Stage, "Stage" );
	Tomahawk.extend( "Stage", "DisplayObjectContainer" );

	Stage._instances = new Object();
	
	Stage.getInstance = function(stageName)
	{
		stageName = stageName || "defaultStage";
		
		if( !tomahawk_ns.Stage._instances[stageName] )
			tomahawk_ns.Stage._instances[stageName] = new tomahawk_ns.Stage();
			
		return tomahawk_ns.Stage._instances[stageName];
	};


	Stage.prototype._lastTime = 0;
	Stage.prototype._frameCount = 0;
	Stage.prototype._fps = 0;
	Stage.prototype._canvas = null;
	Stage.prototype._context = null;
	Stage.prototype._lastActiveChild = null;
	Stage.prototype.mouseX = 0;
	Stage.prototype.mouseY = 0;
	Stage.prototype._focused = false;
	Stage.prototype._focusedElement = null;
	Stage.prototype._cache = null;
	Stage.prototype.background = false;
	Stage.prototype.backgroundColor = "#0080C0";


	Stage.prototype.init = function(canvas)
	{
		var scope = this;
		var callback = function(event)
		{
			scope._mouseHandler(event);
		};
		
		var callbackKey = function(event)
		{
			scope._keyboardHandler(event);
		};
		
		this._canvas = canvas;
		this._context = canvas.getContext("2d");
		this.addEventListener(tomahawk_ns.Event.ADDED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.FOCUSED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.UNFOCUSED, this, this._eventHandler,true);
		this._canvas.addEventListener("click",callback);
		this._canvas.addEventListener("mousemove",callback);
		this._canvas.addEventListener("mousedown",callback);
		this._canvas.addEventListener("mouseup",callback);
		this._canvas.addEventListener("dblclick",callback);
		
		
		window.addEventListener("keyup",callbackKey);
		window.addEventListener("keydown",callbackKey);
		window.addEventListener("keypress",callbackKey);
		this.enterFrame();		
	};

	Stage.prototype._keyboardHandler = function(event)
	{
		if( event.type == "keyup" )
			tomahawk_ns.Keyboard.toggleShift(event.keyCode);
		
		var keyboardEvent = tomahawk_ns.KeyEvent.fromNativeEvent(event, true, true);
		this.dispatchEvent(keyboardEvent);
	};

	Stage.prototype._mouseHandler = function(event)
	{
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
		
		var bounds = this._canvas.getBoundingClientRect();
		var x = event.clientX - bounds.left;
		var y = event.clientY - bounds.top;
		var activeChild = this.getObjectUnder(x,y);
		var mouseEvent = null;
		var i = 0;
		this._lastMouseX = this.mouseX >> 0;
		this._lastMouseY = this.mouseY >> 0;
		this.mouseX = x >> 0;
		this.mouseY = y >> 0;
		
			
		if( event.type == "mousemove" && this._lastActiveChild != activeChild )
		{
			if( activeChild != null )
			{		
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
				mouseEvent.type = tomahawk_ns.MouseEvent.ROLL_OVER;
				activeChild.dispatchEvent(mouseEvent);
			}
			
			if( this._lastActiveChild != null )
			{		
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
				mouseEvent.type = tomahawk_ns.MouseEvent.ROLL_OUT;
				this._lastActiveChild.dispatchEvent(mouseEvent);
			}
		}
		else
		{
			if( activeChild != null )
			{
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);			
				activeChild.dispatchEvent(mouseEvent);
			}
		}
		
		if( event.type == "mousedown" )
		{
			this._lastMouseDownChild = activeChild;
		}
		
		if( 	event.type == "mouseup" && 
				activeChild != this._lastMouseDownChild && 
				this._lastMouseDownChild != null
		)
		{
			mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);	
			mouseEvent.type == tomahawk_ns.MouseEvent.RELEASE_OUTSIDE;
			this._lastMouseDownChild.dispatchEvent(mouseEvent);
			this._lastMouseDownChild = null;
		}
		
		this._lastActiveChild = activeChild;
		
		var handCursor = false;
		var current = activeChild;
		
		while( current != null )
		{
			handCursor = handCursor || current.handCursor;
			current = current.parent;
		}
		
		if( activeChild != null && handCursor == true )
			tomahawk_ns.Mouse.setCursor(tomahawk_ns.Mouse.POINTER, this.getCanvas());
		else
			tomahawk_ns.Mouse.setCursor(tomahawk_ns.Mouse.DEFAULT, this.getCanvas());
		
		
		if( event.type != "mousemove" && this._focusedElement != null && activeChild != this._focusedElement )
		{
			this._focusedElement.setFocus(false);
			this._focusedElement = null;
			this._focused = false;
		}
	};

	Stage.prototype.getMovement = function()
	{
		var pt = new Object();
		pt.x = this.mouseX - this._lastMouseX;
		pt.y = this.mouseY - this._lastMouseY;
		
		return pt;
	};

	Stage.prototype._eventHandler = function(event)
	{
		var list = null;
		var i = 0;
		var max = 0;
		var child = null;
		var type = null;
		
		switch( event.type )
		{
			case tomahawk_ns.Event.FOCUSED: 
				this._focused = true;
				this._focusedElement = event.target;
				break;
				
			case tomahawk_ns.Event.UNFOCUSED: 
				this._focused = false;
				break;
				
			case tomahawk_ns.Event.ADDED: 
			case tomahawk_ns.Event.REMOVED: 
				
				list = event.target.getNestedChildren();
				list.push(event.target);
				max = list.length;
				
				for( i= 0; i < max; i++ )
				{
					list[i].stage = this;
				}
				
				type = ( event.type == tomahawk_ns.Event.ADDED ) ? tomahawk_ns.Event.ADDED_TO_STAGE : tomahawk_ns.Event.REMOVED_FROM_STAGE;
				
				for( i= 0; i < max; i++ )
				{
					list[i].dispatchEvent( new tomahawk_ns.Event(type, true, true) ); 
				}
				
				break;
		}
	};

	Stage.prototype.enterFrame = function()
	{
		var curTime = new Date().getTime();
		var scope = this;
		var context = scope._context;
		var canvas = scope._canvas;
		
		this.width = scope._canvas.width;
		this.height = scope._canvas.height;
		
		scope._frameCount++;
		
		if( curTime - scope._lastTime > 1000 )
		{
			scope._fps = scope._frameCount;
			scope._frameCount = 0;
			scope._lastTime = curTime;
		}
		
		if( scope.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = scope.backgroundColor;
			context.fillRect( 0, 0, canvas.width, canvas.height );
			context.fill();
			context.restore();
		}
		else
		{
			context.clearRect(0,0,canvas.width,canvas.height);
		}
		context.save();
		
		scope.draw(context);
		
		context.restore();
		
		scope.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		window.requestAnimationFrame(	function()
										{
											scope.enterFrame();
										}
		);
	};

	Stage.prototype.setFPS = function(value)
	{
		this._fps = value;
	};

	Stage.prototype.drawFPS = function()
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "black";
		this._context.fillRect(0,0,50,15);
		this._context.fill();
		this._context.fillStyle = "red";
		this._context.font = '10pt Arial';
		this._context.fillText("fps: "+this._fps, 0,15);
		this._context.restore();
	};

	Stage.prototype.getCanvas = function()
	{
		return this._canvas;
	};

	Stage.prototype.getContext = function()
	{
		return this._context;
	};

	Stage.prototype.getFPS = function()
	{
		return this._fps;
	};


	tomahawk_ns.Stage = Stage;

})();






/**
 * @author The Tiny Spark
 */
(function() {
	
	
	function QuadTreeContainer(left,right,top,bottom,childrenPerNode, maxDepth)
	{
		tomahawk_ns.Sprite.apply(this);
		
		left = left || -2147483648;
		right = right || 2147483648;
		top = top || -2147483648;
		bottom = bottom || 2147483648;
		maxDepth = maxDepth || 24;
		childrenPerNode = childrenPerNode || 100;
		
		this._root = new tomahawk_ns.QuadTreeNode(left,right,top,bottom,0,childrenPerNode,maxDepth);
	}

	Tomahawk.registerClass( QuadTreeContainer, "QuadTreeContainer" );
	Tomahawk.extend( "QuadTreeContainer", "Sprite" );
	
	QuadTreeContainer.prototype._root = null;

	QuadTreeContainer.prototype.addChild = function(child)
	{
		child.updateNextFrame = true;
		this._root.add(child);
		return tomahawk_ns.Sprite.prototype.addChild.apply(this,[child]);
	};

	QuadTreeContainer.prototype.addChildAt = function(child, index)
	{
		child.updateNextFrame = true;
		this._root.add(child);
		return tomahawk_ns.Sprite.prototype.addChildAt.apply(this,[child,index]);
	};

	QuadTreeContainer.prototype.removeChildAt = function(child, index)
	{
		child.updateNextFrame = true;
		this._root.remove(child);
		return tomahawk_ns.Sprite.prototype.removeChildAt.apply(this,[child,index]);
	};
	
	QuadTreeContainer.prototype.removeChild = function(child)
	{
		child.updateNextFrame = true;
		this._root.remove(child);
		return tomahawk_ns.Sprite.prototype.removeChild.apply(this,[child]);
	};
	
	QuadTreeContainer.prototype.getVisiblesChildren = function()
	{
		var i = this.children.length;
		var child = null;
		var visibles = null;
		
		if( this.stage == null )
			return new Array();
			
		while( --i > -1 )
		{
			child = this.children[i];
			child.__index__ = i;
			
			if( child.updateNextFrame == true || child.autoUpdate == true )
			{
				this._root.add(child);
			}
		}
		
		var width = this.stage.getCanvas().width;
		var height = this.stage.getCanvas().height;
		var pt1 = this.globalToLocal(0,0);
		var pt2 = this.globalToLocal(width,height);
		var left = pt1.x;
		var right = pt2.x;
		var top = pt1.y;
		var bottom = pt2.y;
		
		visibles = this._root.get(left, right, top, bottom);
		visibles.sort(this._sortVisiblesChildren);
		
		return visibles;
	};
	
	QuadTreeContainer.prototype.getRoot = function()
	{
		return this._root;
	};

	QuadTreeContainer.prototype._sortVisiblesChildren = function(a,b)
	{
		return ( a.__index__ < b.__index__ ) ? -1 : 1;
	};
	
	QuadTreeContainer.prototype.draw = function(context)
	{
		var all = this.children;
		this.children = this.getVisiblesChildren();
		tomahawk_ns.Sprite.prototype.draw.apply(this,[context]);
		this.children = all;
	};

	QuadTreeContainer.prototype.hitTest = function(x,y)
	{
		var pt1 = this.globalToLocal(x,y);
		var pt2 = this.globalToLocal(x + 5,y  + 5);
		var left = pt1.x;
		var right = pt1.x + 1;
		var top = pt1.y;
		var bottom = pt1.y + 1;
		var child = null;
		var children = this._root.get(left,right,top,bottom);
		var i = children.length;
		children.sort(this._sortVisiblesChildren);
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.hitTest(x,y) )
				return true;
		}
		
		return false;
	};
	
	QuadTreeContainer.prototype.getObjectUnder = function(x,y)
	{
		var pt1 = this.globalToLocal(x,y);
		var left = pt1.x;
		var right = pt1.x + 1;
		var top = pt1.y;
		var bottom = pt1.y + 1;
		var under = null;
		var child = null;
		var children = this._root.get(left, right, top, bottom);
		var i = children.length;
		
		children.sort(this._sortVisiblesChildren);
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.mouseEnabled == false )
				continue;
					
			if( child.isContainer )
			{				
				under = child.getObjectUnder(x,y);
				
				if( under != null )
				{
					return under;
				}
			}
			else
			{	
				if( child.hitTest(x,y) == true )
				{
					return child;
				}
			}
		}
		
		return null;
	};
	tomahawk_ns.QuadTreeContainer = QuadTreeContainer;
})();



/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function QuadTreeNode(left,right,top,bottom, depth, maxChildren, maxDepth)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		this.maxChildren = maxChildren;
		this.maxDepth = maxDepth;
		this.depth = depth;

		this.limitX = this.left + ( this.right - this.left ) * 0.5;
		this.limitY = this.top + ( this.bottom - this.top ) * 0.5;
		
		this.children = new Array();
	}
	
	Tomahawk.registerClass( QuadTreeNode, "QuadTreeNode" );
	
	QuadTreeNode._tick = 0;
	QuadTreeNode.prototype._cache = null;
	
	
	// iterative  methods
	
	QuadTreeNode.prototype.add = function(element)
	{
		this.remove(element);
		
		if( element.updateNextFrame == true || element.autoUpdate == true )
		{
			element.updateMatrix();
			element.updateBounds();
		}
		
		var nodes = new Array();
		var currentNode = this;
		var bounds = element.bounds;
		var out = false;
		var left = bounds.left;
		var right = bounds.right;
		var top = bounds.top;
		var bottom = bounds.bottom;
		nodes.push(this);
		
		while( nodes.length > 0 )
		{
			currentNode = nodes.shift();
			
			out =	( 	left > currentNode.right || 
						right < currentNode.left || 
						top > currentNode.bottom || 
						bottom < currentNode.top );
						
			if( out == true )
				continue;
			
			if( currentNode.children.length > currentNode.maxChildren && currentNode.depth < currentNode.maxDepth)
			{
				currentNode.split();
			}
		
			if( currentNode.full == false )
			{
				currentNode.children.push(element);
			}
			else
			{
				nodes.push(currentNode.node1);
				nodes.push(currentNode.node2);
				nodes.push(currentNode.node3);
				nodes.push(currentNode.node4);
			}
		}
	};
	
	QuadTreeNode.prototype.remove = function( element )
	{
		var index = -1;
		var nodes = new Array();
		var currentNode = this;
		var bounds = element.bounds;
		nodes.push(this);
		
		while( nodes.length > 0 )
		{
			currentNode = nodes.shift();
			
			if( currentNode.full == true )
			{
				nodes.push(currentNode.node1);
				nodes.push(currentNode.node2);
				nodes.push(currentNode.node3);
				nodes.push(currentNode.node4);
				continue;
			}
			
			index = currentNode.children.indexOf(element);
			if( index > -1 )
				currentNode.children.splice(index,1);
		}
	};
	
	QuadTreeNode.prototype.get = function( left, right, top, bottom )
	{
		var tick = tomahawk_ns.QuadTreeNode._tick + 1;
		var result = new Array();
		var nodes = new Array();
		var currentNode = this;
		var out = false;
		var child = null;
		var i = 0;
		
		nodes.push(this);
		
		while( nodes.length > 0 )
		{
			currentNode = nodes.shift();
			
			out = ( left > currentNode.right || 
					right < currentNode.left || 
					top > currentNode.bottom || 
					bottom < currentNode.top );
					
			if( out == true )
				continue;
				
			if( currentNode.full == true )
			{
				nodes.push(currentNode.node1);
				nodes.push(currentNode.node2);
				nodes.push(currentNode.node3);
				nodes.push(currentNode.node4);
				continue;
			}
				
			i = currentNode.children.length;
			
			while( --i > -1 )
			{
				child = currentNode.children[i];
				bounds = child.bounds;
				
				out = ( bounds.left > right || 
						bounds.right < left ||
						bounds.top > bottom ||
						bounds.bottom < top || 
						child.__tick__ == tick);
						
				if( out == true )
					continue;
				
				result.push(child);
				child.__tick__ = tick;
			}
		}
		
		tomahawk_ns.QuadTreeNode._tick = tick;
		return result;
	};
	
	QuadTreeNode.prototype.split = function()
	{
		var child = null;
		var e = this.depth + 1;
		var f = this.maxChildren;
		var g = this.maxDepth;
		
		this.node1 = new tomahawk_ns.QuadTreeNode(this.left,	this.limitX	, this.top	 , this.limitY	,e,f,g);
		this.node2 = new tomahawk_ns.QuadTreeNode(this.left,	this.limitX	, this.limitY, this.bottom	,e,f,g);
		this.node3 = new tomahawk_ns.QuadTreeNode(this.limitX,	this.right	, this.top	 , this.limitY	,e,f,g);
		this.node4 = new tomahawk_ns.QuadTreeNode(this.limitX,	this.right	, this.limitY, this.bottom	,e,f,g);
		
		while( this.children.length > 0)
		{
			child = this.children.shift();
			this.node1.add(child);
			this.node2.add(child);
			this.node3.add(child);
			this.node4.add(child);
		}
		
		this.full = true;
	};
	
	
	QuadTreeNode.prototype.full = false;
	QuadTreeNode.prototype.left = 0;
	QuadTreeNode.prototype.right = 0;
	QuadTreeNode.prototype.top = 0;
	QuadTreeNode.prototype.bottom = 0;
	QuadTreeNode.prototype.maxChildren = 20;
	QuadTreeNode.prototype.depth = 0;
	QuadTreeNode.prototype.node1 = null;
	QuadTreeNode.prototype.node2 = null;
	QuadTreeNode.prototype.node3 = null;
	QuadTreeNode.prototype.node4 = null;
	QuadTreeNode.prototype.limitX = 0;
	QuadTreeNode.prototype.limitY = 0;
	
	
	tomahawk_ns.QuadTreeNode = QuadTreeNode;
	
})();



/**
 * @author The Tiny Spark
 */

(function() {

	function Sprite3D()
	{
		tomahawk_ns.Sprite.apply(this);
		this.matrix3D = new tomahawk_ns.Matrix4x4();
	}
	
	Sprite3D.prototype.getNormalVector = function()
	{
		var mat = tomahawk_ns.Matrix4x4.toMatrix2D(this.getConcatenedMatrix3D(true));
		var pt1 = mat.transformPoint(0,0);
		var pt3 = mat.transformPoint(0,100);
		var pt2 = mat.transformPoint(100,0);
		
		var vec1 = new tomahawk_ns.Vector3D(pt2.x - pt1.x, pt2.y - pt1.y,0);
		var vec2 = new tomahawk_ns.Vector3D(pt3.x - pt1.x, pt3.y - pt1.y,0);
		vec1.crossProduct(vec2);

		return vec1;
	};
	
	Sprite3D.prototype.updateMatrix = function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
			
		this.rotationX %= 360;
		this.rotationY %= 360;
		this.rotationZ %= 360;
			
		this.matrix3D.identity().appendTransform(	this.x, 
													this.y, 
													this.z,
													this.scaleX, 
													this.scaleY, 
													this.scaleZ,
													this.rotationX, 
													this.rotationY, 
													this.rotationZ,
													this.pivotX,
													this.pivotY,
													this.pivotZ
												);
												
		this.matrix = tomahawk_ns.Matrix4x4.toMatrix2D(this.matrix3D);
		this.updateNextFrame = false;
	};
	
	Sprite3D.prototype.getConcatenedMatrix3D = function()
	{
		this.updateNextFrame = true;
		this.updateMatrix();
		var current = this.parent;
		var mat3D = this.matrix3D.clone();
		
		while( current != null )
		{
			current.updateNextFrame = true;
			current.updateMatrix();
			
			if( current.matrix3D && current.matrix3D != null )
			{
				mat3D.prependMatrix( current.matrix3D );
			}
			else
			{
				mat3D.prependMatrix( tomahawk_ns.Matrix4x4.toMatrix4x4(current.matrix) );
			}
			current = current.parent;
		}
		
		return mat3D;
	};
	
	Sprite3D.prototype.draw = function(context)
	{
		context.save();
		
		if( this.useReal3D == true )
		{
			var mat = tomahawk_ns.Matrix4x4.toMatrix2D(this.getConcatenedMatrix3D());
			context.setTransform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		}
		
		tomahawk_ns.Sprite.prototype.draw.apply(this,[context]);
		context.restore();
	};
	
	Sprite3D.prototype.localToGlobal3D = function(x,y,z)
	{
		var mat = this.getConcatenedMatrix3D();
		var pt = new tomahawk_ns.Point3D(x,y,z);
		mat.transformPoint3D(pt);
		return pt;
	};
	
	Sprite3D.prototype.matrix3D = null;
	
	Sprite3D.prototype.scaleZ = 1;
	Sprite3D.prototype.z = 0;
	Sprite3D.prototype.pivotZ = 0;
	
	Sprite3D.prototype.rotationX = 0;
	Sprite3D.prototype.rotationY = 0;
	Sprite3D.prototype.rotationZ = 0;
	
	Sprite3D.prototype.useReal3D = false;
	
	Tomahawk.registerClass( Sprite3D, "Sprite3D" );
	Tomahawk.extend( "Sprite3D", "Sprite" );
	

	tomahawk_ns.Sprite3D = Sprite3D;
})();





/**
 * @author The Tiny Spark
 */

(function() {	
	
	function Event(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( Event, "Event" );

	Event.prototype.type = null;
	Event.prototype.bubbles = false;
	Event.prototype.cancelable = true;
	Event.prototype.data = null;
	Event.prototype.target = null;
	Event.prototype.currentTarget = null;

	Event.prototype.stopPropagation = function()
	{
		if( this.cancelable == true )
			this.bubbles = false;
	};


	Event.FOCUSED			= "focused"
	Event.UNFOCUSED			= "unfocused"
	Event.ADDED 			= "added";
	Event.ADDED_TO_STAGE 	= "addedToStage";
	Event.ENTER_FRAME 		= "enterFrame";
	Event.REMOVED 			= "removed";
	Event.REMOVED_FROM_STAGE= "removedFromStage";
	Event.IO_ERROR			= "ioError";
	Event.PROGRESS			= "progress";
	Event.COMPLETE			= "complete";
	
	
	tomahawk_ns.Event = Event;

})();



/**
 * @author The Tiny Spark
 */

(function() {
	
	function EventDispatcher()
	{
		this._listeners = new Array();
	}

	Tomahawk.registerClass( EventDispatcher, "EventDispatcher" );

	EventDispatcher.prototype.parent = null;
	EventDispatcher.prototype._listeners = null;

	EventDispatcher.prototype.addEventListener = function( type, scope, callback, useCapture )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		obj.type = type;
		obj.scope = scope;
		obj.callback = callback;
		obj.useCapture = useCapture;
		this._listeners.push(obj);
	};

	EventDispatcher.prototype.hasEventListener = function(type)
	{
		if( this._listeners == null )
			return false;
			
		var obj = new Object();
		var i = this._listeners.length;
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type == type )
				return true;
		}
	};

	EventDispatcher.prototype.dispatchEvent = function( event )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		var i = this._listeners.length;
		var toDispatch = new Array();
		
		if( event.target == null )
			event.target = this;
			
		event.currentTarget = this;
		
		while( --i > -1 )
		{
			obj = this._listeners[i];
			
			if( obj.type == event.type )
			{
				if( event.target != this && obj.useCapture == false )
				{
					continue;
				}
				
				toDispatch.push(obj);
			}
		}
		
		i = toDispatch.length;
		
		while( --i > -1 )
		{
			obj = toDispatch[i];
			obj.callback.apply( obj.scope, [event] );
		}
		
		if( event.bubbles == true && this.parent != null && this.parent.dispatchEvent )
		{
			this.parent.dispatchEvent(event);
		}
	};

	EventDispatcher.prototype.removeEventListener = function( type, scope, callback, useCapture )
	{
		var obj = new Object();
		var i = this._listeners.length;
		var arr = new Array();
			
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type != type || obj.scope != scope || obj.callback != callback || obj.useCapture != useCapture )
				arr.push(obj);
		}
			
		this._listeners = arr;
	};

	EventDispatcher.prototype.removeEventListeners = function()
	{
		this._listeners = new Array();
	};
	
	EventDispatcher.prototype.destroy = function()
	{
		this.removeEventListeners();
		this.parent = null;
	};
	
	tomahawk_ns.EventDispatcher = EventDispatcher;

})();




/**
 * @author The Tiny Spark
 */
(function() {	

	function KeyEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( KeyEvent, "KeyEvent" );
	Tomahawk.extend( "Keyboard", "Event" );

	KeyEvent.prototype.value = "";
	KeyEvent.prototype.keyCode = 0;
	KeyEvent.prototype.isCharacter = false;
	KeyEvent.prototype.charCode = 0;
	KeyEvent.prototype.crtlKey = false;
	KeyEvent.prototype.shiftKey = false;
	KeyEvent.prototype.altKey = false;
	KeyEvent.prototype.nativeEvent = null;

	KeyEvent.fromNativeEvent = function(event,bubbles,cancelable)
	{
		var type = "";
		var newEvent = null;
		
		switch( event.type )
		{
			case "keyup": type = KeyEvent.KEY_UP; break;
			case "keypress": type = KeyEvent.KEY_PRESS; break;
			case "keydown": type = KeyEvent.KEY_DOWN; break;
		}
		
		newEvent = new KeyEvent(type,bubbles,cancelable);
		newEvent.nativeEvent = event;
		newEvent.keyCode = event.keyCode;
		newEvent.charCode = event.charCode;
		newEvent.ctrlKey = event.ctrlKey;
		newEvent.shiftKey = event.shiftKey;
		newEvent.altKey = event.altKey;
		newEvent.value = tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode, event.shiftKey, event.ctrlKey, event.altKey);
		newEvent.isCharacter = tomahawk_ns.Keyboard.isMapped(event.keyCode);
		newEvent.which = event.which;
		return newEvent;
	};


	KeyEvent.KEY_UP = "keyup";
	KeyEvent.KEY_DOWN = "keydown";
	KeyEvent.KEY_PRESS = "keypress";

	tomahawk_ns.KeyEvent = KeyEvent;

})();











/**
 * @author The Tiny Spark
 */
 
 (function() {
	
	 
	function Keyboard(){}
	
	Tomahawk.registerClass( Keyboard, "Keyboard" );

	Keyboard.keyCodeToChar = function(keyCode, shiftKey, ctrlKey, altKey)
	{
		var obj = Keyboard.MAP[keyCode];
		var altgr = ctrlKey && altKey;
		
		if( obj == undefined )
			return "";

		if( altgr )
			return obj.altgr;
			
		if( shiftKey || Keyboard._majActive )
			return obj.shift;
			
		return obj.normal;
	};

	Keyboard.isChar = function(keyCode)
	{
		if( Keyboard.MAP[keyCode] )
			return true;
			
		return false;
	};

	Keyboard.toggleShift = function(keyCode)
	{
		if( keyCode == Keyboard.CAPSLOCK )
			Keyboard._majActive = ! Keyboard._majActive;
	};

	Keyboard._majActive = false;

	Keyboard.BACKSPACE = 8;
	Keyboard.TAB = 9;
	Keyboard.ENTER = 13;
	Keyboard.SHIFT = 16;
	Keyboard.CTRL = 17;
	Keyboard.ALT = 18;
	Keyboard.CAPSLOCK = 20;
	Keyboard.SPACE = 32;
	Keyboard.END = 35;
	Keyboard.START = 36;
	Keyboard.LEFT = 37;
	Keyboard.UP = 38;
	Keyboard.RIGHT = 39;
	Keyboard.DOWN = 40;
	Keyboard.SUPPR = 46;


	// > 47
	Keyboard.TOUCH_0 = 48;
	Keyboard.TOUCH_1 = 49;
	Keyboard.TOUCH_2 = 50;
	Keyboard.TOUCH_3 = 51;
	Keyboard.TOUCH_4 = 52;
	Keyboard.TOUCH_5 = 53;
	Keyboard.TOUCH_6 = 54;
	Keyboard.TOUCH_7 = 55;
	Keyboard.TOUCH_8 = 56;
	Keyboard.TOUCH_9 = 57;
	// < 58

	// > 64
	Keyboard.A = 65;
	Keyboard.B = 66;
	Keyboard.C = 67;
	Keyboard.D = 68;
	Keyboard.E = 69;
	Keyboard.F = 70;
	Keyboard.G = 71;
	Keyboard.H = 72;
	Keyboard.I = 73;
	Keyboard.J = 74;
	Keyboard.K = 75;
	Keyboard.L = 76;
	Keyboard.M = 77;
	Keyboard.N = 78;
	Keyboard.O = 79;
	Keyboard.P = 80;
	Keyboard.Q = 81;
	Keyboard.R = 82;
	Keyboard.S = 83;
	Keyboard.T = 84;
	Keyboard.U = 85;
	Keyboard.V = 86;
	Keyboard.W = 87;
	Keyboard.X = 88;
	Keyboard.Y = 89;
	Keyboard.Z = 90;
	// < 91



	Keyboard.WINDOWS = 91;
	Keyboard.SELECT = 93;

	// > 95
	Keyboard.NUMPAD_0 = 96;
	Keyboard.NUMPAD_1 = 97;
	Keyboard.NUMPAD_2 = 98;
	Keyboard.NUMPAD_3 = 99;
	Keyboard.NUMPAD_4 = 100;
	Keyboard.NUMPAD_5 = 101;
	Keyboard.NUMPAD_6 = 102;
	Keyboard.NUMPAD_7 = 103;
	Keyboard.NUMPAD_8 = 104;
	Keyboard.NUMPAD_9 = 105;
	Keyboard.NUMPAD_MULTIPLY = 106;
	Keyboard.NUMPAD_PLUS = 107;
	Keyboard.NUMPAD_MINUS = 109;
	Keyboard.NUMPAD_DOT = 110;
	Keyboard.NUMPAD_SLASH = 111;
	// < 112

	// > 111
	Keyboard.F1 = 112;
	Keyboard.F2 = 113;
	Keyboard.F3 = 114;
	Keyboard.F4 = 115;
	Keyboard.F5 = 116;
	Keyboard.F6 = 117;
	Keyboard.F7 = 118;
	Keyboard.F8 = 119;
	Keyboard.F9 = 120;
	Keyboard.F10 = 121;
	Keyboard.F11 = 122;
	Keyboard.F12 = 123;
	// < 124

	Keyboard.VERR_NUM = 144;

	// > 185
	Keyboard.DOLLAR = 186;
	Keyboard.EQUAL = 187;
	Keyboard.QUESTION = 188;
	Keyboard.DOT = 190;
	Keyboard.SLASH = 191;
	Keyboard.PERCENT = 192;
	Keyboard.RIGHT_PARENT = 219;
	Keyboard.MICRO = 220;
	Keyboard.TREMA = 221;
	Keyboard.POWER_TWO = 222;
	Keyboard.EXCLAMATION = 223;
	// < 224



	Keyboard.MAP = new Array();


	Keyboard.MAP[Keyboard.TOUCH_0]={normal:"à",shift:"0",altgr:"@"};
	Keyboard.MAP[Keyboard.TOUCH_1]={normal:"&",shift:"1",altgr:""};
	Keyboard.MAP[Keyboard.TOUCH_2]={normal:"é",shift:"2",altgr:"~"};
	Keyboard.MAP[Keyboard.TOUCH_3]={normal:'"',shift:"3",altgr:"#"};
	Keyboard.MAP[Keyboard.TOUCH_4]={normal:"'",shift:"4",altgr:"{"};
	Keyboard.MAP[Keyboard.TOUCH_5]={normal:"(",shift:"5",altgr:"["};
	Keyboard.MAP[Keyboard.TOUCH_6]={normal:"-",shift:"6",altgr:"|"};
	Keyboard.MAP[Keyboard.TOUCH_7]={normal:"è",shift:"7",altgr:"`"};
	Keyboard.MAP[Keyboard.TOUCH_8]={normal:"_",shift:"8",altgr:"\\"};
	Keyboard.MAP[Keyboard.TOUCH_9]={normal:"ç",shift:"9",altgr:"^"};

	Keyboard.MAP[Keyboard.A]={normal:"a",shift:"A",altgr:""};
	Keyboard.MAP[Keyboard.B]={normal:"b",shift:"B",altgr:""};
	Keyboard.MAP[Keyboard.C]={normal:"c",shift:"C",altgr:""};
	Keyboard.MAP[Keyboard.D]={normal:"d",shift:"D",altgr:""};
	Keyboard.MAP[Keyboard.E]={normal:"e",shift:"E",altgr:""};
	Keyboard.MAP[Keyboard.F]={normal:"f",shift:"F",altgr:""};
	Keyboard.MAP[Keyboard.G]={normal:"g",shift:"G",altgr:""};
	Keyboard.MAP[Keyboard.H]={normal:"h",shift:"H",altgr:""};
	Keyboard.MAP[Keyboard.I]={normal:"i",shift:"I",altgr:""};
	Keyboard.MAP[Keyboard.J]={normal:"j",shift:"J",altgr:""};
	Keyboard.MAP[Keyboard.K]={normal:"k",shift:"K",altgr:""};
	Keyboard.MAP[Keyboard.L]={normal:"l",shift:"L",altgr:""};
	Keyboard.MAP[Keyboard.M]={normal:"m",shift:"M",altgr:""};
	Keyboard.MAP[Keyboard.N]={normal:"n",shift:"N",altgr:""};
	Keyboard.MAP[Keyboard.O]={normal:"o",shift:"O",altgr:""};
	Keyboard.MAP[Keyboard.P]={normal:"p",shift:"P",altgr:""};
	Keyboard.MAP[Keyboard.Q]={normal:"q",shift:"Q",altgr:""};
	Keyboard.MAP[Keyboard.R]={normal:"r",shift:"R",altgr:""};
	Keyboard.MAP[Keyboard.S]={normal:"s",shift:"S",altgr:""};
	Keyboard.MAP[Keyboard.T]={normal:"t",shift:"T",altgr:""};
	Keyboard.MAP[Keyboard.U]={normal:"u",shift:"U",altgr:""};
	Keyboard.MAP[Keyboard.V]={normal:"v",shift:"V",altgr:""};
	Keyboard.MAP[Keyboard.W]={normal:"w",shift:"W",altgr:""};
	Keyboard.MAP[Keyboard.X]={normal:"x",shift:"X",altgr:""};
	Keyboard.MAP[Keyboard.Y]={normal:"y",shift:"Y",altgr:""};
	Keyboard.MAP[Keyboard.Z]={normal:"z",shift:"Z",altgr:""};


	Keyboard.MAP[Keyboard.DOLLAR]		=	{normal:"$",shift:"£",altgr:"¤"};
	Keyboard.MAP[Keyboard.EQUAL]		=	{normal:"=",shift:"+",altgr:"}"};
	Keyboard.MAP[Keyboard.QUESTION]		=	{normal:",",shift:"?",altgr:""};
	Keyboard.MAP[Keyboard.DOT]			=	{normal:";",shift:".",altgr:""};
	Keyboard.MAP[Keyboard.SLASH]		=	{normal:":",shift:"/",altgr:""};
	Keyboard.MAP[Keyboard.EXCLAMATION]	=	{normal:"!",shift:"§",altgr:""};
	Keyboard.MAP[Keyboard.POWER_TWO]	=	{normal:"!",shift:"§",altgr:""};
	Keyboard.MAP[Keyboard.PERCENT]		=	{normal:"ù",shift:"%",altgr:""};
	Keyboard.MAP[Keyboard.RIGHT_PARENT]	=	{normal:")",shift:"°",altgr:"]"};
	Keyboard.MAP[Keyboard.MICRO]		=	{normal:"*",shift:"µ",altgr:""};
	Keyboard.MAP[Keyboard.TREMA]		=	{normal:"^",shift:"¨",altgr:""};


	Keyboard.MAP[Keyboard.NUMPAD_0]		=	{normal:"0",shift:"0",altgr:"0"};
	Keyboard.MAP[Keyboard.NUMPAD_1]		=	{normal:"1",shift:"1",altgr:"1"};
	Keyboard.MAP[Keyboard.NUMPAD_2]		=	{normal:"2",shift:"2",altgr:"2"};
	Keyboard.MAP[Keyboard.NUMPAD_3]		=	{normal:"3",shift:"3",altgr:"3"};
	Keyboard.MAP[Keyboard.NUMPAD_4]		=	{normal:"4",shift:"4",altgr:"4"};
	Keyboard.MAP[Keyboard.NUMPAD_5]		=	{normal:"5",shift:"5",altgr:"5"};
	Keyboard.MAP[Keyboard.NUMPAD_6]		=	{normal:"6",shift:"6",altgr:"6"};
	Keyboard.MAP[Keyboard.NUMPAD_7]		=	{normal:"7",shift:"7",altgr:"7"};
	Keyboard.MAP[Keyboard.NUMPAD_8]		=	{normal:"8",shift:"8",altgr:"8"};
	Keyboard.MAP[Keyboard.NUMPAD_9]		=	{normal:"9",shift:"9",altgr:"9"};

	Keyboard.MAP[Keyboard.NUMPAD_MULTIPLY]	=	{normal:"*",shift:"*",altgr:"*"};
	Keyboard.MAP[Keyboard.NUMPAD_SLASH]		=	{normal:"/",shift:"/",altgr:"/"};
	Keyboard.MAP[Keyboard.NUMPAD_PLUS]		=	{normal:"+",shift:"+",altgr:"+"};
	Keyboard.MAP[Keyboard.NUMPAD_MINUS]		=	{normal:"-",shift:"-",altgr:"-"};
	Keyboard.MAP[Keyboard.NUMPAD_DOT]		=	{normal:".",shift:".",altgr:"."};

	Keyboard.MAP[Keyboard.SPACE]			=	{normal:" ",shift:" ",altgr:" "};
	Keyboard.MAP[Keyboard.ENTER]			=	{normal:"¤",shift:"¤",altgr:"¤"};


	Keyboard.isMapped = function(keyCode)
	{
		return Keyboard.MAP[keyCode] != undefined;
	};
	
	
	tomahawk_ns.Keyboard = Keyboard;
})();




/**
 * @author The Tiny Spark
 */
(function() {
	
	function MouseEvent(){}

	Tomahawk.registerClass( MouseEvent, "MouseEvent" );
	Tomahawk.extend( "MouseEvent", "Event" );

	function MouseEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	MouseEvent.fromNativeMouseEvent = function(event,bubbles,cancelable,x,y)
	{
		var type = "";
		var msevent = null;
		
		
		
		switch( event.type )
		{
			case "click": type = tomahawk_ns.MouseEvent.CLICK; break;
			case "dblclick": type = tomahawk_ns.MouseEvent.DOUBLE_CLICK; break;
			case "mousemove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "mouseup": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "mousedown": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
		}
		
		msevent = new tomahawk_ns.MouseEvent(type,bubbles,cancelable);
		msevent.stageX = x;
		msevent.stageY = y;
		return msevent;
	};

	MouseEvent.CLICK 			= "click";
	MouseEvent.DOUBLE_CLICK 	= "doubleClick";
	MouseEvent.ROLL_OVER 		= "rollOver";
	MouseEvent.ROLL_OUT 		= "rollOut";
	MouseEvent.MOUSE_MOVE 		= "mouseMove";
	MouseEvent.MOUSE_UP 		= "mouseUp";
	MouseEvent.MOUSE_DOWN 		= "mouseDown";

	tomahawk_ns.MouseEvent = MouseEvent;

})();



/**
 * @author The Tiny Spark
 */
(function() {
	
	function GrayScaleFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( GrayScaleFilter, "GrayScaleFilter" );
	Tomahawk.extend( "GrayScaleFilter", "PixelFilter" );

	GrayScaleFilter.prototype.process = function()
	{
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		
		for (var i=0; i<data.length; i+=4) 
		{
			var r = data[i];
			var g = data[i+1];
			var b = data[i+2];
			var v = 0.2126*r + 0.7152*g + 0.0722*b;
			data[i] = data[i+1] = data[i+2] = v;
		}
		
		this.setPixels(pixels,0,0);
	};

	tomahawk_ns.GrayScaleFilter = GrayScaleFilter;

})();



/**
 * @author The Tiny Spark
 */
 
(function() {

	function PixelFilter(){}
	Tomahawk.registerClass( PixelFilter, "PixelFilter" );

	PixelFilter.BEFORE_DRAWING_FILTER = 0;
	PixelFilter.AFTER_DRAWING_FILTER = 1;
	
	PixelFilter.prototype._canvas = null;
	PixelFilter.prototype._context = null;
	PixelFilter.prototype._object = null;
	PixelFilter.prototype.filterType = 1;
	
	PixelFilter.prototype.getPixels = function(x,y,width,height)
	{
		return this._context.getImageData(x,y,width,height);
	};

	PixelFilter.prototype.setPixels = function(pixels,x,y)
	{
		this._context.putImageData(pixels,x,y);
	};

	PixelFilter.prototype.process = function()
	{
		//code de notre filtre ici
	};

	PixelFilter.prototype.apply = function(canvas, context, object)
	{
		this._canvas = canvas;
		this._object = object;
		this._context = context;
		this.process();
	};

	tomahawk_ns.PixelFilter = PixelFilter;

})();



/**
 * @author The Tiny Spark
 */
(function() {
	
	function ShadowBlurFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
		this.type = tomahawk_ns.PixelFilter.BEFORE_DRAWING_FILTER;
	}
	
	Tomahawk.registerClass( ShadowBlurFilter, "ShadowBlurFilter" );
	Tomahawk.extend( "ShadowBlurFilter", "PixelFilter" );
	
	ShadowBlurFilter.prototype.shadowOffsetX = 1;
	ShadowBlurFilter.prototype.shadowOffsetY = 1;
	ShadowBlurFilter.prototype.shadowBlur 	= 100;
	ShadowBlurFilter.prototype.shadowColor 	= "white";

	ShadowBlurFilter.prototype.process = function()
	{
		var context = this._canvas.getContext("2d");
		this._canvas.width += this.shadowBlur + this.shadowOffsetX;
		this._canvas.height += this.shadowBlur + this.shadowOffsetY;
		context.shadowBlur = this.shadowBlur;
		context.shadowColor = this.shadowColor;
		context.shadowOffsetX = this.shadowOffsetX;
		context.shadowOffsetY = this.shadowOffsetY;
	};

	tomahawk_ns.ShadowBlurFilter = ShadowBlurFilter;

})();



/**
 * @author The Tiny Spark
 * original file extracted from createJs and modified a bit for Tomahawk
 */
(function() {
	

	function Matrix2D(a, b, c, d, tx, ty)
	{
		this.initialize(a, b, c, d, tx, ty);
		this._stack = new Array();
	}

	Tomahawk.registerClass( Matrix2D, "Matrix2D" );
	
	Matrix2D.prototype._stack = null;

	Matrix2D.prototype.save = function()
	{
		this._stack.push(this.a,this.b,this.c,this.d,this.tx,this.ty);
	};

	Matrix2D.prototype.restore = function()
	{
		this.ty = this._stack.pop();
		this.tx = this._stack.pop();
		this.d = this._stack.pop();
		this.c = this._stack.pop();
		this.b = this._stack.pop();
		this.a = this._stack.pop();
	};

	// static public properties:

	/**
	 * An identity matrix, representing a null transformation.
	 * @property identity
	 * @static
	 * @type Matrix2D
	 * @readonly
	 **/
	Matrix2D.prototype.identity = null;// set at bottom of class definition.

	/**
	 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	Matrix2D.DEG_TO_RAD = Math.PI/180;


// public properties:
	/**
	 * Position (0, 0) in a 3x3 affine transformation matrix.
	 * @property a
	 * @type Number
	 **/
	Matrix2D.prototype.a = 1;

	/**
	 * Position (0, 1) in a 3x3 affine transformation matrix.
	 * @property b
	 * @type Number
	 **/
	Matrix2D.prototype.b = 0;

	/**
	 * Position (1, 0) in a 3x3 affine transformation matrix.
	 * @property c
	 * @type Number
	 **/
	Matrix2D.prototype.c = 0;

	/**
	 * Position (1, 1) in a 3x3 affine transformation matrix.
	 * @property d
	 * @type Number
	 **/
	Matrix2D.prototype.d = 1;

	/**
	 * Position (2, 0) in a 3x3 affine transformation matrix.
	 * @property tx
	 * @type Number
	 **/
	Matrix2D.prototype.tx = 0;

	/**
	 * Position (2, 1) in a 3x3 affine transformation matrix.
	 * @property ty
	 * @type Number
	 **/
	Matrix2D.prototype.ty = 0;



// constructor:
	/**
	 * Initialization method. Can also be used to reinitialize the instance.
	 * @method initialize
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This instance. Useful for chaining method calls.
	*/
	Matrix2D.prototype.initialize = function(a, b, c, d, tx, ty) {
		this.a = (a == null) ? 1 : a;
		this.b = b || 0;
		this.c = c || 0;
		this.d = (d == null) ? 1 : d;
		this.tx = tx || 0;
		this.ty = ty || 0;
		return this;
	};

// public methods:
	/**
	 * Concatenates the specified matrix properties with this matrix. All parameters are required.
	 * @method prepend
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.prepend = function(a, b, c, d, tx, ty) {
		var tx1 = this.tx;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			var a1 = this.a;
			var c1 = this.c;
			this.a  = a1*a+this.b*c;
			this.b  = a1*b+this.b*d;
			this.c  = c1*a+this.d*c;
			this.d  = c1*b+this.d*d;
		}
		this.tx = tx1*a+this.ty*c+tx;
		this.ty = tx1*b+this.ty*d+ty;
		return this;
	};

	/**
	 * Appends the specified matrix properties with this matrix. All parameters are required.
	 * @method append
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;

		this.a  = a*a1+b*c1;
		this.b  = a*b1+b*d1;
		this.c  = c*a1+d*c1;
		this.d  = c*b1+d*d1;
		this.tx = tx*a1+ty*c1+this.tx;
		this.ty = tx*b1+ty*d1+this.ty;
		return this;
	};

	/**
	 * Prepends the specified matrix with this matrix.
	 * @method prependMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.prependMatrix = function(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	};

	/**
	 * Appends the specified matrix with this matrix.
	 * @method appendMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.appendMatrix = function(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
	 * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method prependTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
	 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method appendTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		
		tomahawk_ns.Matrix2D.TOTAL_COUNT++;
		
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX*this.a+regY*this.c; 
			this.ty -= regX*this.b+regY*this.d;
		}
		return this;
	};

	/**
	 * Applies a rotation transformation to the matrix.
	 * @method rotate
	 * @param {Number} angle The angle in radians. To use degrees, multiply by <code>Math.PI/180</code>.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a = a1*cos-this.b*sin;
		this.b = a1*sin+this.b*cos;
		this.c = c1*cos-this.d*sin;
		this.d = c1*sin+this.d*cos;
		this.tx = tx1*cos-this.ty*sin;
		this.ty = tx1*sin+this.ty*cos;
		return this;
	};

	/**
	 * Applies a skew transformation to the matrix.
	 * @method skew
	 * @param {Number} skewX The amount to skew horizontally in degrees.
	 * @param {Number} skewY The amount to skew vertically in degrees.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.skew = function(skewX, skewY) {
		skewX = skewX*Matrix2D.DEG_TO_RAD;
		skewY = skewY*Matrix2D.DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this;
	};

	/**
	 * Applies a scale transformation to the matrix.
	 * @method scale
	 * @param {Number} x The amount to scale horizontally
	 * @param {Number} y The amount to scale vertically
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.c *= x;
		this.b *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	};

	/**
	 * Translates the matrix on the x and y axes.
	 * @method translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
		return this;
	};

	/**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @method identity
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	};

	/**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @method invert
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
		return this;
	};

	/**
	 * Returns true if the matrix is an identity matrix.
	 * @method isIdentity
	 * @return {Boolean}
	 **/
	Matrix2D.prototype.isIdentity = function() {
		return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
	};

	/**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.transformPoint = function(x, y, pt) {
		pt = pt||{};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	};

	/**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @method decompose
	 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.decompose = function(target) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
		// even when scale is negative
		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		if (skewX == skewY) {
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	};

	/**
	 * Reinitializes all matrix properties to those specified.
	 * @method reinitialize
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.reinitialize = function(a, b, c, d, tx, ty) {
		this.initialize(a,b,c,d,tx,ty);
		return this;
	};
	
	/**
	 * Copies all properties from the specified matrix to this matrix.
	 * @method copy
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.copy = function(matrix) {
		return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	};

	/**
	 * Returns a clone of the Matrix2D instance.
	 * @method clone
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 **/
	Matrix2D.prototype.clone = function() {
		return (new Matrix2D()).copy(this);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	Matrix2D.prototype.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	};

	// this has to be populated after the class is defined:
	Matrix2D.identity = new Matrix2D();
	
	Matrix2D.TOTAL_COUNT = 0;
	tomahawk_ns.Matrix2D = Matrix2D;
	
})();




/**
 * ...
 * @author Thot
 */
(function() {

function Matrix4x4()
{
	this.init (1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
}

// public
Matrix4x4.prototype.data = null;

Matrix4x4.prototype.init = function( 		a, b, c, d, 
											e, f, g, h, 
											i, j, k, l, 
											m, n, o, p ){
											
										
		
	var container = null;
	container = new Array();

	container[0] 	= a;
	container[1] 	= b;
	container[2] 	= c;
	container[3] 	= d;
	container[4] 	= e;
	container[5] 	= f;
	container[6] 	= g;
	container[7] 	= h;
	container[8] 	= i;
	container[9] 	= j;
	container[10] 	= k;
	container[11] 	= l;
	container[12] 	= m;
	container[13] 	= n;
	container[14] 	= o;
	container[15] 	= p;
	
	this.data = container;
	return this;
	
};

Matrix4x4.prototype.clone = function()
{
	var matrix = new tomahawk_ns.Matrix4x4();
	var i = 16;
	
	while( --i > -1 )
	{
		matrix.data[i] = this.data[i];
	}
	
	return matrix;
};

Matrix4x4.prototype.translate = function( tx, ty, tz )
{
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[3] = tx;
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[7] = ty;
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[11] = tz;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX );
	return this;
};

Matrix4x4.prototype.scale = function( sx, sy, sz )
{	
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[0] = sx;
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[5] = sy;
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[10] = sz;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._SCALE_MATRIX );
	return this;
};

Matrix4x4.prototype.rotate =  function( rx, ry, rz )
{
	var c = tomahawk_ns.Matrix4x4._cos[rx];
	var s = tomahawk_ns.Matrix4x4._sin[rx];
	
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[5] = c;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[6] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[9] = s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[10] = c;
	
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX );
	
	c = tomahawk_ns.Matrix4x4._cos[ry];
	s = tomahawk_ns.Matrix4x4._sin[ry];
	
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[2] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[8] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[10] = c;
	
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX );
	
	c = tomahawk_ns.Matrix4x4._cos[rz];
	s = tomahawk_ns.Matrix4x4._sin[rz];
	
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[1] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[4] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[5] = c;
	
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX );
	return this;
};

Matrix4x4.prototype.rotateX = function( p_rotation )
{
	var c = tomahawk_ns.Matrix4x4._cos[p_rotation];
	var s = tomahawk_ns.Matrix4x4._sin[p_rotation];
	
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[5] = c;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[6] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[9] = s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[10] = c;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX );
	return this;
};

Matrix4x4.prototype.rotateY = function( p_rotation )
{
	var c = tomahawk_ns.Matrix4x4._cos[p_rotation];
	var s = tomahawk_ns.Matrix4x4._sin[p_rotation];
	
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[2] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[8] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[10] = c;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX );
	
	return this;
};

Matrix4x4.prototype.rotateZ = function( p_rotation )
{
	var c = tomahawk_ns.Matrix4x4._cos[p_rotation];
	var s = tomahawk_ns.Matrix4x4._sin[p_rotation];
						
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[1] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[4] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[5] = c;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX );
	
	return this;
};

Matrix4x4.prototype.multiplyByNumber = function( p_number )
{
	var data1 = this.data;
	
	data1[0] *= p_number;
	data1[1] *= p_number;
	data1[2] *= p_number;
	data1[3] *= p_number;
	data1[4] *= p_number;
	data1[5] *= p_number;
	data1[6] *= p_number;
	data1[7] *= p_number;
	data1[8] *= p_number;
	data1[9] *= p_number;
	data1[10] *= p_number;
	data1[11] *= p_number;
	data1[12] *= p_number;
	data1[13] *= p_number;
	data1[14] *= p_number;
	data1[15] *= p_number;
	
	return this;
};

Matrix4x4.prototype.prependMatrix = function(matrix)
{
	return matrix.clone().appendMatrix(this);
};

Matrix4x4.prototype.appendTransform = function(	x, 
												y, 
												z,
												scaleX, 
												scaleY, 
												scaleZ,
												rotationX, 
												rotationY, 
												rotationZ,
												pivotX,
												pivotY,
												pivotZ)
{
	
	return this	.translate(x + pivotX,y + pivotY,z + pivotZ)
				.scale(scaleX,scaleY,scaleZ)
				.rotate(rotationX,rotationY,rotationZ)
				.translate(-pivotX,-pivotY,-pivotZ);
};

Matrix4x4.prototype.prependMatrix = function( p_mat )
{
	var data1 = this.data;
	var data2 = p_mat.data;
	
	var a00 = data2[0], a01 = data2[1], a02 = data2[2], a03 = data2[3];
	var a10 = data2[4], a11 = data2[5], a12 = data2[6], a13 = data2[7];
	var a20 = data2[8], a21 = data2[9], a22 = data2[10], a23 = data2[11];
	var a30 = data2[12], a31 = data2[13], a32 = data2[14], a33 = data2[15];
	
	var b00 = data1[0], b01 = data1[1], b02 = data1[2], b03 = data1[3];
	var b10 = data1[4], b11 = data1[5], b12 = data1[6], b13 = data1[7];
	var b20 = data1[8], b21 = data1[9], b22 = data1[10], b23 = data1[11];
	var b30 = data1[12], b31 = data1[13], b32 = data1[14], b33 = data1[15];
	
	data1[0] 	= a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
	data1[1] 	= a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
	data1[2] 	= a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
	data1[3] 	= a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
	
	data1[4] 	= a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
	data1[5] 	= a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
	data1[6] 	= a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
	data1[7] 	= a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
	
	data1[8] 	= a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
	data1[9] 	= a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
	data1[10] 	= a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
	data1[11] 	= a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
	
	data1[12] 	= a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
	data1[13] 	= a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
	data1[14] 	= a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
	data1[15] 	= a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
	
	return this;
};

Matrix4x4.prototype.appendMatrix = function( p_mat )
{
	var data1 = this.data;
	var data2 = p_mat.data;
	
	var a00 = data1[0], a01 = data1[1], a02 = data1[2], a03 = data1[3];
	var a10 = data1[4], a11 = data1[5], a12 = data1[6], a13 = data1[7];
	var a20 = data1[8], a21 = data1[9], a22 = data1[10], a23 = data1[11];
	var a30 = data1[12], a31 = data1[13], a32 = data1[14], a33 = data1[15];
	
	var b00 = data2[0], b01 = data2[1], b02 = data2[2], b03 = data2[3];
	var b10 = data2[4], b11 = data2[5], b12 = data2[6], b13 = data2[7];
	var b20 = data2[8], b21 = data2[9], b22 = data2[10], b23 = data2[11];
	var b30 = data2[12], b31 = data2[13], b32 = data2[14], b33 = data2[15];
	
	data1[0] 	= a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
	data1[1] 	= a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
	data1[2] 	= a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
	data1[3] 	= a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
	
	data1[4] 	= a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
	data1[5] 	= a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
	data1[6] 	= a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
	data1[7] 	= a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
	
	data1[8] 	= a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
	data1[9] 	= a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
	data1[10] 	= a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
	data1[11] 	= a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
	
	data1[12] 	= a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
	data1[13] 	= a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
	data1[14] 	= a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
	data1[15] 	= a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
	
	return this;
};


Matrix4x4.prototype.determinant = function() 
{
		var data = this.data;
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = data[0], a01 = data[1], a02 = data[2], a03 = data[3];
        var a10 = data[4], a11 = data[5], a12 = data[6], a13 = data[7];
        var a20 = data[8], a21 = data[9], a22 = data[10], a23 = data[11];
        var a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];

        return  ( 		a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
                        a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
                        a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
                        a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
                        a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
                        a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33 	);
};

Matrix4x4.prototype.identity = function()
{
	this.init( 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1 );
	return this;
};

Matrix4x4.prototype.invert = function() 
{
	var data = this.data;
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = data[0], a01 = data[1], a02 = data[2], a03 = data[3];
	var a10 = data[4], a11 = data[5], a12 = data[6], a13 = data[7];
	var a20 = data[8], a21 = data[9], a22 = data[10], a23 = data[11];
	var a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];
	
	var b00 = a00*a11 - a01*a10;
	var b01 = a00*a12 - a02*a10;
	var b02 = a00*a13 - a03*a10;
	var b03 = a01*a12 - a02*a11;
	var b04 = a01*a13 - a03*a11;
	var b05 = a02*a13 - a03*a12;
	var b06 = a20*a31 - a21*a30;
	var b07 = a20*a32 - a22*a30;
	var b08 = a20*a33 - a23*a30;
	var b09 = a21*a32 - a22*a31;
	var b10 = a21*a33 - a23*a31;
	var b11 = a22*a33 - a23*a32;
	
	// Calculate the determinant (inlined to avoid double-caching)
	var d = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;
	var id = 1/d;
	
	data[0] = (a11*b11 - a12*b10 + a13*b09)*id;
	data[1] = (-a01*b11 + a02*b10 - a03*b09)*id;
	data[2] = (a31*b05 - a32*b04 + a33*b03)*id;
	data[3] = (-a21*b05 + a22*b04 - a23*b03)*id;
	data[4] = (-a10*b11 + a12*b08 - a13*b07)*id;
	data[5] = (a00*b11 - a02*b08 + a03*b07)*id;
	data[6] = (-a30*b05 + a32*b02 - a33*b01)*id;
	data[7] = (a20*b05 - a22*b02 + a23*b01)*id;
	data[8] = (a10*b10 - a11*b08 + a13*b06)*id;
	data[9] = (-a00*b10 + a01*b08 - a03*b06)*id;
	data[10] = (a30*b04 - a31*b02 + a33*b00)*id;
	data[11] = (-a20*b04 + a21*b02 - a23*b00)*id;
	data[12] = (-a10*b09 + a11*b07 - a12*b06)*id;
	data[13] = (a00*b09 - a01*b07 + a02*b06)*id;
	data[14] = (-a30*b03 + a31*b01 - a32*b00)*id;
	data[15] = (a20*b03 - a21*b01 + a22*b00)*id;
	
	return this;
};

Matrix4x4.prototype.transpose = function() 
{		
	// Cache the matrix values (makes for huge speed increases!)
	var data = this.data;
	
	var a00 = data[0], a01 = data[1], a02 = data[2], a03 = data[3];
	var a10 = data[4], a11 = data[5], a12 = data[6], a13 = data[7];
	var a20 = data[8], a21 = data[9], a22 = data[10], a23 = data[11];
	var a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];

	data[0] = a00;
	data[1] = a10;
	data[2] = a20;
	data[3] = a30;
	data[4] = a01;
	data[5] = a11;
	data[6] = a21;
	data[7] = a31;
	data[8] = a02;
	data[9] = a12;
	data[10] = a22;
	data[11] = a32;
	data[12] = a03;
	data[13] = a13;
	data[14] = a23;
	data[15] = a33;
	
	return this;
};


Matrix4x4.prototype.frustum = function(left, right, bottom, top, near, far, dest) 
{
	var data = this.data;
	var temp1 = 2 * near;
	var temp2 = right - left;
	var temp3 = top - bottom;
	var temp4 = far - near;
	
	data[0] = temp1 / temp2;
	data[1] = 0;
	data[2] = 0;
	data[3] = 0;
	data[4] = 0;
	data[5] = temp1 / temp3;
	data[6] = 0;
	data[7] = 0;
	data[8] = (right + left) / temp2;
	data[9] = (top + bottom) / temp3;
	data[10] = (-far - near) / temp4;
	data[11] = -1;
	data[12] = 0;
	data[13] = 0;
	data[14] = (-temp1 * far) / temp4;
	data[15] = 0;
	return this;
};

Matrix4x4.prototype.perspective = function(fovy, aspect, near, far) 
{
	var top = near * Math.tan(fovy * Math.PI / 360);
	var right = top * aspect;
	this.frustum(-right, right, -top, top, near, far);
	return this;
};

Matrix4x4.prototype.ortho = function(left, right, bottom, top, near, far ) 
{
	var lr = (left - right);
	var tb = (top - bottom);
	var fn = (far - near);
	var data = this.data;
	data[0] = 2 / lr;
	data[1] = 0;
	data[2] = 0;
	data[3] = 0;
	data[4] = 0;
	data[5] = 2 / tb;
	data[6] = 0;
	data[7] = 0;
	data[8] = 0;
	data[9] = 0;
	data[10] = -2 / fn;
	data[11] = 0;
	data[12] = (left + right) / lr;
	data[13] = (top + bottom) / tb;
	data[14] = (far + near) / fn;
	data[15] = 1;
	
	return this;
};

Matrix4x4.prototype.str = function() 
{
	var data = this.data;
	return '[\n' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + data[3] + 
			'\n, '+ data[4] + ', ' + data[5] + ', ' + data[6] + ', ' + data[7] + 
			'\n, '+ data[8] + ', ' + data[9] + ', ' + data[10] + ', ' + data[11] + 
			'\n, '+ data[12] + ', ' + data[13] + ', ' + data[14] + ', ' + data[15] + ']';
};



Matrix4x4.prototype.transformPoint3D = function(point3D)
{	
	//var x = point3D.x, y = point3D.y, z = point3D.z;
	//var m = this.data;
    //point3D.x = m[0] * x + m[4] * y + m[8] * z + m[12];
    //point3D.y = m[1] * x + m[5] * y + m[9] * z + m[13];
    //point3D.z = m[2] * x + m[6] * y + m[10] * z + m[14];
	
	var mat1 = new tomahawk_ns.Matrix4x4();
	mat1.translate(point3D.x,point3D.y,point3D.z).prependMatrix(this);
	
	point3D.x = mat1.data[3];
	point3D.y = mat1.data[7];
	point3D.z = mat1.data[11];
	return point3D;
};


Matrix4x4.toMatrix2D = function(mat)
{
	var matrix2D = new tomahawk_ns.Matrix2D();
	matrix2D.a = mat.data[0];
	matrix2D.b = mat.data[4];
	matrix2D.c = mat.data[1];
	matrix2D.d = mat.data[5];
	matrix2D.tx = mat.data[3];
	matrix2D.ty = mat.data[7];
	
	return matrix2D;
};

Matrix4x4.toMatrix4x4 = function(mat2d)
{
	var mat = new tomahawk_ns.Matrix4x4();
	mat.data[0] = mat2d.a;
	mat.data[4] = mat2d.b;
	mat.data[1] = mat2d.c;
	mat.data[5] = mat2d.d;
	mat.data[3] = mat2d.tx;
	mat.data[7] = mat2d.ty;
	
	return mat;
};


// static



Matrix4x4._getMatrixPattern = function( p_type )
{
	var c = Matrix4x4._cos[0];
	var s = Matrix4x4._sin[0];
	var sx = 1;
	var sy = 1;
	var sz = 1;
	var tx = 0;
	var ty = 0;
	var tz = 0;
	var mat = new Matrix4x4();
	
	switch( p_type )
	{
		case "translate":
			mat.init (	
							1, 	0, 	0, 	tx,
							0, 	1, 	0, 	ty,
							0, 	0, 	1, 	tz,
							0, 	0, 	0, 	1
					);
			break;
			
		case "scale":
			mat.init( 
							sx, 0, 	0, 	0,
							0, 	sy, 0, 	0,
							0, 	0, 	sz, 0,
							0, 	0, 	0, 	1
					);
			break;
			
		case "rotX":
			mat.init(
							1, 	0, 	0, 	0,
							0, 	c, -s, 	0,
							0, 	s, 	c, 	0,
							0, 	0, 	0, 	1
					);
			break;
			
		case "rotY":
			mat.init(
							c, 0, -s,0,
							0, 1, 0, 0,
							s, 0, c, 0,
							0, 0, 0, 1
						);
					
				break;
			
		case "rotZ":
			mat.init(
						c, 	-s, 0, 	0,
						s, 	c, 	0, 	0,
						0, 	0, 	1, 	0,
						0, 	0, 	0, 	1
					);
			break;
	}
	
	return mat;
};


Matrix4x4._cos = new Array();
Matrix4x4._sin = new Array();
Matrix4x4._tan = new Array();

Matrix4x4.TO_RADIANS = Math.PI / 180;
Matrix4x4.TO_DEGREES = 180 / Math.PI;


Matrix4x4.init = function()
{
	var i = 0;
	for( i = 0; i < 360; i++ )
	{
		Matrix4x4._cos[i] = Math.cos( i * Matrix4x4.TO_RADIANS );
		Matrix4x4._sin[i] = Math.sin( i * Matrix4x4.TO_RADIANS );
		Matrix4x4._tan[i] = Math.tan( i * Matrix4x4.TO_RADIANS );
	}
};

Matrix4x4.init();

Matrix4x4._ROTATION_X_MATRIX 	= Matrix4x4._getMatrixPattern("rotX");
Matrix4x4._ROTATION_Y_MATRIX 	= Matrix4x4._getMatrixPattern("rotY");
Matrix4x4._ROTATION_Z_MATRIX 	= Matrix4x4._getMatrixPattern("rotZ");
Matrix4x4._TRANSLATE_MATRIX 	= Matrix4x4._getMatrixPattern("translate");
Matrix4x4._SCALE_MATRIX			= Matrix4x4._getMatrixPattern("scale");
Matrix4x4._instance				= new Matrix4x4();

tomahawk_ns.Matrix4x4 			= Matrix4x4;
	
})();




/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function Point(x,y)
	{
		this.x = x, this.y = y
	}
	
	Tomahawk.registerClass( Point, "Point" );
	
	
	Point.prototype.x = 0;
	Point.prototype.y = 0;
	
	
	tomahawk_ns.Point = Point;
})();



/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function Point3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Point3D, "Point3D" );
	
	
	Point3D.prototype.x = 0;
	Point3D.prototype.y = 0;
	Point3D.prototype.z = 0;
	
	
	tomahawk_ns.Point3D = Point3D;
})();



/**
 * @author The Tiny Spark
 */
 
 (function() {
	
	
	Tomahawk.registerClass(Rectangle,"Rectangle");

	function Rectangle(){}

	Rectangle.prototype.x 		= 0;
	Rectangle.prototype.y 		= 0;
	Rectangle.prototype.width 	= 0;
	Rectangle.prototype.height 	= 0;
	Rectangle.prototype.left 	= 0;
	Rectangle.prototype.right 	= 0;
	Rectangle.prototype.top 	= 0;
	Rectangle.prototype.bottom 	= 0;

	tomahawk_ns.Rectangle = Rectangle;

})();



/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function Vector3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Vector3D, "Vector3D" );
	
	
	Vector3D.prototype.x = 0;
	Vector3D.prototype.y = 0;
	Vector3D.prototype.z = 0;
	
	Vector3D.prototype.crossProduct = function(vector)
	{
		var x = this.y * vector.z - this.z * vector.y;
		var y = this.z * vector.x - this.x * vector.z;
		var z = this.x * vector.y - this.y * vector.x;
		
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	};
	
	tomahawk_ns.Vector3D = Vector3D;
	
	
})();



/**
 * @author The Tiny Spark
 */
(function() {
	
	function InputTextField()
	{
		tomahawk_ns.SelectableTextField.apply(this);
		this.addEventListener( tomahawk_ns.Event.ADDED_TO_STAGE, this, this._inputTextFieldAddedHandler );
	}

	Tomahawk.registerClass(InputTextField,"InputTextField");
	Tomahawk.extend("InputTextField","SelectableTextField");

	InputTextField.prototype._inputTextFieldAddedHandler = function(event)
	{
		this.removeEventListener( tomahawk_ns.Event.ADDED_TO_STAGE, this, this._inputTextFieldAddedHandler );
		this.stage.addEventListener( tomahawk_ns.KeyEvent.KEY_DOWN, this, this._keyHandler );
	};
	
	InputTextField.prototype._keyHandler = function(event)
	{
		if( this.getFocus() == false )
			return;
		
		event.nativeEvent.preventDefault();
		event.nativeEvent.stopImmediatePropagation();
		event.nativeEvent.stopPropagation();
		
		var range = this.getSelectionRange();
			
		if( this.isSelected() == true && event.keyCode != tomahawk_ns.Keyboard.LEFT && event.keyCode != tomahawk_ns.Keyboard.RIGHT )
		{
			this.removeTextBetween( range.start, range.end );
		}
		
		if( event.keyCode == tomahawk_ns.Keyboard.BACKSPACE )
		{
			this.removeCharAt(this.getCurrentIndex());
		}
		else if( event.keyCode == tomahawk_ns.Keyboard.SUPPR )
		{
			this.removeCharAt(this.getCurrentIndex() + 1);
		}
		else if( event.keyCode == tomahawk_ns.Keyboard.LEFT || event.keyCode == tomahawk_ns.Keyboard.RIGHT)
		{
			var step = ( event.keyCode == tomahawk_ns.Keyboard.LEFT ) ? -1 : 1;
			this.setCurrentIndex(this.getCurrentIndex()+step);
		}
		else if( event.isCharacter == true )
		{
			var newline = false;
			 //special select all
			if( event.keyCode == tomahawk_ns.Keyboard.A && event.ctrlKey )
			{
				this.selectAll();
				return;
			}
			
			var text = event.value;
			
			if( event.keyCode == tomahawk_ns.Keyboard.V && event.ctrlKey )
			{
				text = window.prompt ("Copy to clipboard: Ctrl+C, Enter", "");
				this.addTextAt(text,this.getCurrentIndex() + 1);
			}
			else
			{
				if( event.keyCode == tomahawk_ns.Keyboard.ENTER )
				{
					text = "";
					newline = true;
				}
				
				this.addCharAt(text,this.getCurrentIndex() + 1, newline);
			}
		}
	};

	tomahawk_ns.InputTextField = InputTextField;
})();



/**
 * @author The Tiny Spark
 */

(function() {
	
 
	function Letter(value)
	{
		tomahawk_ns.DisplayObject.apply(this);		
		Letter._metricsContext = Letter._metricsContext || document.createElement("canvas").getContext("2d");
		this.setTextFormat( new tomahawk_ns.TextFormat() );
		this.value = ( value == undefined ) ? "" : value;
	}

	Tomahawk.registerClass(Letter,"Letter");
	Tomahawk.extend("Letter","DisplayObject");

	Letter.prototype.newline 			= false;
	Letter.prototype.value 				= "";
	Letter.prototype.format 			= null;
	Letter.prototype.index 				= 0;
	Letter.prototype.textWidth 			= 0;	
	Letter.prototype.textHeight 		= 0;	
	Letter.prototype.selected			= false;
	Letter._metricsContext				= null;
	
	
	Letter.prototype.setTextFormat = function(value)
	{
		this.format = value;
		this.updateMetrics();
	};

	Letter.prototype.updateMetrics = function()
	{
		var context = Letter._metricsContext;
		context.save();
		
		this.format.updateContext(context);
		this.textHeight = ( context.measureText('M').width );
		this.textWidth = context.measureText(this.value).width;
		this.width = this.textWidth;
		this.height = this.textHeight * 1.4;
		
		context.restore();
	};

	Letter.prototype.draw = function(context)
	{
		if( this.selected == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.format.backgroundSelectedColor;
			context.fillRect(0, 0, this.textWidth, this.textHeight );
			context.fill();
			context.restore();
		}
		
		this.format.updateContext(context);
		context.fillText(this.value,0,this.textHeight);
		
		if( this.format.underline == true )
		{
			context.save();
			context.beginPath();
			context.moveTo(0,this.textHeight + 2);
			context.lineTo( this.textWidth,this.textHeight + 2);
			context.stroke();
			context.restore();
		}	
	};

	Letter.prototype.clone = function()
	{
		var letter = new tomahawk_ns.Letter(this.value);
		letter.format = this.format.clone();
		letter.index = this.index;
		letter.row = this.row;
		letter.textWidth = this.textWidth;
		letter.textHeight = this.textHeight;
		letter.selected = this.selected;
		
		return letter;
	};
	
	tomahawk_ns.Letter = Letter;
})();



/**
 * @author The Tiny Spark
 */
(function() {
	

	function SelectableTextField()
	{
		tomahawk_ns.TextField.apply(this);
		this.mouseEnabled = true;
	}

	Tomahawk.registerClass(SelectableTextField,"SelectableTextField");
	Tomahawk.extend("SelectableTextField","TextField");

	SelectableTextField.prototype._ignoreNextClick = false;
	SelectableTextField.prototype._startPoint = null;
	SelectableTextField.prototype._down = false;

	SelectableTextField.prototype.getObjectUnder = function(x,y)
	{
		if( tomahawk_ns.DisplayObject.prototype.hitTest.apply(this,[x,y] ) )
			return this;
			
		return null;
	};

	SelectableTextField.prototype._selectCurrentWord = function()
	{
		this.unSelect();
		var range = this.getWordRangeAt(this.getCurrentIndex());
		this.selectBetween(range.start,range.end);
	};

	SelectableTextField.prototype._setIndexUnderMouse = function(x,y)
	{
		var pt = this.globalToLocal(x, y);
		var letters = this.getLettersIn(pt.x,pt.y,1,1);
		this.unSelect();
		
		if( letters.length > 0 )
		{
			this.setCurrentIndex( letters[0].index );
		}
	};

	
	SelectableTextField.prototype.setFocus = function(value)
	{
		tomahawk_ns.TextField.prototype.setFocus.apply(this,[value]);
		
		this.removeEventListener( tomahawk_ns.MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.CLICK, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
		
		if( value == true )
		{
			this.addEventListener( tomahawk_ns.MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.CLICK, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
		}
		
		this.unSelect();
	};
	
	SelectableTextField.prototype._mouseEventHandler = function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.DOUBLE_CLICK )
		{
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._selectCurrentWord();
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_UP )
		{
			this._down = false;
		}
		
		if( event.type == tomahawk_ns.MouseEvent.CLICK )
		{
			this._down = false;
			
			if( this._ignoreNextClick == true )
			{
				this._ignoreNextClick = false;
			}
			else
			{
				this._setIndexUnderMouse(event.stageX,event.stageY);
			}
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_MOVE && this._down == true && this._startPoint != null)
		{
			var endPoint = this.globalToLocal(event.stageX, event.stageY);
			var x = ( endPoint.x < this._startPoint.x ) ? endPoint.x : this._startPoint.x;
			var x2 = ( endPoint.x < this._startPoint.x ) ? this._startPoint.x : endPoint.x;
			var y = ( endPoint.y < this._startPoint.y ) ? endPoint.y : this._startPoint.y;
			var y2 = ( endPoint.y < this._startPoint.y ) ? this._startPoint.y : endPoint.y;
			var width = x2 - x;
			var height = y2 - y;
			
			this.selectInto(x,y,width,height);
			this._ignoreNextClick = true;
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN)
		{
			this._down = true;
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._startPoint = this.globalToLocal(event.stageX, event.stageY);
			return;
		}

	};

	SelectableTextField.prototype.selectInto = function(x,y,width,height)
	{
		var result = this.getLettersIn(x,y,width,height);
		var i = result.length;
		var letter = null;
		var start = -1;
		var end = -1;
		
		while( --i > -1 )
		{
			letter = result[i];
			start = ( start == -1 || letter.index < start ) ? letter.index : start;
			end = ( end == -1 || letter.index > end ) ? letter.index : end;
		}
		
		this.selectBetween(start,end);
	};

	SelectableTextField.prototype.getLettersIn = function(x,y,width,height)
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		var result = new Array();
		var word = null;
		var bounds = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			word = letter.parent;
			
			if( word == null )
				continue;
				
			if( 
				word.x > x + width ||
				word.x + word.width < x || 
				word.y + word.height < y || 
				word.y > y + height 
			)
			{
				continue;
			}
			
			bounds = letter.getBoundingRectIn(this);
			
			if( bounds.left > x + width ||
				bounds.right < x ||
				bounds.top > y + height ||
				bounds.bottom < y 
			)
			{
				continue;
			}
			
			result.push( letter );
		}
		
		return result;
	};

	SelectableTextField.prototype.getSelectionRange = function()
	{
		var start = -1;
		var end = -1;
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			if( letter.selected == true )
			{
				if( end == -1 )
				{
					end = i;
				}
				
				if( end > 0 )
				{
					start = i;
				}
			}
		}
		
		return {start: start, end: end};
	};

	SelectableTextField.prototype.isSelected = function()
	{
		var range =  this.getSelectionRange();
		return ( range.start >= 0 && range.end > range.start );
	};

	SelectableTextField.prototype.selectAll = function()
	{
		this.selectBetween(0,this.getLetters().length);
	};

	SelectableTextField.prototype.unSelect = function()
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			
			if( letter.selected == true && letter.parent != null )
			{
				letter.parent.needRefresh = true;
			}
			
			letter.selected = false;
		}
		
		this._refreshNextFrame = true;
	};

	SelectableTextField.prototype.selectBetween = function(startIndex, endIndex)
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			
			if( i >= startIndex && i <= endIndex )
			{
				letter.selected = true;
				if( letter.parent != null )
					letter.parent.needRefresh = true;
			}
			else
			{
				if( letter.selected == true && letter.parent != null)
				{
					letter.parent.needRefresh = true;
				}
				letter.selected = false;
			}
		}
		this._refreshNextFrame = true;
	};

	tomahawk_ns.SelectableTextField = SelectableTextField;
})();




/**
 * @author The Tiny Spark
 */
(function() {
	
	function TextField()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.defaultTextFormat = new tomahawk_ns.TextFormat();
		this.width = this.height = 100;
		this._letters = new Array();
		this._text = "";
	}

	Tomahawk.registerClass(TextField,"TextField");
	Tomahawk.extend("TextField","DisplayObjectContainer");

	TextField.prototype.defaultTextFormat 	= null;
	TextField.prototype.currentIndex 		= null;
	TextField.prototype.background 			= false;
	TextField.prototype.border 				= false;
	TextField.prototype.padding 			= 0;
	TextField.prototype.backgroundColor 	= "white";
	TextField.prototype.borderColor 		= "black";
	TextField.prototype.autoSize 			= false;
	TextField.prototype.focusable			= true;
	
	TextField.prototype._focused 			= false;
	TextField.prototype._lastWidth 			= 0;
	TextField.prototype._refreshNextFrame 	= true;
	TextField.prototype._textAlign 			= "left";
	TextField.prototype._text 				= null;
	TextField.prototype._drawCursor	 		= false;
	TextField.prototype._drawCursorTime 	= 0;
	TextField.prototype._letters 			= null;
	
	TextField.ALIGN_LEFT 					= "left";
	TextField.ALIGN_CENTER 					= "center";
	TextField.ALIGN_RIGHT 					= "right";
	TextField.ALIGN_JUSTIFY 				= "justify";

	
	TextField.prototype.getTextAlign = function()
	{
		return this._textAlign;
	};
	
	TextField.prototype.setTextAlign = function(value)
	{
		if( this._textAlign == value )
			return;
			
		this._textAlign = value;
		this._refreshNextFrame = true;
	};
	
	TextField.prototype.setCurrentIndex = function(index)
	{
		if( this.currentIndex == index )
			return;
			
		this.currentIndex = index;
		this._refreshNextFrame = true;
	};

	TextField.prototype.getWordRangeAt = function(index)
	{
		var letter = null;
		var word = this.getWordAt(index);
		var start = -1;
		var index = -1;
		
		if( word != null )
		{			
			start = word.getStartIndex();
			end = word.getEndIndex();
		}
		
		return {start: start, end: end};
	};

	TextField.prototype.getCurrentIndex = function()
	{
		return this.currentIndex;
	};

	TextField.prototype.setFocus = function(value)
	{
		if( this._focused == value )
			return;
			
		this._focused = value;
		var type = ( this._focused == true ) ? tomahawk_ns.Event.FOCUSED : tomahawk_ns.Event.UNFOCUSED;
		var focusEvent = new tomahawk_ns.Event( type, true, true );
		this.dispatchEvent(focusEvent);
		
		if( this._focused == false )
		{
			this.setCurrentIndex(-1);
		}
		else
		{
			this.setCurrentIndex(0);
		}
	};

	TextField.prototype.getFocus = function()
	{
		return this._focused;
	};

	TextField.prototype.setTextFormat = function( format, startIndex, endIndex )
	{
		var end = ( endIndex == undefined ) ? startIndex : endIndex;
		var i = startIndex;
		var letter = null;
		var word = null;
		var currentWord = null;
		
		for( ; i <= end; i++ )
		{
			letter = this.getLetterAt(i);
			if( letter != null )
			{
				this._refreshNextFrame = true;
				letter.setTextFormat(format);
				if( letter.parent != null )
					letter.parent.needRefresh = true;
			}
		}
	};

	TextField.prototype.getTextFormat = function(index)
	{
		var letter = this.getLetterAt(index);
		if( letter == null )
			return this.defaultTextFormat.clone();
			
		return letter.format.clone();
	};

	TextField.prototype.getText = function()
	{
		return this._text;
	};

	TextField.prototype.setText = function(value)
	{
		if( this._text == value )
			return;
			
		this._text = "";
		
		while( this.children.length > 0 )
			this.removeChildAt(0);
			
		this._letters = new Array();
			
		var i = 0;
		var max = value.length;
		
		for( i = 0; i < max; i++ )
		{
			this.addCharAt(value[i], i);
		}
	};

	TextField.prototype.getLetters = function()
	{
		return this._letters;
	};

	TextField.prototype.getLetterAt = function(index)
	{
		var letters = this.getLetters();
		return letters[index] || null;
	};
	
	TextField.prototype.getWordAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var word = null;
		
		if( letter == null )
			return null;
			
		word = letter.parent;
		
		return word;
	};

	TextField.prototype.addCharAt = function(value,index,isNewline)
	{
		var wordIndex =  ( index == 0 ) ? 0 : index - 1 ;
		var letter = new tomahawk_ns.Letter();
		var previous = this.getLetterAt(index-1);
		var currentWord = this.getWordAt(wordIndex);
		var tab1 = this._letters.slice(0,index);
		var tab2 = this._letters.slice(index);
		
		//create letter
		isNewline = ( isNewline == true ) ? true : false;
		letter.value = value;
		letter.newline = isNewline;
		letter.setTextFormat( ( previous == null ) ? this.defaultTextFormat.clone() : previous.format.clone() );
		
		//rebuild letters array
		tab1.push(letter);
		this._letters = tab1.concat(tab2);
		
		this.setCurrentIndex(index); //set current index
		this._refreshNextFrame = true; //refresh textfield at next frame
		this._text = this._text.substr(0,index) + value + this._text.substr(index); // rebuild text value
		
		if( currentWord == null )
		{
			currentWord = new tomahawk_ns.Word();
		}
		
		this.addChild(currentWord);
		currentWord.needRefresh = true;
		currentWord.addLetterAt(letter,index - currentWord.getStartIndex());
		
		this._resetLettersIndex(); // reset letters index
		this._cutWord(currentWord); // cut the word if necessary
	};
	
	TextField.prototype.removeCharAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var previous = this.getLetterAt(index-1);
		
		if( letter == null )
			return;
			
		var currentWord = letter.parent;
		
		this._letters.splice(index,1);
		this.setCurrentIndex(index-1);
		this._refreshNextFrame = true;
	
		this._text = this._text.substr(0,index-1) + this._text.substr(index+1);
		
		currentWord.removeLetterAt( index - currentWord.getStartIndex() );
		
		if( currentWord.getNumLetters() == 0 )
			this.removeChild(currentWord);
			
		this._resetLettersIndex();
	};

	TextField.prototype.addTextAt = function(value,index)
	{
		var i = value.length;
		while( --i > -1 )
		{
			this.addCharAt(value[i],index);
		}
		
		this.setCurrentIndex(index);
	};

	TextField.prototype.removeTextBetween = function(startIndex,endIndex)
	{
		var i = this.getLetters().length;
		var letters = new Array();
		var letter = null;
		
		while( --i > -1 )
		{
			if( i >= startIndex && i <= endIndex )
			{
				letters.push( this.getLetterAt(i) );
			}
		}
		
		while( letters.length > 0 )
		{
			letter = letters.shift();
			this.removeCharAt(letter.index);
		}
	};
	
	TextField.prototype.draw = function(context)
	{
		var currentIndexLetter = this.getLetterAt(this.currentIndex);
		var bounds = null;
		var time = null;
		
		if( this._lastWidth != this.width || this._refreshNextFrame == true )
		{
			this._refresh();	
			this._lastWidth = this.width;
			this._refreshNextFrame = false;
		}
		
		if( this.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.backgroundColor;
			context.fillRect(0,0,this.width,this.height);
			context.fill();
			context.restore();
		}
		
		if( this.border == true )
		{
			context.save();
			context.beginPath();
			context.strokeStyle = this.borderColor;
			context.moveTo(0,0);
			context.lineTo(this.width,0);
			context.lineTo(this.width,this.height);
			context.lineTo(0,this.height);
			context.lineTo(0,0);
			context.stroke();
			context.restore();
		}
		
		
		tomahawk_ns.DisplayObjectContainer.prototype.draw.apply(this, [context]);		
		
		if( this._focused == true)
		{
			time = new Date().getTime();
			
			if( currentIndexLetter != null )
			{
				bounds = currentIndexLetter.getBoundingRectIn(this);
			}
			else
			{
				bounds = new tomahawk_ns.Rectangle();
				bounds.left = bounds.x = 0;
				bounds.width = bounds.right = 5;
				bounds.top = bounds.y = 0;
				bounds.bottom = bounds.height = 10;
			}
			
			if( time - this._drawCursorTime > 500 )
			{
				this._drawCursor = ( this._drawCursor == true ) ? false: true;
				this._drawCursorTime = time;
			}
			
			if( this._drawCursor == true )
			{
				context.save();
				context.beginPath();
				context.strokeStyle = "black";
				context.moveTo(	bounds.right,bounds.top);
				context.lineTo(	bounds.right,bounds.bottom );
				context.stroke();
				context.restore();
			}
		}
	};

	
	
	
	TextField.prototype._cutWord = function(word)
	{
		var letters = 0;
		var i = 0;
		var nextWord = null;
		var cut = true;
		var currentLetter = null;
		
		while( cut == true )
		{
			cut = false;
			letters = word.getLetters();
			i = letters.length;
			
			while( --i > -1 )
			{
				currentLetter = letters[i];
				if( ( currentLetter.value == " " || currentLetter.newline == true ) && i > 0 )
				{
					nextWord = word.cut(i);
					cut = true;
					this.addChild( nextWord );
					
					nextWord.newline = currentLetter.newline;
					nextWord.needRefresh = word.needRefresh = true;
					break;
				}
			}
		}
		
		if( word.text.length == 0 )
			this.removeChild(word);
	};

	TextField.prototype._resetLettersIndex = function(start)
	{
		var letters = this.getLetters();
		var i = 0;
		var max = letters.length;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = letters[i];
			currentLetter.index = i;
		}
	};
	
	TextField.prototype._sortWords = function(a,b)
	{
		return ( a.getStartIndex() < b.getStartIndex() ) ? -1 : 1;
	};
	
	TextField.prototype._refresh = function()
	{
		var rowIndex = 0;
		var currentRow = new Array();
		var rowWord = null;
		var word = null;
		var i = 0;
		var max = this.children.length;
		var lineY = 0;
		var lineX = this.padding;
		var lineHeight = 0;
		var lineWidth = 0;
		var maxWidth = this.width - ( this.padding * 2 );
		
		this.children.sort( this._sortWords );
		
		for( i = 0; i < max; i++ )
		{		
			word = this.children[i];
			word.index = i;
			word.refresh();

			lineHeight = ( lineHeight < word.height ) ? word.height : lineHeight;
			
			if( lineWidth + word.width > maxWidth || word.newline == true )
			{
				lineY += lineHeight;
				this._alignRow( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight );
				
				rowIndex++;
				lineWidth = 0;
				currentRow = new Array();
				lineHeight = word.height;
			}
			
			lineWidth += word.width;
			currentRow.push(word);
			
			if( i == max - 1 )
			{
				lineY += lineHeight;
				this._alignRow( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight );
			}
		}
		
		if( this.autoSize == true && word != null )
		{
			this.height = word.y + word.height;
		}
		
		
		//this._cache = null;
		//this.cacheAsBitmap = true;
		this._lastWidth = this.width;
	};
	
	TextField.prototype._alignRow = function( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight )
	{
		if( currentRow.length == 0 )
			return;
			
		var maxWidth = this.width - ( this.padding * 2 );
		var word = currentRow[0];
		var offsetX = lineX;
		var marginLeft = 0;
		var textAlign = this._textAlign;
		var i = 0;
		var max = currentRow.length;
		var currentX = 0;
				
		if( textAlign == tomahawk_ns.TextField.ALIGN_LEFT )
		{
			offsetX = lineX;
		}
		
		if( textAlign == tomahawk_ns.TextField.ALIGN_CENTER )
		{
			offsetX = lineX + ( ( maxWidth - lineWidth ) * 0.5 );
		}
			
		if( textAlign == tomahawk_ns.TextField.ALIGN_RIGHT )
		{
			offsetX = lineX + ( maxWidth - lineWidth );
		}
		
		// on ne justifie que si la ligne est occupée à minimum 70% sinon c'est aligné à gauche
		if( textAlign == tomahawk_ns.TextField.ALIGN_JUSTIFY && lineWidth >= ( maxWidth * 0.7 ) )
		{
			offsetX = lineX;
			marginLeft = ( maxWidth - lineWidth ) / ( currentRow.length - 1 );
		}
		
		currentX = offsetX;
		
		for( i = 0; i < max; i++ )
		{
			word = currentRow[i];
			word.y = lineY - word.height;
			word.x = currentX;
			
			currentX += word.width + marginLeft;
		}
	};
	

	tomahawk_ns.TextField = TextField;
})();




/**
 * @author The Tiny Spark
 */
(function() {
	
	function TextFormat(){}
	Tomahawk.registerClass( TextFormat, "TextFormat" );

	TextFormat.prototype.textColor = "black";
	TextFormat.prototype.underline = false;
	TextFormat.prototype.backgroundSelectedColor = "blue";
	TextFormat.prototype.font = "Arial";
	TextFormat.prototype.bold = false;
	TextFormat.prototype.italic = false;
	TextFormat.prototype.size = 12;

	TextFormat.prototype.updateContext = function(context)
	{
		var bold = ( this.bold ) ? "bold" : "";
		var italic = ( this.italic ) ? "italic" : "";
		
		context.font = italic+' '+bold+' '+this.size+'px '+this.font;
		context.fillStyle = this.textColor;
		
		if( this.underline == true )
		{
			context.strokeStyle = this.textColor;
		}
	};

	TextFormat.prototype.clone = function()
	{
		var format = new tomahawk_ns.TextFormat();
		format.textColor = this.textColor+"";
		format.font = this.font+"";
		format.bold = ( this.bold == true );
		format.underline = ( this.underline == true );
		format.italic = ( this.italic == true );
		format.size = parseInt( this.size );
		
		return format;
	};
	
	tomahawk_ns.TextFormat = TextFormat;
})();



/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function Word()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.mouseEnabled = true;
	}
	
	Tomahawk.registerClass(Word,"Word");
	Tomahawk.extend("Word","DisplayObjectContainer");
	
	Word.prototype.row = 0;
	Word.prototype.newline = false;
	Word.prototype.marginLeft = 0;
	Word.prototype.index = 0;
	Word.prototype.text = "";
	Word.prototype.needRefresh = false;
	
	Word.prototype.getNumLetters = function()
	{
		return this.children.length;
	};
	
	Word.prototype.getStartIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt(0).index;
	};
	
	Word.prototype.getEndIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt( this.children.length - 1 ).index;
	};
	
	Word.prototype.addLetter = function(letter)
	{
		this.text = this.text + letter.value;
		this.needRefresh = true;
		return this.addChild(letter);
	};
	
	Word.prototype.removeLetterAt = function(index)
	{
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		this.needRefresh = true;
		return this.removeChildAt(index);
	};
	
	Word.prototype.removeLetter = function(letter)
	{
		var index = this.getChildIndex(letter);
		
		if( index == -1 )
			return letter;
	
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		return this.removeChild(letter);
	};
	
	Word.prototype.getLetterAt = function(index)
	{
		return this.getChildAt(index);
	};
		
	Word.prototype.addLetterAt = function(letter,index)
	{
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + letter.value + this.text.substr(index);
		this.addChildAt(letter,index);
	};
	
	Word.prototype.getLetters = function()
	{
		return this.children;
	};
	
	Word.prototype.refresh = function()
	{
		if( this.needRefresh != true )
			return;
			
		var max = this.children.length;
		var i = 0;
		var currentX = 0;
		this.height = 0;
		this.width = 0;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			
			if( currentLetter.value == " " && i == 0)
			{
				this.marginLeft = currentLetter.width;
			}
			
			currentLetter.updateMetrics();
			currentLetter.x = currentX;
			currentX += currentLetter.width;
			this.height = ( this.height < currentLetter.textHeight ) ? currentLetter.textHeight : this.height;
		}
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			currentLetter.y = this.height - currentLetter.textHeight;
		}
		
		this.width = currentX;
		this.needRefresh = false;
		this._cache = null;
		this.updateCache();
		this.cacheAsBitmap = true;
	};
	
	Word.prototype.cut = function(index)
	{
		var word = new tomahawk_ns.Word();
		var i = index;
		var max = this.children.length;
		
		for( i = index; i < max; i++ )
		{
			word.addLetter(this.removeLetterAt(index));
		}
		
		word.needRefresh = this.needRefresh = true;
		return word;
	};
	
	tomahawk_ns.Word = Word;
})();



/**
 * @author The Tiny Spark
 */

(function() {
	
	function Texture(){}

	Tomahawk.registerClass( Texture, "Texture" );

	Texture.prototype.data = null;
	Texture.prototype.name = null;
	Texture.prototype.rect = null;

	tomahawk_ns.Texture = Texture;

})();








/**
 * @author The Tiny Spark
 */
(function() {
	
	function TextureAtlas()
	{
		this._textures = new Array();
	}

	Tomahawk.registerClass( TextureAtlas, "TextureAtlas" );

	TextureAtlas.prototype._textures = null;
	TextureAtlas.prototype.data = null;
	TextureAtlas.prototype.name = null;

	TextureAtlas.prototype.createTexture = function( name, startX, startY, endX, endY )
	{
		var texture = new tomahawk_ns.Texture();
		texture.name = name;
		texture.data = this.data;
		texture.rect = [startX, startY, endX, endY];
		
		this._textures.push(texture);
	};

	TextureAtlas.prototype.getTextureByName = function( name )
	{
		var i = this._textures.length;
		var currentTexture = null;
		while( --i > -1 )
		{
			currentTexture = this._textures[i];
			if( currentTexture.name == name )
				return currentTexture;
		}
		
		return null;
	};

	TextureAtlas.prototype.removeTexture = function( name )
	{
		var texture = this.getTextureByName(name);
		
		if( texture == null )
			return;
			
		var index = this._textures.indexOf(texture);
		this._textures.splice(index,1);
	};


	tomahawk_ns.TextureAtlas = TextureAtlas;

})();



