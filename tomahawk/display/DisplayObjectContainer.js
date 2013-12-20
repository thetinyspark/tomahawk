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


