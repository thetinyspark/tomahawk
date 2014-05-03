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
	 * @description ...
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