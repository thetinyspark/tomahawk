

/**
 * ...
 * @author Thot
 */

function Tomahawk(){}

Tomahawk._classes = new Object();
Tomahawk._extends = new Array();
	

	Tomahawk.registerClass = function( classDef, className )
	{
		Tomahawk._classes[className] = classDef;
	};

	Tomahawk.extend = function( p_child, p_ancestor )
	{
		Tomahawk._extends.push({"child":p_child,"ancestor":p_ancestor});
	};

	Tomahawk.run = function()
	{
		var obj = null;
		var i = 0;
		var max = Tomahawk._extends.length;
			
		
		
		for (i = 0; i < max; i++ )
		{
			Tomahawk._inherits( Tomahawk._extends[i] );
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
		
		if( superParent != null )
			Tomahawk._inherits(superParent);

		child = Tomahawk._classes[obj["child"]];
		ancestor = Tomahawk._classes[obj["ancestor"]];
		
		if( child != null && ancestor != null )
		{
			ancestor = new ancestor();
			for( var prop in ancestor )
			{
				if( !child.prototype[prop] )
				{
					child.prototype[prop] = ancestor[prop];
				}
			}
		}
	};





/**
 * ...
 * @author Thot
 */

 
function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );

// singleton
AssetsLoader._instance = null;
AssetsLoader.getInstance = function()
{
	if( AssetsLoader._instance == null )
		AssetsLoader._instance = new AssetsLoader();
		
	return AssetsLoader._instance;
};



AssetsLoader.prototype.onComplete = null;
AssetsLoader.prototype._loadingList = null;
AssetsLoader.prototype._data = null;

AssetsLoader.prototype.getData = function()
{
	return this._data;
};

AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this._data = new Object();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
};

AssetsLoader.prototype.load = function()
{
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete )
		{
			this.onComplete();
		}
	}
	else
	{
		var obj = this._loadingList.shift();
		var scope = this;
		var image = new Image();
		image.onload = function()
		{
			scope._onLoadComplete(image, obj.alias);
		};
		
		image.src = obj.url;
	}
};

AssetsLoader.prototype._onLoadComplete = function(image,alias)
{
	this._data[alias] = image;
	this.load();
};





/**
 * ...
 * @author Thot
 */

 
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
	if( AssetsManager._instance == null )
		AssetsManager._instance = new AssetsManager();
		
	return AssetsManager._instance;
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







/**
 * ...
 * @author Hatshepsout
 */

function Screen(){}

Tomahawk.registerClass(Screen,"Screen");


Screen.getInnerWidth = function()
{
	return Stage.getInstance().getCanvas().parent.offsetWidth;
};

Screen.getInnerHeight = function()
{
	return Stage.getInstance().getCanvas().parent.offsetHeight;
};

Screen.getWindowWidth = function()
{
	return window.innerWidth;
};



/**
 * ...
 * @author Thot
*/



function Bitmap()
{
	DisplayObject.apply(this);
}

Tomahawk.registerClass( Bitmap, "Bitmap" );
Tomahawk.extend( "Bitmap", "DisplayObject" );

Bitmap.prototype.texture = null;

Bitmap.prototype.draw = function( context, transformMatrix )
{
	if( this.texture )
	{
		var rect = this.texture.rect;
		var data = this.texture.data;
		
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	}
};






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









/**
 * ...
 * @author Thot
*/

function DisplayObjectContainer()
{
	DisplayObject.apply(this);
	this.children = new Array();
}

Tomahawk.registerClass( DisplayObjectContainer, "DisplayObjectContainer" );
Tomahawk.extend( "DisplayObjectContainer", "DisplayObject" );

DisplayObjectContainer.prototype.children = null;

DisplayObjectContainer.prototype.addChild = function(child)
{
	if( child.parent )
	{
		child.parent.removeChild(child);
	}
	
	child.parent = this;
	this.children.push(child);
	child.dispatchEvent( new Event(Event.ADDED, true, true) );
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
	var left = null;
	var top = null;
	var right = null;
	var bottom = null;
	var lRect = null;
	var rRect = null;
	var tRect = null;
	var bRect = null;
	
	while( --i > -1 )
	{
		child = children[i];
		
		if( child.hitTest(x,y) )
			return true;
	}
	
	return false;
};

DisplayObjectContainer.prototype.getBoundingRect = function()
{
	var children = this.children;
	var i = children.length;
	var child = null;
	var rect = new Object();
	var childRect = null;
	
	rect.x = 0;
	rect.y = 0;
	rect.top = 0;
	rect.left = 0;
	rect.right = 0;
	rect.bottom = 0;
	rect.width = 0;
	rect.height = 0;
	
	i = children.length;
	
	while( --i > -1 )
	{
		child = children[i];
		rect.left = ( child.x < rect.left ) ? child.x : rect.left;
		rect.top = ( child.y < rect.top ) ? child.y : rect.top;
		rect.right = ( child.x + child.width > rect.right ) ? child.x + child.width : rect.right;
		rect.bottom = ( child.y + child.height > rect.bottom ) ? child.y + child.height : rect.bottom;
	}
	
	rect.x 			= rect.left;
	rect.y 			= rect.top;
	rect.width 		= rect.right - rect.left;
	rect.height 	= rect.bottom - rect.top;
	
	return rect;
};

DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
	var children = this.children;
	var tab1 = this.children.slice(0,index);
	var tab2 = this.children.slice(index);
	this.children = tab1.concat([child]).concat(tab2);
	
	child.parent = this;
	child.dispatchEvent( new Event(Event.ADDED, true, true) );
};

DisplayObjectContainer.prototype.removeChildAt = function(index)
{
	var child = this.children[index];
	if( child == undefined )
		return;
		
	child.parent = null;
	this.children.splice(index,1);
	child.dispatchEvent( new Event(Event.REMOVED, true, true) );
};

DisplayObjectContainer.prototype.removeChild = function(child)
{
	var index = this.children.indexOf(child);
	
	if( index > -1 )
		this.children.splice(index,1);
		
	child.parent = null;
	child.dispatchEvent( new Event(Event.REMOVED, true, true) );
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
		
		if( child.children )
		{
			under = child.getObjectUnder(x,y);
			
			if( under != null )
				return under;
		}
		else if( child.mouseEnabled == true && child.hitTest(x,y) == true )
		{
			return child;
		}
	}
	
	return under;
};

DisplayObjectContainer.prototype.draw = function( context, transformMatrix  )
{	
	var children = this.children;
	var i = 0;
	var max = children.length;
	var child = null;
	
	for( ; i < max; i++ )
	{
		child = children[i];
		child.render(context, transformMatrix);
	}
};

DisplayObjectContainer.prototype.getObjectsUnder = function(x,y,limit)
{
	var under = new Array();
	var children = this.children;
	var i = children.length;
	var child = null;
	
	while( --i > -1 )
	{
		child = children[i];
		
		if( child.getObjectsUnder )
		{
			under = under.concat(child.getObjectsUnder(x,y,limit));
		}
		else if( child.hitTest(x,y) == true )
		{
			under.push(child);
		}
		
		if( limit != undefined && under.length == limit)
			return under;
	}
	
	return under;
};






/**
 * ...
 * @author Thot
*/

function MovieClip()
{
	Bitmap.apply(this);
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
	Stage.getInstance().addEventListener(Event.ENTER_FRAME, this,this._enterFrameHandler); 
};

MovieClip.prototype.stop = function()
{
	Stage.getInstance().removeEventListener(Event.ENTER_FRAME, this,this._enterFrameHandler); 
};







/**
 * ...
 * @author HTML5
 */

function Shape()
{
	DisplayObject.apply(this);
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
	
	//type = 0 : set; type = 1 : method
	
	for (i = 0; i < max; i++ )
	{
		command = commands[i];
		type = command[0];
		prop = command[1];
		args = command[2];
		
		if( type == 0 )
		{
			context[prop] = args;
		}
		else
		{
			context[prop].apply(context,args);
		}
	}
	
};



/**
 * ...
 * @author Thot
*/

function Stage()
{
	DisplayObjectContainer.apply(this);
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
}

Tomahawk.registerClass( Stage, "Stage" );
Tomahawk.extend( "Stage", "DisplayObjectContainer" );

Stage._instance = null;
Stage.getInstance = function()
{
	if( Stage._instance == null )
		Stage._instance = new Stage();
		
	return Stage._instance;
};


Stage.prototype._lastTime = 0;
Stage.prototype._frameCount = 0;
Stage.prototype._fps = 0;
Stage.prototype._canvas = null;
Stage.prototype._context = null;
Stage.prototype._debug = false;
Stage.prototype._lastActiveChild = null;
Stage.prototype.displayMouseCoordinates = false;
Stage.prototype.mouseX = 0;
Stage.prototype.mouseY = 0;
Stage.prototype._input = null;
Stage.prototype._focused = false;


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
	
	this._input = document.createElement("input");
	this._input.type = "text";
	this._canvas = canvas;
	this._context = canvas.getContext("2d");
	this.addEventListener(Event.ADDED, this, this._eventHandler,true);
	this.addEventListener(Event.FOCUSED, this, this._eventHandler,true);
	this.addEventListener(Event.UNFOCUSED, this, this._eventHandler,true);
	this._canvas.addEventListener("click",callback);
	this._canvas.addEventListener("mousemove",callback);
	this._canvas.addEventListener("mousedown",callback);
	this._canvas.addEventListener("mouseup",callback);
	this._canvas.addEventListener("dblclick",callback);
	
	
	window.addEventListener("keyup",callbackKey);
	window.addEventListener("keydown",callbackKey);
	window.addEventListener("keypress",callbackKey);
	this._enterFrame();		
};

Stage.prototype._keyboardHandler = function(event)
{
	if( this._focused == true )
	{
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
	}

	if( event.type == "keyup" )
		Keyboard.toggleShift(event.keyCode);
	
	var keyboardEvent = KeyEvent.fromNativeMouseEvent(event, true, true);
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
	//var activeChild = this._getMouseObjectUnder(x,y,this);
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
			mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
			mouseEvent.type = MouseEvent.ROLL_OVER;
			activeChild.dispatchEvent(mouseEvent);
		}
		
		if( this._lastActiveChild != null )
		{		
			mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
			mouseEvent.type = MouseEvent.ROLL_OUT;
			this._lastActiveChild.dispatchEvent(mouseEvent);
		}
	}
	else
	{
		if( activeChild != null )
		{
			mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);			
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
		mouseEvent = MouseEvent.fromNativeMouseEvent(event,true,true,x,y);	
		mouseEvent.type == MouseEvent.RELEASE_OUTSIDE;
		this._lastMouseDownChild.dispatchEvent(mouseEvent);
		this._lastMouseDownChild = null;
	}
	
	this._lastActiveChild = activeChild;
};

Stage.prototype.getMovement = function()
{
	var pt = new Object();
	pt.x = this.mouseX - this._lastMouseX;
	pt.y = this.mouseY - this._lastMouseY;
	
	return pt;
};

Stage.prototype._getMouseObjectUnder = function(x,y,container)
{
	var under = null;
	var children = container.children;
	var i = children.length;
	var child = null;
	
	while( --i > -1 )
	{
		child = children[i];
		
		if( child.children )
		{
			under = this._getMouseObjectUnder(x,y,child);
			if( under != null )
				return under;
		}
		else if( child.mouseEnabled == true && child.hitTest(x,y) == true )
		{
			return child;
		}
	}
	
	return null;
};

Stage.prototype._eventHandler = function(event)
{
	switch( event.type )
	{
		case Event.FOCUSED: 
			this._focused = true;
			break;
			
		case Event.UNFOCUSED: 
			this._focused = false;
			break;
			
		case Event.ADDED: 
			event.target.dispatchEvent( new Event(Event.ADDED_TO_STAGE, true, true) ); 
			break;
			
		case Event.REMOVED: 
			event.target.dispatchEvent( new Event(Event.REMOVED_FROM_STAGE, true, true) ); 
			break;
	}
};

Stage.prototype._enterFrame = function()
{
	this.dispatchEvent(new Event(Event.ENTER_FRAME,true,true));
	
	var transformMatrix = new Matrix2D();
	var curTime = new Date().getTime();
	var scope = this;
	
	this._frameCount++;
	
	if( curTime - this._lastTime >= 1000 )
	{
		this._fps = this._frameCount;
		this._frameCount = 0;
		this._lastTime = curTime;
	}
	
	this._context.clearRect(0,0,this._canvas.width,this._canvas.height);
	this._context.save();
	this.render(this._context, transformMatrix);
	this._context.restore();
	
	if( this._debug == true )
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "black";
		this._context.fillRect(0,0,100,30);
		this._context.fill();
		this._context.fillStyle = "red";
		this._context.font = 'italic 20pt Calibri';
		this._context.fillText("fps: "+this._fps, 0,30);
		this._context.restore();
	}
	
	if( this.displayMouseCoordinates == true )
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "green";
		this._context.fillRect(this.mouseX - 2,this.mouseY - 2,4,4);
		this._context.fill();
		this._context.restore();
	}
	
	window.requestAnimationFrame(
		function()
		{
			scope._enterFrame();
		}
	);
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

Stage.prototype.setDebug = function( debug )
{
	this._debug = debug;
};










/**
 * ...
 * @author Thot
*/

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





/**
 * ...
 * @author Thot
*/

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






/**
 * ...
 * @author Thot
*/

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

KeyEvent.fromNativeMouseEvent = function(event,bubbles,cancelable)
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
	newEvent.keyCode = event.keyCode;
	newEvent.charCode = event.charCode;
	newEvent.ctrlKey = event.ctrlKey;
	newEvent.shiftKey = event.shiftKey;
	newEvent.altKey = event.altKey;
	newEvent.value = Keyboard.keyCodeToChar(event.keyCode, event.shiftKey, event.ctrlKey, event.altKey);
	newEvent.isCharacter = Keyboard.isMapped(event.keyCode);
	newEvent.which = event.which;
	return newEvent;
};


KeyEvent.KEY_UP = "keyup";
KeyEvent.KEY_DOWN = "keydown";
KeyEvent.KEY_PRESS = "keypress";











/**
 * ...
 * @author Hatshepsout
 */

function Keyboard(){}

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









/**
 * ...
 * @author Thot
*/

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
		case "click": type = MouseEvent.CLICK; break;
		case "dblclick": type = MouseEvent.DOUBLE_CLICK; break;
		case "mousemove": type = MouseEvent.MOUSE_MOVE; break;
		case "mouseup": type = MouseEvent.MOUSE_UP; break;
		case "mousedown": type = MouseEvent.MOUSE_DOWN; break;
	}
	
	msevent = new MouseEvent(type,bubbles,cancelable);
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





/*source: html5rocks.com*/

function GrayScaleFilter(){}
Tomahawk.registerClass( GrayScaleFilter, "GrayScaleFilter" );
Tomahawk.extend( "GrayScaleFilter", "PixelFilter" );

GrayScaleFilter.prototype.process = function()
{
	var pixels = this.getPixels();
	var data = pixels.data;
	
	for (var i=0; i<data.length; i+=4) 
	{
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		var v = 0.2126*r + 0.7152*g + 0.0722*b;
		data[i] = data[i+1] = data[i+2] = v;
	}
	
	this.setPixels(pixels);
};



/**
 * ...
 * @author Hatshepsout
 */

function PixelFilter(){}
Tomahawk.registerClass( PixelFilter, "PixelFilter" );

PixelFilter.prototype._canvas = null;
PixelFilter.prototype._context = null;

PixelFilter.prototype.getPixels = function()
{
	return this._context.getImageData(0,0,this._canvas.width,this._canvas.height);
};

PixelFilter.prototype.setPixels = function(pixels)
{
	this._context.putImageData(pixels,0,0);
};

PixelFilter.prototype.process = function()
{
	//code de notre filtre ici
};

PixelFilter.prototype.apply = function(canvas,context)
{
	this._canvas = canvas;
	this._context = context;
	this.process();
};





function Matrix2D(a, b, c, d, tx, ty)
{
	this.initialize(a, b, c, d, tx, ty);
	this._stack = new Array();
}

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




/**
 * ...
 * @author Hatshepsout
 */

function InputTextField()
{
	SelectableTextField.apply(this);
	Stage.getInstance().addEventListener( KeyEvent.KEY_DOWN, this, this._keyHandler );
}

Tomahawk.registerClass(InputTextField,"InputTextField");
Tomahawk.extend("InputTextField","SelectableTextField");


InputTextField.prototype._keyHandler = function(event)
{
	
	var range = this.getSelectionRange();
	
	if( this.getFocus() == false )
		return;
		
	if( this.isSelected() == true && event.keyCode != Keyboard.LEFT && event.keyCode != Keyboard.RIGHT )
	{
		this.removeTextBetween( range.start, range.end );
	}
	
	if( event.keyCode == Keyboard.BACKSPACE )
	{
		this.removeCharAt(this.getCurrentIndex());
	}
	else if( event.keyCode == Keyboard.SUPPR )
	{
		this.removeCharAt(this.getCurrentIndex() + 1);
	}
	else if( event.keyCode == Keyboard.LEFT || event.keyCode == Keyboard.RIGHT)
	{
		var step = ( event.keyCode == Keyboard.LEFT ) ? -1 : 1;
		this.setCurrentIndex(this.getCurrentIndex()+step);
	}
	else if( event.isCharacter == true )
	{
		 //special select all
		if( event.keyCode == Keyboard.A && event.ctrlKey )
		{
			this.selectAll();
			return;
		}
		
		var text = event.value;
		
		if( event.keyCode == Keyboard.V && event.ctrlKey )
		{
			text = window.prompt ("Copy to clipboard: Ctrl+C, Enter", "");
			this.addTextAt(text,this.getCurrentIndex() + 1);
		}
		else
		{
			if( event.keyCode == Keyboard.ENTER )
			{
				text = "";
			}
			
			this.addCharAt(text,this.getCurrentIndex() + 1, true);
		}
		
		
	}
};





/**
 * ...
 * @author Hatshepsout
 */

function Letter()
{
	DisplayObject.apply(this);
	this.format = new TextFormat();
}

Tomahawk.registerClass(Letter,"Letter");
Tomahawk.extend("Letter","DisplayObject");

Letter.prototype.value 				= "";
Letter.prototype.format 			= null;
Letter.prototype.newline 			= false;
Letter.prototype.index 				= 0;
Letter.prototype.row 				= 0;	
Letter.prototype.textWidth 			= 0;	
Letter.prototype.textHeight 		= 0;	
Letter.prototype.selected			= false;
Letter.prototype.cursor				= false;		
Letter.prototype._drawCursor	 	= false;
Letter.prototype._drawCursorTime 	= 0;

Letter.prototype.updateMetrics = function(context)
{
	context.save();
	this.format.updateContext(context);
	this.textHeight = context.measureText('M').width;
	this.textWidth = context.measureText(this.value).width;
	this.width = this.textWidth;
	this.height = this.textHeight;
	
	context.restore();
};


Letter.prototype.draw = function(context,transformMatrix)
{
	this.updateMetrics(context);
	
	if( this.newline == true )
		return;
		
	if( this.selected == true )
	{
		context.globalCompositeOperation = "xor";
		
		context.save();
		context.beginPath();
		context.fillStyle = "black";
		context.fillRect(0, 0, this.textWidth, this.textHeight);
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
	
	
	

		
	if( this.cursor == true )
	{
		var time = new Date().getTime();
		if( time - this._drawCursorTime > 500 )
		{
			this._drawCursor = ( this._drawCursor == true ) ? false: true;
			this._drawCursorTime = time;
		}
		
		if( this._drawCursor == true )
		{
			context.save();
			context.beginPath();
			context.moveTo(this.textWidth,0);
			context.lineTo(this.textWidth,this.textHeight);
			context.stroke();
			context.restore();
		}
	}
};



/**
 * ...
 * @author Hatshepsout
 */

function SelectableTextField()
{
	TextField.apply(this);
	this.mouseEnabled = true;
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler,true );
	Stage.getInstance().addEventListener( MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler,true );
	this.addEventListener( MouseEvent.CLICK, this, this._mouseEventHandler );
	this.addEventListener( MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_UP, this, this._mouseEventHandler, true );
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
}

Tomahawk.registerClass(SelectableTextField,"SelectableTextField");
Tomahawk.extend("SelectableTextField","TextField");

SelectableTextField.prototype._ignoreNextClick = false;
SelectableTextField.prototype._startPoint = null;
SelectableTextField.prototype._down = false;

SelectableTextField.prototype.getObjectUnder = function(x,y)
{
	if( DisplayObject.prototype.hitTest.apply(this,[x,y] ) )
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
	this.setFocus(true);
	
	if( letters.length > 0 )
	{
		this.setCurrentIndex( letters[0].index );
	}
};

SelectableTextField.prototype._mouseEventHandler = function(event)
{
	
	if( event.type == MouseEvent.DOUBLE_CLICK )
	{
		this.setFocus( event.target == this );
		
		if( this.getFocus() == true )
		{
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._selectCurrentWord();
		}
	}
	
	if( event.type == MouseEvent.MOUSE_DOWN && this._focused == true && event.target != this )
	{
		this.setFocus(false);
	}
	
	// if non focused return
	if( this._focused == false )
	{
		this.unSelect();
		return;
	}
		
	if( event.type == MouseEvent.MOUSE_UP )
	{
		this._down = false;
	}
	
	if( event.type == MouseEvent.CLICK )
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
	
	if( event.type == MouseEvent.MOUSE_DOWN)
	{
		this._down = true;
		this._setIndexUnderMouse(event.stageX,event.stageY);
		this._startPoint = this.globalToLocal(event.stageX, event.stageY);
		return;
	}
	
	if( event.type == MouseEvent.MOUSE_MOVE && this._down == true && this._startPoint != null)
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
	var i = this.children.length;
	var letter = null;
	var result = new Array();
	
	while( --i > -1 )
	{
		letter = this.children[i];
		
		if( 
			letter.x > x + width ||
			letter.x + letter.width < x || 
			letter.y + letter.height < y || 
			letter.y > y + height 
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
	var i = this.children.length;
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
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
	this.selectBetween(0,this.children.length);
};

SelectableTextField.prototype.unSelect = function()
{
	var i = this.children.length;
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
		letter.selected = false;
	}
};

SelectableTextField.prototype.selectBetween = function(startIndex, endIndex)
{
	var i = this.children.length;
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
		letter.selected = ( i >= startIndex && i <= endIndex );
	}
};






/**
 * ...
 * @author Hatshepsout
 */

function TextField()
{
	DisplayObjectContainer.apply(this);
	this.defaultTextFormat = new TextFormat();
}

Tomahawk.registerClass(TextField,"TextField");
Tomahawk.extend("TextField","DisplayObjectContainer");

TextField.prototype.defaultTextFormat = null;
TextField.prototype._focused = false;
TextField.prototype._selectedLetter = null;
TextField.prototype.background = true;
TextField.prototype.border = true;
TextField.prototype.backgroundColor = "white";
TextField.prototype.borderColor = "black";

TextField.prototype.setCurrentIndex = function(index)
{
	var current = null;
	index = ( index < 0 ) ? 0 : index;
	index = ( index > this.children.length ) ? this.children.length : index;
	
	if( this._selectedLetter != null )
	{
		this._selectedLetter.cursor = false;
	}
	
	current = this.getChildAt(index);
	
	if( current == null )
		return;
		
	current.cursor = true;	
	this._selectedLetter = current;
};

TextField.prototype.getWordRangeAt = function(index)
{
	var letter = null;
	var i = index;
	var max = this.children.length;
	var end = -1;
	var start = -1;
	
	while( i < max )
	{
		letter = this.getChildAt(i);
		
		if( letter == null )
			continue;
			
		if( i == max - 1 )
		{
			end = i;
			break;
		}
		
		if( letter.value == " " || letter.newline == true )
		{
			end = i - 1;
			break;
		}
		
		i++;
	}
	
	i = index;
	
	while( i > -1 )
	{
		letter = this.getChildAt(i);
		if( letter == null )
			continue;
		
		if( letter.value == " " || letter.newline == true )
		{
			start = i + 1;
			break;
		}
		
		i--;
	}
	
	return {start: start, end: end};

};

TextField.prototype.getCurrentIndex = function()
{
	return this._selectedLetter.index;
};

TextField.prototype._alignRow = function( row, textAlign )
{
	var i = this.children[i];
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
		if( letter.row == row )
		{
			letter.format.textAlign == textAlign;
		}
	}
}

TextField.prototype.setFocus = function(value)
{
	if( this._focused == value )
		return;
		
	this._focused = value;
	var type = ( this._focused == true ) ? Event.FOCUSED : Event.UNFOCUSED;
	var focusEvent = new Event( type, true, true );
	this.dispatchEvent(focusEvent);
	this.setCurrentIndex(0);
};

TextField.prototype.getFocus = function()
{
	return this._focused;
};

TextField.prototype.setTextFormat = function( format, startIndex, endIndex )
{
	var end = ( endIndex == undefined ) ? startIndex : endIndex;
	var i = startIndex;
	var currentFormat = null;
	
	for( ; i <= end; i++ )
	{
		var letter = this.getChildAt(i);
		if( letter != null )
			letter.format = format;
	}
	
	if( letter != null )
		this._alignRow(letter.row,format.textAlign);
};

TextField.prototype.getTextFormat = function(index)
{
	var letter = this.getChildAt(index);
	if( letter == null )
		return this.defaultTextFormat.clone();
		
	return letter.format.clone();
};

TextField.prototype.getText = function()
{
	var text = "";
	var i = 0;
	var max = this.children.length;
	
	for( i = 0; i < max; i++ )
	{
		letter = this.children[i];
		text += letter.value;
	}
	
	return text;
};

TextField.prototype.setText = function(value)
{
	while( this.children.length > 0 )
		this.removeChildAt(0);
		
	var i = 0;
	var max = value.length;
	
	for( i = 0; i < max; i++ )
	{
		this.addCharAt(value[i],i);
	}
};

TextField.prototype.getLetters = function()
{
	return this.children;
};

TextField.prototype.getLetterAt = function(index)
{
	return this.getChildAt(index);
};

TextField.prototype.addCharAt = function(value,index,isNewline)
{
	var previous = this.children[index-1];
	var letter = new Letter();
	letter.value = value;
	letter.index = index;
	letter.newline = ( isNewline == true ) ? true : false;
	letter.format = ( previous == undefined ) ? this.defaultTextFormat.clone() : previous.format.clone();
	this.addChildAt(letter,index);
	this.setCurrentIndex(index);
};

TextField.prototype.removeCharAt = function(index)
{
	this.removeChildAt(index);
	this.setCurrentIndex(index-1);
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
	var i = this.children.length;
	var letters = new Array();
	var letter = null;
	
	while( --i > -1 )
	{
		if( i >= startIndex && i <= endIndex )
		{
			letters.push( this.getChildAt(i) );
		}
	}
	
	while( letters.length > 0 )
	{
		letter = letters.shift();
		this.removeCharAt(letter.index);
	}
};

TextField.prototype.draw = function(context,transformMatrix)
{
	var i = 0;
	var max = this.children.length;
	var x = 0;
	var rowsHeight = new Array();
	var rowsWidth = new Array();
	var maxLineHeight = 0;
	var currentRow = 0;
	var rowY = 0;
	var offsetX = 0;
	var rows = new Array();
	var currentRow = new Array();
	var rowLetter = null;
	var j = 0;
	var y = 0;
	var textAlign = "left";
	
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
	
	for( i = 0; i < max; i++ )
	{		
		letter = this.children[i];
		letter.index = i;
		maxLineHeight = ( maxLineHeight < letter.textHeight ) ? letter.textHeight : maxLineHeight;
		
		if( x + letter.textWidth > this.width || letter.newline == true )
		{
			y += maxLineHeight;
			
			textAlign = ( currentRow[0] != undefined ) ? currentRow[0].format.textAlign : "left";
			
			offsetX = (textAlign == "left" ) ? 0 : 0;
			offsetX = (textAlign == "center" ) ? ( this.width - x ) * 0.5 : 0;
			offsetX = (textAlign == "right" ) ? ( this.width - x ) : 0;
			
			for( j = 0; j < currentRow.length; j++ )
			{
				rowLetter = currentRow[j];
				rowLetter.y = y - rowLetter.textHeight;
				rowLetter.x += offsetX;
			}
			
			currentRow = new Array();
			x = 0;
			maxLineHeight = letter.textHeight;
		}
		
		letter.x = x;
		letter.y = 0;
		x += letter.textWidth;
		currentRow.push(letter);
	}
	
	y += maxLineHeight;
	textAlign = ( currentRow[0] != undefined ) ? currentRow[0].format.textAlign : "left";
			
	offsetX = (textAlign == "left" ) ? 0 : 0;
	offsetX = (textAlign == "center" ) ? ( this.width - x ) * 0.5 : 0;
	offsetX = (textAlign == "right" ) ? ( this.width - x ) : 0;
	
	for( j = 0; j < currentRow.length; j++ )
	{
		rowLetter = currentRow[j];
		rowLetter.y = y - rowLetter.textHeight;
		rowLetter.x += offsetX;
	}
	
	DisplayObjectContainer.prototype.draw.apply(this, [context,transformMatrix]);
};





function TextFormat(){}

TextFormat.prototype.textColor = "black";
TextFormat.prototype.textAlign = "center";
TextFormat.prototype.font = "Arial";
TextFormat.prototype.bold = false;
TextFormat.prototype.italic = false;
TextFormat.prototype.size = 12;
TextFormat.prototype.underline = false;

TextFormat.prototype.updateContext = function(context)
{
	var bold = ( this.bold ) ? "bold" : "";
	var italic = ( this.italic ) ? "italic" : "";
	
	context.font = italic+' '+bold+' '+this.size+'px '+this.font;
	context.fillStyle = this.textColor;
	//context.textAlign = this.textAlign;
	
	if( this.underline == true )
	{
		context.strokeStyle = this.textColor;
	}
};

TextFormat.prototype.clone = function()
{
	var format = new TextFormat();
	format.textColor = this.textColor.substr(0,this.textColor.length);
	format.textAlign = new String( this.textAlign );
	format.font = new String( this.font );
	format.bold = ( this.bold == true );
	format.underline = ( this.underline == true );
	format.italic = ( this.italic == true );
	format.size = new Number( this.size );
	
	return format;
};



/**
 * ...
 * @author Thot
*/



function Texture(){}

Tomahawk.registerClass( Texture, "Texture" );

Texture.prototype.data = null;
Texture.prototype.name = null;
Texture.prototype.rect = null;








/**
 * ...
 * @author Thot
*/



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
	var texture = new Texture();
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






