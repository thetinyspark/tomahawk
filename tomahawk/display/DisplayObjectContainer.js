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
		this.addChildAt(child,index);
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
			return child;
			
		if( child.parent )
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
		if( child.parent != null && child.parent != this)
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