

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

/** 
*@namespace 
**/

var tomahawk_ns 			= new Object();
var gl_canvas 				= document.createElement("canvas");
var gl_context 				= null;

tomahawk_ns.version 		= "1.0"; 

/**
* @class Tomahawk
* Core Framework class
* @constructor
*/
function Tomahawk(){}

Tomahawk._classes 			= new Object();
Tomahawk._extends 			= new Array();
Tomahawk._runned 			= false;
Tomahawk.glEnabled 			= false;
	

Tomahawk._funcTab 			= null;

Tomahawk._UNIQUE_OBJECT_ID	= 0;


/**
* @method registerClass
* @memberOf Tomahawk
* @description Register a class definition
* @params {class} the class definition
* @params {string} the class definition alias which will be used for inheritance
*/
Tomahawk.registerClass 		= function( classDef, className )
{
	Tomahawk._classes[className] = classDef;
};

/**
* @method extend
* @memberOf Tomahawk
* @description Make child Inherits ancestor
* @params {class} childAlias the child definition alias
* @params {string} ancestorAlias the ancestor definition alias
*/
Tomahawk.extend 			= function( p_child, p_ancestor )
{
	Tomahawk._extends.push({"child":p_child,"ancestor":p_ancestor,"done":false});
};

/**
* @method run
* @memberOf Tomahawk
* @description run the framework, apply inheritances to classes
*/
Tomahawk.run 				= function()
{
	var obj = null;
	var i = 0;
	var max = Tomahawk._extends.length;
	
	if( Tomahawk._runned == true )
		return;
		
	Tomahawk._runned = true;
	
	Tomahawk._funcTab = new Object();
	
	for (i = 0; i < max; i++ )
	{
		obj = Tomahawk._extends[i];
		Tomahawk._inherits( obj );
	}
}

Tomahawk._getParentClass 	= function(child)
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

Tomahawk._transfer		= function(child,ancestor)
{
	for ( var prop in ancestor ) 
	{
		var getter = ancestor.__lookupGetter__(prop);
		var setter = ancestor.__lookupSetter__(prop);

		if ( getter || setter ) 
		{
			if ( getter )
			{
				child.__defineGetter__(prop, getter);
			}
			if ( setter )
			{
				child.__defineSetter__(prop, setter);
			}
		} 
		else
		{
			child[prop] = ancestor[prop];
		}
	}
	
	return child;
};

Tomahawk._inherits 			= function( obj )
{
	var child 		= null;
	var ancestor 	= null;
	var superParent = Tomahawk._getParentClass(obj["ancestor"]);
	var proxy 		= null;
	
	if( superParent != null && superParent.done == false)
		Tomahawk._inherits(superParent);

	proxy 			= new Object();
	child 			= Tomahawk._classes[obj["child"]];
	ancestor 		= Tomahawk._classes[obj["ancestor"]];
	obj.done 		= true;
	
	

	if( 	child != null 		&& 
			child != undefined 	&& 
			ancestor != null 	&& 
			ancestor != undefined
	)
	{	
		
		Tomahawk._transfer( proxy, ancestor.prototype );
		Tomahawk._transfer( proxy, child.prototype );
		child.prototype = proxy;
	}
};


// gl context available
try
{
	gl_context = gl_canvas.getContext("experimental-webgl");
	Tomahawk.glEnabled = true;
}
catch(e)
{
	Tomahawk.glEnabled = false;
}





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
	 * @class QuadTreeContainer
	 * @memberOf tomahawk_ns
	 * @description The QuadTreeContainer class is a basic display list building block: a display list node that can contain children. The only difference with the basic Sprite class is that QuadTreeContainer orders his children in an internal quadtree structure. Each child which needs to be updated ( updateNextFrame || autoUpdate to true ) will be removed and added to the quadtree every frame. It means that the QuadTreeContainer is a very good container for a large subset of statics objects, so you can set the children autoUpdate property to false. It will results to a large gain of performances. Elsewhere, you can put a little subset of children with the autoUpdate property to true depending of the performances of the targeted devices.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
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

	/**
	* @description Returns all the children of the QuadTreeContainer that are visibles on the canvas area.
	* @method getVisiblesChildren
	* @memberOf tomahawk_ns.QuadTreeContainer.prototype
	* @returns {Array} an array of DisplayObject instances.
	**/
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
	
	/**
	* @description Returns the top node of the internal quadtree structure.
	* @method getRoot
	* @memberOf tomahawk_ns.QuadTreeContainer.prototype
	* @returns {tomahawk_ns.QuadTreeNode} the root node of the internal quadtree structure
	**/
	QuadTreeContainer.prototype.getRoot = function()
	{
		return this._root;
	};

	
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
	 * @class QuadTreeNode
	 * @memberOf tomahawk_ns
	 * @description A QuadTreeNode Object defines a leaf of a quadtree structure. Quadtrees are a derived implementation of binary trees which are very efficient in 2d plans.
	 * @constructor	
	 **/
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
	
	/**
	* @description Adds a display object to the tree node
	* @method add
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @param {tomahawk_ns.DisplayObject} element the display object you want to add to the tree node
	**/
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
	
	/**
	* @description Removes a display object from the tree node
	* @method remove
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @param {tomahawk_ns.DisplayObject} element the display object you want to remove from the tree node
	**/
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
	
	/**
	* @description Returns an Array of DisplayObjects that are visible in the area defined by the left,right,top,bottom parameters.
	* @method get
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @param {Number} left 
	* @param {Number} right 
	* @param {Number} top 
	* @param {Number} bottom 
	* @returns {Array} An array of DisplayObject
	**/
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
	
	/**
	* @description Splits the current node into four child nodes. The children of the node will be redispatched throught those new four nodes.
	* @method split
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	**/
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
	
	/**
	* @member full
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Boolean}
	* @default false
	* @description Indicates wether the node is full.
	**/
	QuadTreeNode.prototype.full = false;
	
	/**
	* @default 0
	* @member left
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the node's area.
	**/
	QuadTreeNode.prototype.left = 0;
	
	/**
	* @default 0
	* @member right
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The x coordinate of the bottom-right corner of the node's area.
	**/
	QuadTreeNode.prototype.right = 0;
	
	/**
	* @default 0
	* @member top
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the node's area.
	**/
	QuadTreeNode.prototype.top = 0;
	
	
	/**
	* @default 0
	* @member bottom
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The y coordinate of the bottom-right corner of the node's area.
	**/
	QuadTreeNode.prototype.bottom = 0;
	
	/**
	* @default 20
	* @member maxChildren
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description Indicates the maximum amount of children of that node can stores before splitting itself.
	**/
	QuadTreeNode.prototype.maxChildren = 20;
	
	/**
	* @default 0
	* @member depth
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description Indicates the depth of the node within the quadtree structure
	**/
	QuadTreeNode.prototype.depth = 0;
	
	/**
	* @default null
	* @member node1
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the top-left child node of the node.
	**/
	QuadTreeNode.prototype.node1 = null;
	
	/**
	* @default null
	* @member node2
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the bottom-left child node of the node.
	**/
	QuadTreeNode.prototype.node2 = null;
	
	/**
	* @default null
	* @member node3
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the top-right child node of the node.
	**/
	QuadTreeNode.prototype.node3 = null;
	
	/**
	* @default null
	* @member node4
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the bottom-right child node of the node.
	**/
	QuadTreeNode.prototype.node4 = null;
	
	/**
	* @default 0
	* @member limitX
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the x coordinate of the splitting boundary within this node.
	**/
	QuadTreeNode.prototype.limitX = 0;
	
	/**
	* @default 0
	* @member limitY
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the y coordinate of the splitting boundary within this node.
	**/
	QuadTreeNode.prototype.limitY = 0;
	
	
	tomahawk_ns.QuadTreeNode = QuadTreeNode;
	
})();



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
	 * @class BitmapMesh
	 * @memberOf tomahawk_ns
	 * @description The BitmapMesh class represents display objects that represent bitmap images. The main difference between a BitmapMesh and a Bitmap instance is that you can deform the current texture with the vertices, uvs and indices properties which defines triangles.
	 * @constructor
	 * @augments tomahawk_ns.Bitmap
	 **/
	function BitmapMesh(texture)
	{
		tomahawk_ns.Bitmap.apply(this,[texture]);
		this._canvas = document.createElement("canvas");
	}

	Tomahawk.registerClass( BitmapMesh, "BitmapMesh" );
	Tomahawk.extend( "BitmapMesh", "Bitmap" );
	
	/**
	* @member vertices
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Array}
	* @description An Array of vertices, used with indices, they defines a sets of triangles.
	**/
	BitmapMesh.prototype.vertices = null;
	
	/**
	* @member uvs
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Array}
	* @description The Array of UV coordinates attached to each vertex.
	**/
	BitmapMesh.prototype.uvs = null;
	
	/**
	* @member indices
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Array}
	* @description An Array of indices, used with vertices, they defines a sets of triangles.
	**/
	BitmapMesh.prototype.indices = null;
	
	/**
	* @member showLines
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Boolean}
	* @description Indicates wether the BitmapMesh instance will display the triangle's lines.
	**/
	BitmapMesh.prototype.showLines = false;
	
	BitmapMesh.prototype.setTexture = function(texture)
	{
		tomahawk_ns.Bitmap.prototype.setTexture.apply(this,[texture]);
		this.vertices = [[0,0],[this.width,0],[0,this.height],[this.width,this.height]];
		this.uvs = [[0,0],[1,0],[0,1],[1,1]];
		this.indices = [0,1,2,1,2,3];
	};

	BitmapMesh.prototype.draw = function(context)
	{
		var vertices = this.vertices;
		var uvtData = this.uvs;
		var indices = this.indices;
		var max = indices.length;
		var i = 0;
		var width = this.texture.rect[2];
		var height = this.texture.rect[3];
		var data = this.texture.data;
		var vertex1 = null;
		var vertex2 = null;
		var vertex3 = null;
		var index1 = 0;
		var index2 = 0;
		var index3 = 0;
		var uv1 = null;
		var uv2 = null;
		var uv3 = null;
		
		for( i = 0; i < max; i+=3 )
		{
			index1 = indices[i];
			index2 = indices[i + 1];
			index3 = indices[i + 2];
			vertex1 = vertices[index1];
			vertex2 = vertices[index2];
			vertex3 = vertices[index3];
			
			uv1 = uvtData[index1];
			uv2 = uvtData[index2];
			uv3 = uvtData[index3];
			this._drawTriangle( vertex1,vertex2,vertex3,uv1,uv2,uv3, context, data, width, height );
		}
	};
	
	BitmapMesh.prototype._drawTriangle = function(v1,v2,v3,uv1,uv2,uv3, ctx, texture, texW, texH ) 
	{
        ctx.save(); 
		
        var x0 = v1[0], x1 = v2[0], x2 = v3[0];
        var y0 = v1[1], y1 = v2[1], y2 = v3[1];
		
        var u0 = uv1[0], u1 = uv2[0], u2 = uv3[0];
        var v0 = uv1[1], v1 = uv2[1], v2 = uv3[1];
		
		u0 *= texW;
		u1 *= texW;
		u2 *= texW;
		v0 *= texH;
		v1 *= texH;
		v2 *= texH;

        // Set clipping area so that only pixels inside the triangle will
        // be affected by the image drawing operation
        
		
		ctx.beginPath(); 
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;
		
		ctx.moveTo(x0, y0 ); 
		ctx.lineTo(x1, y1 );
        ctx.lineTo(x2, y2 ); 
		ctx.lineTo(x0,y0);
		
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
					  
        ctx.drawImage(texture, 0,0,texW,texH );
		
        ctx.restore();
		
		if( this.showLines == true )
		{
			ctx.save();
			ctx.beginPath(); 
			ctx.strokeStyle = "black";
			ctx.lineWidth = 1;
			ctx.moveTo(x0, y0 ); 
			ctx.lineTo(x1, y1 );
			ctx.lineTo(x2, y2 ); 
			ctx.lineTo(x0,y0);
			ctx.stroke();
			ctx.closePath(); 
			ctx.restore();
		}
	};

	tomahawk_ns.BitmapMesh = BitmapMesh;

})();




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
	 * @class GridList
	 * @memberOf tomahawk_ns
	 * @description The GridList class provides an grid list of display objects
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function GridList(texture)
	{
		tomahawk_ns.Sprite.apply(this);
	}

	Tomahawk.registerClass( GridList, "GridList" );
	Tomahawk.extend( "GridList", "Sprite" );
	
	
	GridList.prototype.elementsPerPage	= 12;
	GridList.prototype.elementsPerRow	= 4;
	GridList.prototype.elementWidth 	= 100;
	GridList.prototype.elementHeight 	= 100;
	GridList.prototype.margin			= 10;
	GridList.prototype.ratioMax			= 1;
	GridList.prototype._currentPage		= 0;
	
	GridList.prototype.refresh		= function(numPage)
	{
		var max 			= this.getMaxPage();
		var start 			= 0;
		var end	 			= 0;
		var currentCol 		= 0;
		var currentRow 		= 0;
		var counter			= 0;
		var ratioX			= 0;
		var ratioY			= 0;
		var ratio			= 0;
		var currentChild	= null;
		var i				= this.children.length;
		var gapX 			= this.elementWidth + this.margin;
		var gapY 			= this.elementHeight + this.margin;
		
		this._currentPage 	= numPage || 0;
		this._currentPage 	= ( this._currentPage < 0 ) ? 0 : this._currentPage;
		this._currentPage 	= ( this._currentPage > max ) ? max : this._currentPage;
		
		
		start 				= Math.min( this.children.length, this._currentPage * this.elementsPerPage );
		end 				= start + this.elementsPerPage;
		
		
		while( --i > -1 )
		{
			this.children[i].visible = false;
		}
		
		for( i = start; i < end; i ++ )
		{
			currentCol = parseInt( counter % this.elementsPerRow );
			currentRow = parseInt( counter / this.elementsPerRow );
			
			currentChild 					= this.children[i];
			currentChild.updateNextFrame 	= true;
			currentChild.updateBounds();
			
			ratioX 							=  this.elementWidth / currentChild.width;
			ratioY 							=  this.elementHeight / currentChild.height;
			ratio							= ( ratioX < ratioY ) ? ratioX : ratioY;
			ratio							= ( ratio > this.ratioMax ) ? this.ratioMax : ratio;
			
			currentChild.scaleX 			= ratio;
			currentChild.scaleY 			= ratio;
			
			currentChild.x 					= parseInt( currentCol * gapX ) + ( (this.elementWidth - currentChild.width * ratio ) / 2 );
			currentChild.y 					= parseInt( currentRow * gapY ) + ( (this.elementHeight - currentChild.height * ratio ) / 2 );
			currentChild.visible 			= true;
			
			counter++;
		}
	};
	
	GridList.prototype.getMaxPage	= function()
	{
		var max = Math.ceil( this.children.length / this.elementsPerPage ) - 1;
		return max;
	};
	
	GridList.prototype.next			= function()
	{
		this.refresh(this._currentPage + 1);
	};
	
	GridList.prototype.prev			= function()
	{
		this.refresh(this._currentPage - 1);
	};
	
	tomahawk_ns.GridList = GridList;
})();




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
	 * @class HList
	 * @memberOf tomahawk_ns
	 * @description The HList class provides an horizontal list of display objects
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function HList(texture)
	{
		tomahawk_ns.Sprite.apply(this);
	}

	Tomahawk.registerClass( HList, "HList" );
	Tomahawk.extend( "HList", "Sprite" );
	
	HList.prototype.elementWidth 	= 100;
	HList.prototype.elementHeight 	= 100;
	HList.prototype.listWidth 		= 100;
	HList.prototype.listHeight 		= 100;
	HList.prototype.margin			= 10;
	
	HList.prototype.refresh			= function()
	{
		var i 			= 0;
		var child 		= null;
		var max 		= this.children.length;
		var ratioX 		= 1;
		var ratioY 		= 1;
		var ratio		= 1;
		var currentX 	= 0; 
		var currentY 	= 0; 
		
		for( i = 0; i < max; i++ )
		{
			child = this.children[i];
			ratioX = this.elementWidth / child.width;
			ratioY = this.elementHeight / child.height;
			ratio = ( ratioX < ratioY ) ? ratioX : ratioY;
			child.scaleX = child.scaleY = ratio;
			
			child.x = currentX + ( (this.elementWidth - (child.width * child.scaleX)) >> 1);
			child.y = currentY + ( (this.elementHeight - (child.height * child.scaleY)) >> 1);
			
			currentX += this.elementWidth + this.margin;
			
			if( child.x > this.listWidth || child.y > this.listHeight )
				child.visible = false;
			else
				child.visible = true;
		}
		
	};
	
	HList.prototype.right			= function()
	{
		var child = this.children.pop();
		this.children.unshift(child);
		this.refresh();
	};
	
	HList.prototype.left			= function()
	{
		var child = this.children.shift();
		this.children.push(child);
		this.refresh();
	};
	
	tomahawk_ns.HList = HList;
})();




/**
 * ...
 * @author Hatshepsout
 */

(function() {

 
	function ScrollBar()
	{
		tomahawk_ns.Sprite.apply(this);
		this.reset();
	}

	Tomahawk.registerClass(ScrollBar,"ScrollBar")
	Tomahawk.extend("ScrollBar","Sprite");

	ScrollBar.prototype._background 			= null;
	ScrollBar.prototype._foreground 			= null;
	ScrollBar.prototype._field 					= null;
	ScrollBar.prototype.backgroundColor 		= "#333333";
	ScrollBar.prototype.foregroundColor 		= "#0080C0";
	ScrollBar.prototype.errorColor 				= "#c00000";
	ScrollBar.prototype.barWidth				= 100;
	ScrollBar.prototype.barHeight				= 15;

	ScrollBar.prototype.reset 			= function(barWidth, barHeight,backgroundColor, foregroundColor,errorColor)
	{
		this.removeChildren();
		
		this.barWidth 			= barWidth 			|| this.barWidth;
		this.barHeight 			= barHeight 		|| this.barHeight;
		this.foregroundColor 	= foregroundColor 	|| this.foregroundColor;
		this.backgroundColor 	= backgroundColor 	|| this.backgroundColor;
		this.errorColor 		= errorColor 		|| this.errorColor;
		
		this._background 	= new tomahawk_ns.Shape();
		this._foreground 	= new tomahawk_ns.Shape();
		
		this._background.beginPath();
		this._background.fillStyle(this.backgroundColor);
		this._background.fillRect(0,0,this.barWidth,this.barHeight);
		this._background.fill();
		this._background.closePath();
		this._background.width = this.barWidth;
		this._background.height = this.barHeight;
		this._background.cacheAsBitmap = true;
		
		this._foreground.beginPath();
		this._foreground.fillStyle(this.foregroundColor);
		this._foreground.fillRect(0,0,this.barWidth,this.barHeight);
		this._foreground.fill();
		this._foreground.closePath();
		this._foreground.width = this.barWidth;
		this._foreground.height = this.barHeight;
		this._foreground.scaleX = 0;
		//this._foreground.cacheAsBitmap = true;
		
		
		this.addChild(this._background);
		this.addChild(this._foreground);
		this.setProgression(0);
	};

	ScrollBar.prototype.error 			= function()
	{
		this._foreground.clear();
		this._foreground.beginPath();
		this._foreground.fillStyle(this.errorColor);
		this._foreground.fillRect(0,0,this.barWidth,this.barHeight);
		this._foreground.fill();
		this._foreground.closePath();
		this._foreground.width = this.barWidth;
		this._foreground.height = this.barHeight;
	};

	ScrollBar.prototype.setProgression 	= function(progression)
	{
		progression = ( progression < 1 ) ? progression : 1;
		this._foreground.scaleX = progression;
	};

	ScrollBar.prototype.complete 		= function()
	{	
		this._foreground.scaleX = 1;
	};

	ScrollBar.prototype.destroy 		= function()
	{
		this.removeChildren();
		this._foreground = null;
		this._background = null;
	};


	tomahawk_ns.ScrollBar = ScrollBar;
})();





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
	 * @class Sprite3D
	 * @memberOf tomahawk_ns
	 * @description The Sprite3d class is a basic display list building block, a display list node that can contain children on which pseudo3D effects can be applied.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function Sprite3D()
	{
		tomahawk_ns.Sprite.apply(this);
		this.matrix3D = new tomahawk_ns.Matrix4x4();
	}
	
	/**
	* @member matrix3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Matrix4x4}
	* @description The transformation matrix (3d) of the Sprite3D
	* @default null
	**/
	Sprite3D.prototype.matrix3D = null;
	
	/**
	* @member scaleZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 1
	* @description Indicates the depth scale (percentage) of the object as applied from the registration point.
	**/
	Sprite3D.prototype.scaleZ = 1;
	
	/**
	* @member z
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the z coordinate of the Sprite3D instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	Sprite3D.prototype.z = 0;
	
	/**
	* @member pivotZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the z coordinate of the Sprite3D instance registration point
	**/
	Sprite3D.prototype.pivotZ = 0;
	
	/**
	* @member rotationX
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the x axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationX = 0;
	
	/**
	* @member rotationY
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the y axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationY = 0;
	
	/**
	* @member rotationZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the z axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationZ = 0;
	
	/**
	* @member useReal3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Boolean}
	* @default false
	* @description Indicates wether the Sprite3D instance will convert his parent's transformation matrixes in 3d matrixes before rendering. If true it will results in a better 3d transformation.
	**/
	Sprite3D.prototype.useReal3D = false;
	
	/**
	* @description Returns a vector that represents the normale of the Sprite3D instance.
	* @method getNormalVector
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @returns {tomahawk_ns.Vector3D} returns a Vector3D object
	**/
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
	
	/**
	* @description Returns the combined 3d and 2d transformation matrixes of the Sprite3D instance and all of its parent objects, back to the stage level. If one of the parents of the Sprite3D instance is classical 2d display object, his matrix is converted into a Matrix4x4.
	* @method getConcatenedMatrix3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @returns {tomahawk_ns.Matrix4x4} returns a Matrix4x4 object
	**/
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
	
	/**
	* @method localToGlobal3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @param {string} {param} myparam
	* @returns {Number} returns a number
	* @description Converts the point object specified by x,y,z parameters from the DisplayObject's (local) coordinates to the Stage (global) coordinates.
	**/
	Sprite3D.prototype.localToGlobal3D = function(x,y,z)
	{
		var mat = this.getConcatenedMatrix3D();
		var pt = new tomahawk_ns.Point3D(x,y,z);
		mat.transformPoint3D(pt);
		return pt;
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
	
	
	Tomahawk.registerClass( Sprite3D, "Sprite3D" );
	Tomahawk.extend( "Sprite3D", "Sprite" );
	

	tomahawk_ns.Sprite3D = Sprite3D;
})();





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
	 * @class VList
	 * @memberOf tomahawk_ns
	 * @description The VList class provides an vertical list of display objects
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function VList(texture)
	{
		tomahawk_ns.Sprite.apply(this);
	}

	Tomahawk.registerClass( VList, "VList" );
	Tomahawk.extend( "VList", "Sprite" );
	
	VList.prototype.elementWidth 	= 100;
	VList.prototype.elementHeight 	= 100;
	VList.prototype.listWidth 		= 100;
	VList.prototype.listHeight 		= 100;
	VList.prototype.margin			= 10;
	
	VList.prototype.refresh			= function()
	{
		var i 			= 0;
		var child 		= null;
		var max 		= this.children.length;
		var ratioX 		= 1;
		var ratioY 		= 1;
		var ratio		= 1;
		var currentX 	= 0; 
		var currentY 	= 0; 
		
		for( i = 0; i < max; i++ )
		{
			child = this.children[i];
			ratioX = this.elementWidth / child.width;
			ratioY = this.elementHeight / child.height;
			ratio = ( ratioX < ratioY ) ? ratioX : ratioY;
			child.scaleX = child.scaleY = ratio;
			
			child.x = currentX + ( (this.elementWidth - (child.width * child.scaleX)) >> 1);
			child.y = currentY + ( (this.elementHeight - (child.height * child.scaleY)) >> 1);
			
			currentY += this.elementHeight + this.margin;
			
			if( child.x > this.listWidth || child.y > this.listHeight )
				child.visible = false;
			else
				child.visible = true;
		}
		
	};
	
	VList.prototype.up			= function()
	{
		var child = this.children.pop();
		this.children.unshift(child);
		this.refresh();
	};
	
	VList.prototype.down		= function()
	{
		var child = this.children.shift();
		this.children.push(child);
		this.refresh();
	};
	
	tomahawk_ns.VList = VList;
})();




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
	* @class Bitmap
	* @memberOf tomahawk_ns
	* @description The Bitmap class represents display objects that represent bitmap images. 
	* @param {tomahawk_ns.Texture} [texture=undefined] the bitmap drawing texture.
	* @augments tomahawk_ns.DisplayObject
	* @constructor
	*/
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		
		if( texture == undefined )
			return;
			
		this.setTexture(texture);
	}

	Tomahawk.registerClass( Bitmap, "Bitmap" );
	Tomahawk.extend( "Bitmap", "DisplayObject" );

	/**
	 * @description The current drawing texture.
	 * @member texture
	 * @type {tomahawk_ns.Texture}
	 * @memberOf tomahawk_ns.Bitmap.prototype
	 * @default null
	 */
	Bitmap.prototype.texture = null;
	
	/**
	* @description Sets the Bitmap current Texture.
	* @method setTexture
	* @param {tomahawk_ns.Texture} texture 
	* @memberOf tomahawk_ns.Bitmap.prototype
	**/
	Bitmap.prototype.setTexture = function(texture)
	{
		this.texture = texture;
		this.width = this.texture.rect[2];
		this.height = this.texture.rect[3];
	};

	Bitmap.prototype.draw = function( context )
	{	
		var rect = this.texture.rect;
		var data = this.texture.data;
			
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	};
	
	Bitmap.prototype.toFlatObject	= function()
	{
		var copy 			= tomahawk_ns.DisplayObject.prototype.toFlatObject.apply(this);
		var texObj			= new Object();
		
		texObj.data 		= this.snapshot().toDataURL("image/png");
		texObj.rect			= this.texture.rect;
		texObj.name			= this.texture.name;
		
		copy.texture		= texObj;
		
		return copy;
	};
	
	tomahawk_ns.Bitmap = Bitmap;

})();






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
		this.name = "display_object_" + Tomahawk._UNIQUE_OBJECT_ID++;
	}

	Tomahawk.registerClass( DisplayObject, "DisplayObject" );
	Tomahawk.extend( "DisplayObject", "EventDispatcher" );

	/**
	* @member shadow
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Indicates wether the DisplayObject has a shadow.
	* @default null
	**/
	DisplayObject.prototype.shadow 						= false;
	
	/**
	* @member shadowBlur
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the shadowBlur of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.shadowBlur 					= 5;
	
	/**
	* @member shadowOffsetY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the shadowOffsetY of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.shadowOffsetY 				= 0;
	
	/**
	* @member shadowOffsetX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the shadowOffsetX of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.shadowOffsetX 				= 0;
	
	/**
	* @member shadowColor
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {String}
	* @description Indicates the shadowColor of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.shadowColor 				= "black";

	/**
	* @member globalCompositeOperation
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {String}
	* @description Indicates the globalCompositeOperation used to draw the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.globalCompositeOperation 	= null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {String}
	* @description Indicates the instance name of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.name 						= null;
	
	/**
	* @member parent
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.DisplayObjectContainer}
	* @description Indicates the DisplayObjectContainer object that contains this display object.
	* @default null
	**/
	DisplayObject.prototype.parent 						= null;
	
	/**
	* @member x
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	DisplayObject.prototype.x 							= 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	DisplayObject.prototype.y 							= 0;
	
	/**
	* @member pivotX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the x coordinate of the DisplayObject instance registration point
	**/
	DisplayObject.prototype.pivotX 						= 0;
	
	/**
	* @member pivotY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the y coordinate of the DisplayObject instance registration point
	**/
	DisplayObject.prototype.pivotY 						= 0;
	
	/**
	* @member skewX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the skew on the x axis of the DisplayObject instance
	**/
	DisplayObject.prototype.skewX 						= 0;
	
	/**
	* @member skewY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the skew on the y axis of the DisplayObject instance
	**/
	DisplayObject.prototype.skewY 						= 0;
	
	/**
	* @member scaleX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the horizontal scale (percentage) of the object as applied from the registration point.
	* @default 1
	**/
	DisplayObject.prototype.scaleX 						= 1;
	
	/**
	* @member scaleY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 1
	* @description Indicates the vertical scale (percentage) of the object as applied from the registration point.
	**/
	DisplayObject.prototype.scaleY 						= 1;
	
	/**
	* @default 0
	* @member width
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the width of the display object, in pixels.
	**/
	DisplayObject.prototype.width 						= 0;
	
	/**
	* @default 0
	* @member height
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the height of the display object, in pixels.
	**/
	DisplayObject.prototype.height 						= 0;
	
	/**
	* @member rotation
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation.
	* @default 0
	**/
	DisplayObject.prototype.rotation 					= 0;
	
	/**
	* @member stage
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Stage}
	* @description The Stage of the display object.
	* @default null
	**/
	DisplayObject.prototype.stage 						= null;
	
	/**
	* @member alpha
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the alpha transparency value of the object specified.
	* @default 1
	**/
	DisplayObject.prototype.alpha 						= 1;
	
	/**
	* @member mouseEnabled
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Specifies whether this object receives mouse, or other user input, messages.
	* @default true
	**/
	DisplayObject.prototype.mouseEnabled 				= true;
	
	/**
	* @member handCursor
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description A Boolean value that indicates whether the pointing hand (hand cursor) appears when the pointer rolls over this sprite
	* @default false
	**/
	DisplayObject.prototype.handCursor 					= false;
	
	/**
	* @member visible
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Whether or not the display object is visible.
	* @default true
	**/
	DisplayObject.prototype.visible 					= true;
	
	/**
	* @member isMask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Defines if the current DisplayObject is masking another one
	* @default false
	**/
	DisplayObject.prototype.isMask						= false;
	
	/**
	* @member filters
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Array}
	* @description An indexed array that contains each filter object currently associated with the display object.
	* @default null
	**/
	DisplayObject.prototype.filters 					= null;
	
	/**
	* @member mask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.DisplayObject}
	* @description The calling display object is masked by the specified mask object.
	* @default null
	**/
	DisplayObject.prototype.mask 						= null;
	
	/**
	* @member matrix
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Matrix2D}
	* @description The transformation matrix of the DisplayObject
	* @default null
	**/
	DisplayObject.prototype.matrix 						= null;
	
	/**
	* @member bounds
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Rectangle}
	* @description Indicates a rectangle that defines the area of the display object relative to his parent coordinate system. You must set the updateNextFrame ( or the autoUpdate ) property to true and call the updateBounds method to actualize this Rectangle.
	* @default null
	**/
	DisplayObject.prototype.bounds 						= null;
	
	/**
	* @member cacheAsBitmap
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description If set to true, the object is caching an internal representation of the display object.
	* @default true
	**/
	DisplayObject.prototype.cacheAsBitmap				= false;
	
	/**
	* @member autoUpdate
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description If set to true, the matrix of the DisplayObject will be computed every frame, if not, the matrix will not change.
	* @default true
	**/
	DisplayObject.prototype.autoUpdate					= true;
	
	/**
	* @member updateNextFrame
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @default true
	* @description If set to true, the transformation matrix will be update at next frame.
	**/
	DisplayObject.prototype.updateNextFrame				= true;	
	
	/**
	* @member pixelPerfect
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @default false
	* @description If set to true, the hitTest call will check the alpha channel of the pixel beneath the mouse coordinates.
	* If the pixel alpha channel is > pixelAlphaLimit, the pixel is considered non transparent
	**/
	DisplayObject.prototype.pixelPerfect				= false;
	
	/**
	* @member pixelAlphaLimit
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description The alpha channel limit under which a pixel is considered transparent while calling the hitTest method.
	**/
	DisplayObject.prototype.pixelAlphaLimit				= 0;
	
	DisplayObject.prototype._concatenedMatrix 			= null;
	DisplayObject.prototype._cache 						= null;
	DisplayObject.prototype._maskBuffer 				= null;
	DisplayObject.prototype._cacheOffsetX 				= 0;
	DisplayObject.prototype._cacheOffsetY 				= 0;
	DisplayObject._pixelBuffer 							= null;
	
	/**
	* @method updateBounds
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Updates the bounds of the current DisplayObject if his updateNextFrame || autoUpdate = true
	**/
	DisplayObject.prototype.updateBounds 				= function()
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
	DisplayObject.prototype.setMask 					= function( mask )
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
	DisplayObject.prototype.updateMatrix 				= function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
			
		var mat = this.matrix;
		
		mat.d = mat.a = 1;
		mat.b = mat.c = mat.tx = mat.ty = 0;
		
		
		mat.appendTransform(	this.x + this.pivotX, 
								this.y + this.pivotY, 
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
	DisplayObject.prototype.updateCache 				= function()
	{	
		var buffer = null;
		var context = null;
		var filters = this.filters;
		var i = 0;
		var j = 0;
		var max = 0;
		var offX = 0;
		var offY = 0;
		var bounds = this.getBoundingRectIn(this);
		var cacheAsBitmap = this.cacheAsBitmap;
		var filterBounds = null;
		
		var width = 0;
		var height = 0;
		
		if( this._cache == null || this._cache == undefined)
		{
			this._cache = document.createElement("canvas");
		}
		
		buffer = this._cache;
		context = buffer.getContext("2d");
		
		
		width = (bounds.width < 1) ? 1 : bounds.width >> 0;
		height = (bounds.height < 1) ? 1 : bounds.height >> 0;
		
		if( filters != null )
		{
			i = 0;
			max = filters.length;
			
			for( i = 0; i < max; i++ )
			{
				filterBounds = filters[i].getOffsetBounds(buffer,context,this);
				
				if( filterBounds == null )
					continue;
					
				offX += filterBounds.x;
				offY += filterBounds.y;
				width += filterBounds.width;
				height += filterBounds.height;
			}
		}
		
		width = Math.ceil(width / 100) * 100;
		height =  Math.ceil(height / 100) * 100;
		
		buffer.width = width;
		buffer.height = height;
		
		
		context.save();
		context.globalAlpha = this.alpha;
		this.cacheAsBitmap = false;
		this.draw(context);
		this.cacheAsBitmap = cacheAsBitmap;
		context.restore();
		
		//after drawing filters
		if( filters != null )
		{		
			i = 0;
			max = filters.length;
			
			for( i = 0; i < max; i++ )
			{
				filters[i].applyFilter(buffer,context,this);
			}
		}
		
		this._cache = buffer;
		this._cacheOffsetX = -offX;
		this._cacheOffsetY = -offY;
		return buffer;
	};
	
	/**
	* @method drawComposite
	* @description Draw the DisplayObject instance into the specified context with mask and filters.
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {CanvasRenderingContext2D} drawContext the CanvasRenderingContext2D context on which you want to draw.
	**/
	DisplayObject.prototype.drawComposite 				= function(context)
	{
		if( this._cache == null || this.cacheAsBitmap == false )
			this.updateCache();
			
		var maskBuffer = null;
		var maskContext = null;
		var mask = this.mask;
		var mat = null;
		var i = 0;
		
		if( mask != null )
		{
			this._maskBuffer = ( this._maskBuffer == null ) ? document.createElement("canvas") : this._maskBuffer;
			maskBuffer = this._maskBuffer;
			maskBuffer.width = this._cache.width;
			maskBuffer.height = this._cache.height;
			maskContext = maskBuffer.getContext("2d");
			
			mat = mask.getConcatenedMatrix().prependMatrix( this.getConcatenedMatrix().invert() );
			
			maskContext.save();
			maskContext.globalAlpha = mask.alpha;
			maskContext.setTransform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			mask.draw(maskContext);
			maskContext.restore();
			
			maskContext.save();
			maskContext.globalCompositeOperation = "source-in";
			maskContext.drawImage(	this._cache, 
									this._cacheOffsetX , 
									this._cacheOffsetY , 
									this._cache.width , 
									this._cache.height );
			maskContext.restore();
			
			context.drawImage(maskBuffer,0, 0, maskBuffer.width, maskBuffer.height );
		}
		else
		{
			context.drawImage(	this._cache, 
								this._cacheOffsetX, 
								this._cacheOffsetY, 
								this._cache.width, 
								this._cache.height);	
		}
	};

	/**
	* @method draw
	* @description Draws the DisplayObject instance into the specified context
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {CanvasRenderingContext2D} drawContext the CanvasRenderingContext2D context on which you want to draw.
	**/
	DisplayObject.prototype.draw 						= function(context)
	{
		
	};
	
	/**
	* @method getConcatenedMatrix
	* @description Returns the combined transformation matrices of the DisplayObject instance and all of its parent objects, back to the stage level.
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Boolean} forceUpdate Forces the update of the current DisplayObject and all his parents
	**/
	DisplayObject.prototype.getConcatenedMatrix 		= function(forceUpdate)
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
	DisplayObject.prototype.localToGlobal 				= function(x,y)
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
	DisplayObject.prototype.globalToLocal 				= function(x,y)
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
	DisplayObject.prototype.hitTest 					= function(x,y)
	{		
		var pt1 = this.globalToLocal(x,y);
		var buffer = null;
		var context = null;
		var mat = this.matrix;
		var pixels = null;
		
		if( pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height )
			return false;
		
		if( this.pixelPerfect == false )
			return true;
			
		tomahawk_ns.DisplayObject._pixelBuffer = tomahawk_ns.DisplayObject._pixelBuffer || document.createElement("canvas");
		buffer = tomahawk_ns.DisplayObject._pixelBuffer;
		buffer.width = buffer.height = 1;
		
		context = buffer.getContext("2d");
		context.save();
		context.translate(-pt1.x,-pt1.y);
		this.draw(context);
		context.restore();
		
		pixels = context.getImageData(0,0,1,1).data;
		return ( pixels[3] > this.pixelAlphaLimit );
	};

	/**
	* @method isChildOf
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} obj
	* @returns {Boolean}
	* @description Indicates if the DisplayObject "obj" is a child of the DisplayObject instance
	**/
	DisplayObject.prototype.isChildOf 					= function( obj )
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
	DisplayObject.prototype.getBoundingRectIn 			= function(spaceCoordinates)
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
	DisplayObject.prototype.snapshot 					= function(transformMatrix)
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
	DisplayObject.prototype.destroy 					= function()
	{
		this._cache = null;
		this._maskBuffer = null;
		this.setMask(null);
		
		if( this.parent != null )
		{
			this.parent.removeChild(this);
		}
		
		tomahawk_ns.EventDispatcher.prototype.destroy.apply(this);
	};
	
	/**
	* @method toJSON
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Exports the current DisplayObject to JSON
	* @returns {String} a JSON string 
	**/
	DisplayObject.prototype.toJSON						= function()
	{
		return JSON.stringify(this.toFlatObject());
	};
	
	/**
	* @method toFlatObject
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Exports the current DisplayObject to a flat Object ( no methods, just public properties )
	* @returns {Object} a flat Object
	**/
	DisplayObject.prototype.toFlatObject	= function()
	{
		var copy 						= new Object();
		copy.x 							= this.x;
		copy.y 							= this.y;
		copy.pivotX 					= this.pivotX;
		copy.pivotY 					= this.pivotY;
		copy.skewX 						= this.skewX;
		copy.skewY 						= this.skewY;
		copy.scaleX 					= this.scaleX;
		copy.scaleY 					= this.scaleY;
		copy.width 						= this.width;
		copy.height 					= this.height;
		copy.rotation 					= this.rotation;
		copy.alpha 						= this.alpha;
		copy.visible 					= this.visible;
		copy.bounds 					= this.bounds;
		copy.handCursor 				= this.handCursor;
		copy.mouseEnabled 				= this.mouseEnabled;
		copy.isMask 					= this.isMask;
		copy.cacheAsBitmap 				= this.cacheAsBitmap;
		copy.autoUpdate 				= this.autoUpdate;
		copy.updateNextFrame 			= this.updateNextFrame;
		copy.pixelPerfect 				= this.pixelPerfect;
		copy.pixelAlphaLimit 			= this.pixelAlphaLimit;
		copy.shadow 					= this.shadow;
		copy.shadowBlur 				= this.shadowBlur;
		copy.shadowColor 				= this.shadowColor;
		copy.shadowOffsetX 				= this.shadowOffsetX;
		copy.shadowOffsetY 				= this.shadowOffsetY;
		copy.globalCompositeOperation 	= this.globalCompositeOperation;
		copy.name 						= this.name;
		
		copy.parent 					= ( this.parent == null ) ? null : this.parent.name;
		copy.stage 						= ( this.stage == null ) ? null : this.stage.name;
		copy.mask 						= ( this.mask == null ) ? null : this.mask.name;
		copy.matrix						= this.matrix.toFlatObject();
		//copy.filters 					= this.filters;
		
		return copy;
		
	};
	
	tomahawk_ns.DisplayObject = DisplayObject;

})();







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
	 * @class DisplayObjectContainer
	 * @memberOf tomahawk_ns
	 * @description The DisplayObjectContainer class is the base class for all objects that can serve as display object containers on the display list. The display list manages all objects displayed in the canvas. Use the DisplayObjectContainer class to arrange the display objects in the display list. Each DisplayObjectContainer object has its own child list for organizing the z-order of the objects. The z-order is the front-to-back order that determines which object is drawn in front, which is behind, and so on. DisplayObjectContainer is an abstract base class; therefore, you cannot call DisplayObjectContainer directly.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObject
	 **/
	function DisplayObjectContainer()
	{
		tomahawk_ns.DisplayObject.apply(this);
		this.children = new Array();
	}

	Tomahawk.registerClass( DisplayObjectContainer, "DisplayObjectContainer" );
	Tomahawk.extend( "DisplayObjectContainer", "DisplayObject" );

	/**
	* @member children
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @type {Array}
	* @description the child list of the DisplayObjectContainer instance
	* @default null
	**/
	DisplayObjectContainer.prototype.children = null;
	
	/**
	* @member isContainer
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @type {Boolean}
	* @description Defines if the current DisplayObjectContainer is a container or not ( actually always sets to true )
	* @default true
	**/
	DisplayObjectContainer.prototype.isContainer = true;

	/**
	* @method setChildIndex
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The child DisplayObject instance for which you want to change the index number.
	* @param {Number} index The resulting index number for the child display object.
	* @description Changes the position of an existing child in the display object container.
	**/
	DisplayObjectContainer.prototype.setChildIndex = function(child,index)
	{
		if( child.parent != this )
			return;
			
		var tab1 = null;
		var tab2 = null;
		var currentIndex = this.children.indexOf(child);
		
		this.children.splice(currentIndex,1);
		
		tab1 = this.children.slice(0,index);
		tab2 = this.children.slice(index);
		
		this.children = tab1.concat([child]).concat(tab2);
	};
	
	/**
	* @method addChild
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance that you pass in the child parameter.
	* @description Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added to the front (top) of all other children in this DisplayObjectContainer instance. (To add a child to a specific index position, use the addChildAt() method.) If you add a child object that already has a different display object container as a parent, the object is removed from the child list of the other display object container.
	**/
	DisplayObjectContainer.prototype.addChild = function(child)
	{	
		if( child.parent == this )
		{
			this.setChildIndex(child, this.children.length);
			return child;
		}
		
		if( child.parent != null )
		{
			child.parent.removeChild(child);
		}
		
		child.parent = this;
		this.children.push(child);
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED, true, true) );
		return child;
	};

	/**
	* @method getChildAt
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {Number} index The index position of the child object.
	* @returns {tomahawk_ns.DisplayObject} The child display object at the specified index position.
	* @description Returns the child display object instance that exists at the specified index.
	**/
	DisplayObjectContainer.prototype.getChildAt = function (index)
	{
		return this.children[index];
	};

	/**
	* @method getChildByName
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {String} name The name of the child to return.
	* @returns {tomahawk_ns.DisplayObject} The child display object with the specified name.
	* @description Returns the child display object that exists with the specified name. If more that one child display object has the specified name, the method returns the first object in the child list.
	**/
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

	/**
	* @method addChildAt
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance that you pass in the child parameter.
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @param {Number} index The index position to which the child is added. If you specify a currently occupied index position, the child object that exists at that position and all higher positions are moved up one position in the child list.
	* @description Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added at the index position specified. An index of 0 represents the back (bottom) of the display list for this DisplayObjectContainer object.
	**/
	DisplayObjectContainer.prototype.addChildAt = function(child, index)
	{
		if( child.parent == this )
		{
			this.setChildIndex(child, index);
			return child;
		}
		
		
		if( child.parent != null )
		{
			child.parent.removeChild(child);
		}
		
		var children = this.children;
		var tab1 = this.children.slice(0,index);
		var tab2 = this.children.slice(index);
		this.children = tab1.concat([child]).concat(tab2);
		
		child.parent = this;
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED, true, true) );
		
		return child;
	};
	
	/**
	* @method getChildIndex
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to identify.
	* @returns {Number}  The index position of the child display object to identify.
	* @description Returns the index position of a child DisplayObject instance.
	**/
	DisplayObjectContainer.prototype.getChildIndex = function(child)
	{
		return this.children.indexOf(child);
	};

	/**
	* @method removeChildAt
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {Number} index The child index of the DisplayObject to remove.
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance that was removed.
	* @description Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
	**/
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
	
	/**
	* @method removeChildren
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @description Removes all child DisplayObject instances from the child list of the DisplayObjectContainer instance.
	**/
	DisplayObjectContainer.prototype.removeChildren = function()
	{
		while( this.children.length > 0 )
		{
			this.removeChildAt(0);
		}
	};
	
	/**
	* @method removeChild
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to remove
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance to remove
	* @description Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
	**/
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

	/**
	* @method getObjectUnder
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @returns {Array}
	* @description Returns an Array with the first nested child of the DisplayObjectContainer instance which overlaps or intersects with the point specified by the x and y parameters. The x and y parameters specify a point in the coordinate space of the Stage, not the display object container that contains the display object (unless that display object container is the Stage).
	**/
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
	
	/**
	* @method getNestedChildren
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @returns {Array}
	* @description Returns an Array with all the nested children of the DisplayObjectContainer instance 
	**/
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
	
	
	DisplayObjectContainer.prototype.toFlatObject	= function()
	{
		var copy 			= tomahawk_ns.DisplayObject.prototype.toFlatObject.apply(this);
		var i 				= 0;
		var max 			= this.children.length;
		
		copy.children 		= new Array();
		copy.isContainer 	= this.isContainer;
		
		for(i = 0; i < max; i++)
		{
			copy.children.push( this.children[i].toFlatObject() );
		}
		
		return copy;
	};
	
	DisplayObjectContainer.prototype.draw = function( context )
	{	
		var children = this.children;
		var i = 0;
		var max = children.length;
		var child = null;
		var mat = null;
		
		for( i = 0; i < max; i++ )
		{
			child = children[i];
			
			if( !child.visible )
				continue;
			
			child.updateMatrix();
			
			if( child.isMask == true )
				continue;
			
			mat = child.matrix;
			
			context.save();
			context.globalAlpha *= child.alpha;
			context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			
			if( child.shadow == true )
			{
				context.shadowColor = child.shadowColor;
				context.shadowBlur = child.shadowBlur;
				context.shadowOffsetX = child.shadowOffsetX;
				context.shadowOffsetY = child.shadowOffsetY;
			}
			
			if( child.globalCompositeOperation != null )
			{
				context.globalCompositeOperation = child.globalCompositeOperation;
			}
			
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
	 * @class MovieClip
	 * @memberOf tomahawk_ns
	 * @description The MovieClip class inherits from the following classes: Sprite,DisplayObjectContainer, DisplayObject, and EventDispatcher. Unlike the Sprite object, a MovieClip object has a timeline.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function MovieClip()
	{
		tomahawk_ns.Sprite.apply(this);
		this._symbols = new Object();
		this._timeline = new tomahawk_ns.Timeline();
	}

	Tomahawk.registerClass( MovieClip, "MovieClip" );
	Tomahawk.extend( "MovieClip", "Sprite" );
	
	
	MovieClip.prototype.fps 				= 1;
	MovieClip.prototype.isMovieClip 		= true;
	MovieClip.prototype._timer 				= 0;
	MovieClip.prototype._lastFrame 			= null;
	MovieClip.prototype.reverse 			= false;
	MovieClip.prototype._symbols 			= null;
	
	MovieClip.prototype.setSymbols 			= function(symbols)
	{
		this._symbols = symbols;
	};
	
	MovieClip.prototype._refresh 			= function()
	{
		var i = 0
		var frame = null;
		var tween = null;
		var currentChild = null;
		var currentFrame = this._timeline.getCurrentFrameIndex();
		
		frame = this._timeline.getFrameAt(currentFrame);
		
		if(  frame != null )
		{		
			if( this._lastFrame != frame )
			{
				this._lastFrame = frame;
				this.removeChildren();
				i = frame.children.length;
				
				while( --i > -1 )
				{
					currentChild = this._symbols[frame.children[i].symbol];
					
					if( currentChild == undefined || currentChild == null )
						continue;
						
					this.addChildAt(currentChild,0);
				
					if( currentChild.isMovieClip == true )
					{
						currentChild.gotoAndStop(currentFrame - frame.index);
					}
				}
				
				frame.runScript(this);
			}
		}
	};
	
	MovieClip.prototype.gotoLabelAndStop 	= function(label)
	{
		this.stop();
		this._timeline.goToLabel(label);
		this._refresh();
	};
	
	MovieClip.prototype.gotoAndStop 		= function(index)
	{
		this.stop();
		this._timeline.setPosition(index);
		this._refresh();
	};
	
	MovieClip.prototype.gotoLabelAndPlay 	= function(label)
	{
		this.stop();
		this._timeline.goToLabel(label);
		this._refresh();
		this.play();
	};	
	
	MovieClip.prototype.gotoAndPlay 		= function(index)
	{
		this.stop();
		this._timeline.setPosition(index);
		this._refresh();
		this.play();
	};

	MovieClip.prototype.nextFrame 			= function()
	{
		this._timeline.setPosition(this._timeline.getCurrentFrameIndex()+1);
		this._refresh();
	};
	
	MovieClip.prototype.prevFrame 			= function()
	{
		this._timeline.setPosition(this._timeline.getCurrentFrameIndex()-1);
		this._refresh();
	};
	
	MovieClip.prototype.getTimeline 		= function()
	{
		return this._timeline;
	};
	
	MovieClip.prototype.play 				= function()
	{
		this.stop();
		
		if( this.reverse == true )
		{
			this.prevFrame();
		}
		else
		{
			this.nextFrame();
		}
		
		this._timer = setTimeout(this.play.bind(this), 1000 / this.fps );
	};

	MovieClip.prototype.stop 				= function()
	{
		clearTimeout(this._timer); 
	};
	
	MovieClip.prototype.destroy 			= function()
	{
		this.stop();
		this._timeline.destroy();
		tomahawk_ns.Sprite.prototype.destroy.apply(this);
	};

	
	tomahawk_ns.MovieClip = MovieClip;

})();




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
	 * @author The Tiny Spark
	 */
 
	/**
	 * @class SWFAnim
	 * @memberOf tomahawk_ns
	 * @description The SWFAnim class is a basic export 
	 * @constructor
	 * @augments tomahawk_ns.SWFAnim
	 **/

	function SWFAnim()
	{
		tomahawk_ns.Sprite.apply(this);
		this._frames 	= new Array();
		this._symbols 	= new Array();
		this._labels 	= new Array();
		this._scripts 	= new Array();
	}

	Tomahawk.registerClass( SWFAnim, "SWFAnim" );
	Tomahawk.extend( "SWFAnim", "Sprite" );

	SWFAnim.prototype._labels 				= null;
	SWFAnim.prototype._frames 				= null;
	SWFAnim.prototype._symbols 				= null;
	SWFAnim.prototype.currentFrame 			= 0;
	SWFAnim.prototype.minFrame 				= 0;
	SWFAnim.prototype.maxFrame 				= 0;
	SWFAnim.prototype.loop 					= false;
	SWFAnim.prototype.reverse 				= false;
	SWFAnim.prototype.yoyo 					= false;
	SWFAnim.prototype.fps 					= 60;
	SWFAnim.prototype._timer 				= -1;
	SWFAnim.prototype._playing 				= false;
	SWFAnim.prototype._scripts 				= null;

	SWFAnim.prototype.getFrames 			= function()
	{
		return this._frames;
	};
	
	SWFAnim.prototype.addFrameScript 		= function(frameIndex, callback)
	{
		this._scripts[frameIndex] = callback;
	};
	
	SWFAnim.prototype.removeFrameScript 	= function(frameIndex)
	{
		this._scripts[frameIndex] = null;
	};
	
	SWFAnim.prototype._enterFrameHandler 	= function()
	{
		var currentFrame = null;
		var script = null;
		var i = 0;
		var max = 0;
		var obj = null;
		var child = null;
		var mat = null;
		
		if( this.currentFrame > this.maxFrame )
		{
			if( this.yoyo == true )
			{
				this.reverse = true;
				this.currentFrame = this.maxFrame - 1;
			}
			else if( this.loop == true )
			{
				this.currentFrame = this.minFrame;
			}
			else
			{
				this.currentFrame = this.maxFrame;
				this.stop();
				this._playing = false;
				return;
			}
		}
		
		if( this.currentFrame < this.minFrame )
		{
			if( this.yoyo == true )
			{
				this.reverse = false;
				this.currentFrame = this.minFrame + 1;
			}
			else if( this.loop == true )
			{
				this.currentFrame = this.maxFrame;
			}
			else
			{
				this.currentFrame = this.minFrame;
				this._playing = false;
				this.stop();
				return;
			}
		}
		
		this.removeChildren();
		
		currentFrame = this._frames[this.currentFrame];
		max = currentFrame.length;
		script = this._scripts[this.currentFrame];
		
		if( script != undefined && script != null)
		{
			script.apply(this);
		}
		
		for( i = 0; i < max; i++ )
		{
			
			obj 					= currentFrame[i];
			child 					= this._getSymbolByName(obj.symbol);
			child.pixelPerfect 		= this.pixelPerfect;
			child.pixelAlphaLimit 	= this.pixelAlphaLimit;
			child.width 			= obj.width;
			child.height 			= obj.height;
			child.name 				= obj.name;
			child.alpha 			= obj.alpha;
			
			if( child != null )
			{
				mat 		= new tomahawk_ns.Matrix2D();
				mat.a 		= obj.a;
				mat.b 		= obj.b;
				mat.c 		= obj.c;
				mat.d 		= obj.d;
				mat.tx 		= obj.tx;
				mat.ty 		= obj.ty;
				
				mat.decompose(child);
				this.addChild(child);
			}
		}
			
		if( this._playing == true )
		{
			clearTimeout(this._timeout);
			this._timeout = setTimeout( this.nextFrame.bind(this), 1000 / this.fps );
		}
	};
	
	SWFAnim.prototype.nextFrame 			= function()
	{
		this.currentFrame += ( this.reverse == true ) ? -1 : 1;
		this._enterFrameHandler();
	};
	
	SWFAnim.prototype._getLabelByName 		= function(labelName)
	{
		var i = this._labels.length;
		while( --i > -1 )
		{
			if( this._labels[i].name == labelName )
				return this._labels[i];
		}
		
		return null;
	};
	
	SWFAnim.prototype._getSymbolByName 		= function(name)
	{
		var i = this._symbols.length;
		while( --i > -1 )
		{
			if( this._symbols[i].texture.name == name )
			{
				return this._symbols[i];
			}
		}
		
		return null;
	};
	
	SWFAnim.prototype.setSymbols 			= function(symbols)
	{
		this._symbols = symbols;
	};
	
	SWFAnim.prototype.setFrames 			= function(data)
	{
		this._frames = data;
		this.maxFrame = this._frames.length - 1;
	};
	
	SWFAnim.prototype.setLabels 			= function(labels)
	{
		this._labels = labels;
	};
	
	SWFAnim.prototype.gotoAndStop 			= function(labelName)
	{
		var labelData = this._getLabelByName(labelName);
		
		if (labelData == null )
		{
			this.currentFrame = parseInt(labelName);
			this.minFrame = 0;
			this.maxFrame = this._frames.length - 1;
		}
		else
		{			
			this.minFrame = labelData.startFrame;
			this.maxFrame = labelData.endFrame;
		}
		
		this.stop();
		this._enterFrameHandler();
	};
	
	SWFAnim.prototype.play 					= function(labelName)
	{
		this.stop();
		labelName = ( labelName == undefined ) ? this.currentFrame : labelName;
		var labelData = this._getLabelByName(labelName);
		
		if (labelData == null )
		{
			this.currentFrame = parseInt(labelName);
			this.minFrame = 0;
			this.maxFrame = this._frames.length - 1;
		}
		else
		{			
			this.minFrame = labelData.startFrame;
			this.maxFrame = labelData.endFrame;
		}
		
		this._playing = true;
		this._enterFrameHandler();
	};
	
	SWFAnim.prototype.destroy 				= function()
	{
		this.stop();
		this.removeChildren();
		this.removeEventListeners();
		this._symbols = new Array();
		this._frames = new Array();
		tomahawk_ns.Sprite.prototype.destroy.apply(this);
	};

	SWFAnim.prototype.stop 					= function()
	{
		clearTimeout( this._timeout );
		this._playing = false;
	};

	tomahawk_ns.SWFAnim = SWFAnim;
})();



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
	 * @class Shape
	 * @memberOf tomahawk_ns
	 * @description This class is used to create lightweight shapes using the CanvasRenderingContext2D vectorial drawing API.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObject
	 **/
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

	/**
	* @method clear
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Cleans the current Shape.
	**/
	Shape.prototype.clear = function()
	{
		this._commands = new Array();
	};

	/**
	* @method stroke
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Strokes the subpaths with the current stroke style.
	**/
	Shape.prototype.stroke = function()
	{
		this._getCommands().push( [1,"stroke",null] ); 
	};

	/**
	* @method fill
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Fills the subpaths with the current fill style.
	**/
	Shape.prototype.fill = function()
	{
		this._getCommands().push( [1,"fill",null] ); 
	};

	/**
	* @method beginPath
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Starts a new path by resetting the list of sub-paths. Call this method when you want to create a new path.
	**/
	Shape.prototype.beginPath = function()
	{
		this._getCommands().push( [1,"beginPath",null] ); 
	};
	
	/**
	* @method closePath
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Tries to draw a straight line from the current point to the start. If the shape has already been closed or has only one point, this function does nothing.
	**/
	Shape.prototype.closePath = function()
	{
		this._getCommands().push( [1,"closePath",null] );
	};

	/**
	* @method rect
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Adds a new closed subpath to the path, representing the given rectangle.
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	**/
	Shape.prototype.rect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"rect",[x, y, width, height]] );
	};

	/**
	* @method fillRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Draws a filled rectangle at (x, y) position whose size is determined by width and height.
	**/
	Shape.prototype.fillRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"fillRect",[x, y, width, height]] );
	};
	
	/**
	* @method clearRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Sets all pixels in the rectangle defined by starting point (x, y) and size (width, height) to transparent black.
	**/
	Shape.prototype.clearRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"clearRect",[x, y, width, height]] );
	};
	
	/**
	* @method strokeRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Paints a rectangle which has a starting point at (x, y) and has a w width and an h height onto the canvas, using the current stroke style.
	**/
	Shape.prototype.strokeRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"strokeRect",[x, y, width, height]] );
	};

	/**
	* @method moveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @description Moves the starting point of a new subpath to the (x, y) coordinates.
	**/
	Shape.prototype.moveTo = function(x,y)
	{
		this._getCommands().push( [1,"moveTo",[x,y]] );
	};
	
	/**
	* @method lineTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @description Connects the last point in the subpath to the x, y coordinates with a straight line.
	**/
	Shape.prototype.lineTo = function(x,y)
	{
		this._getCommands().push( [1,"lineTo",[x,y]] );
	};
	
	/**
	* @method arc
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} radius
	* @param {Number} startAngle
	* @param {Number} endAngle
	* @param {Boolean} antiClockwise
	* @description Adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
	**/
	Shape.prototype.arc = function(x, y, radius, startAngle, endAngle, antiClockwise)
	{
		this._getCommands().push( [1,"arc",[x, y, radius, startAngle, endAngle, antiClockwise]] );
	};
	
	/**
	* @method arcTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX
	* @param {Number} controlY
	* @param {Number} endX
	* @param {Number} endY
	* @param {Number} radius
	* @description Adds an arc to the path with the given control points and radius, connected to the previous point by a straight line
	**/
	Shape.prototype.arcTo = function(controlX,controlY,endX,endY,radius)
	{
		this._getCommands().push( [1,"arcTo",[controlX,controlY,endX,endY,radius]] );
	};
	
	/**
	* @method quadraticCurveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX
	* @param {Number} controlY
	* @param {Number} endX
	* @param {Number} endY
	* @description Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.
	**/
	Shape.prototype.quadraticCurveTo = function(controlX, controlY, endX, endY)
	{
		this._getCommands().push( [1,"quadraticCurveTo",[controlX, controlY, endX, endY]] );
	};
	
	/**
	* @method bezierCurveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX1
	* @param {Number} controlY1
	* @param {Number} controlX2
	* @param {Number} controlY2
	* @param {Number} endX
	* @param {Number} endY
	* @description Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.
	**/
	Shape.prototype.bezierCurveTo = function(controlX1, controlY1, controlX2, controlY2, endX, endY)
	{
		this._getCommands().push( [1,"bezierCurveTo",[controlX1, controlY1, controlX2, controlY2, endX, endY]] );
	};
	
	/**
	* @method fillWithCurrentGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Sets the current gradient as the current fillStyle
	**/
	Shape.prototype.fillWithCurrentGradient = function()
	{
		this._getCommands().push( [1,"fillWithCurrentGradient",null] );
	};
	
	/**
	* @method addColorStop
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} offset
	* @param {String} color
	* @description Adds a color stop with the given color to the gradient at the given offset. 0.0 is the offset at one end of the gradient, 1.0 is the offset at the other end.
	**/
	Shape.prototype.addColorStop = function(offset, color)
	{
		this._getCommands().push( [1,"addColorStop",[offset, color]] );
	};
	
	/**
	* @method createLinearGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} endX
	* @param {Number} endY
	* @description Creates a gradient along the line given by the coordinates represented by the parameters.
	**/
	Shape.prototype.createLinearGradient = function(startX, startY, endX, endY)
	{
		this._getCommands().push( [1,"createLinearGradient",[startX, startY, endX, endY]] );
	};
	
	/**
	* @method createRadialGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} startRadius
	* @param {Number} endX
	* @param {Number} endY
	* @param {Number} endRadius
	* @description Creates a CanvasGradient object that represents a radial gradient that paints along the cone given by the circles represented by the arguments. If either of the radii are negative, throws an IndexSizeError exception.
	**/
	Shape.prototype.createRadialGradient = function(startX, startY, startRadius, endX, endY, endRadius)
	{
		this._getCommands().push( [1,"createRadialGradient",[startX, startY, startRadius, endX, endY, endRadius]] );
	};
	
	/**
	* @description Sets width of lines, default 1.0
	* @method lineWidth
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} value the new line width.
	**/
	Shape.prototype.lineWidth = function(value)
	{
		this._getCommands().push( [0,"lineWidth",value] );
	};
	
	/**
	* @description Sets line dash, default [5]
	* @method lineDash
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Array} value an Array of numbers.
	**/
	Shape.prototype.lineDash = function(value)
	{
		this._getCommands().push( [1,"setLineDash",[value]] );
	};
	
	/**
	* @description Defines the type of endings on the end of lines. Possible values: butt (default), round, square
	* @method lineCap
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {String} value 
	**/
	Shape.prototype.lineCap = function(value)
	{
		this._getCommands().push( [0,"lineCap",value] );
	};

	/**
	* @description Defines the type of corners where two lines meet. Possible values: round, bevel, miter (default)
	* @method strokeStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {String} value 
	**/
	Shape.prototype.lineJoin = function(value)
	{
		this._getCommands().push( [0,"lineJoin",value] );
	};
	
	/**
	* @description Defines the style used for stroking shapes. It can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	* @method strokeStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Object} value 
	**/
	Shape.prototype.strokeStyle = function(value)
	{
		this._getCommands().push( [0,"strokeStyle",value] );
	};
	
	/**
	* @description Defines the style used for filling shapes. It can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	* @method fillStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Object} value 
	**/
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
	 * @class Sprite
	 * @memberOf tomahawk_ns
	 * @description The Sprite class is a basic display list building block: a display list node that can contain children.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Sprite()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
	}
	
	Tomahawk.registerClass( Sprite, "Sprite" );
	Tomahawk.extend( "Sprite", "DisplayObjectContainer" );
	
	Sprite.prototype._behaviorDrag = null;
	
	/**
	* @method enableDragAndDrop
	* @memberOf tomahawk_ns.Sprite.prototype
	* @deprecated prefer to use DragAndDropBehavior class
	* @param {Boolean} value Indicates if the drag and drop feature is enabled or not. 
	* @description Enables or Disables the drag and drop feature.
	**/
	Sprite.prototype.enableDragAndDrop 				= function(value)
	{
		if( this._behaviorDrag != null )
			this._behaviorDrag.destroy();
			
		if( value == false )
			return;
			
		this._behaviorDrag = new tomahawk_ns.DragAndDropBehavior();
		this._behaviorDrag.enableDragAndDrop(this, value);
	};
	
	/**
	* @method startDrag
	* @memberOf tomahawk_ns.Sprite.prototype
	* @description Start the dragging operation.
	**/
	Sprite.prototype.startDrag 						= function()
	{
		if( this._behaviorDrag != null )
			this._behaviorDrag.startDrag();
	};
	
	/**
	* @method stopDrag
	* @memberOf tomahawk_ns.Sprite.prototype
	* @description Stop the dragging operation.
	**/
	Sprite.prototype.stopDrag 						= function()
	{
		if( this._behaviorDrag != null )
			this._behaviorDrag.stopDrag();
	};

	tomahawk_ns.Sprite = Sprite;
})();





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
	 * @class Stage
	 * @memberOf tomahawk_ns
	 * @description The Stage class represents the main drawing area, it is the top of the display list.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Stage()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		
		this._renderer = new tomahawk_ns.FrameRenderer();
		this._renderer.setCallback( this.enterFrame.smartBind(this) );
		
		this.setFPS(60);
		this.stage = this;
	}

	Tomahawk.registerClass( Stage, "Stage" );
	Tomahawk.extend( "Stage", "DisplayObjectContainer" );

	Stage._instances = new Object();
	
	/**
	* @method getInstance
	* @memberOf tomahawk_ns.Stage
	* @param {string} stageName 
	* @returns {tomahawk_ns.Stage} returns a Stage object that matches the "stageName" parameter. If none of the Stage instances corresponds to the "stageName" parameter, one is automatically created and returned. It is a (Multiton || Factory) implementation of the Stage class.
	**/
	Stage.getInstance = function(stageName)
	{
		stageName = stageName || "defaultStage";
		
		if( tomahawk_ns.Stage._instances[stageName] == undefined || tomahawk_ns.Stage._instances[stageName] == null)
			tomahawk_ns.Stage._instances[stageName] = new tomahawk_ns.Stage();
			
		return tomahawk_ns.Stage._instances[stageName];
	};
	
	/**
	* @method removeInstance
	* @memberOf tomahawk_ns.Stage
	* @param {string} stageName 
	* @returns {tomahawk_ns.Stage} removes the Stage object that matches the "stageName" parameter.
	**/
	Stage.removeInstance = function(stageName)
	{
		var stage = null;
		stageName = stageName || "defaultStage";
		stage = tomahawk_ns.Stage._instances[stageName];
		
		if( stage != undefined && stage != null )
		{
			stage.destroy();
			tomahawk_ns.Stage._instances[stageName] = null;
		}
	};

	/**
	* @member RESIZE_AUTO
	* @memberOf tomahawk_ns.Stage
	* @type {String}
	* @description The application will be resized by chosing the best ratio
	* @default "autoResize"
	**/
	Stage.RESIZE_AUTO = "autoResize";
	
	/**
	* @member RESIZE_BY_WIDTH
	* @memberOf tomahawk_ns.Stage
	* @type {String}
	* @description The application will be resized by chosing the width ratio
	* @default "resizeByWidth"
	**/
	Stage.RESIZE_BY_WIDTH = "resizeByWidth";
	
	/**
	* @member RESIZE_BY_HEIGHT
	* @memberOf tomahawk_ns.Stage
	* @type {String}
	* @description The application will be resized by chosing the height ratio
	* @default "resizeByHeight"
	**/
	Stage.RESIZE_BY_HEIGHT = "resizeByHeight";
	
	
	
	/**
	* @member mouseX
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description the x mouse coordinates on the stage.
	**/
	Stage.prototype.mouseX = 0;
	
	/**
	* @member mouseY
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description the y mouse coordinates on the stage.
	**/
	Stage.prototype.mouseY = 0;
	
	/**
	* @member background
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the stage has a background fill. If true, the stage has a background fill. If false, stage has no background fill. Use the backgroundColor property to set the background color of the stage instance.
	**/
	Stage.prototype.background = false;
	
	/**
	* @member backgroundColor
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {string}
	* @description The color of the stage background.
	* @default "#0080C0"
	**/
	Stage.prototype.backgroundColor = "#0080C0";
	
	/**
	* @member debug
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Boolean}
	* @description Draw the FPS or not
	* @default false
	**/
	Stage.prototype.debug = false;
	
	/**
	* @member appWidth
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description The original application width, used only when application is responsive
	* @default 800
	**/
	Stage.prototype.appWidth = 800;
	
	/**
	* @member appHeight
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description The original application height, used only when application is responsive
	* @default 600
	**/
	Stage.prototype.appHeight = 600;

	/**
	* @member resizeMode
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {String}
	* @description Defines how the application will be resized
	* @default "autoResize"
	**/
	Stage.prototype.resizeMode = "autoResize";
	
	Stage.prototype._lastTime 			= 0;
	Stage.prototype._frameCount 		= 0;
	Stage.prototype._fps 				= 0;
	
	Stage.prototype._timeout 			= 0;
	Stage.prototype._renderer 			= null;
	Stage.prototype._canvas 			= null;
	Stage.prototype._context 			= null;
	Stage.prototype._lastActiveChild 	= null;
	Stage.prototype._focused 			= false;
	Stage.prototype._focusedElement 	= null;
	Stage.prototype._cache 				= null;
	Stage.prototype._responsive 		= false;

	/**
	* @description  Associates the canvas element specified by the "canvas" parameter  to this stage and runs the rendering loop.
	* @method init
	* @memberOf tomahawk_ns.Stage.prototype
	* @param {HTMLCanvasElement} canvas the HTMLCanvasElement element associated to this stage object.
	**/
	Stage.prototype.init 			= function(canvas)
	{
		this.setCanvas(canvas);
		
		this.addEventListener(tomahawk_ns.Event.ADDED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.FOCUSED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.UNFOCUSED, this, this._eventHandler,true);
		
		window.removeEventListener("resize",this._resizeHandler.smartBind(this));
		window.addEventListener("resize",this._resizeHandler.smartBind(this));
	};
	
	Stage.prototype.setCanvas		= function(canvas)
	{
		var callback = this._mouseHandler.smartBind(this);
		
		if( this._canvas != null )
		{
			this._canvas.removeEventListener("click",callback);
			this._canvas.removeEventListener("touchstart",callback);
			this._canvas.removeEventListener("touchmove",callback);
			this._canvas.removeEventListener("touchend",callback);
			this._canvas.removeEventListener("mousemove",callback);
			this._canvas.removeEventListener("mousedown",callback);
			this._canvas.removeEventListener("mouseup",callback);
			this._canvas.removeEventListener("dblclick",callback);
		}
		
		
		this._canvas = canvas;
		this._context = this._getContext();
		this._canvas.addEventListener("click",callback);
		this._canvas.addEventListener("touchstart",callback);
		this._canvas.addEventListener("touchmove",callback);
		this._canvas.addEventListener("touchend",callback);
		this._canvas.addEventListener("mousemove",callback);
		this._canvas.addEventListener("mousedown",callback);
		this._canvas.addEventListener("mouseup",callback);
		this._canvas.addEventListener("dblclick",callback);
		
		
		this.resume();
	};
	
	/**
	* @description  Stops the rendering loop
	* @method stop
	* @memberOf tomahawk_ns.Stage.prototype
	**/
	Stage.prototype.stop			= function()
	{
		this._renderer.stop();
	};
	
	/**
	* @description  Resumes the rendering loop
	* @method resume
	* @memberOf tomahawk_ns.Stage.prototype
	**/
	Stage.prototype.resume			= function()
	{
		this._renderer.resume();
	};
	
	/**
	* @description Returns a point object which determines the movement on x and y axises since the last frame ( in local stage coordinates system ).
	* @method getMovement
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {tomahawk_ns.Point} a Point object
	**/
	Stage.prototype.getMovement 	= function()
	{
		var pt = new Object();
		pt.x = this.mouseX - this._lastMouseX;
		pt.y = this.mouseY - this._lastMouseY;
		
		return pt;
	};

	/**
	* @description The main rendering loop, automatically called at each frame.
	* @method enterFrame
	* @memberOf tomahawk_ns.Stage.prototype
	**/
	Stage.prototype.enterFrame 		= function()
	{
		var curTime = new Date().getTime();
		var scope = this;
		var context = this._context;
		var canvas = this._canvas;
		var mat = this.matrix;
		
		this.width = this._canvas.width;
		this.height = this._canvas.height;
		
		this._frameCount++;
		
		if( curTime - this._lastTime > 1000 )
		{
			this._fps = this._frameCount;
			this._frameCount = 0;
			this._lastTime = curTime;
		}
		
		if( this.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.backgroundColor;
			context.fillRect( 0, 0, canvas.width, canvas.height );
			context.fill();
			context.restore();
		}
		else
		{
			canvas.width = canvas.width;
		}
		
		this.updateMatrix();
		mat = this.matrix;
		
		context.save();
		context.globalAlpha *= this.alpha;
		context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			
		if( this.shadow == true )
		{
			context.shadowColor 	= this.shadowColor;
			context.shadowBlur 		= this.shadowBlur;
			context.shadowOffsetX 	= this.shadowOffsetX;
			context.shadowOffsetY 	= this.shadowOffsetY;
		}
		
		if( this.globalCompositeOperation != null )
		{
			context.globalCompositeOperation = this.globalCompositeOperation;
		}
		
		if( this.cacheAsBitmap == true || this.mask != null || this.filters != null )
		{
			this.drawComposite(context);
		}
		else
		{
			this.draw(context);
		}
		
		context.restore();
		
		if( this.debug == true )
		{
			this.drawFPS();
		}
		
		this.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
	};

	/**
	* @description Sets the current fps but only if the browser doesn't have a valid implementation of window.requestAnimationFrame or equivalent. If there's one, it will be used instead even if you specify another fps value.
	* @method setFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @param {Number} value the new current fps
	**/
	Stage.prototype.setFPS 			= function(value)
	{
		value 				= ( value > 60 ) ? 60 : value;
		this._fps 			= value;
		this._renderer.fps 	= value;
	};

	/**
	* @method drawFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Draws the current fps on the top left corner of the stage.
	**/
	Stage.prototype.drawFPS 		= function()
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

	/**
	* @method getCanvas
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {HTMLCanvasElement} An HTMLCanvasElement DOM object
	* @description Returns the HTMLCanvasElement associated to this stage.
	**/
	Stage.prototype.getCanvas 		= function()
	{
		return this._canvas;
	};
	
	/**
	* @method getContext
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {CanvasRenderingContext2D} A CanvasRenderingContext2D object
	* @description Returns the CanvasRenderingContext2D associated to this stage's canvas.
	**/
	Stage.prototype.getContext 		= function()
	{
		return this._context;
	};

	/**
	* @member getFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Returns the current fps.
	* @returns {Number} the current fps
	**/
	Stage.prototype.getFPS 			= function()
	{
		return this._fps;
	};

	/**
	* @member setResponsive
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Defines if the application is responsive or not according to the 
	* original dimensions defined by appWidth and appHeight properties
	* @param {Boolean} value the value of the responsiveness
	**/
	Stage.prototype.setResponsive 	= function(value)
	{
		this._responsive = (value == true);
		this._resizeHandler(null);
	};
	
	/**
	* @member resize
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Resizes the application according according to the 
	* original dimensions defined by appWidth, appHeight and resizeMode properties and
	* the newWidth, newHeight parameters.
	* @param {Number} newWidth the value of the newWidth
	* @param {Number} newHeight the value of the newHeight
	**/
	Stage.prototype.resize			= function(newWidth, newHeight)
	{
		var stage = this;
		var canvas = stage.getCanvas();
		var screenWidth = newWidth;
		var screenHeight = newHeight;
		var ratioX = 1;
		var ratioY = 1;
		var ratio = 1;
		var app_width = stage.appWidth;
		var app_height = stage.appHeight;
		
		screenWidth = ( screenWidth > app_width ) ? app_width : screenWidth;
		screenHeight = ( screenHeight > app_height ) ? app_height: screenHeight;

		ratioX = screenWidth / app_width;
		ratioY = screenHeight / app_height;
		
		if( this.resizeMode == tomahawk_ns.Stage.RESIZE_BY_WIDTH )
		{
			ratio = ratioX;
		}
		else if( this.resizeMode == tomahawk_ns.Stage.RESIZE_BY_HEIGHT )
		{
			ratio = ratioY;
		}
		else
		{
			ratio = ( ratioX < ratioY ) ? ratioX : ratioY;
		}
		
		ratio = (ratio > 1) ? 1 : ratio;
		
		stage.scaleX = stage.scaleY = ratio;
		
		canvas.width = parseInt(app_width * ratio);
		canvas.height = parseInt(app_height * ratio);
	};
	
	Stage.prototype.destroy			= function()
	{
		tomahawk_ns.DisplayObjectContainer.prototype.destroy.apply(this);
		
		var callback = this._mouseHandler.smartBind(this);
		
		if( this._canvas != null )
		{
			this._canvas.removeEventListener("click",callback);
			this._canvas.removeEventListener("touchstart",callback);
			this._canvas.removeEventListener("touchmove",callback);
			this._canvas.removeEventListener("touchend",callback);
			this._canvas.removeEventListener("mousemove",callback);
			this._canvas.removeEventListener("mousedown",callback);
			this._canvas.removeEventListener("mouseup",callback);
			this._canvas.removeEventListener("dblclick",callback);
			window.removeEventListener("resize",this._resizeHandler.smartBind(this));
		}
		
		this._canvas = null;
		this._context = null;
		this.stop();
		this._renderer.destroy();
		this.removeEventListeners();
		
		this._mouseHandler.removeSmartBind(this);
	};

	
	Stage.prototype._resizeHandler 	= function(event)
	{
		if( this._responsive == false )
			return;
			
		this.resize(	
						tomahawk_ns.Screen.getInnerWidth(this), 
						tomahawk_ns.Screen.getInnerHeight(this)
					);
	};
	
	Stage.prototype._getContext  	= function()
	{
		return this._canvas.getContext("2d");
	};

	Stage.prototype._mouseHandler 	= function(event)
	{
		var bounds = this._canvas.getBoundingClientRect();
		var x = 0;
		var y = 0;
		var touch = null;
		
		if( event.type == "touchstart" || 
			event.type == "touchmove" || 
			event.type == "touchend" 
		)
		{
			touch = event.touches[0];
			
			if( event.type == "touchmove" )
			{
				event.preventDefault();
				//event.stopImmediatePropagation();
				//event.stopPropagation();
			}
			
			
			if( event.type != "touchend" )
			{			
				x = parseInt(touch.clientX) - bounds.left;
				y = parseInt(touch.clientY) - bounds.top;
			}
			else
			{
				x = this.mouseX;
				y = this.mouseY;
			}
			
		}
		else
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			x = event.clientX - bounds.left;
			y = event.clientY - bounds.top;
		}
		var activeChild = this.getObjectUnder(x,y);
		var mouseEvent = null;
		var i = 0;
		this._lastMouseX = this.mouseX >> 0;
		this._lastMouseY = this.mouseY >> 0;
		this.mouseX = x >> 0;
		this.mouseY = y >> 0;
		
		if( activeChild == null )
			activeChild = this;
		
			
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

	Stage.prototype._eventHandler 	= function(event)
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
				
				
				if( event.target.isContainer == true )
				{
					list = event.target.getNestedChildren();
				}
				else
				{
					list = new Array();
				}
				
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


	tomahawk_ns.Stage = Stage;

})();






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
	 * @class BlendColorFilter
	 * @description a basic BlendColorFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function BlendColorFilter(srcColor, destColor, intensity,deltaRed, deltaGreen, deltaBlue, deltaAlpha)
	{
		this.intensity = intensity || this.intensity;
		this.deltaGreen = deltaGreen || this.deltaGreen;
		this.deltaRed = deltaRed || this.deltaRed;
		this.deltaBlue = deltaBlue || this.deltaBlue;
		this.deltaAlpha = deltaAlpha || this.deltaAlpha;
		this.srcColor = srcColor || this.srcColor;
		this.destColor = destColor || this.destColor;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( BlendColorFilter, "BlendColorFilter" );
	Tomahawk.extend( "BlendColorFilter", "PixelFilter" );

	/**
	* @member {Number} intensity value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.intensity = 0;
	/**
	* @member {Number} ARGB srcColor value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.srcColor = 0xFFFFFF;
	/**
	* @member {Number} ARGB destColor value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.destColor = 0xFFFFFF;
	/**
	* @member {Number} deltaRed value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaRed = 0;
	/**
	* @member {Number} deltaGreen value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaGreen = 0;
	/**
	* @member {Number} deltaBlue value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaBlue = 0;
	/**
	* @member {Number} deltaAlpha value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaAlpha = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	BlendColorFilter.prototype.process = function()
	{
		
		if( this.intensity == 0 )
			return;
		
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var a1 = (this.srcColor >> 24) & 0xFF;
		var r1 = (this.srcColor >> 16) & 0xFF;
		var g1 = (this.srcColor >> 8) & 0xFF;
		var b1 = this.srcColor & 0xFF;
		var a2 = (this.destColor >> 24) & 0xFF;
		var r2 = (this.destColor >> 16) & 0xFF;
		var g2 = (this.destColor >> 8) & 0xFF;
		var b2 = this.destColor & 0xFF;
		var distRed = 0;
		var distGreen = 0;
		var distBlue = 0;
		var distAlpha = 0;
		
		var i = 0, a = 0, r = 0, g = 0, b = 0, max = data.length;
		
		for ( i=0; i < max; i+=4) 
		{
			r = data[i];
			g = data[i+1];
			b = data[i+2];
			a = data[i+3];
			
			distRed = r1 - r;
			distRed = ( distRed < 0 ) ? -distRed : distRed;
			
			distGreen = g1 - g;
			distGreen = ( distGreen < 0 ) ? -distGreen : distGreen;
			
			distBlue = b1 - b;
			distBlue = ( distBlue < 0 ) ? -distBlue : distBlue;
			
			distAlpha = a1 - a;
			distAlpha = ( distAlpha < 0 ) ? -distAlpha : distAlpha;
			
			if( distRed > this.deltaRed ||
				distGreen > this.deltaGreen ||
				distAlpha > this.deltaAlpha ||
				distBlue > this.deltaBlue 
			)
			{
				continue;
			}
			
			data[i+0] = ((r2 * this.intensity) + r) / (this.intensity+1);
			data[i+1] = ((g2 * this.intensity) + g) / (this.intensity+1);
			data[i+2] = ((b2 * this.intensity) + b) / (this.intensity+1);
			data[i+3] = ((a2 * this.intensity) + a) / (this.intensity+1);
		}
		
		this.setPixels(pixels,0,0);
	};

	tomahawk_ns.BlendColorFilter = BlendColorFilter;

})();



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
* @deprecated
*/


(function() {
	
	/**
	 * @class BlurFilter
	 * @description a basic BlurFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.ConvolutionFilter
	 * @param {Number} quality the blur quality.
	 * @constructor
	 **/
	function BlurFilter()
	{
		var convolutionMatrix = [	
									1/9,1/9,1/9,
									1/9,1/9,1/9,
									1/9,1/9,1/9
								];
		tomahawk_ns.ConvolutionFilter.apply(this, [convolutionMatrix]);
	}
	
	Tomahawk.registerClass( BlurFilter, "BlurFilter" );
	Tomahawk.extend( "BlurFilter", "ConvolutionFilter" );
	
	tomahawk_ns.BlurFilter = BlurFilter;

})();



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
	 * @class BrightnessFilter
	 * @description a basic BrightnessFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function BrightnessFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( BrightnessFilter, "BrightnessFilter" );
	Tomahawk.extend( "BrightnessFilter", "PixelFilter" );
	
	/**
	* @member {Number} value brightness intensity.
	* @memberOf tomahawk_ns.BrightnessFilter.prototype
	**/
	BrightnessFilter.prototype.value = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.BrightnessFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	BrightnessFilter.prototype.process = function()
	{
		if( this.value == 0 )
			return;
			
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var value = parseInt(this.value);
		
		for (var i=0; i<data.length; i+=4) 
		{
			data[i]	  = data[i] + value;
			data[i+1] = data[i+1] + value;
			data[i+2] = data[i+2] + value;
		}
		
		this.setPixels(pixels,0,0);
	};
	
	tomahawk_ns.BrightnessFilter = BrightnessFilter;

})();



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
	 * @class ColorFilter
	 * @description a basic ColorFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function ColorFilter(color, intensity)
	{
		this.intensity = intensity || 0;
		this.color = color || this.color;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ColorFilter, "ColorFilter" );
	Tomahawk.extend( "ColorFilter", "PixelFilter" );

	/**
	* @member {Number} coloration intensity.
	* @memberOf tomahawk_ns.ColorFilter.prototype
	**/
	ColorFilter.prototype.intensity = 0;
	
	/**
	* @member {Number} color value.
	* @memberOf tomahawk_ns.ColorFilter.prototype
	**/
	ColorFilter.prototype.color = "#004080";
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ColorFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ColorFilter.prototype.process = function()
	{
		
		if( this.intensity == 0 )
			return;
		
		var context = this._context;
		var canvas = this._canvas;
		
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		
		buffer.width =  canvas.width;
		buffer.height =  canvas.height;
		
		bufferContext.save();
		bufferContext.drawImage(canvas, 0, 0);
		bufferContext.globalCompositeOperation = "source-in";
		bufferContext.beginPath();
		bufferContext.fillStyle = this.color;
		bufferContext.globalAlpha = this.intensity;
		bufferContext.fillRect(0,0,buffer.width, buffer.height);
		bufferContext.fill();
		bufferContext.restore();
		
		
		context.save();
		context.drawImage(buffer, 0, 0, buffer.width, buffer.height);
		context.restore();
	};

	tomahawk_ns.ColorFilter = ColorFilter;

})();



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
	 * @class ContrastFilter
	 * @description a basic ContrastFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function ContrastFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ContrastFilter, "ContrastFilter" );
	Tomahawk.extend( "ContrastFilter", "PixelFilter" );
	
	/**
	* @member {Number} value contrast intensity.
	* @memberOf tomahawk_ns.ContrastFilter.prototype
	**/
	ContrastFilter.prototype.value = 0;

	/**
	* @method process
	* @memberOf tomahawk_ns.ContrastFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ContrastFilter.prototype.process = function()
	{
		if( this.value == 0 )
			return;
			
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var r = 0, g = 0, b = 0, a = 0;
		var value = parseFloat(this.value);

		for (var i=0; i<data.length; i+=4) 
		{
			r = data[i+0]; r/=255; r -= 0.5; r *= value; r += 0.5; r *= 255;
			g = data[i+1]; g/=255; g -= 0.5; g *= value; g += 0.5; g *= 255;
			b = data[i+2]; b/=255; b -= 0.5; b *= value; b += 0.5; b *= 255;
			
			r = parseInt(r); r = ( r > 255 ) ? 255 : r; r = ( r < 0 ) ? 0 : r;
			g = parseInt(g); g = ( g > 255 ) ? 255 : g; g = ( g < 0 ) ? 0 : g;
			b = parseInt(b); b = ( b > 255 ) ? 255 : b; b = ( b < 0 ) ? 0 : b;
			
			data[i] = r;
			data[i+1] = g;
			data[i+2] = b;
		}
		
		this.setPixels(pixels,0,0);
	};
	
	
	tomahawk_ns.ContrastFilter = ContrastFilter;

})();



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
* @deprecated
*/


(function() {
	
	/**
	 * @class ConvolutionFilter
	 * @description a basic ConvolutionFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @param {Array} matrix the convolution matrix.
	 * @constructor
	 **/
	function ConvolutionFilter(matrix)
	{
		this.matrix = matrix || this.matrix;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ConvolutionFilter, "ConvolutionFilter" );
	Tomahawk.extend( "ConvolutionFilter", "PixelFilter" );
	
	/**
	* @member {Array} the convolution matrix
	* @memberOf tomahawk_ns.ConvolutionFilter.prototype
	**/
	ConvolutionFilter.prototype.matrix 	= [1];
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ConvolutionFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ConvolutionFilter.prototype.process = function()
	{
		var pixels = this.getPixels(0,0,this._object.width, this._object.height);
		var weights = this.matrix;
		var opaque = false;
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side/2);
		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;
		// pad output by the convolution matrix
		var w = sw;
		var h = sh;
		var r=0, g=0, b=0, a=0, sy = 0, sx = 0, x = 0, y = 0, cy = 0, cx = 0, dstOff = 0, scx = 0, scy = 0, srcOff = 0, wt = 0;
		var output = pixels;
		//var output = this._context.createImageData(this._object.width, this._object.height);
		var dst = output.data;
		// go through the destination image pixels
		var alphaFac = opaque ? 1 : 0;
		
		for (y=0; y<h; y++) 
		{
			for ( x=0; x<w; x++) 
			{
				sy = y;
				sx = x;
				dstOff = (y*w+x)*4;
				// calculate the weighed sum of the source image pixels that
				// fall under the convolution matrix
				r = 0; g = 0; b = 0; a = 0;
				
				for (cy=0; cy<side; cy++) 
				{
					for (cx=0; cx<side; cx++) 
					{
						scy = sy + cy - halfSide;
						scx = sx + cx - halfSide;
						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) 
						{
							srcOff = (scy*sw+scx)*4;
							wt = weights[cy*side+cx];
							r += src[srcOff] * wt;
							g += src[srcOff+1] * wt;
							b += src[srcOff+2] * wt;
							a += src[srcOff+3] * wt;
						}
					}
				}
				dst[dstOff] = r;
				dst[dstOff+1] = g;
				dst[dstOff+2] = b;
				dst[dstOff+3] = a + alphaFac*(255-a);
			}
		}
		
		this.setPixels(output,0,0);
	};
	
	ConvolutionFilter.prototype.getOffsetBounds = function(canvas, context, object)
	{ 
		this._offsetBounds = this._offsetBounds || new tomahawk_ns.Rectangle();
		return this._offsetBounds;
	};

	tomahawk_ns.ConvolutionFilter = ConvolutionFilter;

})();



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
	 * @class GrayScaleFilter
	 * @description a basic GrayScaleFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function GrayScaleFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( GrayScaleFilter, "GrayScaleFilter" );
	Tomahawk.extend( "GrayScaleFilter", "PixelFilter" );

	/**
	* @method process
	* @memberOf tomahawk_ns.GrayScaleFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
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
	 * @class PixelFilter
	 * @description the base class for all filters
	 * @memberOf tomahawk_ns
	 * @constructor
	 **/
	function PixelFilter()
	{
		tomahawk_ns.PixelFilter._buffer = tomahawk_ns.PixelFilter._buffer || document.createElement("canvas");
	}
	
	Tomahawk.registerClass( PixelFilter, "PixelFilter" );
	
	PixelFilter.prototype._canvas = null;
	PixelFilter.prototype._context = null;
	PixelFilter.prototype._object = null;
	PixelFilter.prototype._offsetBounds = null;
	
	PixelFilter._buffer = null;
	/**
	* @method getPixels
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description return the pixels of the linked DisplayObject into the region defined by (x,y,width,height)
	* @param {Number} x the x coordinates of top left corner of the region.
	* @param {Number} y the y coordinates of top left corner of the region.
	* @param {Number} width the width of the region.
	* @param {Number} height the height of the region.
	* @returns {ImageData}
	**/
	PixelFilter.prototype.getPixels = function(x,y,width,height)
	{
		return this._context.getImageData(x,y,width,height);
	};

	/**
	* @method setPixels
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description set the pixels of the linked DisplayObject from the point defined by (x,y)
	* @param {ImageData} pixels an ImageData object
	* @param {Number} x the x coordinates of top left corner from which the pixels will be set.
	* @param {Number} y the y coordinates of top left corner from which the pixels will be set.
	**/
	PixelFilter.prototype.setPixels = function(pixels,x,y)
	{
		this._context.putImageData(pixels,x,y);
	};

	/**
	* @method process
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	PixelFilter.prototype.process = function()
	{
		//code de notre filtre ici
	};

	/**
	* @method apply
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description apply the filter on the canvas passed in param
	* @param {HTMLCanvasElement} canvas the canvas used by the current filter.
	* @param {CanvasRenderingContext2D} context the context used by the current filter.
	* @param {tomahawk_ns.DisplayObject} object the DisplayObject on which the filter will be applied to
	**/
	PixelFilter.prototype.applyFilter = function(canvas, context, object)
	{
		this._canvas = canvas;
		this._object = object;
		this._context = context;
		this.process();
	};

	/**
	* @method getOffsetBounds
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description returns a rectangle that represents the extra pixels generated by the filter
	* @param {HTMLCanvasElement} canvas the canvas used by the current filter.
	* @param {CanvasRenderingContext2D} context the context used by the current filter.
	* @param {tomahawk_ns.DisplayObject} object the DisplayObject on which the filter will be applied to
	* @returns {Number}
	**/
	PixelFilter.prototype.getOffsetBounds = function(canvas, context, object)
	{ 
		return this._offsetBounds;
	};
	
	tomahawk_ns.PixelFilter = PixelFilter;

})();



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
	 * @class PixelateFilter
	 * @description a basic PixelateFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function PixelateFilter(value)
	{
		this.value = value || 0;
		this._offsetBounds = new tomahawk_ns.Rectangle();
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( PixelateFilter, "PixelateFilter" );
	Tomahawk.extend( "PixelateFilter", "PixelFilter" );

	/**
	* @member {Number} value pixelisation intensity.
	* @memberOf tomahawk_ns.PixelateFilter.prototype
	**/
	PixelateFilter.prototype.value = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.PixelateFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	PixelateFilter.prototype.process = function()
	{
		if( this.value <= 0 )
			return;
		
		var context = this._context;
		var canvas = this._canvas;
		
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		
		buffer.width =  canvas.width;
		buffer.height =  canvas.height;
		
		bufferContext.save();
		bufferContext.scale( 1/this.value, 1/this.value);
		bufferContext.drawImage(canvas, 0, 0);
		bufferContext.restore();
		
		
		context.clearRect(0,0,canvas.width,canvas.height);
		context.save();
		context.scale(this.value, this.value);
		context.drawImage(buffer, 0, 0, buffer.width, buffer.height);
		context.restore();
	};

	tomahawk_ns.PixelateFilter = PixelateFilter;

})();



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
* @deprecated
*/


(function() {
	
	/**
	 * @class RemanenceFilter
	 * @description a basic RemanenceFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @param {Number} time the time of the effect
	 * @constructor
	 **/
	function RemanenceFilter(time,power)
	{
		this.time = time || 1000;
		this.power = power || 0.5;
		this._cache = document.createElement("canvas");
		this._cache.width = this._cache.height = 1;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( RemanenceFilter, "RemanenceFilter" );
	Tomahawk.extend( "RemanenceFilter", "PixelFilter" );
	

	RemanenceFilter.prototype._cache = null;
	
	/**
	* @member {Number} time in ms at which you want to have remanence displayed.
	* @memberOf tomahawk_ns.RemanenceFilter.prototype
	**/
	RemanenceFilter.prototype.time = 1000;
	
	/**
	* @member {Number} power the remanence power.
	* @memberOf tomahawk_ns.RemanenceFilter.prototype
	**/
	RemanenceFilter.prototype.power = 0.5;
	
	RemanenceFilter.prototype._lastTime = 0;
	RemanenceFilter.prototype._maxWidth = 0;
	RemanenceFilter.prototype._maxHeight = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.RemanenceFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	RemanenceFilter.prototype.process = function()
	{
		var canvas = this._canvas;
		var context = this._context;
		var currentTime = new Date().getTime();
		var width = ( canvas.width > this._cache.width ) ? canvas.width : this._cache.width;
		var height = ( canvas.height > this._cache.height ) ? canvas.height : this._cache.height;
		
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		
		// ugly hack, save memory on chrome
		width = Math.ceil(width / 100) * 100;
		height =  Math.ceil(height / 100) * 100;
		
		buffer.width = width;
		buffer.height = height;
		
		bufferContext.save();
		bufferContext.globalAlpha = this.power;
		bufferContext.drawImage( this._cache, 0, 0 );
		bufferContext.restore();
		
		bufferContext.save();
		bufferContext.drawImage(canvas, 0, 0 );
		bufferContext.restore();
		
		context.save();
		context.globalCompositeOperation = "destination-over";
		context.globalAlpha = this.power;
		context.drawImage(this._cache,0,0);
		context.restore();
		
		
		canvas.width = buffer.width;
		canvas.height = buffer.height;
		
		context.save();
		context.drawImage( buffer, 0, 0 );
		context.restore();
		
		if( currentTime - this._lastTime < this.time )
		{
			return;
		}
		
		this._lastTime = currentTime;
		
		context = this._cache.getContext("2d");
		
		this._cache.width = buffer.width;
		this._cache.height = buffer.height;
			
		context.save();
		context.drawImage(canvas,0,0);
		context.restore();
	};

	tomahawk_ns.RemanenceFilter = RemanenceFilter;

})();



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
* @deprecated
*/


(function() {
	
	/**
	 * @class ShadowBlurFilter
	 * @description a basic ShadowBlurFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @param {Number} x the x coordinates of top left corner of the region.
	 * @param {Number} y the y coordinates of top left corner of the region.
	 * @param {String} color the css color of the shadow.
	 * @param {Number} quality the blur quality.
	 * @constructor
	 **/
	function ShadowBlurFilter(x,y,color, quality)
	{
		this.shadowOffsetX = x || this.shadowOffsetX;
		this.shadowOffsetY = y || this.shadowOffsetY;
		this.shadowColor = color || this.shadowColor;
		this.shadowBlur = quality || this.shadowBlur;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ShadowBlurFilter, "ShadowBlurFilter" );
	Tomahawk.extend( "ShadowBlurFilter", "PixelFilter" );
	
	/**
	* @member {Number} shadowOffsetX shadow offset on the x axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetX = 0;
	/**
	* @member {Number} shadowOffsetY shadow offset on the y axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetY = 0;
	/**
	* @member {Number} shadowBlur intensity of the shadow blur.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowBlur 	= 2;
	/**
	* @member {Number} shadowColor the color of the shadow.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowColor 	= "black";
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ShadowBlurFilter.prototype.process = function()
	{
		var context = this._context;
		var canvas = this._canvas;
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		var bounds = this._offsetBounds;
		
		buffer.width = canvas.width + bounds.width;
		buffer.height = canvas.height + bounds.height;
		
		
		bufferContext.save();
		bufferContext.shadowBlur = this.shadowBlur;
		bufferContext.shadowColor = this.shadowColor;
		bufferContext.shadowOffsetX = this.shadowOffsetX;
		bufferContext.shadowOffsetY = this.shadowOffsetY;
		bufferContext.drawImage( canvas, bounds.x, bounds.y );
		bufferContext.restore();
		
		context.clearRect(0,0,canvas.width,canvas.height);
		
		context.save();
		context.drawImage( buffer, 0, 0 );
		context.restore();
	};
	
	ShadowBlurFilter.prototype.getOffsetBounds = function(canvas, context, object)
	{ 
		var width = Math.abs( this.shadowOffsetX ) + (this.shadowBlur * 2);
		var height = Math.abs( this.shadowOffsetY ) + (this.shadowBlur * 2);
		
		this._offsetBounds = this._offsetBounds || new tomahawk_ns.Rectangle();
		this._offsetBounds.x = width >> 1;
		this._offsetBounds.y = height >> 1;
		this._offsetBounds.width = Math.abs( this.shadowOffsetX ) + width;
		this._offsetBounds.height = Math.abs( this.shadowOffsetY ) + height;
		
		return this._offsetBounds;
	};

	tomahawk_ns.ShadowBlurFilter = ShadowBlurFilter;

})();



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
	 * @class Font
	 * @memberOf tomahawk_ns
	 * @description The Font class is currently useful only to find out information about fonts; you cannot alter a font by using this class. You cannot use the Font class to load external fonts.
	 * @constructor
	 **/
	function Font(fontName)
	{
		this.name = fontName;
		this.sizes = new Object();
	}
		
	/**
	* @member name
	* @memberOf tomahawk_ns.Font.prototype
	* @type {string}
	* @description the font name
	**/
	Font.prototype.name = null;
	
	/**
	* @member bold
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Boolean}
	* @description defines if the font is bold or not.
	**/
	Font.prototype.bold = false;
	
	/**
	* @member italic
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Boolean}
	* @description defines if the font is in italic or not.
	**/
	Font.prototype.italic = false;
	
	/**
	* @protected
	* @member baseSize
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description the base size of the font, used internally to measure text.
	**/
	Font.prototype.baseSize = 60;
	
	/**
	* @protected
	* @member sizes
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Object}
	* @description An object that stores all the sizes of each character in the corresponding font.
	**/
	Font.prototype.sizes = null;
		
	/**
	* @member maxWidth
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description max char width for this font
	**/
	Font.prototype.maxWidth = 0;
	
	/**
	* @member maxHeight
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description max char height for this font
	**/
	Font.prototype.maxHeight = 0;
	
	
	/**
	* @method addFont
	* @description create and register a new Font object, you have to specify a 'valid' font name, Arial for example.
	* @memberOf tomahawk_ns.Font
	* @param {string} fontName the font name.
	**/
	Font.addFont = function(fontName, fontURL)
	{
		var font = new tomahawk_ns.Font(fontName);
		tomahawk_ns.Font._fonts[fontName] = font;
	};	
	
	/**
	* @method getFont
	* @description get an instance of Font according to the fontName passed in param, you have to specify a 'valid' font name, Arial for example. If there's no instance of {tomahawk_ns.Font} who matches the fontName, a regular one is automatically created.
	* @memberOf tomahawk_ns.Font
	* @param {string} fontName the font name
	* @returns {tomahawk_ns.Font}
	**/
	Font.getFont = function(fontName)
	{
		if( !tomahawk_ns.Font._fonts[fontName])
		{
			tomahawk_ns.Font.addFont(fontName);
		}
		
		return tomahawk_ns.Font._fonts[fontName];
	};
	
	/**
	* @method measureText
	* @description calculate the width and the height of the text passed in param, for the font size passed in param.
	* @memberOf tomahawk_ns.Font.prototype
	* @param {string} text the text you want to measure
	* @param {Numbr} size the fontSize of the text
	* @returns {Object} an object with 'width' and 'height' properties
	**/
	Font.prototype.measureText = function(text, size)
	{
		var div = Font._div;
		var width = 0
		var height = 0;
		var obj = new Object();
		var result = new Object();
		var ratio = size / this.baseSize;
		
		if( this.sizes[text] == undefined )
		{	
			div.style.position = 'absolute';
			div.style.padding = '0';
			div.style.top = '100px';
			div.style.left = '-1000px';
			div.style.width = 'auto';
			div.style.fontFamily = this.name;
			div.style.fontWeight = ( this.bold == true ) ? 'bold' : 'normal';
			div.style.fontStyle = ( this.italic == true ) ? 'italic' : 'normal';
			div.style.fontSize = this.baseSize + 'px';
			
			if( !div.parentNode )
				document.body.appendChild(div);
		
			div.innerHTML = ( text == "\n" ) ? "<br />" : text;
			
			width = div.offsetWidth;
			height = div.offsetHeight;
			
			this.maxWidth = ( width > this.maxWidth ) ? width : this.maxWidth;
			this.maxHeight = ( height > this.maxHeight ) ? height : this.maxHeight;
			
			document.body.removeChild(div);
		
			obj.width = width;
			obj.height = height;
			
			this.sizes[text] = obj;
		}
			
		result.width = this.sizes[text].width * ratio;
		result.height = this.sizes[text].height * ratio;
		
		return result;
	};

	Font._div = document.createElement("div");
	Font._style = document.createElement("style");
	Font._fonts = new Object();
	
	tomahawk_ns.Font = Font;
})();



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
	 * @class InputTextField
	 * @memberOf tomahawk_ns
	 * @description The InputTextField class is used to create display objects for text display,selection and input.
	 * @constructor
	 * @augments tomahawk_ns.SelectableTextField
	 **/
	function InputTextField()
	{
		tomahawk_ns.SelectableTextField.apply(this);
		tomahawk_ns.Keyboard.getInstance().addEventListener( 	tomahawk_ns.KeyboardEvent.KEY_UP, 
																this, 
																this._keyHandler );
	}

	Tomahawk.registerClass(InputTextField,"InputTextField");
	Tomahawk.extend("InputTextField","SelectableTextField");

	InputTextField.prototype.setFocus = function(value)
	{
		tomahawk_ns.SelectableTextField.prototype.setFocus.apply(this,[value]);
	};
	
	InputTextField.prototype._keyHandler = function(event)
	{
		if( this.getFocus() == false )
			return;
		
		var range = this.getSelectionRange();
			
		if( 	this.isSelected() == true && 
				event.keyCode != tomahawk_ns.Keyboard.LEFT && 
				event.keyCode != tomahawk_ns.Keyboard.RIGHT && 
				event.keyCode != tomahawk_ns.Keyboard.CTRL && 
				event.keyCode != tomahawk_ns.Keyboard.ALT && 
				event.keyCode != tomahawk_ns.Keyboard.SHIFT && 
				event.keyCode != tomahawk_ns.Keyboard.TAB 
		)
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
					text = "\n";
				}
				
				this.addCharAt(text,this.getCurrentIndex() + 1);
			}
		}
	};

	tomahawk_ns.InputTextField = InputTextField;
})();



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
	 * @class Letter
	 * @memberOf tomahawk_ns
	 * @description A Letter object is a DisplayObject that displays a Letter according to his format.
	 * @augments tomahawk_ns.DisplayObject
	 * @constructor
	 **/
	function Letter(value)
	{
		tomahawk_ns.DisplayObject.apply(this);		
		Letter._metricsContext = Letter._metricsContext || document.createElement("canvas").getContext("2d");
		this.setTextFormat( new tomahawk_ns.TextFormat() );
		this.value = ( value == undefined ) ? "" : value;
	}

	Tomahawk.registerClass(Letter,"Letter");
	Tomahawk.extend("Letter","DisplayObject");

	/**
	* @member newline
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Boolean}
	* @description Defines if the character is a newline character
	**/
	Letter.prototype.newline 			= false;
	/**
	* @member value
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {string}
	* @description The value of the character (a or b or ... )
	**/
	Letter.prototype.value 				= "";
	/**
	* @member format
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {tomahawk_ns.TextFormat}
	* @description An instance of TextFormat.
	**/
	Letter.prototype.format 			= null;
	/**
	* @member index
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {tNumber}
	* @description The position of the letter in the TextField
	**/
	Letter.prototype.index 				= 0;
	/**
	* @member textWidth
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Number}
	* @description The actual width of this letter
	**/
	Letter.prototype.textWidth 			= 0;	
	/**
	* @member textHeight
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Number}
	* @description The actual height of this letter
	**/
	Letter.prototype.textHeight 		= 0;	
	/**
	* @member selected
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Boolean}
	* @description Defines if the letter is selected or not
	**/
	Letter.prototype.selected			= false;
	Letter._metricsContext				= null;
	
	/**
	* @method setTextFormat
	* @memberOf tomahawk_ns.Letter.prototype
	* @description Sets the letter format
	* @param {tomahawk_ns.TextFormat} value the instance of TextFormat
	**/
	Letter.prototype.setTextFormat = function(value)
	{
		this.format = value;
		this.updateMetrics();
	};

	/**
	* @method updateMetrics
	* @memberOf tomahawk_ns.Letter.prototype
	* @description Update all the measure of the letter
	**/
	Letter.prototype.updateMetrics = function()
	{
		var context = Letter._metricsContext;
		var font = tomahawk_ns.Font.getFont( this.format.font );
		var measure = font.measureText(this.value, this.format.size);
		
		context.save();
		
		if( this.value == " " )
		{
			this.format.updateContext(context);
			measure.width = context.measureText(" ").width;
		}
		
		this.textWidth = measure.width;
		this.textHeight = measure.height;
		this.width = this.textWidth;
		this.height = this.textHeight;
		
		context.restore();
		// TODO
		
		//var context = Letter._metricsContext;
		//context.save();
		//
		//this.format.updateContext(context);
		//this.textHeight = ( context.measureText('M').width );
		//this.textWidth = context.measureText(this.value).width;
		//this.width = this.textWidth;
		//this.height = this.textHeight * 1.4;
		//
		//context.restore();
	};

	/**
	* @method draws the DisplayObject on the stage
	* @memberOf tomahawk_ns.Letter.prototype
	* @description Draws the display object into the specified context
	* @param {CanvasRenderingContext2D} the context of the canvas on which you want to draw the DisplayObject
	**/
	Letter.prototype.draw = function(context)
	{
		if( this.selected == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.format.backgroundSelectedColor;
			context.fillRect(0, 0, this.width, this.height);
			context.fill();
			context.restore();
		}
				
		this.format.updateContext(context);
		
		if( this.format.textBorder == true )
		{
			context.beginPath();
			this.format.updateBorderContext(context);
			context.strokeText(this.value,this.format.textBorderOffsetX,this.format.textBorderOffsetY);
			context.closePath();
		}
		
		context.beginPath();
		context.fillText(this.value,0,0);
		context.closePath();
		
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

	
	/**
	* @method clone
	* @memberOf tomahawk_ns.Letter.prototype
	* @description returns a clone of this Letter
	* @returns {tomahawk_ns.Letter} a new Letter object
	**/
	Letter.prototype.clone = function()
	{
		var letter = new tomahawk_ns.Letter(this.value);
		letter.format = this.format.clone();
		letter.index = this.index;
		letter.row = this.row;
		letter.textWidth = this.textWidth;
		letter.textHeight = this.textHeight;
		letter.height = this.height;
		letter.width = this.width;
		letter.selected = this.selected;
		
		return letter;
	};
	
	tomahawk_ns.Letter = Letter;
})();



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
	 * @class SelectableTextField
	 * @memberOf tomahawk_ns
	 * @description The SelectableTextField class is used to create display objects for text display and selection.
	 * @constructor
	 * @augments tomahawk_ns.TextField
	 **/
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
	
	SelectableTextField.prototype._selectCurrentWord = function()
	{
		this.unSelect();
		var word = this.getWordAt(this.getCurrentIndex());
		var start = -1;
		var end = -1;
		
		if( word != null )
		{			
			start = word.getStartIndex();
			end = word.getEndIndex();
		}
		
		this.selectBetween(start,end);
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

	/**
	* @method selectInto
	* @description Selects all the letters within the zone defined by the x,y,width,height parameters within the text field.
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} x the x position of the selection zone
	* @param {Number} y the y position of the selection zone
	* @param {Number} width the width of the selection zone
	* @param {Number} height the height of the selection zone
	**/
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

	/**
	* @description Returns an Array of letters that match the zone defined by the x,y,width,height parameters within the text field.
	* @method getLettersIn
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} x the x position of the selection zone
	* @param {Number} y the y position of the selection zone
	* @param {Number} width the width of the selection zone
	* @param {Number} height the height of the selection zone
	* @returns {Array} an Array of Letters objects
	**/
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

	/**
	* @method getSelectionRange
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @returns {Object} An object with "start" and "end" properties
	* @description Returns an object which defines the indexes between the text field is selected.
	**/
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

	/**
	* @method isSelected
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @returns {Boolean} true if selected, false it not.
	* @description Indicates wether a portion of the text is selected within the text field.
	**/
	SelectableTextField.prototype.isSelected = function()
	{
		var range =  this.getSelectionRange();
		return ( range.start >= 0 && range.end > range.start );
	};

	/**
	* @method selectAll
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @description Sets as selected all the text within the text field.
	**/
	SelectableTextField.prototype.selectAll = function()
	{
		this.selectBetween(0,this.getLetters().length);
	};

	/**
	* @method unSelect
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @description Removes all selection within the text field.
	**/
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
	
	/**
	* @method selectBetween
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} startIndex The zero-based index value of the first character in the selection (for example, the first character is 0, the second character is 1, and so on).
	* @param {Number} endIndex  The zero-based index value of the last character in the selection.
	* @description Sets as selected the text designated by the index values of the first and last characters, which are specified with the beginIndex and endIndex parameters.
	**/
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
	 * @class TextField
	 * @memberOf tomahawk_ns
	 * @description The TextField class is used to create display objects for text display.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
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

	/**
	* @member forceRefresh
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Forces the refresh of the TextField at every frame.
	**/
	TextField.prototype.forceRefresh		= false;		
	
	/**
	* @member defaultTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {tomahawk_ns.TextFormat}
	* @default null
	* @description Specifies the format applied to newly inserted text.
	**/
	TextField.prototype.defaultTextFormat 	= null;
	
	/**
	* @member currentIndex
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Number}
	* @default 0
	* @description The index of the insertion point (caret) position.
	**/
	TextField.prototype.currentIndex 		= 0;
	
	/**
	* @member background
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the text field has a background fill. If true, the text field has a background fill. If false, the text field has no background fill. Use the backgroundColor property to set the background color of a text field.
	**/
	TextField.prototype.background 			= false;
	
	/**
	* @member border
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the text field has a border. If true, the text field has a border. If false, the text field has no border. Use the borderColor property to set the border color.
	**/
	TextField.prototype.border 				= false;
	
	/**
	* @member padding
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Number}
	* @default 0
	* @description Specifies the internal padding of the text field. 
	**/
	TextField.prototype.padding 			= 0;
	
	/**
	* @member backgroundColor
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {string}
	* @description The color of the text field background.
	* @default "#ffffff"
	**/
	TextField.prototype.backgroundColor 	= "#ffffff";
	
	/**
	* @member borderColor
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {string}
	* @description The color of the text field border.
	* @default "#000000"
	**/
	TextField.prototype.borderColor 		= "#000000";
	
	/**
	* @member autoSize
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @description Specifies if the text field height will match the real text height.
	* @default false
	**/
	TextField.prototype.autoSize 			= false;
	
	/**
	* @member focusable
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @description Specifies if the current display object can have the focus or not.
	* @default true
	**/
	TextField.prototype.focusable			= true;
	
	
	TextField.prototype._focused 			= false;
	TextField.prototype._lastWidth 			= 0;
	TextField.prototype._refreshNextFrame 	= true;
	TextField.prototype._textAlign 			= "left";
	TextField.prototype._text 				= null;
	TextField.prototype._drawCursor	 		= false;
	TextField.prototype._drawCursorTime 	= 0;
	TextField.prototype._letters 			= null;
	
	
	/**
	* @property {String} ALIGN_LEFT left
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant aligns text to the left within the text field.
	**/
	TextField.ALIGN_LEFT 					= "left";

	/**
	* @property {String} ALIGN_CENTER center
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant centers the text in the text field.
	**/
	TextField.ALIGN_CENTER 					= "center";
	
	/**
	* @property {String} ALIGN_RIGHT right
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant aligns text to the right within the text field.
	**/
	TextField.ALIGN_RIGHT 					= "right";
	
	/**
	* @property {String} ALIGN_JUSTIFY justify
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant justifies text within the text field.
	**/
	TextField.ALIGN_JUSTIFY 				= "justify";

	/**
	* @method getTextAlign
	* @description Returns the current text align
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {String} the current text align
	**/
	TextField.prototype.getTextAlign = function()
	{
		return this._textAlign;
	};
	
	/**
	* @method setTextAlign
	* @description Sets the current text align
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value the text align
	**/
	TextField.prototype.setTextAlign = function(value)
	{
		if( this._textAlign == value )
			return;
			
		this._textAlign = value;
		this._refreshNextFrame = true;
	};
	
	/**
	* @method setCurrentIndex
	* @description Sets the index of the insertion point (caret) position.
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the new index of the insertion point
	**/
	TextField.prototype.setCurrentIndex = function(index)
	{
		if( this.currentIndex == index || index > this._letters.length)
			return;
			
		this.currentIndex = index;
		this._refreshNextFrame = true;
	};
	
	/**
	* @method getCurrentIndex
	* @description Returns the index of the insertion point (caret) position.
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Number} the index of the insertion point (caret) position
	**/
	TextField.prototype.getCurrentIndex = function()
	{
		return this.currentIndex;
	};
	
	/**
	* @method setFocus
	* @description Gives focus to the text field, specified by the value parameter. If value != true the current focus is removed.
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Boolean} value
	**/
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

	/**
	* @method getFocus
	* @description Specifies whether the current text field has the focus 
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Boolean} the value of the current focus
	**/
	TextField.prototype.getFocus = function()
	{
		return this._focused;
	};

	/**
	* @method setTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @description Applies the text formatting that the format parameter specifies to the specified text in a text field.
	* @param {tomahawk_ns.TextFormat} format A TextFormat object that contains character and paragraph formatting information
	* @param {Number} startIndex an integer that specifies the zero-based index position specifying the first character of the desired range of text.
	* @param {Number} [endIndex=undefined] An integer that specifies the first character after the desired text span. As designed, if you specify startIndex and endIndex values, the text from beginIndex to endIndex-1 is updated.
	**/
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

	/**
	* @method getTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @description Returns a TextFormat object containing a copy of the text format of the character at the index position.
	* @param {Number} index An integer that specifies the location of a letter within the text field.
	* @returns {tomahawk_ns.TextFormat}
	**/
	TextField.prototype.getTextFormat = function(index)
	{
		var letter = this.getLetterAt(index);
		if( letter == null )
			return this.defaultTextFormat.clone();
			
		return letter.format.clone();
	};

	/**
	* @method getText
	* @description Returns a string that is the current text in the text field.
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {String} the current text in the text field
	**/
	TextField.prototype.getText = function()
	{
		return this._text;
	};

	/**
	* @description Set the current text of the text field specified by the "value" parameter
	* @method setText
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value the new text of the text field
	**/
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
			this.addCharAt(value[i], i );
		}
	};

	/**
	* @description Returns all the letters objects of the text field
	* @method getLetters
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Array} all the letters of the text field
	**/
	TextField.prototype.getLetters = function()
	{
		return this._letters;
	};

	/**
	* @description Returns the letter object at the index specified by the "index" parameter.
	* @method getLetterAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the index of the letter you want to retrieve
	* @returns {tomahawk_ns.Letter} A Letter object
	**/
	TextField.prototype.getLetterAt = function(index)
	{
		var letters = this.getLetters();
		return letters[index] || null;
	};
	
	/**
	* @description Returns the word object at the index specified by the "index" parameter within the text field
	* @method getLetterAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the index
	* @returns {tomahawk_ns.Word} A Word object
	**/
	TextField.prototype.getWordAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var word = null;
		
		if( letter == null )
			return null;
			
		word = letter.parent;
		
		return word;
	};

	/**
	* @method addCharAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @param {Number} index The index position to which the character is added.
	* @description Adds a character to this text field instance at the index specified by the index parameter The character is added at the index position specified. If you specify a currently occupied index position, the character that exists at that position and all higher positions are moved up one position in the text.
	**/
	TextField.prototype.addCharAt = function(value,index)
	{
		var wordIndex =  ( index == 0 ) ? 0 : index - 1 ;
		var letter = new tomahawk_ns.Letter();
		var previous = this.getLetterAt(index-1);
		var currentWord = this.getWordAt(wordIndex);
		var tab1 = this._letters.slice(0,index);
		var tab2 = this._letters.slice(index);
		
		//create letter
		isNewline = ( value == "\n" );
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
	
	/**
	* @method removeCharAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index The index of the character to remove.
	* @returns {tomahawk_ns.Letter} The Letter instance that was removed.
	* @description Removes a character from the specified index position in the text of the text field.
	**/
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
	
		//this._text = this._text.substr(0,index-1) + this._text.substr(index+1);
		this._text = this._text.substr(0,index) + this._text.substr(index+1);
		
		currentWord.removeLetterAt( index - currentWord.getStartIndex() );
		
		if( currentWord.getNumLetters() == 0 )
			this.removeChild(currentWord);
			
		this._resetLettersIndex();
	};

	/**
	* @description Adds the text specified by the "value" parameter at the index specified by the "index" parameter to the text field.
	* @method addTextAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {string} value the text you want to add
	* @param {string} index the index at which you want to insert your text
	**/
	TextField.prototype.addTextAt = function(value,index)
	{
		var i = value.length;
		while( --i > -1 )
		{
			this.addCharAt(value[i],index);
		}
		
		this.setCurrentIndex(index);
	};
	
	/**
	* @description Removes the text between the indexes specified by the "startIndex" and the "endIndex" parameters within the text field.
	* @method removeTextBetween
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} startIndex the index from which you want to remove the text
	* @param {Number} endIndex the index to which you want to remove the text
	**/
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
	
	
	TextField.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		var width = this.width;
		var height = this.height;
		var bounds = tomahawk_ns.DisplayObjectContainer.prototype.getBoundingRectIn.apply(this,[spaceCoordinates]);
		
		if( bounds.width < width ) 
			bounds.width = width;
			
		if( bounds.height < height ) 
			bounds.height = height;
			
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		return bounds;
	};	
	
	TextField.prototype.updateBounds = function()
	{
		var width = this.width;
		var height = this.height;
		tomahawk_ns.DisplayObjectContainer.prototype.updateBounds.apply(this);
		
		var bounds = this.bounds;
		
		if( bounds.width < width ) 
			bounds.width = width;
			
		if( bounds.height < height ) 
			bounds.height = height;
			
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		
		this.width = bounds.width;
		this.height = bounds.height;
	};
	
	TextField.prototype.draw = function(context)
	{
		var currentIndexLetter = this.getLetterAt(this.currentIndex);
		var bounds = null;
		var time = null;
		
		if( this._lastWidth != this.width || this._refreshNextFrame == true || this.forceRefresh == true )
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
			context.lineTo( 0,this.height);
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
		var lineY = this.padding;
		var lineX = this.padding;
		var lineHeight = 0;
		var lineWidth = 0;
		var maxWidth = this.padding + ( this.width - this.padding * 2 );
		var textWidth = 0;
		
		this.children.sort( this._sortWords );
		
		for( i = 0; i < max; i++ )
		{		
			word = this.children[i];
			word.index = i;
			word.forceRefresh = this.forceRefresh;
			word.refresh();
			lineHeight = ( lineHeight < word.height ) ? word.height : lineHeight;
			
			if( i != 0 && ( lineWidth + word.width > maxWidth || word.newline == true ) )
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
			this.height = word.y + ( word.height );
		}
		
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
	 * @class TextFormat
	 * @memberOf tomahawk_ns
	 * @description ....
	 * @constructor
	 **/
	function TextFormat(){}
	Tomahawk.registerClass( TextFormat, "TextFormat" );

	TextFormat.prototype.textColor = "black";
	TextFormat.prototype.underline = false;
	TextFormat.prototype.backgroundSelectedColor = "blue";
	TextFormat.prototype.font = "Arial";
	TextFormat.prototype.bold = false;
	TextFormat.prototype.italic = false;
	TextFormat.prototype.size = 12;
	TextFormat.prototype.textBorder = false;
	TextFormat.prototype.textBorderColor = "black";
	TextFormat.prototype.textBorderOffsetX = 0;
	TextFormat.prototype.textBorderOffsetY = 0;
	TextFormat.prototype.textBorderThickness = 2;
	
	TextFormat.prototype.customMetrics = false;
	TextFormat.prototype.fontBaseWidth = -1;
	TextFormat.prototype.fontBaseHeight = -1;
	TextFormat.prototype.fontBaseSize = 0;
	
	TextFormat.prototype.smooth = false;
	TextFormat.prototype.smoothQuality = 1;

	TextFormat.prototype.updateContext = function(context)
	{
		var bold = ( this.bold ) ? "bold" : "";
		var italic = ( this.italic ) ? "italic" : "";
		
		context.font = italic+' '+bold+' '+this.size+'px '+this.font;
		context.fillStyle = this.textColor;
		context.textBaseline = 'top';
		
		if( this.underline == true )
		{
			context.strokeStyle = this.textColor;
		}
	};
	
	TextFormat.prototype.updateBorderContext = function(context)
	{
		this.updateContext(context);
		
		if( this.smooth == true )
		{
			context.shadowColor = this.textBorderColor;
			context.shadowBlur = this.smoothQuality;
		}
		
		context.lineWidth = this.textBorderThickness;
		context.strokeStyle = this.textBorderColor;
	};

	TextFormat.prototype.clone = function()
	{
		var format = new tomahawk_ns.TextFormat();
		format.textColor = this.textColor+"";
		format.font = this.font+"";
		format.size = parseInt( this.size );
		format.fontBaseWidth = parseInt(this.fontBaseWidth);
		format.fontBaseHeight = parseInt(this.fontBaseHeight);
		format.fontBaseSize = parseInt(this.fontBaseSize);
		format.smoothQuality = parseInt(this.smoothQuality);
		
		
		format.textBorderColor = this.textBorderColor;
		format.textBorderOffsetY = parseInt(this.textBorderOffsetX);
		format.textBorderOffsetY = parseInt(this.textBorderOffsetY);
		format.textBorderThickness = parseInt(this.textBorderThickness);
		
		format.bold = ( this.bold == true );
		format.underline = ( this.underline == true );
		format.italic = ( this.italic == true );
		format.textBorder = ( this.textBorder == true );
		format.customMetrics = ( this.customMetrics == true );
		format.smooth = (this.smooth == true);
		
		return format;
	};
	
	tomahawk_ns.TextFormat = TextFormat;
})();



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
	 * @class Word
	 * @memberOf tomahawk_ns
	 * @description The Word object is a DisplayObjectContainer that contains several Letter objects in order to display a word.
	 * @augments tomahawk_ns.DisplayObjectContainer
	 * @constructor
	 **/
	function Word()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.mouseEnabled = true;
	}
	
	Tomahawk.registerClass(Word,"Word");
	Tomahawk.extend("Word","DisplayObjectContainer");
	
	/**
	* @member row
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Number}
	* @description The row index of this word
	**/
	Word.prototype.row = 0;
	Word.prototype.newline = false;
	Word.prototype.marginLeft = 0;
	
	/**
	* @member index
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Number}
	* @description The index of this word
	**/
	Word.prototype.index = 0;
	
	/**
	* @member text
	* @memberOf tomahawk_ns.Word.prototype
	* @type {String}
	* @description the text of this word
	**/
	Word.prototype.text = "";
	
	/**
	* @member needRefresh
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Boolean}
	* @description forces the refresh of the word at next frame
	**/
	Word.prototype.needRefresh = false;
	
	/**
	* @member forceRefresh
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Boolean}
	* @description forces the refresh of the word at every frame
	**/
	Word.prototype.forceRefresh = true;
	
	/**
	* @description Returns the length of the word
	* @method getNumLetters
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number} returns the word length
	**/
	Word.prototype.getNumLetters = function()
	{
		return this.children.length;
	};
	
	/**
	* @description Returns the index of the first letter
	* @method getStartIndex
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number}
	**/
	Word.prototype.getStartIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt(0).index;
	};
	
	/**
	* @description Returns the index of the last letter
	* @method getEndIndex
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number}
	**/
	Word.prototype.getEndIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt( this.children.length - 1 ).index;
	};
	
	/**
	* @description Appends a letter to the word
	* @method addLetter
	* @param {tomahawk_ns.Letter} letter an instance of a Letter Object
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.addLetter = function(letter)
	{
		this.text = this.text + letter.value;
		this.needRefresh = true;
		return this.addChild(letter);
	};
	
	/**
	* @description Removes a letter in the word at the corresponding index 
	* @method removeLetterAt
	* @param {Number} The letter index
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.removeLetterAt = function(index)
	{
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		this.needRefresh = true;
		return this.removeChildAt(index);
	};
	
	/**
	* @description Removes the corresponding letter in the word
	* @method removeLetter
	* @param {tomahawk_ns.Letter} letter an instance of a Letter Object
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.removeLetter = function(letter)
	{
		var index = this.getChildIndex(letter);
		
		if( index == -1 )
			return letter;
	
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		return this.removeChild(letter);
	};
	
	/**
	* @description Returns the letter at the corresponding index in the word
	* @method getLetterAt
	* @param {Number} the index of the letter
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.getLetterAt = function(index)
	{
		return this.getChildAt(index);
	};
		
	/**
	* @description Adds the letter "letter" at the specified index in the word.
	* @method addLetterAt
	* @param {tomahawk_ns.Letter} the letter you want to add
	* @param {Number} the index of the letter
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.addLetterAt = function(letter,index)
	{
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + letter.value + this.text.substr(index);
		this.addChildAt(letter,index);
	};
	
	/**
	* @description Returns all the letters of the word
	* @method getLetters
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Array} 
	**/
	Word.prototype.getLetters = function()
	{
		return this.children;
	};
	
	/**
	* @description Actualize the appearance of the word
	* @method refresh
	* @memberOf tomahawk_ns.Word.prototype
	**/
	Word.prototype.refresh = function()
	{
		if( this.needRefresh != true && this.forceRefresh != true)
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
		
		if( this.forceRefresh == false )
		{
			this._cache = null;
			this.updateCache();
			this.cacheAsBitmap = true;
		}
	};
	
	/**
	* @description Split the word in two, the cutting point is specified by the "index" parameter. Returns the second Word.
	* @method cut
	* @param {Number} the index form which you want to cut the word
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Word}
	**/
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
	 * @class DragAndDropBehavior
	 * @memberOf tomahawk_ns
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 * @description The DragAndDropBehavior class adds a classic drag and drop behavior to a display object
	 **/
	function DragAndDropBehavior()
	{
		tomahawk_ns.EventDispatcher.apply(this);
	}

	Tomahawk.registerClass( DragAndDropBehavior, "DragAndDropBehavior" );
	Tomahawk.extend( "DragAndDropBehavior", "EventDispatcher" );
	
	
	DragAndDropBehavior.prototype._lastPoint = null;
	DragAndDropBehavior.prototype._dragging = false;
	DragAndDropBehavior.prototype._target = null;
	
	DragAndDropBehavior.prototype.___getDragDropMovement___ 		= function(event)
	{
		if( this._target == null )
			return;
		
		this._lastPoint = this._lastPoint || new tomahawk_ns.Point(0,0);
		
		var newPoint = new tomahawk_ns.Point(event.stageX, event.stageY);
		var movement = new tomahawk_ns.Point(0,0);
		
		if( this._target.parent != null )
		{
			newPoint = this._target.parent.globalToLocal(event.stageX, event.stageY);
		}
		
		movement.x = newPoint.x - this._lastPoint.x;
		movement.y = newPoint.y - this._lastPoint.y;
		
		this._lastPoint.x = newPoint.x;
		this._lastPoint.y = newPoint.y;
		
		return movement;
	};
	
	DragAndDropBehavior.prototype.___dragDropHandler___ 			= function(event)
	{
		if( this._dragging == false || this._target == null )
			return;

		var movement = this.___getDragDropMovement___(event);
		
		this._target.x += movement.x;
		this._target.y += movement.y;
	};
	
	DragAndDropBehavior.prototype.___toggleDragDropHandler___ 		= function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN )
		{
			this.startDrag();
		}
		else
		{
			this.stopDrag();
		}
		
		this.___getDragDropMovement___(event);
	};
	
	/**
	* @method enableDragAndDrop
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @param {Boolean} value Indicates if the drag and drop feature is enabled or not. 
	* @description Enables or Disables the drag and drop feature.
	**/
	DragAndDropBehavior.prototype.enableDragAndDrop 				= function(target,value)
	{
		this.stopDrag();
		this._target = target;
		
		this._target.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
		this._target.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		
		if( value == true )
		{
			this._target.addEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
			this._target.addEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		}
		
		this._target.mouseEnabled = true;
	};
	
	/**
	* @method startDrag
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @description Start the dragging operation.
	**/
	DragAndDropBehavior.prototype.startDrag 						= function()
	{
		if( this._target == null )
			return;
			
		this.stopDrag();
		this._dragging = true;
		this._target.addEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___,true );
		this._target.mouseEnabled = true;
	};
	
	/**
	* @method stopDrag
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @description Stop the dragging operation.
	**/
	DragAndDropBehavior.prototype.stopDrag 							= function()
	{
		if( this._target == null )
			return;
			
		this._dragging = false;
		this._target.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___, true );
	};
	
	/**
	* @method destroy
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @description Destroys the behavior
	**/
	DragAndDropBehavior.prototype.destroy							= function()
	{
		this.stopDrag();
		this._dragging = false;
		this._target = null;
		this._lastPoint = null;
		this.removeEventListeners();
	};


	tomahawk_ns.DragAndDropBehavior = DragAndDropBehavior;

})();







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
	 * @class Keyboard
	 * @memberOf tomahawk_ns
	 * @description The Keyboard class is used to build an interface that can be controlled by a user with a standard keyboard.
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 **/
	
	function Keyboard()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		var callbackKey = this._keyboardHandler.bind(this);
		window.removeEventListener("keyup",callbackKey);
		window.removeEventListener("keydown",callbackKey);
		window.removeEventListener("keypress",callbackKey);
		
		window.addEventListener("keyup",callbackKey);
		window.addEventListener("keydown",callbackKey);
		window.addEventListener("keypress",callbackKey);
	}
	
	Tomahawk.registerClass( Keyboard, "Keyboard" );
	Tomahawk.extend( "Keyboard", "EventDispatcher" );
	
	Keyboard.prototype._keyboardHandler = function(event)
	{	
		if( event.type == "keyup" )
			tomahawk_ns.Keyboard.toggleShift(event.keyCode);
			
		var type = "";
		var newEvent = null;
		var charCode = event.which || event.keyCode;
		var character = tomahawk_ns.Keyboard.keyCodeToChar(	event.keyCode, 
															event.shiftKey, 
															event.ctrlKey, 
															event.altKey);
		
		switch( event.type )
		{
			case "keyup"	: type = tomahawk_ns.KeyboardEvent.KEY_UP	; break;
			case "keypress"	: type = tomahawk_ns.KeyboardEvent.KEY_PRESS; break;
			case "keydown"	: type = tomahawk_ns.KeyboardEvent.KEY_DOWN	; break;
		}
		
		newEvent = new tomahawk_ns.KeyboardEvent(type,true,false);
		newEvent.nativeEvent = event;
		newEvent.keyCode = event.keyCode;
		newEvent.charCode = event.charCode;
		newEvent.ctrlKey = event.ctrlKey;
		newEvent.shiftKey = event.shiftKey;
		newEvent.altKey = event.altKey;
		newEvent.value = character;
		newEvent.isCharacter = tomahawk_ns.Keyboard.isMapped(newEvent.keyCode);
		newEvent.which = event.which;
	
		if( event.keyCode == tomahawk_ns.Keyboard.BACKSPACE ||
			event.keyCode == tomahawk_ns.Keyboard.SPACE 
		)
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
		}
		
		this.dispatchEvent(newEvent);
	};
	
	
	/**
	* @description Returns the unique instance of the Keyboard class, singleton design pattern.
	* @method getInstance
	* @memberOf tomahawk_ns.Keyboard
	* @returns {tomahawk_ns.Keyboard} An Keyboard object
	**/
	Keyboard.getInstance = function()
	{
		if( tomahawk_ns.Keyboard._instance == null )
			tomahawk_ns.Keyboard._instance = new tomahawk_ns.Keyboard();
			
		return tomahawk_ns.Keyboard._instance;
	};
	
	/**
	* @description Returns the character which corresponds to the value passed in parameters.
	* @method keyCodeToChar
	* @memberOf tomahawk_ns.Keyboard
	* @param {Number} keyCode the keycode of the character
	* @param {Boolean} shiftKey indicates wether the shift key is pressed
	* @param {Boolean} ctrlKey indicates wether the ctrl key is pressed
	* @param {Boolean} altKey indicates wether the alt key is pressed
	* @returns {String} A character corresponding to the keycode.
	**/
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
	
	/**
	* @description Returns a Boolean value that indicates if the keycode specified by the "keycode" parameter is mapped by the Keyboard class.
	* @method isMapped
	* @memberOf tomahawk_ns.Keyboard
	* @param {Number} keyCode the keycode of the character
	* @returns {Boolean} true if the keycode is mapped, false if not.
	**/
	Keyboard.isMapped = function(keyCode)
	{
		return Keyboard.MAP[keyCode] != undefined;
	};
	
	Keyboard.toggleShift = function(keyCode)
	{
		if( keyCode == Keyboard.CAPSLOCK )
			Keyboard._majActive = ! Keyboard._majActive;
	};

	Keyboard._majActive = false;

	/**
	* @constant {Number} BACKSPACE
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.BACKSPACE = 8;
	
	/**
	* @constant {Number} TAB
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TAB = 9;
	
	/**
	* @constant {Number} ENTER
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.ENTER = 13;
	
	/**
	* @constant {Number} SHIFT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SHIFT = 16;
	
	/**
	* @constant {Number} CTRL
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.CTRL = 17;
	
	/**
	* @constant {Number} ALT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.ALT = 18;
	
	/**
	* @constant {Number} CAPSLOCK
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.CAPSLOCK = 20;
	
	/**
	* @constant {Number} SPACE
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SPACE = 32;
	
	/**
	* @constant {Number} END
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.END = 35;
	
	/**
	* @constant {Number} START
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.START = 36;
	
	/**
	* @constant {Number} LEFT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.LEFT = 37;
	
	/**
	* @constant {Number} UP
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.UP = 38;
	
	/**
	* @constant {Number} RIGHT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.RIGHT = 39;
	
	/**
	* @constant {Number} DOWN
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.DOWN = 40;
	
	/**
	* @constant {Number} SUPPR
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SUPPR = 46;


	// > 47
	
	/**
	* @constant {Number} TOUCH_0
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_0 = 48;
	
	/**
	* @constant {Number} TOUCH_1
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_1 = 49;
	
	/**
	* @constant {Number} TOUCH_2
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_2 = 50;
	
	/**
	* @constant {Number} TOUCH_3
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_3 = 51;
	
	/**
	* @constant {Number} TOUCH_4
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_4 = 52;
	
	/**
	* @constant {Number} TOUCH_5
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_5 = 53;
	
	/**
	* @constant {Number} TOUCH_6
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_6 = 54;
	
	/**
	* @constant {Number} TOUCH_7
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_7 = 55;
	
	/**
	* @constant {Number} TOUCH_8
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_8 = 56;
	
	/**
	* @constant {Number} TOUCH_9
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_9 = 57;
	// < 58

	// > 64
	/**
	* @constant {Number} A
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.A = 65;
	
	/**
	* @constant {Number} B
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.B = 66;
	
	/**
	* @constant {Number} C
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.C = 67;
	
	/**
	* @constant {Number} D
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.D = 68;
	
	/**
	* @constant {Number} E
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.E = 69;
	
	/**
	* @constant {Number} F
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F = 70;
	
	/**
	* @constant {Number} G
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.G = 71;
	
	/**
	* @constant {Number} H
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.H = 72;
	
	/**
	* @constant {Number} I
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.I = 73;
	
	/**
	* @constant {Number} J
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.J = 74;
	
	/**
	* @constant {Number} K
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.K = 75;
	
	/**
	* @constant {Number} L
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.L = 76;
	
	/**
	* @constant {Number} M
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.M = 77;
	
	/**
	* @constant {Number} N
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.N = 78;
	
	/**
	* @constant {Number} O
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.O = 79;
	
	/**
	* @constant {Number} P
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.P = 80;
	
	/**
	* @constant {Number} Q
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.Q = 81;
	
	/**
	* @constant {Number} R
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.R = 82;
	
	/**
	* @constant {Number} S
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.S = 83;
	
	/**
	* @constant {Number} T
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.T = 84;
	
	/**
	* @constant {Number} U
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.U = 85;
	
	/**
	* @constant {Number} V
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.V = 86;
	
	/**
	* @constant {Number} W
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.W = 87;
	
	/**
	* @constant {Number} X
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.X = 88;
	
	/**
	* @constant {Number} Y
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.Y = 89;
	
	/**
	* @constant {Number} Z
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.Z = 90;
	// < 91


	/**
	* @constant {Number} WINDOWS
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.WINDOWS = 91;
	
	/**
	* @constant {Number} SELECT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SELECT = 93;

	// > 95
	
	/**
	* @constant {Number} NUMPAD_0
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_0 = 96;
	
	/**
	* @constant {Number} NUMPAD_1
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_1 = 97;
	
	/**
	* @constant {Number} NUMPAD_2
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_2 = 98;
	
	/**
	* @constant {Number} NUMPAD_3
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_3 = 99;
	
	/**
	* @constant {Number} NUMPAD_4
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_4 = 100;
	
	/**
	* @constant {Number} NUMPAD_5
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_5 = 101;
	
	/**
	* @constant {Number} NUMPAD_6
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_6 = 102;
	
	/**
	* @constant {Number} NUMPAD_7
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_7 = 103;
	
	/**
	* @constant {Number} NUMPAD_8
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_8 = 104;
	
	/**
	* @constant {Number} NUMPAD_9
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_9 = 105;
	
	/**
	* @constant {Number} NUMPAD_MULTIPLY
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_MULTIPLY = 106;
	
	/**
	* @constant {Number} NUMPAD_PLUS
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_PLUS = 107;
	
	/**
	* @constant {Number} NUMPAD_MINUS
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_MINUS = 109;
	
	/**
	* @constant {Number} NUMPAD_DOT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_DOT = 110;
	
	/**
	* @constant {Number} NUMPAD_SLASH
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_SLASH = 111;
	// < 112

	// > 111
	
	/**
	* @constant {Number} F1
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F1 = 112;
	
	/**
	* @constant {Number} F2
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F2 = 113;
	
	/**
	* @constant {Number} F3
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F3 = 114;
	
	/**
	* @constant {Number} F4
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F4 = 115;
	
	/**
	* @constant {Number} F5
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F5 = 116;
	
	/**
	* @constant {Number} F6
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F6 = 117;
	
	/**
	* @constant {Number} F7
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F7 = 118;
	
	/**
	* @constant {Number} F8
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F8 = 119;
	
	/**
	* @constant {Number} F9
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F9 = 120;
	
	/**
	* @constant {Number} F10
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F10 = 121;
	
	/**
	* @constant {Number} F11
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F11 = 122;
	
	/**
	* @constant {Number} F12
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F12 = 123;
	// < 124
	
	/**
	* @constant {Number} VERR_NUM
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.VERR_NUM = 144;

	// > 185
	
	/**
	* @constant {Number} DOLLAR
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.DOLLAR = 186;
	
	/**
	* @constant {Number} EQUAL
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.EQUAL = 187;
	
	/**
	* @constant {Number} QUESTION
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.QUESTION = 188;
	
	/**
	* @constant {Number} DOT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.DOT = 190
	
	/**
	* @constant {Number} SLASH
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SLASH = 191;
	
	/**
	* @constant {Number} PERCENT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.PERCENT = 192;
	
	/**
	* @constant {Number} RIGHT_PARENT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.RIGHT_PARENT = 219;
	
	/**
	* @constant {Number} MICRO
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.MICRO = 220;
	
	/**
	* @constant {Number} TREMA
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TREMA = 221;
	
	/**
	* @constant {Number} POWER_TWO
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.POWER_TWO = 222;
	
	/**
	* @constant {Number} EXCLAMATION
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.EXCLAMATION = 223;
	
	// < 224

	/**
	* @description a map that contains and associates all the Keyboard constants to a specific character.
	* @constant {Number} MAP
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.MAP = new Array();

	//undocumented
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
	Keyboard.MAP[Keyboard.E]={normal:"e",shift:"E",altgr:"€"};
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

	tomahawk_ns.Keyboard = Keyboard;
})();




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
	 * @class Mouse
	 * @memberOf tomahawk_ns
	 * @description The methods of the Mouse class are used to set the pointer to a specific style. The Mouse class is a top-level class whose properties and methods you can access without using a constructor.
	 * @constructor
	 **/
	function Mouse(){}

	Tomahawk.registerClass( Mouse, "Mouse" );
	
	/**
	* @property {String} RESIZE
	* @memberOf tomahawk_ns.Mouse
	* @default "se-resize"
	**/
	Mouse.RESIZE = "se-resize";
	
	/**
	* @property {String} MOVE
	* @memberOf tomahawk_ns.Mouse
	* @default "move"
	**/
	Mouse.MOVE = "move";
	
	/**
	* @property {String} POINTER
	* @memberOf tomahawk_ns.Mouse
	* @default "pointer"
	**/
	Mouse.POINTER = "pointer";

	/**
	* @property {String} DEFAULT
	* @memberOf tomahawk_ns.Mouse
	* @default "default"
	**/
	Mouse.DEFAULT = "default";

	/**
	* @member setCursor
	* @memberOf tomahawk_ns.Mouse
	* @param {String} value the cursor style value.
	* @param {DOMElement} domElement the domElement on which the cursor style is applied.
	* @description Sets the cursor style for the DOMElement specified by the "domElement" parameter.
	**/
	Mouse.setCursor = function(value,domElement)
	{
		domElement.style.cursor = value;
	};
	
	tomahawk_ns.Mouse = Mouse;
})();



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
	 * @class Screen
	 * @memberOf tomahawk_ns
	 * @description The Screen class is used to get information about the screen or the canvas sizes.
	 * @constructor
	 **/
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	/**
	* @description Returns the width of the HTMLCanvasElement's DOM parent node associated to the stage instance specified by the "stage" parameter.
	* @method getInnerWidth
	* @memberOf tomahawk_ns.Screen
	* @param {tomahawk_ns.Stage} stage an instance stage of .
	* @returns {Number} 
	**/
	Screen.getInnerWidth = function(stage)
	{
		return stage.getCanvas().parentNode.offsetWidth;
	};
	
	/**
	* @description Returns the height of the HTMLCanvasElement's DOM parent node associated to the stage instance specified by the "stage" parameter.
	* @method getInnerHeight
	* @memberOf tomahawk_ns.Screen
	* @param {tomahawk_ns.Stage} stage an instance stage of .
	* @returns {Number} 
	**/
	Screen.getInnerHeight = function(stage)
	{
		return stage.getCanvas().parentNode.offsetHeight;
	};

	/**
	* @description Returns the current window width.
	* @method getWindowWidth
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getWindowWidth = function()
	{
		return window.innerWidth;
	};
	
	/**
	* @description Returns the current window height.
	* @method getWindowHeight
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getWindowHeight = function()
	{
		return window.innerHeight;
	};
	
	/**
	* @description Returns the current client width.
	* @method getClientWidth
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getClientWidth = function()
	{
		return document.body.clientWidth;
	};
	
	/**
	* @description Returns the current client height.
	* @method getClientHeight
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getClientHeight = function()
	{
		return document.body.clientHeight;
	};
	
	tomahawk_ns.Screen = Screen;
})();



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
	 * @class Event
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	 
	function Event(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( Event, "Event" );

	/**
	* @member {String} type the type of the event.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.type = null;
	
	/**
	* @member {Boolean} bubbles indicates if the event can "bubble" or not.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.bubbles = false;
	
	/**
	* @member {Boolean} cancelable indicates if the event is cancelable or not.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.cancelable = true;
	
	/**
	* @member {Object} data an object attached to the event.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.data = null;
	
	/**
	* @member {tomahawk_ns.EventDispatcher} target the original dispatcher of the event
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.target = null;
	
	/**
	* @member {tomahawk_ns.EventDispatcher} currentTarget the actual dispatcher of the event
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.currentTarget = null;

	/**
	* @method stopPropagation stop the bubbling phase
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.stopPropagation = function()
	{
		if( this.cancelable == true )
			this.bubbles = false;
	};

	/**
	* @property {String} FOCUSED focused
	* @memberOf tomahawk_ns.Event
	**/
	Event.FOCUSED			= "focused";
	/**
	* @property {String} UNFOCUSED unfocused
	* @memberOf tomahawk_ns.Event
	**/
	Event.UNFOCUSED			= "unfocused";
	/**
	* @property {String} ADDED added
	* @memberOf tomahawk_ns.Event
	**/
	Event.ADDED 			= "added";
	/**
	* @property {String} ADDED_TO_STAGE addedToStage
	* @memberOf tomahawk_ns.Event
	**/
	Event.ADDED_TO_STAGE 	= "addedToStage";
	/**
	* @property {String} ENTER_FRAME enterFrame
	* @memberOf tomahawk_ns.Event
	**/
	Event.ENTER_FRAME 		= "enterFrame";
	/**
	* @property {String} REMOVED removed
	* @memberOf tomahawk_ns.Event
	**/
	Event.REMOVED 			= "removed";
	/**
	* @property {String} REMOVED_FROM_STAGE removedFromStage
	* @memberOf tomahawk_ns.Event
	**/
	Event.REMOVED_FROM_STAGE= "removedFromStage";
	/**
	* @property {String} IO_ERROR ioError
	* @memberOf tomahawk_ns.Event
	**/
	Event.IO_ERROR			= "ioError";
	/**
	* @property {String} PROGRESS progress
	* @memberOf tomahawk_ns.Event
	**/
	Event.PROGRESS			= "progress";
	/**
	* @property {String} COMPLETE complete
	* @memberOf tomahawk_ns.Event
	**/
	Event.COMPLETE			= "complete";
	
	
	tomahawk_ns.Event = Event;

})();



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
	 * @class EventDispatcher
	 * @memberOf tomahawk_ns
	 * @constructor
	 **/
	function EventDispatcher()
	{
		this._listeners = new Array();
	}

	Tomahawk.registerClass( EventDispatcher, "EventDispatcher" );

	/**
	* @member {tomahawk_ns.EventDispatcher} parent the parent of the current EventDispatcher
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.parent = null;
	EventDispatcher.prototype._listeners = null;

	/**
	* Gets all listeners types
	* @method getListenersTypes
	* @memberOf tomahawk_ns.getEventListeners.prototype
	* @returns {Array}
	**/
	EventDispatcher.prototype.getEventListeners = function()
	{
		var tab = new Array();
		var i = this._listeners.length;
		
		while( --i > -1 )
		{
			tab.push(this._listeners[i].type);
		}
		
		return tab;
	};
	
	/**
	* Add an event listener to the current EventDispatcher
	* @method addEventListener
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @param {String} type The event type.
	* @param {Object} scope the scope of the callback function
	* @param {Function} a callback function which will be called when a matching event will be dispatch.
	**/
	EventDispatcher.prototype.addEventListener = function( type, scope, callback, useCapture )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		
		useCapture = (useCapture == true);
		obj.type = type;
		obj.scope = scope;
		obj.callback = callback;
		obj.useCapture = useCapture;
		this._listeners.push(obj);
	};
	
	/**
	* @description indicates if the current EventDispatcher has an event listener for the type passed in parameter.
	* @method hasEventListener 
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @returns {Boolean}
	* @params {String} type the type of the event listener
	**/
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
		
		return false;
	};

	/**
	* @description send an event trought all the Display list from the current EventDispatcher to the stage
	* @method dispatchEvent 
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @returns {Boolean}
	* @param {tomahawk_ns.Event} event the event to dispatch
	**/
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

	/**
	* Remove ( if exists ) an event listener to the current EventDispatcher
	* @method removeEventListener
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @param {String} type The event type.
	* @param {Object} scope the scope of the callback function
	* @param {Function} a callback function which will be called when a matching event will be dispatch.
	**/
	EventDispatcher.prototype.removeEventListener = function( type, scope, callback, useCapture )
	{
		var obj = new Object();
		var i = this._listeners.length;
		var arr = new Array();
		
		useCapture = (useCapture == true);
			
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type != type || 
				obj.scope != scope || 
				obj.callback != callback || 
				obj.useCapture != useCapture 
			)
			{
				arr.push(obj);
			}
		}
			
		this._listeners = arr;
	};

	/**
	* Remove all event listeners of the current EventDispatcher
	* @method removeEventListeners
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.removeEventListeners = function()
	{
		this._listeners = new Array();
	};
	
	/**
	* Destroy properly the current EventDispatcher
	* @method destroy
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.destroy = function()
	{
		this.removeEventListeners();
		this.parent = null;
		this._listeners = null;
	};
	
	tomahawk_ns.EventDispatcher = EventDispatcher;

})();




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
	 * @class KeyboardEvent
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function KeyboardEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( KeyboardEvent, "KeyboardEvent" );
	Tomahawk.extend( "KeyboardEvent", "Event" );

	/**
	* @member {String} value the value of the event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.value = "";
	
	/**
	* @member {Number} keyCode the keyCode of the event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.keyCode = 0;
	
	/**
	* @member {Boolean} isCharacter Indicates if the touch pressed corresponds to a character
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.isCharacter = false;
	
	/**
	* @member {Number} charCode the charCode of the event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.charCode = 0;
	
	/**
	* @member {Boolean} ctrlKey Indicates weither the ctrlKey is pressed or not
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.crtlKey = false;
	
	/**
	* @member {Boolean} shiftKey Indicates weither the shiftKey is pressed or not
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.shiftKey = false;
	
	/**
	* @member {Boolean} altKey Indicates weither the altKey is pressed or not
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.altKey = false;
	
	/**
	* @member {KeyboardEvent} nativeEvent the native javascript event
	* @memberOf tomahawk_ns.KeyboardEvent.prototype
	**/
	KeyboardEvent.prototype.nativeEvent = null;

	/**
	* @property {String} KEY_UP "keyup"
	* @memberOf tomahawk_ns.KeyboardEvent
	**/
	KeyboardEvent.KEY_UP = "keyup";
	
	/**
	* @property {String} KEY_DOWN "keydown"
	* @memberOf tomahawk_ns.KeyboardEvent
	**/
	KeyboardEvent.KEY_DOWN = "keydown";
	
	/**
	* @property {String} KEY_PRESS "keypress"
	* @memberOf tomahawk_ns.KeyboardEvent
	**/
	KeyboardEvent.KEY_PRESS = "keypress";

	tomahawk_ns.KeyboardEvent = KeyboardEvent;

})();











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
	 * @class MouseEvent
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function MouseEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( MouseEvent, "MouseEvent" );
	Tomahawk.extend( "MouseEvent", "Event" );


	/**
	* @method fromNativeMouseEvent converts an original MouseEvent into a regular tomahawk_ns.MouseEvent one
	* @memberOf tomahawk_ns.MouseEvent
	* @returns {tomahawk_ns.MouseEvent}
	**/
	MouseEvent.fromNativeMouseEvent = function(event,bubbles,cancelable,x,y)
	{
		var type = "";
		var msevent = null;
		
		
		
		switch( event.type )
		{
			case "touchend": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "click": type = tomahawk_ns.MouseEvent.CLICK; break;
			case "dblclick": type = tomahawk_ns.MouseEvent.DOUBLE_CLICK; break;
			case "mousemove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "touchmove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "mouseup": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "mousedown": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
			case "touchstart": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
		}
		
		msevent = new tomahawk_ns.MouseEvent(type,bubbles,cancelable);
		msevent.stageX = x;
		msevent.stageY = y;
		return msevent;
	};

	/**
	* @property {Object} CLICK
	* @memberOf tomahawk_ns.MouseEvent click
	**/
	MouseEvent.CLICK 			= "click";
	/**
	* @property {Object} DOUBLE_CLICK doubleClick
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.DOUBLE_CLICK 	= "doubleClick";
	/**
	* @property {Object} ROLL_OVER rollOver
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.ROLL_OVER 		= "rollOver";
	/**
	* @property {Object} ROLL_OUT rollOut
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.ROLL_OUT 		= "rollOut";
	/**
	* @property {Object} MOUSE_MOVE mouseMove
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_MOVE 		= "mouseMove";
	/**
	* @property {Object} MOUSE_UP mouseUp
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_UP 		= "mouseUp";
	/**
	* @property {Object} MOUSE_DOWN mouseDown
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_DOWN 		= "mouseDown";

	tomahawk_ns.MouseEvent = MouseEvent;

})();



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
	 * @class MathUtils
	 * @memberOf tomahawk_ns
	 * @description The MathUtils class provide useful mathematic features
	 * @constructor
	 **/
	function MathUtils(){}
	
	Tomahawk.registerClass( MathUtils, "MathUtils" );
	
	/**
	 * Multiplier for converting degrees to radians.
	 * @memberOf tomahawk_ns.MathUtils
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	MathUtils.DEG_TO_RAD = Math.PI / 180;
	
	/**
	 * Multiplier for converting radians to degrees.
	 * @memberOf tomahawk_ns.MathUtils
	 * @property RAD_TO_DEG
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	MathUtils.RAD_TO_DEG = 1 / MathUtils.DEG_TO_RAD;
	
	/**
	 * return the distance between the points specified by the coordinates x1,y1 and x2,y2 
	 * @method getDistanceBetween
	 * @memberOf tomahawk_ns.MathUtils
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @return {Number} the distance between the two points
	 **/
	MathUtils.getDistanceBetween = function(x1,y1,x2,y2)
	{
		var a = ( x2 - x1 ) * ( x2 - x2 );
		var b = ( y2 - y1 ) * ( y2 - y2 );
		return Math.sqrt( a + b );
	};
	
	/**
	* return the angle in pointA according to te Al Kashi's theorem
	* α = angleA, β = angleB, γ = angleC
	* a² = b² + c² − 2bc.cos(α)
	* b² = a² + c² − 2ac.cos(β)
	* c² = a² + b² − 2ab.cos(γ)
	* @method findAngleInTriangle
	* @memberOf tomahawk_ns.MathUtils
	* @param {tomahawk_ns.Point} pointA
	* @param {tomahawk_ns.Point} pointB
	* @param {tomahawk_ns.Point} pointC
	* @return {Number} the angle in pointA
	*/
	MathUtils.findAngleInTriangle = function(pointA,pointB,pointC)
	{
		var AB = tomahawk_ns.MathUtils.getDistanceBetween(pointA,pointB);
		var BC = tomahawk_ns.MathUtils.getDistanceBetween(pointB,pointC);
		var AC = tomahawk_ns.MathUtils.getDistanceBetween(pointA,pointC);
		
		var AB2 = AB * AB;
		var BC2 = BC * BC;
		var AC2 = AC * AC;
		
		var angle = Math.acos( ( AC2 + AB2 - BC2 ) /( 2*(AC*AB) ) );
		return angle;
	};
	
	/**
	* return the next power of 2 greater or equal than the value passed in parameter
	* @method getNextPowerOf2
	* @memberOf tomahawk_ns.MathUtils
	* @param {Number} value
	* @return {Number} the next power of 2
	*/
	MathUtils.getNextPowerOf2 = function(value)
	{
		var num = 1;
		while( num < value )
		{
			num *= 2;
		}
		
		return num;
	};
	
	/**
	* Converts a pair of x,y coordinates with specifics cell's width and height into a pair of row,col
	* @method screenToIso
	* @memberOf tomahawk_ns.MathUtils
	* @param {Number} x
	* @param {Number} y
	* @param {Number} cellW
	* @param {Number} cellH
	* @return {tomahawk_ns.Point} a Point Object which x  = col and y = row
	*/
	MathUtils.prototype.screenToIso = function( x, y, cellW, cellH)
	{
		var obj = new tomahawk_ns.Point();
		var divY = y / cellH;
		var divX = x / cellW;
		obj.x = divY + divX;
		obj.y = divY - divX;
		return obj;
	}

	/**
	* Converts a pair of row,col coordinates with specifics cell's width and height into a pair of x,y
	* @method isoToScreen
	* @memberOf tomahawk_ns.MathUtils
	* @param {Number} row
	* @param {Number} col
	* @param {Number} cellW
	* @param {Number} cellH
	* @return {tomahawk_ns.Point} a Point Object
	*/
	MathUtils.prototype.isoToScreen = function(  row, col, cellW, cellH )
	{
		var x = ( col - row ) * ( cellW * 0.5 );
		var y = ( col + row ) * ( cellH * 0.5 );
		var pt = new tomahawk_ns.Point(x >> 0 , y >> 0);
		
		return pt;
	}
	
	tomahawk_ns.MathUtils = MathUtils;
})();



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

/**
 * original file extracted from createJs ( http://www.createjs.com ) 
 * and modified a bit for Tomahawk
 */

(
function() 
{
	 /**
	 * @class Matrix2D
	 * @description A Basic implementation of a Matrix3x3 
	 * @memberOf tomahawk_ns
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @constructor
	 **/
	function Matrix2D(a, b, c, d, tx, ty)
	{
		this.initialize(a, b, c, d, tx, ty);
		this._stack = new Array();
	}

	Tomahawk.registerClass( Matrix2D, "Matrix2D" );	

// public properties:
	/**
	 * Position (0, 0) in a 3x3 affine transformation matrix.
	 * @member a
	 * @type Number
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 **/
	Matrix2D.prototype.a = 1;

	/**
	 * Position (0, 1) in a 3x3 affine transformation matrix.
	 * @member b
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.b = 0;

	/**
	 * Position (1, 0) in a 3x3 affine transformation matrix.
	 * @member c
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.c = 0;

	/**
	 * Position (1, 1) in a 3x3 affine transformation matrix.
	 * @member d
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.d = 1;

	/**
	 * Position (2, 0) in a 3x3 affine transformation matrix.
	 * @member tx
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.tx = 0;

	/**
	 * Position (2, 1) in a 3x3 affine transformation matrix.
	 * @member ty
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.ty = 0;



// constructor:
	/**
	 * Initialization method. Can also be used to reinitialize the instance.
	 * @method initialize
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @description Save the current Matrix state
	 * @method save
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return null
	 **/
	Matrix2D.prototype.save = function()
	{
		this._stack.push(this.a,this.b,this.c,this.d,this.tx,this.ty);
	};

	/**
	 * Restore the las saved matrix state
	 * @method save
	 * @memberOf tomhawk_ns.Matrix2D.prototype
	 * @return null
	 **/
	Matrix2D.prototype.restore = function()
	{
		this.ty = this._stack.pop();
		this.tx = this._stack.pop();
		this.d = this._stack.pop();
		this.c = this._stack.pop();
		this.b = this._stack.pop();
		this.a = this._stack.pop();
	};

	
	/**
	 * Appends the specified matrix properties with this matrix. All parameters are required.
	 * @method append
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	
	Matrix2D.prototype.combine = function(matrices)
	{
		//identity
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		
		
		//multiple append
		var i 	= 0;
		var max = matrices.length;
		var mat = null;
		var a1 	= this.a;
		var b1 	= this.b;
		var c1 	= this.c;
		var d1 	= this.d;
		
		for( i = 0; i < max; i++ )
		{
			mat 	= matrices[i];
			this.a  = mat.a  * a1 + mat.b  * c1;
			this.b  = mat.a  * b1 + mat.b  * d1;
			this.c  = mat.c  * a1 + mat.d  * c1;
			this.d  = mat.c  * b1 + mat.d  * d1;
			this.tx = mat.tx * a1 + mat.ty * c1 + this.tx;
			this.ty = mat.tx * b1 + mat.ty * d1 + this.ty;
			
			a1 		= this.a;
			b1 		= this.b;
			c1 		= this.c;
			d1 		= this.d;
		}
		
		return this;
	};

	/**
	 * Prepends the specified matrix with this matrix.
	 * @method prependMatrix
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
		
		
		var r = ( rotation % 360) >> 0;
		var cos = tomahawk_ns.Matrix2D._fastCos[r];
		var sin = tomahawk_ns.Matrix2D._fastSin[r];
		
		//if (rotation%360) {
			//var r = rotation*Matrix2D.DEG_TO_RAD;
			//var cos = Math.cos(r);
			//var sin = Math.sin(r);
		//} else {
			//cos = 1;
			//sin = 0;
		//}

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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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

		var r = ( rotation % 360) >> 0;
		var cos = tomahawk_ns.Matrix2D._fastCos[r];
		var sin = tomahawk_ns.Matrix2D._fastSin[r];
		//if (rotation%360) {
			//var r = rotation*Matrix2D.DEG_TO_RAD;
			//var cos = Math.cos(r);
			//var sin = Math.sin(r);
		//} else {
			//cos = 1;
			//sin = 0;
		//}

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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} angle The angle in radians. To use degrees, multiply by <code>Math.PI/180</code>.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.rotate = function(angle) {
		//var cos = Math.cos(angle);
		//var sin = Math.sin(angle);
		
		var r = ( angle % 360) >> 0;
		var cos = tomahawk_ns.Matrix2D._fastCos[r];
		var sin = tomahawk_ns.Matrix2D._fastSin[r];

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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {Boolean}
	 **/
	Matrix2D.prototype.isIdentity = function() {
		return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
	};

	/**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point}
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
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
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.copy = function(matrix) {
		return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	};

	/**
	 * Returns a clone of the Matrix2D instance.
	 * @method clone
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 **/
	Matrix2D.prototype.clone = function() {
		return (new Matrix2D()).copy(this);
	};

	
	/**
	* @method toFlatObject
	* @memberOf tomahawk_ns.Matrix2D.prototype
	* @description Exports the current Matrix2D to a flat Object ( no methods, just public properties )
	* @returns {Object} a flat Object
	**/
	
	Matrix2D.prototype.toFlatObject = function()
	{
		var obj = new Object();
		obj.a 	= this.a;
		obj.b 	= this.b;
		obj.c 	= this.c;
		obj.d 	= this.d;
		obj.tx 	= this.tx;
		obj.ty 	= this.ty;
		
		return obj;
	};
	
	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {String} a string representation of the instance.
	 **/
	Matrix2D.prototype.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	};

	
	
	
	
	Matrix2D._fastCos = [];
	Matrix2D._fastSin = [];
	
	Matrix2D._fastMath = function()
	{
		var i = 360;
		var r = 0;
		while( --i > -1 )
		{
			r = ( i % 360 ) >> 0;
			Matrix2D._fastCos[r] = Math.cos(r*Matrix2D.DEG_TO_RAD);
			Matrix2D._fastSin[r] = Math.sin(r*Matrix2D.DEG_TO_RAD);
		}
	};
	
	
	
	Matrix2D.prototype._stack = null;
	
	// static public properties:
	/**
	 * An identity matrix, representing a null transformation.
	 * @memberOf tomahawk_ns.Matrix2D
	 * @property identity
	 * @static
	 * @type Matrix2D
	 * @memberOf tomhawk_ns.Matrix2D
	 * @readonly
	 **/
	Matrix2D.identity = null;// set at bottom of class definition.

	/**
	 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
	 * @memberOf tomahawk_ns.Matrix2D
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	Matrix2D.DEG_TO_RAD = Math.PI/180;

	
	Matrix2D._fastMath(); // init fastMath table
	Matrix2D.identity = new Matrix2D();
	
	tomahawk_ns.Matrix2D = Matrix2D;
	
})();




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
 * @class Matrix4x4
 * @description A Basic implementation of a Matrix4x4 
 * @memberOf tomahawk_ns
 * @constructor
 **/
function Matrix4x4()
{
	this.init (1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
}

/**
 * @memberOf tomahawk_ns.Matrix2D.prototype
 * @member {Array} data
 * @description a 16 elements Array that contains the matrix data [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p]
 * @readonly
 **/
Matrix4x4.prototype.data = null;

 /**
 * @method init
 * @description initialize the matrix properties
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} e
 * @param {Number} f
 * @param {Number} g
 * @param {Number} h
 * @param {Number} i
 * @param {Number} j
 * @param {Number} k
 * @param {Number} l
 * @param {Number} m
 * @param {Number} n
 * @param {Number} o
 * @param {Number} p
 **/
Matrix4x4.prototype.init = function( 		a, b, c, d, 
											e, f, g, h, 
											i, j, k, l, 
											m, n, o, p ){
											
										
		
	var container = new Array();

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

/**
* @method clone
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description return a clone of the matrix
* @returns {Matrix4x4}
**/
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

/**
* @method translate
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description translate the matrix by tx, ty, and tz
* @param {Number} tx
* @param {Number} ty
* @param {Number} tz
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.translate = function( tx, ty, tz )
{
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[3] = tx;
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[7] = ty;
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[11] = tz;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX );
	return this;
};

/**
* @method scale
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description scale the matrix by sx, sy, and sz
* @param {Number} sx
* @param {Number} sy
* @param {Number} sz
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.scale = function( sx, sy, sz )
{	
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[0] = sx;
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[5] = sy;
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[10] = sz;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._SCALE_MATRIX );
	return this;
};

/**
* @method rotate
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by rx, ry, and rz
* @param {Number} rx
* @param {Number} ry
* @param {Number} rz
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
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

/**
* @method rotateX
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by p_rotation degrees on the x axis
* @param {Number} p_rotation
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
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

/**
* @method rotateY
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by p_rotation degrees on the y axis
* @param {Number} p_rotation
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
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

/**
* @method rotateZ
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by p_rotation degrees on the z axis
* @param {Number} p_rotation
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
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

/**
* @method multiplyByNumber
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description multiply the current matrix by p_number
* @param {Number} p_number
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
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


/**
* @method appendTransform
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description append transformation on the current matrix around the point defined by pivotX, pivotY and pivotZ
* @param {Number} p_number
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @param {Number} scaleX
* @param {Number} scaleY
* @param {Number} scaleZ
* @param {Number} rotationX
* @param {Number} rotationY
* @param {Number} rotationZ
* @param {Number} pivotX
* @param {Number} pivotY
* @param {Number} pivotZ
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
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

/**
 * Prepends the specified matrix with this matrix.
 * @method prependMatrix
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {Matrix4x4} matrix
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
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

/**
 * Appends the specified matrix with this matrix.
 * @method appendMatrix
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {Matrix4x4} matrix
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
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

/**
 * get the matrix determinant
 * @method appendMatrix
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Number} the matrix determinant
 **/
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

/**
 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
 * @method identity
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.identity = function()
{
	this.init( 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1 );
	return this;
};

/**
 * Inverts the matrix, causing it to perform the opposite transformation.
 * @method invert
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
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

/**
 * Transposes the matrix
 * @method transpose
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
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

/**
 * Sets the matrix frustum
 * @method frustum
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
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

/**
 * Applies a perspective on the current matrix
 * @method perspective
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.perspective = function(fovy, aspect, near, far) 
{
	var top = near * Math.tan(fovy * Math.PI / 360);
	var right = top * aspect;
	this.frustum(-right, right, -top, top, near, far);
	return this;
};

/**
 * Applies an orthographic projection on the current matrix
 * @method ortho
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
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

/**
 * Returns a string representation of this object.
 * @method toString
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {String} a string representation of the instance.
 **/
Matrix4x4.prototype.str = function() 
{
	var data = this.data;
	return '[\n' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + data[3] + 
			'\n, '+ data[4] + ', ' + data[5] + ', ' + data[6] + ', ' + data[7] + 
			'\n, '+ data[8] + ', ' + data[9] + ', ' + data[10] + ', ' + data[11] + 
			'\n, '+ data[12] + ', ' + data[13] + ', ' + data[14] + ', ' + data[15] + ']';
};


/**
 * Transforms a Point3D according to this matrix.
 * @method transformPoint3D
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {tomahawk_ns.Point3D}
 * @return {tomahawk_ns.Point3D}
 **/
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

/**
 * Converts the "mat" matrix into a Matrix2D
 * @method toMatrix2D
 * @memberOf tomahawk_ns.Matrix4x4
 * @param {tomahawk_ns.Matrix4x4} mat the matrix you want to convert
 * @return {tomahawk_ns.Matrix2D}
 **/
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

/**
 * Converts the "mat2d" matrix into a Matrix4x4
 * @method toMatrix4x4
 * @memberOf tomahawk_ns.Matrix4x4
 * @param {tomahawk_ns.Matrix2D} mat the matrix you want to convert
 * @return {tomahawk_ns.Matrix4x4}
 **/
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
	 * @class Point
	 * @description Represents a basic 2d point
	 * @memberOf tomahawk_ns
	 * @param {Number} x the x value of the point on the x axis
	 * @param {Number} y the y value of the point on the y axis
	 * @constructor
	 **/
	function Point(x,y)
	{
		this.x = x, this.y = y
	}
	
	Tomahawk.registerClass( Point, "Point" );
	
	/**
	* @member {Number} x the x position of  the point
	* @memberOf tomahawk_ns.Point.prototype
	**/
	Point.prototype.x = 0;
	/**
	* @member {Number} y the y position of  the point
	* @memberOf tomahawk_ns.Point.prototype
	**/
	Point.prototype.y = 0;
	
	
	/**
	* @method distanceBetween
	* @description returns a distance between two points
	* @memberOf tomahawk_ns.Point
	* @param {tomahawk_ns.Point} pointA
	* @param {tomahawk_ns.Point} pointB
	* @returns {Number}
	**/
	Point.distanceBetween = function(pointA, pointB)
	{
		var distX = ( pointB.x - pointA.x ) * ( pointB.x - pointA.x );
		var distY = ( pointB.y - pointA.y ) * ( pointB.y - pointA.y );
		var segLength = Math.sqrt( distX + distY );  
		return segLength;
	};
	

	
	tomahawk_ns.Point = Point;
})();



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
	 * @class Point3D
	 * @memberOf tomahawk_ns
	 * @description a basic 3D point
	 * @constructor
	 * @param {Number} x the value on the x axis
	 * @param {Number} y the value on the y axis
	 * @param {Number} z the value on the z axis
	 **/
	function Point3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Point3D, "Point3D" );
	
	/**
	* @member x
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the x axis.
	**/
	Point3D.prototype.x = 0;
	/**
	* @member y
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the y axis.
	**/
	Point3D.prototype.y = 0;
	/**
	* @member z
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the z axis.
	**/
	Point3D.prototype.z = 0;
	
	
	tomahawk_ns.Point3D = Point3D;
})();



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
	 * @class Rectangle
	 * @memberOf tomahawk_ns
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @description Represents a rectangle
	 * @constructor
	 **/
	function Rectangle(x,y,width,height)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
		this.left = this.x;
		this.top = this.y;
		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
	}
	
	Tomahawk.registerClass(Rectangle,"Rectangle");

	/**
	* @member x
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.x 		= 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.y 		= 0;
	
	/**
	* @member width
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description the width of the rectangle, in pixels.
	**/
	Rectangle.prototype.width 	= 0;
	
	/**
	* @member height
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description the height of the rectangle, in pixels.
	**/
	Rectangle.prototype.height 	= 0;
	
	/**
	* @member left
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.left 	= 0;
	
	/**
	* @member right
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The sum of the x and width properties.
	**/
	Rectangle.prototype.right 	= 0;
	
	/**
	* @member top
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the rectangle.
	**/
	
	Rectangle.prototype.top 	= 0;
	/**
	* @member bottom
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The sum of the y and height properties.
	**/
	Rectangle.prototype.bottom 	= 0;

	tomahawk_ns.Rectangle = Rectangle;

})();



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
	 * @class Vector3D
	 * @memberOf tomahawk_ns
	 * @description The Vector3D class represents a point or a location in the three-dimensional space using the Cartesian coordinates x, y, and z. As in a two-dimensional space, the x property represents the horizontal axis and the y property represents the vertical axis. In three-dimensional space, the z property represents depth.
	 * @constructor
	 **/
	function Vector3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Vector3D, "Vector3D" );
	
	/**
	* @member x
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The first element of a Vector3D object, such as the x coordinate of a point in the three-dimensional space.
	**/
	Vector3D.prototype.x = 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The second element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
	**/
	Vector3D.prototype.y = 0;
	
	/**
	* @member z
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The third element of a Vector3D object, such as the z coordinate of a point in three-dimensional space.
	**/
	Vector3D.prototype.z = 0;
	
	/**
	* @member w
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The fourth element of a Vector3D object (in addition to the x, y, and z properties) can hold data such as the angle of rotation.
	**/
	Vector3D.prototype.w = 0;
	
	/**
	* @method crossProduct
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @param {tomahawk_ns.Vector3D} vector A second Vector3D object.
	* @returns {tomahawk_ns.Vector3D} This Vector3D. Useful for chaining method calls.
	* @description Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another Vector3D object.
	**/
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
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{

	function WebAudioSound()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		this._init();
	}
	
	Tomahawk.registerClass( WebAudioSound, "WebAudioSound" );
	Tomahawk.extend( "WebAudioSound", "EventDispatcher" );
	
	WebAudioSound.isSupported = function()
	{
		var contextClass = window.AudioContext || window.webkitAudioContext; 
		return ( contextClass != undefined );
	};
	
	WebAudioSound.getContext = function()
	{
		var contextClass = window.AudioContext || window.webkitAudioContext; 
		tomahawk_ns.WebAudioSound._context = tomahawk_ns.WebAudioSound._context || new contextClass();
		return tomahawk_ns.WebAudioSound._context;
	};
	
	WebAudioSound._context = null;

	WebAudioSound.prototype._buffer = null;
	WebAudioSound.prototype._context = null;
	WebAudioSound.prototype._source = null;
	WebAudioSound.prototype._gainNode = null;
	WebAudioSound.prototype._playing = false;
	WebAudioSound.prototype._startContextTime = 0;
	WebAudioSound.prototype._currentTime = 0;
	
	
	WebAudioSound.prototype._init = function()
	{
		this._context = tomahawk_ns.WebAudioSound.getContext();
	};
	
	WebAudioSound.prototype._decodeComplete = function(buffer)
	{
		this._buffer = buffer;
		this.dispatchEvent( new tomahawk_ns.Event( tomahawk_ns.Event.COMPLETE, true, true ) );
	};	
	
	WebAudioSound.prototype._decodeError = function()
	{
		this.dispatchEvent( new tomahawk_ns.Event( tomahawk_ns.Event.IO_ERROR, true, true ) );
	};
	
	WebAudioSound.prototype.load = function(url)
	{
		var soundBuffer = null;
		var request = new XMLHttpRequest();
		var context = this._context;
		var onSuccess =  this._decodeComplete.bind(this);
		var onError =   this._decodeError.bind(this);
		
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function()
		{
			context.decodeAudioData(request.response, onSuccess,onError);
		}
		
		request.send();
	};
	
	WebAudioSound.prototype.play = function(time)
	{
		time = ( isNaN(time) ) ? 0 : parseFloat(time);
		
		this.stop();
		
		if( this._playing == true )	
		{
			this.stop();
		}
			
		this._gainNode = this._context.createGain();
		this._source = this._context.createBufferSource(); 		// creates a sound source
		this._source.buffer = this._buffer;                    // tell the source which sound to play
		this._source.connect(this._gainNode);
		this._gainNode.connect(this._context.destination);
		
		if( !this._source.start )
			this._source.start = this._source.noteOn;
			
		this._source.start(0,time);
		this._playing = true;
		this._startContextTime = this._context.currentTime;
	};
	
	WebAudioSound.prototype.resume = function()
	{
		if( this._playing == true )	
			return;
			
		this.play(this._currentTime);
	};	
	
	WebAudioSound.prototype.pause = function()
	{
		if( this._playing == false )	
			return;
			
		this._source.stop();
		this._currentTime = this.getElapsedTime();
		this._playing = false;
	};
	
	WebAudioSound.prototype.stop = function()
	{
		if( this._playing == false )	
			return;
			
		this._source.stop();
		this._playing = false;
		this._currentTime = 0;
	};
	
	WebAudioSound.prototype.seek = function(time)
	{
		this.play(time);
	};
	
	WebAudioSound.prototype.getElapsedTime = function()
	{
		if( this._playing == true )
		{
			return this._currentTime + ( this._context.currentTime - this._startContextTime );
		}
		else
		{
			return this._currentTime;
		}
	};
	
	WebAudioSound.prototype.getDuration = function()
	{
		return this._buffer.duration;
	};
	
	WebAudioSound.prototype.isPlaying = function()
	{
		return this._playing;
	};
	
	WebAudioSound.prototype.setVolume = function(value)
	{
		if( this._playing == false )	
			return;
			
		this._gainNode.gain.value = value;
	};
	
	tomahawk_ns.WebAudioSound = WebAudioSound;
	
	
})();



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
 * @class AssetsLoader
 * @memberOf tomahawk_ns
 * @description The AssetsLoader class is a basic Image mass loader.
 * @constructor
 * @augments tomahawk_ns.EventDispatcher
 **/
function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );
Tomahawk.extend("AssetsLoader", "EventDispatcher" );

// singleton
AssetsLoader._instance = null;

/**
* @description Returns a unique instance of AssetsLoader, singleton implementation.
* @method getInstance
* @memberOf tomahawk_ns.AssetsLoader
* @returns {tomahawk_ns.AssetsLoader} returns a number
**/
AssetsLoader.getInstance = function()
{
	if( tomahawk_ns.AssetsLoader._instance == null )
		tomahawk_ns.AssetsLoader._instance = new tomahawk_ns.AssetsLoader();
		
	return tomahawk_ns.AssetsLoader._instance;
};

AssetsLoader.prototype.onComplete = null;
AssetsLoader.prototype._loadingList = null;
AssetsLoader.prototype._data = null;
AssetsLoader.prototype._numFiles = 0;

/**
* @description Returns a key indexed object which contains the loaded data.
* @method getData
* @memberOf tomahawk_ns.AssetsLoader.prototype
* @returns {Object} a key indexed object
**/
AssetsLoader.prototype.getData = function()
{
	return this._data;
};

/**
* @description Cleans the internal loaded data object, call it before another loading task in order to save memory.
* @method clean
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.clean = function()
{
	this._loadingList = new Array();
	this._data = new Object();
};

/**
* @description Adds an image to the loading list, with the url specified by the "fileURL" parameter and an alias specified by the "fileAlias" parameter.
* @method load
* @param {String] fileURL the url of the image.
* @param {String] fileAlias The alias of the image used as a key within the object returned by the "getData()" method.
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this._data = new Object();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
	this._numFiles++;
};

/**
* @description Aborts the loading process.
* @method abort
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.abort = function()
{
	this._loadingList = new Array();
};

/**
* @description Starts the loading process.
* @method load
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.load = function()
{
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete != null )
		{
			this.onComplete();
		}
		
		this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.COMPLETE, true, true) );
		this._numFiles = 0;
	}
	else
	{
		var obj = this._loadingList.shift();
		var scope = this;
		var image = new Image();
		
		image.onerror = function()
		{
			scope._errorHandler();
		};
		
		image.onload = function()
		{
			scope._progressHandler(image, obj.alias);
		};
		
		image.src = obj.url;
	}
};

/**
* @description Returns the loading progression ( between 0.0 and 1.0 )
* @method getProgression
* @memberOf tomahawk_ns.AssetsLoader.prototype
* @returns {Number}
**/
AssetsLoader.prototype.getProgression = function()
{
	var progression = ( this._numFiles - this._loadingList.length ) / this._numFiles;
	return progression;
};

AssetsLoader.prototype._progressHandler = function(image,alias)
{
	this._data[alias] = image;
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
	this.load();
};

AssetsLoader.prototype._errorHandler = function()
{
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.IO_ERROR, true, true) );
	this.load();
};

tomahawk_ns.AssetsLoader = AssetsLoader;
})();




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
	 * @class AssetsManager
	 * @memberOf tomahawk_ns
	 * @description The AssetsManager class is used to stores and restitutes assets objects like Textures, TextureAtlases, Images.
	 * @constructor
	 **/
	function AssetsManager()
	{
		this._images 	= new Object();
		this._atlases 	= new Object();
		this._data 		= new Object();
		this._textures 	= new Object();
	};

	Tomahawk.registerClass( AssetsManager, "AssetsManager" );

	// singleton
	AssetsManager._instance 					= null;
	
	/**
	* @description Returns a unique instance of AssetsManager, singleton implementation.
	* @method getInstance
	* @memberOf tomahawk_ns.AssetsManager
	* @returns {tomahawk_ns.AssetsManager}
	**/
	AssetsManager.getInstance 					= function()
	{
		if( tomahawk_ns.AssetsManager._instance == null )
			tomahawk_ns.AssetsManager._instance = new tomahawk_ns.AssetsManager();
			
		return tomahawk_ns.AssetsManager._instance;
	};

	AssetsManager.prototype._images 			= null;
	AssetsManager.prototype._atlases 			= null;
	AssetsManager.prototype._textures 			= null;
	AssetsManager.prototype._data 				= null;


	// images
	/**
	* @description Returns a key indexed objects with all the HTMLImageElement stored within the manager
	* @method getImages
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} a key indexed objects
	**/
	AssetsManager.prototype.getImages 			= function()
	{
		return this._images;
	};
	
	/**
	* @description returns an HTMLImageElement that matches with the "alias" parameter
	* @method getImageByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {DOMImageElement} an HTMLImageElement object
	**/
	AssetsManager.prototype.getImageByAlias 	= function(alias)
	{
		if( this._images[alias] )
			return this._images[alias];
			
		return null;
	};

	/**
	* @description Adds an HTMLImageElement object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getImageByAlias" method.
	* @method addImage
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {HTMLImageElement} image an HTMLImageElement object
	* @param {String} alias
	**/
	AssetsManager.prototype.addImage 			= function(image, alias)
	{
		this._images[alias] = image;
	};

	//atlases
	
	/**
	* @description Adds a TextureAtlas object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getAtlasByAlias" method.
	* @method addAtlas
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {tomahawk_ns.TextureAtlas} atlas a TextureAtlas object
	* @param {String} alias
	**/
	AssetsManager.prototype.addAtlas 			= function(atlas, alias)
	{
		this._atlases[alias] = atlas;
	};
	
	/**
	* @method getAtlases
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the atlases stored within the manager
	**/
	AssetsManager.prototype.getAtlases 			= function()
	{
		return this._atlases;
	};
	
	/**
	* @description returns an TextureAtlas instance that matches with the "alias" parameter
	* @method getAtlasByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {tomahawk_ns.TextureAtlas} a TextureAtlas object
	**/
	AssetsManager.prototype.getAtlasByAlias 	= function(alias)
	{
		if( this._atlases[alias] )
			return this._atlases[alias];
			
		return null;
	};

	//textures
	/**
	* @description Adds a Texture object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getTextureByAlias" method.
	* @method addAtlas
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {tomahawk_ns.Texture} texture a Texture object
	* @param {String} alias
	**/
	AssetsManager.prototype.addTexture 			= function(texture, alias)
	{
		this._textures[alias] = texture;
	};

	/**
	* @method getTextures
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the textures stored within the manager
	**/
	AssetsManager.prototype.getTextures 		= function()
	{
		return this._textures;
	};
	
	/**
	* @description returns an Texture instance that matches with the "alias" parameter
	* @method getTextureByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {tomahawk_ns.Texture} a Texture object
	**/
	AssetsManager.prototype.getTextureByAlias 	= function(alias)
	{
		if( this._textures[alias] )
			return this._textures[alias];
			
		return null;
	};

	//data objects
	/**
	* @description Add a data object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getDataObjectByAlias" method.
	* @method addDataObject
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {Object} a data Object
	* @param {String} alias
	**/
	AssetsManager.prototype.addDataObject 		= function(data, alias)
	{
		this._data[alias] = data;
	};
	
	/**
	* @description returns a data Object instance that matches with the "alias" parameter
	* @method getDataObjectByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} a data object
	**/
	AssetsManager.prototype.getDataObjectByAlias = function(alias)
	{
		if( this._data[alias] )
			return this._data[alias];
			
		return null;
	};
	
	/**
	* @method getDataObjects
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the data objects stored within the manager
	**/
	AssetsManager.prototype.getDataObjects 		= function()
	{
		return this._data;
	};

	tomahawk_ns.AssetsManager = AssetsManager;
})();





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
 * @class DataLoader
 * @memberOf tomahawk_ns
 * @description The DataLoader class is a basic data (text,json,xml,binary) mass loader.
 * @constructor
 * @augments tomahawk_ns.EventDispatcher
 **/
function DataLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( DataLoader, "DataLoader" );
Tomahawk.extend("DataLoader", "EventDispatcher" );

// singleton
DataLoader._instance 				= null;

/**
* @description Returns a unique instance of DataLoader, singleton implementation.
* @method getInstance
* @memberOf tomahawk_ns.DataLoader
* @returns {tomahawk_ns.DataLoader} returns a number
**/
DataLoader.getInstance 				= function()
{
	if( tomahawk_ns.DataLoader._instance == null )
		tomahawk_ns.DataLoader._instance = new tomahawk_ns.DataLoader();
		
	return tomahawk_ns.DataLoader._instance;
};

DataLoader.prototype.onComplete 	= null;
DataLoader.prototype._loadingList 	= null;
DataLoader.prototype._data 			= null;
DataLoader.prototype._numFiles 		= 0;

/**
* @description Returns a key indexed object which contains the loaded data.
* @method getData
* @memberOf tomahawk_ns.DataLoader.prototype
* @returns {Object} a key indexed object
**/
DataLoader.prototype.getData = function()
{
	return this._data;
};

/**
* @description Cleans the internal loaded data object, call it before another loading task in order to save memory.
* @method clean
* @memberOf tomahawk_ns.DataLoader.prototype
**/
DataLoader.prototype.clean = function()
{
	this._data = new Object();
};

/**
* @description Add a file to the loading list, with the url specified by the "fileURL" parameter and an alias specified by the "fileAlias" parameter.
* @method load
* @param {String] fileURL the distant file url.
* @param {String] fileAlias The alias of the url used as a key within the object returned by the "getData()" method.
* @param {String] mode the request mode [GET or POST]
* @param {Object] params  the params sent to the distant url 
* @memberOf tomahawk_ns.DataLoader.prototype
**/
DataLoader.prototype.addFile = function(fileURL, fileAlias, mode,params)
{
	// on réinitialise les data
	this.clean();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias,params:params,mode:mode});
	this._numFiles++;
};

/**
* @description Starts the loading process.
* @method load
* @memberOf tomahawk_ns.DataLoader.prototype
**/
DataLoader.prototype.load = function()
{
	var scope 	= this;
	var obj 	= null;
	var http 	= null;
	var data 	= null;
	var alias	= null;
	var props	= null;
	
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete != null )
		{
			this.onComplete();
		}
		
		this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.COMPLETE, true, true) );
		this._numFiles = 0;
	}
	else
	{
		obj 	= this._loadingList.shift();
		http 	= new XMLHttpRequest();
		data 	= null;
		alias 	= obj.alias
		props	= new Array();
		
		
		if( obj.params != undefined && obj.params != null )
		{
			for( prop in obj.params )
			{
				props.push( prop+"="+obj.params[prop] );
			}
			
			data = props.join("&");
		}
		
		if(obj.mode == "POST")
		{
			http.open( "POST" , obj.url, true);
		}
		else
		{
			http.open( "GET" , obj.url+"?"+data, true);
		}

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.onreadystatechange = function() 
		{
			if(http.readyState == 4 && http.status == 200) 
			{
				scope._progressHandler(http.responseText, alias);
			}
		}
		
		if(obj.mode == "POST")
		{
			http.send(data);
		}
		else
		{
			http.send(null);
		}
	}
};

/**
* @description Returns the loading progression ( between 0.0 and 1.0 )
* @method getProgression
* @memberOf tomahawk_ns.DataLoader.prototype
* @returns {Number}
**/
DataLoader.prototype.getProgression = function()
{
	var progression = ( this._numFiles - this._loadingList.length ) / this._numFiles;
	return progression;
};

DataLoader.prototype._progressHandler = function(data,alias)
{
	this._data[alias] = data;
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
	this.load();
};

DataLoader.prototype._errorHandler = function()
{
	this.load();
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.IO_ERROR, true, true) );
};

tomahawk_ns.DataLoader = DataLoader;
})();




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
	 * @class Texture
	 * @memberOf tomahawk_ns
	 * @param {Object} data The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement.
	 * @param {Array} rect The portion of the rendering data used for the rendering. Example: [0,0,10,10].
	 * @param {String} name The texture's name.
	 * @description The Texture class represents a 2-dimensional texture which will be used in a Bitmap instance. Defines a 2D texture for use during rendering.
	 * @constructor
	 **/
	function Texture(data,rect,name)
	{
		this._init(data,rect,name);
		this.id = Tomahawk._UNIQUE_OBJECT_ID++;
	}

	Tomahawk.registerClass( Texture, "Texture" );

	/**
	* @description The texture unique id
	* @member id
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Number}
	* @default null
	**/
	Texture.prototype.id = 0;
	
	/**
	* @description The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement
	* @member data
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Object}
	* @default null
	**/
	Texture.prototype.data = null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {String}
	* @description The name of the texture
	* @default null
	**/
	Texture.prototype.name = null;
	
	/**
	* @member rect
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Array}
	* @description An array representating the portion of the rendering data used for the rendering. Example: [0,0,10,10] the top-left 10x10 pixels square of the data will be rendered but not the rest.
	**/
	Texture.prototype.rect = null;
	
	Texture.prototype._init = function(data,rect,name)
	{
		this.data = data || null;
		this.rect = rect || null;
		this.name = name || null;
	};

	tomahawk_ns.Texture = Texture;

})();








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
	 * @class TextureAtlas
	 * @memberOf tomahawk_ns
	 * @description A texture atlas is a collection of many smaller textures in one big image. This class is used to access and create textures from such an atlas.
	 * @constructor
	 **/
	function TextureAtlas()
	{
		this._textures = new Array();
	}

	Tomahawk.registerClass( TextureAtlas, "TextureAtlas" );

	TextureAtlas.prototype._textures = null;
	
	/**
	* @description The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement
	* @member data
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @type {Object}
	* @default null
	**/
	TextureAtlas.prototype.data = null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {String}
	* @description The name of the texture atlas
	* @default null
	**/
	TextureAtlas.prototype.name = null;

	/**
	* @method createTexture
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} endX
	* @param {Number} endY
	* @description creates a new sub texture from the atlas which will render the region of the atlas data specified
	  by the startX, startY, endX, endY parameters with the name specified by the "name" parameter. The newly created texture is automatically stored within the atlas, it means that you can retrieve it with the "getTextureByName" method.
	**/
	TextureAtlas.prototype.createTexture = function( name, startX, startY, endX, endY )
	{
		var texture = new tomahawk_ns.Texture();
		texture.name = name;
		texture.data = this.data;
		texture.rect = [startX, startY, endX, endY];
		
		this._textures.push(texture);
	};
	
	/**
	* @method getTextureByName
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @returns {tomahawk_ns.Texture}
	* @description Returns the internal sub texture which matches the name specified by the "name" parameter.
	**/
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
	
	/**
	* @method removeTexture
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @description Removes the internal sub texture which matches the name specified by the "name" parameter.
	**/
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
	 * @class Frame
	 * @memberOf tomahawk_ns
	 * @description A Frame Object that represents a frame of a MovieClip Object
	 * @constructor
	 **/
	function Frame(info)
	{
		this.label = null;
		this.children = new Array();
		
		if( info != undefined )
		{
			this.label = info.label || null;
			this.children = info.children || new Array();
		}
	}

	Tomahawk.registerClass( Frame, "Frame" );

	/**
	* @member index
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {Number}
	* @description The frame index 
	**/
	Frame.prototype.index 				= 0;
	
	/**
	* @member label
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {String}
	* @description The frame label 
	**/
	Frame.prototype.label 				= null;
	
	/**
	* @member script
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {Function}
	* @description A block of script which will be executed when the frame will be played.
	**/
	Frame.prototype.script 				= null;
	
	/**
	* @member chilren
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {Array}
	* @description The frame's displaylist.
	**/
	Frame.prototype.children 			= null;
	
	/**
	* @method runScript
	* @memberOf tomahawk_ns.Frame.prototype
	* @param {Object} scope An object that represents the script execution context
	**/
	Frame.prototype.runScript 			= function(scope)
	{
		if( this.script != null )
		{
			this.script.apply(scope);
		}
	};
	
	Frame.prototype.setChildIndex 		= function(child,index)
	{
		this.addChildAt(child,index);
	};
	
	Frame.prototype.addChild 			= function(child)
	{		
		if( this.contains(child) == true )
			return child;
			
		this.children.push(child);	
		return child;
	};
	
	Frame.prototype.contains 			= function(child)
	{
		return (this.children.indexOf(child) > -1);
	};

	Frame.prototype.getChildAt 			= function (index)
	{
		return this.children[index];
	};

	Frame.prototype.getChildByName 		= function(name)
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

	Frame.prototype.addChildAt 			= function(child, index)
	{
		if( this.contains(child) == true )
			return child;
			
		var children = this.children;
		var tab1 = this.children.slice(0,index);
		var tab2 = this.children.slice(index);
		this.children = tab1.concat([child]).concat(tab2);
		
		return child;
	};
	
	Frame.prototype.getChildIndex 		= function(child)
	{
		return this.children.indexOf(child);
	};

	Frame.prototype.removeChildAt 		= function(index)
	{
		var child = this.children[index];
		if( child == undefined )
			return null;
			
		this.children.splice(index,1);
		return child;
	};

	Frame.prototype.removeChildren 		= function()
	{
		while( this.children.length > 0 )
		{
			this.removeChildAt(0);
		}
	};
	
	Frame.prototype.removeChild 		= function(child)
	{
		var index = this.children.indexOf(child);
		var child = null;
		
		if( index > -1 )
		{
			child = this.children[index];
			this.children.splice(index,1);
		}
		
		return child;
	};
	
	Frame.prototype.clone 				= function()
	{
		var frame = new tomahawk_ns.Frame(this.label);
		var max = this.children.length;
		var i = 0; 
		
		frame.index = this.index;
		frame.script = ( this.script == null ) ? null : this.script.bind({});
		
		for( i = 0; i < max; i++ )
		{
			frame.children.push(this.children[i]);
		}
		
		return frame;
	};
	
	Frame.prototype.destroy 			= function()
	{
		this.script = null;
		this.label = null;
		this.index = null;
		this.children = null;
	};

	tomahawk_ns.Frame = Frame;

})();




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
	 * @class Timeline
	 * @memberOf tomahawk_ns
	 * @description A basic Timeline class
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 **/
	function Timeline()
	{
		this._frames = new Array();
		this._tweens = new Array();
		tomahawk_ns.EventDispatcher.apply(this);
	}

	Tomahawk.registerClass( Timeline, "Timeline" );
	Tomahawk.extend( "Timeline", "EventDispatcher" );
	
	Timeline.prototype._currentFrame 		= 0;
	Timeline.prototype._frames 				= null;
	Timeline.prototype._tweens 				= null;
	Timeline.prototype.totalFrames 			= 0;

	Timeline.prototype.setPosition 			= function(index)
	{
		var i = 0;
		var max = this._tweens.length;
		var tween = null;
		var lastTween = this._tweens[this._tweens.length-1];
		var totalFrames = lastTween.delay + lastTween.duration + 1;
		
		totalFrames = ( totalFrames < this._frames.length ) ? this._frames.length : totalFrames;
		
		this.totalFrames = totalFrames;
		this._currentFrame = index;
		
		if( this._currentFrame >= this.totalFrames )
			this._currentFrame = 0;
			
		if( this._currentFrame < 0 )
			this._currentFrame = this.totalFrames;
		
		for( i = 0; i < max; i++ )
		{
			tween = this._tweens[i];
			tween.update(this._currentFrame);
		}
	};
	
	Timeline.prototype.nextFrame 			= function()
	{
		this.setPosition(this._currentFrame + 1);
	};
	
	Timeline.prototype.prevFrame 			= function()
	{
		this.setPosition(this._currentFrame - 1);
	};
	
	Timeline.prototype.goToLabel 			= function(label)
	{
		var frame = this.getFrameByLabel(label);
		
		if( frame != null )
			this.setPosition(frame.index);
	};
	
	Timeline.prototype.getCurrentFrameLabel = function()
	{
		return this.getFrameAt(this._currentFrame).label;
	};
	
	Timeline.prototype.getCurrentFrameIndex = function()
	{
		return this._currentFrame;
	};

	Timeline.prototype.getFrameByLabel 		= function(label)
	{
		var i = this._frames.length;
		while( --i > -1 )
		{
			if( this._frames[i] != undefined && this._frames[i].label == label )
			{
				return this._frames[i];
			}
		}
		
		return null;
	};
	
	Timeline.prototype.addFrameAt 			= function(frame,index)
	{
		frame.index = index;
		this._frames[index] = frame;
	};
	
	Timeline.prototype.addFrame 			= function(frame)
	{
		frame.index = this._frames.length;
		this._frames.push(frame);
	};
	
	Timeline.prototype.getFrameAt 			= function(index)
	{
		var currentIndex = index;
		var frame = null;
		
		while( currentIndex > -1 )
		{
			frame = this._frames[currentIndex];
			
			if( frame != undefined && frame != null )
				return frame;
				
			currentIndex--;
		}
			
		return null;
	};
		
	Timeline.prototype.removeFrameAt 		= function(index)
	{
		var frame = this.getFrameAt(index);
		
		if( frame == null )
			return;
			
		if( index > -1 )
		{
			frame.destroy();
			this._frames[index] = null;
		}
	};
	
	Timeline.prototype.getTweens 			= function()
	{
		return this._tweens;
	};
	
	Timeline.prototype.addTween 			= function(tween)
	{
		this._tweens.push( tween );
		this._tweens.sort(this._sortTweens);
	};
	
	Timeline.prototype.removeTween 			= function(tween)
	{
		var index = this._tweens.indexOf(tween);
		if( index > -1 )
		{
			this._tweens.splice(index,1);
		}
		this._tweens.sort(this._sortTweens);
	};
	
	Timeline.prototype.destroy 				= function()
	{
		this.stop();
		tomahawk_ns.Sprite.prototype.destroy.apply(this);
	};

	
	Timeline.prototype._sortTweens 			= function(a,b)
	{
		if( a.delay == b.delay )
		{
			return ( a.duration < b.duration ) ? -1 : 1;
		}
		else
		{
			return ( a.delay < b.delay ) ? -1 : 1;
		}
	};
	
	
	tomahawk_ns.Timeline = Timeline;

})();




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
	 * @class Tween
	 * @memberOf tomahawk_ns
	 * @description a basic Tween Object used to update object properties with custom easing functions
	 * @constructor
	**/
	function Tween(target,duration,from,to,easing,delay)
	{
		this.target = target || null;
		this.delay = delay || 0;
		this.duration = duration || 0;
		this.easing = easing || tomahaw_ns.Linear.easeIn;
		this.from = from || {};
		this.to = to || {};
	}
	
	Tomahawk.registerClass(Tween,"Tween");
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {String}
	* @description The name of the Tween instance.
	**/
	Tween.prototype.name 			= null;
	
	/**
	* @member target
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Object}
	* @description The target object on which the tween is applied.
	**/
	Tween.prototype.target 			= null;
	
	/**
	* @member delay
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Number}
	* @description The amount of time before the tween effect is applied.
	**/
	Tween.prototype.delay 			= 0;
	
	/**
	* @member from
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Object}
	* @description Defines the starting values of the target properties.
	**/
	Tween.prototype.from 			= null;
	
	/**
	* @member to
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Object}
	* @description Defines the ending values of the target properties.
	**/
	Tween.prototype.to 				= null;
	
	/**
	* @member duration
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Number}
	* @description The duration of the tween ( in frames or ms ).
	**/
	Tween.prototype.duration 		= 0;
	
	/**
	* @member easing
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Function}
	* @description The easing function used to interpolate the values during the tween process.
	**/
	Tween.prototype.easing 			= null;
	
	/**
	* @member measureUnit
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {String}
	* @description The unit measure used for time and duration, must be "frame" or "ms"
	* @default "frame"
	**/
	Tween.prototype.measureUnit 	= "frame";
	
	/**
	* @method update
	* @description Updates the target values according to the time ( in frame or ms ) passed in parameter.
	* @memberOf tomahawk_ns.Tween.prototype
	* @param {Number} time The current tween time ( in frame or ms )
	**/
	Tween.prototype.update 			= function(time)
	{
		var prop = null;
		var ratio = 1;
		
		if( this.target == null || time < this.delay )
		{
			return;
		}
			
		// instant tween
		if( this.duration == 0 || time > this.delay + this.duration )
		{
			for( prop in this.to )
			{
				this.target[prop] = this.to[prop];
			}
		}
		else
		{
			ratio = this.easing(time-this.delay,0,1,this.duration);
			for( prop in this.from )
			{
				this.target[prop] = this.from[prop] + ( this.to[prop] - this.from[prop] ) * ratio;
			}
		}
	};
	
	/**
	* @method destroy
	* @description Stops and kill the tween properly.
	* @memberOf tomahawk_ns.Tween.prototype
	**/
	Tween.prototype.destroy = function()
	{
		this.name 		= null;
		this.target 	= null;
		this.delay 		= null;
		this.from 		= null;
		this.to 		= null;
		this.duration 	= null;
		this.easing 	= null;
	};
	
	tomahawk_ns.Tween = Tween;

})();
	

	
	





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
	 * @class Back
	 * @memberOf tomahawk_ns
	 * @description a back easing class effect
	 * @constructor
	 **/
	function Back() {}

	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Back
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Back.easeIn = function ( p_t , p_b, p_c , p_d )
	{
		return p_c * ( p_t /= p_d ) * p_t * ( 2.70158 * p_t - 1.70158 ) + p_b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Back
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Back.easeOut = function (p_t, p_b, p_c, p_d)
	{
		return p_c * ( ( p_t = p_t / p_d - 1) * p_t * ( 2.70158 * p_t + 1.70158) + 1 ) + p_b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Back
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Back.easeInOut = function( p_t, p_b, p_c, p_d ) 
	{
		if ( ( p_t /= p_d * 0.5 ) < 1 )
		{
			return p_c * 0.5 * ( p_t * p_t * ( ( 1.70158 * 1.525 + 1 ) * p_t - 1.70158 ) ) + p_b;
		}
		else
		{
			return p_c / 2 * ( ( ( p_t -= 2 ) * p_t * ( 1.70158 * 1.525 + 1 ) * p_t + 1.70158 ) + 2 ) + p_b;
		}
		
	};

	tomahawk_ns.Back = Back;

})();



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
	 * @class Bounce
	 * @memberOf tomahawk_ns
	 * @description a bounce easing class effect
	 * @constructor
	 **/
	function Bounce() {}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Bounce
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Bounce.easeIn = function ( t , b, c , d )
	{
		return c - easeOut(d-t, 0, c, d) + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Bounce
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Bounce.easeOut = function (t, b, c, d)
	{
		if ((t/=d) < (1/2.75)) 
		{
			return c*(7.5625*t*t) + b;
		} 
		else if (t < (2/2.75)) 
		{
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} 
		else if (t < (2.5/2.75)) 
		{
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} 
		else 
		{
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Bounce
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Bounce.easeInOut = function( t, b, c, d ) 
	{
		if (t < d*0.5) 
		{
			return Bounce.easeIn (t*2, 0, c, d) * .5 + b;
		}
		else 
		{
			return Bounce.easeOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
		}	
	};

	tomahawk_ns.Bounce = Bounce;

})();



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
	 * @class Circ
	 * @memberOf tomahawk_ns
	 * @description a circ easing class effect
	 * @constructor
	 **/
	function Circ(){}

	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Circ
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Circ.easeIn = function(t, b, c, d) 
	{
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Circ
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Circ.easeOut = function(t, b, c, d) 
	{
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Circ
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Circ.easeInOut = function(t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return -c*0.5 * (Math.sqrt(1 - t*t) - 1) + b;
		return c*0.5 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	};

	tomahawk_ns.Circ = Circ;

})();



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
	 * @class Cubic
	 * @memberOf tomahawk_ns
	 * @description a cubic easing class effect
	 * @constructor
	 **/
	function Cubic() {}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Cubic
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Cubic.easeIn = function(t, b, c, d) 
	{
		return c*(t/=d)*t*t + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Cubic
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Cubic.easeOut = function(t, b, c, d) 
	{
		return c*((t=t/d-1)*t*t + 1) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Cubic
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Cubic.easeInOut = function(t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t*t + b;
		return c*0.5*((t-=2)*t*t + 2) + b;
	};


	tomahawk_ns.Cubic = Cubic;

})();



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
	 * @class Elastic
	 * @memberOf tomahawk_ns
	 * @description an elastic easing class effect
	 * @constructor
	 **/
	function Elastic() {}

	Elastic._2PI = Math.PI * 2;
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Elastic
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @param {Number} a
	* @param {Number} p
	* @returns {Number} returns a number
	**/
	Elastic.easeIn = function(t, b, c, d, a, p) 
	{

		var s;
		a = a || 0;
		p = p || 0;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
		else s = p/Elastic._2PI * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Elastic._2PI/p )) + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Elastic
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @param {Number} a
	* @param {Number} p
	* @returns {Number} returns a number
	**/
	Elastic.easeOut  = function(t, b, c, d, a, p ) 
	{
		var s;
		a = a || 0;
		p = p || 0;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
		else s = p/Elastic._2PI * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*Elastic._2PI/p ) + c + b);
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Elastic
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @param {Number} a
	* @param {Number} p
	* @returns {Number} returns a number
	**/
	Elastic.easeInOut = function (t, b, c, d, a, p) 
	{
		var s;
		a = a || 0;
		p = p || 0;
		if (t==0) return b;  if ((t/=d*0.5)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
		else s = p/Elastic._2PI * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Elastic._2PI/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*Elastic._2PI/p )*.5 + c + b;
	};
	
	tomahawk_ns.Elastic = Elastic;

})();



﻿/*
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
	 * @class Expo
	 * @memberOf tomahawk_ns
	 * @description an expo easing class effect
	 * @constructor
	 **/
	function Expo (){}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Expo
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Expo.easeIn = function(t, b, c, d) 
	{
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Expo
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Expo.easeOut = function(t, b, c, d) 
	{
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Expo
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Expo.easeInOut = function(t, b, c, d) 
	{
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d*0.5) < 1) return c*0.5 * Math.pow(2, 10 * (t - 1)) + b;
		return c*0.5 * (-Math.pow(2, -10 * --t) + 2) + b;
	};
	
	tomahawk_ns.Expo = Expo;

})();



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
	 * @class Linear
	 * @memberOf tomahawk_ns
	 * @description a linear class effect
	 * @constructor
	 **/
	function Linear() {}

	Linear.power = 0;
	
	/**
	* @method easeNone
	* @memberOf tomahawk_ns.Linear
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Linear.easeNone = function(t, b, c, d)
	{
		return c*t/d + b;
	};
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Linear
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Linear.easeIn = function(t, b, c, d)
	{
		return c*t/d + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Linear
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Linear.easeOut = function(t, b, c, d)
	{
		return c*t/d + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Linear
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Linear.easeInOut = function(t, b, c, d)
	{
		return c*t/d + b;
	};
	
	tomahawk_ns.Linear = Linear;

})();



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
	 * @class Quad
	 * @memberOf tomahawk_ns
	 * @description a Quad class effect
	 * @constructor
	 **/
	function Quad(){}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Quad
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quad.easeIn = function(t, b, c, d) 
	{
		return c*(t/=d)*t + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Quad
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quad.easeOut = function(t, b, c, d) 
	{
		return -c *(t/=d)*(t-2) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Quad
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quad.easeInOut = function( t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t + b;
		return -c*0.5 * ((--t)*(t-2) - 1) + b;
	};

	tomahawk_ns.Quad = Quad;

})();



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
	 * @class Quart
	 * @memberOf tomahawk_ns
	 * @description a Quart class effect
	 * @constructor
	**/
	function Quart(){}
		
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Quart
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quart.easeIn = function(t, b, c, d) 
	{
		return c*(t/=d)*t*t*t + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Quart
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quart.easeOut = function(t, b, c, d) 
	{
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Quart
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quart.easeInOut = function(t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t*t*t + b;
		return -c*0.5 * ((t-=2)*t*t*t - 2) + b;
	};
	
	tomahawk_ns.Quart = Quart;

})();



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
	 * @class Quint
	 * @memberOf tomahawk_ns
	 * @description a Quint class effect
	 * @constructor
	 **/
	function Quint() {}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Quint
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quint.easeIn  = function(t, b, c, d) 
	{
		return c*(t/=d)*t*t*t*t + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Quint
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quint.easeOut  = function(t, b, c, d) 
	{
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Quint
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Quint.easeInOut  = function(t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t*t*t*t + b;
		return c*0.5*((t-=2)*t*t*t*t + 2) + b;
	};
	tomahawk_ns.Quint = Quint;

})();



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
	 * @class Sine
	 * @memberOf tomahawk_ns
	 * @description a Sine class effect
	 * @constructor
	**/
	function Sine(){}

	Sine._HALF_PI = Math.PI * 0.5;
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Sine
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Sine.easeIn  = function(t, b, c, d) 
	{
		return -c * Math.cos(t/d * _HALF_PI) + c + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Sine
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Sine.easeOut  = function(t, b, c, d) 
	{
		return c * Math.sin(t/d * _HALF_PI) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Sine
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Sine.easeInOut  = function(t, b, c, d) 
	{
		return -c*0.5 * (Math.cos(Math.PI*t/d) - 1) + b;
	};
	
	tomahawk_ns.Sine = Sine;

})();



﻿/*
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
	 * @class Strong
	 * @memberOf tomahawk_ns
	 * @description a Strong class effect
	 * @constructor
	**/
	function Strong() {}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Strong
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Strong.easeIn  = function(t, b, c, d) 
	{
		return c*(t/=d)*t*t*t*t + b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Strong
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Strong.easeOut  = function(t, b, c, d) 
	{
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Strong
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Strong.easeInOut  = function(t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t*t*t*t + b;
		return c*0.5*((t-=2)*t*t*t*t + 2) + b;
	};
	
	tomahawk_ns.Strong = Strong;

})();




(function() {
	
	function FrameRenderer()
	{
		window.requestAnimationFrame = 	window.requestAnimationFrame       ||  //Chromium 
										window.webkitRequestAnimationFrame ||  //Webkit
										window.mozRequestAnimationFrame    || //Mozilla Geko
										window.oRequestAnimationFrame      || //Opera Presto
										window.msRequestAnimationFrame     || //IE Trident?
										null;
	}

	Tomahawk.registerClass( FrameRenderer, "FrameRenderer" );
	

	FrameRenderer.prototype._callback 	= null;
	FrameRenderer.prototype._playing 	= true;
	FrameRenderer.prototype._timeout 	= 0;
	FrameRenderer.prototype.fps			= 60;
	
	FrameRenderer.prototype.stop = function()
	{
		clearTimeout(this._timeout);
		this._playing = false;
	};
	
	FrameRenderer.prototype.resume = function()
	{
		this.stop();
		this._playing = true;
		this.nextFrame();
	};
	
	FrameRenderer.prototype.nextFrame = function()
	{
		if( this._playing != true )
			return;
			
		if( this._callback != null )
		{
			this._callback();
		}
					
		if( window.requestAnimationFrame == null )
		{
			clearTimeout(this._timeout);
			this._timeout = setTimeout( this.nextFrame.bind(this), 1000 / this.fps );
		}
		else
		{
			window.requestAnimationFrame(this.nextFrame.bind(this));
		}
	};
	
	FrameRenderer.prototype.setCallback = function(callback)
	{
		this._callback = callback;
	};
	
	FrameRenderer.prototype.destroy = function()
	{
		this.stop();
		this._callback = null;
	};
	
	tomahawk_ns.FrameRenderer = FrameRenderer;
	
	

})();






(function() {
	
	if( Tomahawk.glEnabled == false )
		return;
	
	tomahawk_ns.Bitmap.prototype.draw 	= function( renderTask )
	{
		renderTask.batchQuad(this, this._concatenedMatrix);
	};

})();



/**
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{

	function BlendMode(){}
	
	Tomahawk.registerClass( BlendMode, "BlendMode" );

	tomahawk_ns.BlendMode = BlendMode;
	
	
	BlendMode.init = function(gl)
	{
		tomahawk_ns.BlendMode.NORMAL         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
		//tomahawk_ns.BlendMode.NORMAL         = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.ADD            = [gl.SRC_ALPHA, gl.DST_ALPHA];
        tomahawk_ns.BlendMode.MULTIPLY       = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.SCREEN         = [gl.SRC_ALPHA, gl.ONE];
        tomahawk_ns.BlendMode.OVERLAY        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.DARKEN         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.LIGHTEN        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.COLOR_DODGE    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.COLOR_BURN     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.HARD_LIGHT     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.SOFT_LIGHT     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.DIFFERENCE     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.EXCLUSION      = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.HUE            = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.SATURATION     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.COLOR          = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.LUMINOSITY     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
	}
	
	BlendMode.NORMAL = 0;
	BlendMode.ADD = 1;
	BlendMode.MULTIPLY = 2;
	BlendMode.SCREEN = 3;
	BlendMode.OVERLAY = 4;
	BlendMode.DARKEN = 5;
	BlendMode.LIGHTEN = 6;
	BlendMode.COLOR_DODGE = 7;
	BlendMode.COLOR_BURN = 8;
	BlendMode.HARD_LIGHT = 9;
	BlendMode.SOFT_LIGHT = 10;
	BlendMode.DIFFERENCE = 11;
	BlendMode.EXCLUSION = 12;
	BlendMode.HUE = 13;
	BlendMode.SATURATION = 14;
	BlendMode.COLOR = 15;
	BlendMode.LUMINOSITY = 16;
	
})();



/**
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{

	function DefaultShader()
	{
		//this.init();
	}
	
	Tomahawk.registerClass( DefaultShader, "DefaultShader" );

	
	DefaultShader.prototype.id 					= 0;
	DefaultShader.prototype.fragmentShader 		= null;
	DefaultShader.prototype.vertexShader 		= null;
	DefaultShader.prototype.program 			= null;
	DefaultShader.prototype.projectionPointer 	= null;
	DefaultShader.prototype.inited 				= false;
	DefaultShader.VERTEX_SIZE 					= 6;
	
	
	DefaultShader.prototype._compile = function(context, source, type)
	{
		var shader = context.createShader(type);
	
		context.shaderSource(shader, source);
		context.compileShader(shader);

		if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) 
		{
			alert(context.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	};
	
	DefaultShader.prototype.init = function(context, source, type)
	{
		
		if( this.inited == true )
			return;
			
		this.inited = true;
		
		var vertexPosAttribPointer = 0;
		var colorAttribPointer = 0;
		var uvsAttribPointer = 0;
		var samplerPointer = 0;
		var projectionPointer = 0;
		var stride = tomahawk_ns.DefaultShader.VERTEX_SIZE * 4;
		
		this.fragmentShader = this._compile(context, this._getFragmentSource(), context.FRAGMENT_SHADER );
		this.vertexShader = this._compile(context, this._getVertexSource(), context.VERTEX_SHADER );
		
		if( this.program != null )
		{
			context.deleteProgram( this.program );
		}
		
		this.program = context.createProgram();
		
		context.attachShader(this.program, this.vertexShader); // attach vertexShader
		context.attachShader(this.program, this.fragmentShader); // attach fragmentShader
		context.linkProgram(this.program); // links program to webgl context
		
		
		/* if the program is not linked...*/
		if (!context.getProgramParameter(this.program, context.LINK_STATUS)) 
		{
			alert("Could not initialise shaders");
		}
	
		context.useProgram(this.program); // use the shaderProgram
		
		
		vertexPosAttribPointer = context.getAttribLocation(this.program, "aVertexPosition"); 
		colorAttribPointer = context.getAttribLocation(this.program, "aColor"); 
		uvsAttribPointer = context.getAttribLocation(this.program, "aTextureCoord"); 
		context.enableVertexAttribArray(vertexPosAttribPointer);
		context.enableVertexAttribArray(colorAttribPointer);
		context.enableVertexAttribArray(uvsAttribPointer);
		
		
		context.vertexAttribPointer(vertexPosAttribPointer, 2, context.FLOAT, false, stride, 0);
		context.vertexAttribPointer(colorAttribPointer, 2, context.FLOAT, false, stride, 2*4);
		context.vertexAttribPointer(uvsAttribPointer, 2, context.FLOAT, false, stride, 4*4);
		
		samplerPointer = context.getUniformLocation(this.program,"uSampler");
		projectionPointer = context.getUniformLocation(this.program,"uProjection");
		context.uniform1i(samplerPointer, 0);
		
		this.projectionPointer = projectionPointer;
	};
	
	DefaultShader.prototype._getVertexSource = function ()
	{
		var VERTEX_SRC = ''+
		
		'attribute vec2 aVertexPosition;'+
		'attribute vec2 aColor;'+
		'attribute vec2 aTextureCoord;'+
		'varying vec4 vColor;'+
		'varying vec2 vTextureCoord;'+
		'uniform vec2 uProjection;'+
		'const vec2 center = vec2(-1.0, 1.0);'+
		
		
		'void main(void) {'+
			//'gl_Position = vec4( ( aVertexPosition / uProjection) + center , 0.0, 1.0);'+
			//'vTextureCoord = aTextureCoord;'+
			//'vec3 color = mod(vec3(aColor.x/65536.0, aColor.x/256.0, aColor.x), 256.0) / 256.0;'+
			//'vColor = vec4( color * aColor.y, aColor.y );'+
			'gl_Position = vec4( ( aVertexPosition / uProjection) + center , 0.0, 1.0);'+
			'vTextureCoord = aTextureCoord;'+
			'vec3 color = mod(vec3(aColor.x/65536.0, aColor.x/256.0, aColor.x), 256.0) / 256.0;'+
			'vColor = vec4( color * aColor.y, aColor.y );'+
		'}';
		
		return VERTEX_SRC;
	};
	
	DefaultShader.prototype._getFragmentSource = function ()
	{
		var FRAG_SRC = ''+
		
		'precision lowp float;'+
		'varying vec4 vColor;'+
		'varying vec2 vTextureCoord;'+
		'uniform sampler2D uSampler;'+

		'void main(void) {'+
			'gl_FragColor = texture2D(uSampler,vTextureCoord) * vColor.a;'+
		'}';
		
		return FRAG_SRC;
	};
	
	tomahawk_ns.DefaultShader = DefaultShader;
	
	
	
})();



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
	
	if( Tomahawk.glEnabled == false )
		return;
	
	
	tomahawk_ns.DisplayObjectContainer.prototype.draw = function( renderTask )
	{
		var children 	= this.children;
		var i 			= 0;
		var max 		= children.length;
		var child 		= null;
		
		//this.updateMatrix();
		
		for( i = 0; i < max; i++ )
		{
			child = children[i];
			child.updateMatrix();
			child.draw(renderTask);
		}
	};

})();



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



/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function RenderTask (){}
	
	RenderTask.prototype._currentTexture 		= null;
	RenderTask.prototype._vertexArray 			= null;
	RenderTask.prototype._vdata 				= null;
	RenderTask.prototype._indexArray 			= null;
	RenderTask.prototype._maxSpritePerSession 	= 2730;
	RenderTask.prototype.currentShader 			= null;
	RenderTask.prototype.context 				= null;
	RenderTask.prototype.counter 				= 0;
	RenderTask.prototype._numQuads 				= 0;
	RenderTask.prototype._vertexSize 			= 0;
	
	
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
		
		this._vertexArray 	= new Float32Array(verticesSize);
		this._indexArray 	= new Uint16Array(indicesSize);
		
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
		var shader = this.currentShader || new tomahawk_ns.DefaultShader();
		
		this._numQuads = 0;
		this.counter = 0;
		
		this.currentShader = shader;
		
		this._vertexSize = tomahawk_ns.DefaultShader.VERTEX_SIZE;
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
			var view = this._vertexArray.subarray(0, this._numQuads * 4 * this._vertexSize);
			context.bufferSubData(context.ARRAY_BUFFER, 0, view);
		}
		
		
		context.drawElements(context.TRIANGLES, this._numQuads * 6, context.UNSIGNED_SHORT, 0 );

		this.counter++;
		this._numQuads = 0;
	}
	
	RenderTask.prototype.batchQuad 				= function(quad, transformMatrix)
	{
		var m 			= transformMatrix;
		var a 			= m.a;
		var b 			= m.b;
		var c 			= m.c;
		var d 			= m.d;
		var width 		= quad.width;
		var height 		= quad.height;
		var x1 			= width * a;
		var x2 			= width * b;
		var y1 			= height * c;
		var y2 			= height * d;
		var tx 			= m.tx;
		var ty 			= m.ty;
		var tint 		= quad.color;
		var alpha 		= quad.alpha;
		var texture 	= quad.texture;
		var uvs 		= texture.uvs;
		var index 		= 0;
		var vertices 	= this._vertexArray;
		var context 	= this.context;
		
		if( this._currentTexture == null 				|| 
			this._currentTexture.id != texture.id 		|| 
			this._numQuads >= this._maxSpritePerSession 
		)
		{
			this._currentTexture = texture;
			this.flush();
		}
		
		index = this._numQuads * 4 * this._vertexSize;
		
		
		vertices[index++] = 1*(tx);
		vertices[index++] = 1*(ty);
		vertices[index++] = 1*(tint);
		vertices[index++] = 1*(alpha);
		vertices[index++] = 1*(uvs.x1);
		vertices[index++] = 1*(uvs.y1);
		
		vertices[index++] = 1*(x1 + tx);
		vertices[index++] = 1*(x2 + ty);
		vertices[index++] = 1*(tint);
		vertices[index++] = 1*(alpha);
		vertices[index++] = 1*(uvs.x2);
		vertices[index++] = 1*(uvs.y2);
		
		vertices[index++] = 1*(y1 + tx);
		vertices[index++] = 1*(y2 + ty);
		vertices[index++] = 1*(tint);
		vertices[index++] = 1*(alpha);
		vertices[index++] = 1*(uvs.x3);
		vertices[index++] = 1*(uvs.y3);
	
		vertices[index++] = 1*(x1 + y1 + tx);
		vertices[index++] = 1*(x2 + y2 + ty);
		vertices[index++] = 1*(tint);
		vertices[index++] = 1*(alpha);
		vertices[index++] = 1*(uvs.x4);
		vertices[index++] = 1*(uvs.y4);
		
		this._numQuads++;
	};
	
	
	tomahawk_ns.RenderTask = RenderTask;
	
})();

	
	




(function() {

	if( Tomahawk.glEnabled == false )
		return;
		
	tomahawk_ns.Stage.prototype.backgroundColor = 0xFF0080C0;
	tomahawk_ns.Stage.prototype._renderTask 	= null;
		
	tomahawk_ns.Stage.prototype.getRenderTask	= function()
	{
		return this._renderTask;
	};
	
	tomahawk_ns.Stage.prototype.init 			= function(canvas)
	{
		var callback = this._mouseHandler.smartBind(this);
		
		this._renderTask = new tomahawk_ns.RenderTask();
		this._canvas = canvas;
		this._context = this._getContext();
		this._renderTask.init(this._context);
		
		this.addEventListener(tomahawk_ns.Event.ADDED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.FOCUSED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.UNFOCUSED, this, this._eventHandler,true);
		this._canvas.addEventListener("click",callback);
		this._canvas.addEventListener("touchstart",callback);
		this._canvas.addEventListener("touchmove",callback);
		this._canvas.addEventListener("touchend",callback);
		this._canvas.addEventListener("mousemove",callback);
		this._canvas.addEventListener("mousedown",callback);
		this._canvas.addEventListener("mouseup",callback);
		this._canvas.addEventListener("dblclick",callback);
		
		window.addEventListener("resize",this._resizeHandler.smartBind(this));
		
		
		tomahawk_ns.BlendMode.init(this._context);		
		this._context.clearColor(0,0,0,1);
		this._context.disable(this._context.DEPTH_TEST);
		this._context.disable(this._context.CULL_FACE);
		this._context.blendFunc( tomahawk_ns.BlendMode.NORMAL[0], tomahawk_ns.BlendMode.NORMAL[1] );
		this._context.enable(this._context.BLEND);
		
		this.resume();		
	};
	
	tomahawk_ns.Stage.prototype._getContext 	= function(canvas)
	{
		return this._canvas.getContext("experimental-webgl");
	};
	
	tomahawk_ns.Stage.prototype.drawFPS 		= function()
	{
		//console.log(this._fps, this._renderTask._numQuads);
	};
	
	tomahawk_ns.Stage.prototype.enterFrame 		= function()
	{
		var curTime 	= new Date().getTime();
		var scope 		= this;
		var context 	= this._context;
		var canvas 		= this._canvas;
		var renderTask 	= this._renderTask;
		var unit 		= 1/255;
		var a 			= ( this.backgroundColor >> 24 ) & 0xFF;
		var r 			= ( this.backgroundColor >> 16 ) & 0xFF;
		var g 			= ( this.backgroundColor >> 8 ) & 0xFF;
		var b 			= ( this.backgroundColor >> 0 ) & 0xFF;
		
		
		this.width 		= canvas.width;
		this.height 	= canvas.height;
		
		this._frameCount++;
		
		if( curTime - this._lastTime > 1000 )
		{
			this._fps = this._frameCount;
			this._frameCount = 0;
			this._lastTime = curTime;
		}
		

		context.clearColor(r*unit,g*unit,b*unit,a*unit);
		context.viewport(0, 0, canvas.width, canvas.height);
		context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
		
		
		renderTask.start( new tomahawk_ns.Point(this.width/2,  -this.height/2 ) );
		this.draw(renderTask);
		renderTask.end();
		
		this.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		
		if( this.debug == true )
		{
			this.drawFPS();
		}
		
	};

})();



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



Function.prototype.smartBind 		= function(scope, destroy)
{	
	var obj = new Object();
	var copy = null;
	
	destroy = ( destroy === true );
	
	if( this.__bindings__ == undefined )
	{
		this.__bindings__ = new Object();
	}
	
	if( this.__bindings__[scope] == undefined )
	{
		this.__bindings__[scope] = this.bind(scope);
	}
	
	copy = this.__bindings__[scope];
	
	if( destroy == true )
	{
		this.removeSmartBind(scope)
	}
	
	return copy;
};

Function.prototype.removeSmartBind 	= function(scope)
{
	if( this.__bindings__[scope] != undefined )
		delete this.__bindings__[scope];
};





