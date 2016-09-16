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
	 * @class Screen
	 * @memberOf tomahawk_ns
	 * @description The Screen class is used to get information about the screen or the canvas sizes.
	 * @constructor
	 **/
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	/**
	* @description Returns the width of the HTMLCanvasElement's DOM parent node associated to the stage instance specified by the "stage" parameter.
	* @method getInnerWidth
	* @memberOf tomahawk_ns.Screen
	* @param {tomahawk_ns.Stage} stage an instance stage of .
	* @returns {Number} 
	**/
	Screen.getInnerWidth = function(stage)
	{
		return stage.getCanvas().parentNode.offsetWidth;
	};
	
	/**
	* @description Returns the height of the HTMLCanvasElement's DOM parent node associated to the stage instance specified by the "stage" parameter.
	* @method getInnerHeight
	* @memberOf tomahawk_ns.Screen
	* @param {tomahawk_ns.Stage} stage an instance stage of .
	* @returns {Number} 
	**/
	Screen.getInnerHeight = function(stage)
	{
		return stage.getCanvas().parentNode.offsetHeight;
	};

	/**
	* @description Returns the current window width.
	* @method getWindowWidth
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getWindowWidth = function()
	{
		return window.innerWidth;
	};
	
	/**
	* @description Returns the current window height.
	* @method getWindowHeight
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getWindowHeight = function()
	{
		return window.innerHeight;
	};
	
	/**
	* @description Returns the current client width.
	* @method getClientWidth
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getClientWidth = function()
	{
		return document.body.clientWidth;
	};
	
	/**
	* @description Returns the current client height.
	* @method getClientHeight
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getClientHeight = function()
	{
		return document.body.clientHeight;
	};
	
	tomahawk_ns.Screen = Screen;
})();