/**
 * @author The Tiny Spark
 */
 
//namespace
var tomahawk_ns = new Object();

/**
* @class Tomahawk
* Core Framework class
* @constructor
*/
function Tomahawk(){}

Tomahawk._classes = new Object();
Tomahawk._extends = new Array();
	

	Tomahawk._funcTab = null;

	/**
	* @method registerClass
	* @memberOf Tomahawk
	* @description Register a class definition
	* @params {class} the class definition
	* @params {string} the class definition alias which will be used for inheritance
	*/
	Tomahawk.registerClass = function( classDef, className )
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
	Tomahawk.extend = function( p_child, p_ancestor )
	{
		Tomahawk._extends.push({"child":p_child,"ancestor":p_ancestor,"done":false});
	};

	/**
	* @method run
	* @memberOf Tomahawk
	* @description run the framework, apply inheritances to classes
	*/
	Tomahawk.run = function()
	{
		var obj = null;
		var i = 0;
		var max = Tomahawk._extends.length;
		
		Tomahawk._funcTab = new Object();
		
		for (i = 0; i < max; i++ )
		{
			obj = Tomahawk._extends[i];
			Tomahawk._inherits( obj );
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
		
		if( superParent != null && superParent.done == false)
			Tomahawk._inherits(superParent);

		child = Tomahawk._classes[obj["child"]];
		ancestor = Tomahawk._classes[obj["ancestor"]];
		obj.done = true;
		
		var func = new Object();
	
		if( child != null && ancestor != null )
		{	
			for( var prop in ancestor.prototype )
			{
				func[prop] = ancestor.prototype[prop];
			}
			
			for( var prop in child.prototype )
			{
				func[prop] = child.prototype[prop];
			}
		}
		
		child.prototype = func;
	};

