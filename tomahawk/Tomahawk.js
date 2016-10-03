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

