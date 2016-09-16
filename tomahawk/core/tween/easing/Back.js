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
	 * @class Back
	 * @memberOf tomahawk_ns
	 * @description a back easing class effect
	 * @constructor
	 **/
	function Back() {}

	/**
	* @method easeIn
	* @memberOf tomahawk_ns.Back
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Back.easeIn = function ( p_t , p_b, p_c , p_d )
	{
		return p_c * ( p_t /= p_d ) * p_t * ( 2.70158 * p_t - 1.70158 ) + p_b;
	};
	
	/**
	* @method easeOut
	* @memberOf tomahawk_ns.Back
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Back.easeOut = function (p_t, p_b, p_c, p_d)
	{
		return p_c * ( ( p_t = p_t / p_d - 1) * p_t * ( 2.70158 * p_t + 1.70158) + 1 ) + p_b;
	};
	
	/**
	* @method easeInOut
	* @memberOf tomahawk_ns.Back
	* @param {Number} t
	* @param {Number} b
	* @param {Number} c
	* @param {Number} d
	* @returns {Number} returns a number
	**/
	Back.easeInOut = function( p_t, p_b, p_c, p_d ) 
	{
		if ( ( p_t /= p_d * 0.5 ) < 1 )
		{
			return p_c * 0.5 * ( p_t * p_t * ( ( 1.70158 * 1.525 + 1 ) * p_t - 1.70158 ) ) + p_b;
		}
		else
		{
			return p_c / 2 * ( ( ( p_t -= 2 ) * p_t * ( 1.70158 * 1.525 + 1 ) * p_t + 1.70158 ) + 2 ) + p_b;
		}
		
	};

	tomahawk_ns.Back = Back;

})();