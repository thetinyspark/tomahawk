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
DisplayObjectContainer.prototype.isContainer = true;
DisplayObjectContainer.prototype.cacheChildrenMatrix = true;

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
		child.updateMatrix();
		mat = child.matrix;
		
		if( child.visible == false || child.isMask == true )
			continue;
		
		context.save();
		context.globalAlpha *= child.alpha;
		context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		
		if( child.mask != null || child.filters != null || child.cacheAsBitmap == true )
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



DisplayObjectContainer.prototype.getBoundingRect = function()
{
	var children = this.children;
	var i = children.length;
	var child = null;
	var rect = new Rectangle();
	var childRect = null;
	
	i = children.length;
	
	while( --i > -1 )
	{
		child = children[i];
		childRect = child.getBoundingRect();
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

DisplayObjectContainer.prototype.getObjectsUnder = function(x,y,limit)
{
	var under = new Array();
	var children = this.children;
	var i = children.length;
	var child = null;
	
	while( --i > -1 )
	{
		child = children[i];
		
		if( child.isContainer )
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

DisplayObjectContainer.prototype.getObjectUnder = function(x,y)
{
	var under = null;
	var children = this.children;
	var i = children.length;
	var child = null;
	
	while( --i > -1 )
	{
		child = children[i];
		
		if( child.isContainer )
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


