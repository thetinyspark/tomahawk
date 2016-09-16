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
	 * @class Rectangle
	 * @memberOf tomahawk_ns
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @description Represents a rectangle
	 * @constructor
	 **/
	function Rectangle(x,y,width,height)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
		this.left = this.x;
		this.top = this.y;
		this.right = this.x + this.width;
		this.bottom = this.y + this.height;
	}
	
	Tomahawk.registerClass(Rectangle,"Rectangle");

	/**
	* @member x
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.x 		= 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.y 		= 0;
	
	/**
	* @member width
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description the width of the rectangle, in pixels.
	**/
	Rectangle.prototype.width 	= 0;
	
	/**
	* @member height
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description the height of the rectangle, in pixels.
	**/
	Rectangle.prototype.height 	= 0;
	
	/**
	* @member left
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.left 	= 0;
	
	/**
	* @member right
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The sum of the x and width properties.
	**/
	Rectangle.prototype.right 	= 0;
	
	/**
	* @member top
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the rectangle.
	**/
	
	Rectangle.prototype.top 	= 0;
	/**
	* @member bottom
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The sum of the y and height properties.
	**/
	Rectangle.prototype.bottom 	= 0;

	tomahawk_ns.Rectangle = Rectangle;

})();