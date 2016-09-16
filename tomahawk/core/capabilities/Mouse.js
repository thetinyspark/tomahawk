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
	 * @class Mouse
	 * @memberOf tomahawk_ns
	 * @description The methods of the Mouse class are used to set the pointer to a specific style. The Mouse class is a top-level class whose properties and methods you can access without using a constructor.
	 * @constructor
	 **/
	function Mouse(){}

	Tomahawk.registerClass( Mouse, "Mouse" );
	
	/**
	* @property {String} RESIZE
	* @memberOf tomahawk_ns.Mouse
	* @default "se-resize"
	**/
	Mouse.RESIZE = "se-resize";
	
	/**
	* @property {String} MOVE
	* @memberOf tomahawk_ns.Mouse
	* @default "move"
	**/
	Mouse.MOVE = "move";
	
	/**
	* @property {String} POINTER
	* @memberOf tomahawk_ns.Mouse
	* @default "pointer"
	**/
	Mouse.POINTER = "pointer";

	/**
	* @property {String} DEFAULT
	* @memberOf tomahawk_ns.Mouse
	* @default "default"
	**/
	Mouse.DEFAULT = "default";

	/**
	* @member setCursor
	* @memberOf tomahawk_ns.Mouse
	* @param {String} value the cursor style value.
	* @param {DOMElement} domElement the domElement on which the cursor style is applied.
	* @description Sets the cursor style for the DOMElement specified by the "domElement" parameter.
	**/
	Mouse.setCursor = function(value,domElement)
	{
		domElement.style.cursor = value;
	};
	
	tomahawk_ns.Mouse = Mouse;
})();