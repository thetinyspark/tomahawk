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
	 * @class Frame
	 * @memberOf tomahawk_ns
	 * @description A Frame Object that represents a frame of a MovieClip Object
	 * @constructor
	 **/
	function Frame(info)
	{
		this.label = null;
		this.children = new Array();
		
		if( info != undefined )
		{
			this.label = info.label || null;
			this.children = info.children || new Array();
		}
	}

	Tomahawk.registerClass( Frame, "Frame" );

	/**
	* @member index
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {Number}
	* @description The frame index 
	**/
	Frame.prototype.index 				= 0;
	
	/**
	* @member label
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {String}
	* @description The frame label 
	**/
	Frame.prototype.label 				= null;
	
	/**
	* @member script
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {Function}
	* @description A block of script which will be executed when the frame will be played.
	**/
	Frame.prototype.script 				= null;
	
	/**
	* @member chilren
	* @memberOf tomahawk_ns.Frame.prototype
	* @type {Array}
	* @description The frame's displaylist.
	**/
	Frame.prototype.children 			= null;
	
	/**
	* @method runScript
	* @memberOf tomahawk_ns.Frame.prototype
	* @param {Object} scope An object that represents the script execution context
	**/
	Frame.prototype.runScript 			= function(scope)
	{
		if( this.script != null )
		{
			this.script.apply(scope);
		}
	};
	
	Frame.prototype.setChildIndex 		= function(child,index)
	{
		this.addChildAt(child,index);
	};
	
	Frame.prototype.addChild 			= function(child)
	{		
		if( this.contains(child) == true )
			return child;
			
		this.children.push(child);	
		return child;
	};
	
	Frame.prototype.contains 			= function(child)
	{
		return (this.children.indexOf(child) > -1);
	};

	Frame.prototype.getChildAt 			= function (index)
	{
		return this.children[index];
	};

	Frame.prototype.getChildByName 		= function(name)
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

	Frame.prototype.addChildAt 			= function(child, index)
	{
		if( this.contains(child) == true )
			return child;
			
		var children = this.children;
		var tab1 = this.children.slice(0,index);
		var tab2 = this.children.slice(index);
		this.children = tab1.concat([child]).concat(tab2);
		
		return child;
	};
	
	Frame.prototype.getChildIndex 		= function(child)
	{
		return this.children.indexOf(child);
	};

	Frame.prototype.removeChildAt 		= function(index)
	{
		var child = this.children[index];
		if( child == undefined )
			return null;
			
		this.children.splice(index,1);
		return child;
	};

	Frame.prototype.removeChildren 		= function()
	{
		while( this.children.length > 0 )
		{
			this.removeChildAt(0);
		}
	};
	
	Frame.prototype.removeChild 		= function(child)
	{
		var index = this.children.indexOf(child);
		var child = null;
		
		if( index > -1 )
		{
			child = this.children[index];
			this.children.splice(index,1);
		}
		
		return child;
	};
	
	Frame.prototype.clone 				= function()
	{
		var frame = new tomahawk_ns.Frame(this.label);
		var max = this.children.length;
		var i = 0; 
		
		frame.index = this.index;
		frame.script = ( this.script == null ) ? null : this.script.bind({});
		
		for( i = 0; i < max; i++ )
		{
			frame.children.push(this.children[i]);
		}
		
		return frame;
	};
	
	Frame.prototype.destroy 			= function()
	{
		this.script = null;
		this.label = null;
		this.index = null;
		this.children = null;
	};

	tomahawk_ns.Frame = Frame;

})();
