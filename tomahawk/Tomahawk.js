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

