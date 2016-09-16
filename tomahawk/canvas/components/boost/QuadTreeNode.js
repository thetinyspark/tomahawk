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