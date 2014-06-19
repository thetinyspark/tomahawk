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
	 * @class Expo
	 * @memberOf tomahawk_ns
	 * @description an expo easing class effect
	 * @constructor
	 **/
	function Expo (){}
	
	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Expo
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Expo.easeIn = function(t, b, c, d) 
	{
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Expo
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Expo.easeOut = function(t, b, c, d) 
	{
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Expo
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Expo.easeInOut = function(t, b, c, d) 
	{
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d*0.5) < 1) return c*0.5 * Math.pow(2, 10 * (t - 1)) + b;
		return c*0.5 * (-Math.pow(2, -10 * --t) + 2) + b;
	};
	
	tomahawk_ns.Expo = Expo;

})();