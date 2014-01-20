/**
 * @author The Tiny Spark
 */
(function() {
	
	
	function QuadTreeContainer()
	{
		tomahawk_ns.Sprite.apply(this);
		
		var min = -2147483648;
		var max = 2147483648;
		var rootDepth = 0;
		var maxDepth = 24;
		var maxChildrenPerNode = 24;
		
		//var min = -65535;
		//var max = 65535;
		this._root = new tomahawk_ns.QuadTreeNode(min,max,min,max,rootDepth,maxDepth,maxChildrenPerNode);
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
	

	QuadTreeContainer.prototype._sort = function(a,b)
	{
		return ( a.__index__ < b.__index__ ) ? -1 : 1;
	};
	
	QuadTreeContainer.prototype.draw = function(context)
	{
		var i = this.children.length;
		var child = null;
		
		if( this.stage == null )
			return;
			
		var pt1 = this.globalToLocal(0,0);
		var pt2 = this.globalToLocal(this.stage.getCanvas().width,this.stage.getCanvas().height);
		var left = pt1.x;
		var right = pt2.x;
		var top = pt1.y;
		var bottom = pt2.y;
		
		while( --i > -1 )
		{
			child = this.children[i];
			child.__index__ = i;
			if( child.updateNextFrame == true || child.autoUpdate == true )
			{
				this._root.remove(child);
				this._root.add(child);
			}
		}
		
		var all = this.children;
	
		this.children = this._root.get(left, right, top, bottom);
		this.children.sort(this._sort);
		tomahawk_ns.Sprite.prototype.draw.apply(this,[context]);
		
		this.children = all;
	};

	QuadTreeContainer.prototype.hitTest = function(x,y)
	{
		var pt1 = this.globalToLocal(x,y);
		var left = pt1.x;
		var right = pt1.x + 1;
		var top = pt1.y;
		var bottom = pt1.y + 1;
		var all = this.children;
		var answer = false;
		this.children = this._root.get(left,right,top,bottom);
		this.children.sort(this._sort);
		
		answer = tomahawk_ns.Sprite.prototype.hitTest.apply(this,[x,y]);
		
		this.children = all;
		return answer;
	};
	
	QuadTreeContainer.prototype.getObjectUnder = function(x,y)
	{
		var pt1 = this.globalToLocal(x,y);
		var left = pt1.x;
		var right = pt1.x + 1;
		var top = pt1.y;
		var bottom = pt1.y + 1;
		
		var all = this.children;
		var answer = null;
		this.children = this._root.get(left, right, top, bottom);
		this.children.sort(this._sort);
		
		answer = tomahawk_ns.Sprite.prototype.getObjectUnder.apply(this,[x,y]);
		this.children = all;
		return answer;
	};
	
	tomahawk_ns.QuadTreeContainer = QuadTreeContainer;
})();