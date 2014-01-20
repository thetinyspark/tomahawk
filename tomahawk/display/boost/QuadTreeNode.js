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
	
	QuadTreeNode.prototype.add = function( element )
	{
		var child = null;
		var bounds = element.getBounds();
		var out = ( bounds.left > this.right || 
					bounds.right < this.left || 
					bounds.top > this.bottom || 
					bounds.bottom < this.top );
					
		
		if( out == true )
			return;
		
		if( this.children.length > this.maxChildren && this.depth < this.maxDepth)
		{
			var e = this.depth + 1;
			var f = this.maxChildren;
			var g = this.maxDepth;
			
			this.full = true;
			
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
		}
		
		if( this.full == false )
		{
			this.children.push(element);
		}
		else
		{
			this.node1.add(element);
			this.node2.add(element);
			this.node3.add(element);
			this.node4.add(element);
		}
		
	};
	
	QuadTreeNode.prototype.remove = function( element )
	{
		var index = -1;
				
		if( this.full == true )
		{
			this.node1.remove(element);
			this.node2.remove(element);
			this.node3.remove(element);
			this.node4.remove(element);
		}
		else
		{
			index = this.children.indexOf(element);
			
			if( index != -1 )
				this.children.splice(index,1);
		}
	};
	
	QuadTreeNode.prototype.get = function(left,right,top,bottom)
	{
		tomahawk_ns.QuadTreeNode._tick++;
		return this._get(left,right,top,bottom);
	};
	
	QuadTreeNode.prototype._get = function( left, right, top, bottom )
	{
		var out = ( left > this.right || right < this.left || top > this.bottom || bottom < this.top );
		var tab = new Array();
		var child = null;
		var i = 0;
		var bounds = null;
		
		if( out == true )
			return tab;
			
		if( this.full == true )
		{
			tab = tab.concat(this.node1._get(left,right,top,bottom));
			tab = tab.concat(this.node2._get(left,right,top,bottom));
			tab = tab.concat(this.node3._get(left,right,top,bottom));
			tab = tab.concat(this.node4._get(left,right,top,bottom));
		}
		else
		{
			i = this.children.length;
			while( --i > -1 )
			{
				child = this.children[i];
				bounds = child.getBounds();
				
				out = ( bounds.left > right || 
						bounds.right < left ||
						bounds.top > bottom ||
						bounds.bottom < top || 
						child.__tick__ == tomahawk_ns.QuadTreeNode._tick);
						
				if( out == true )
					continue;
				
				tab.push(child);
				child.__tick__ = tomahawk_ns.QuadTreeNode._tick;
			}
		}
		
		return tab;
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