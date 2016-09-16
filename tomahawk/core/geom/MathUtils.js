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
	 * @class MathUtils
	 * @memberOf tomahawk_ns
	 * @description The MathUtils class provide useful mathematic features
	 * @constructor
	 **/
	function MathUtils(){}
	
	Tomahawk.registerClass( MathUtils, "MathUtils" );
	
	/**
	 * Multiplier for converting degrees to radians.
	 * @memberOf tomahawk_ns.MathUtils
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	MathUtils.DEG_TO_RAD = Math.PI / 180;
	
	/**
	 * Multiplier for converting radians to degrees.
	 * @memberOf tomahawk_ns.MathUtils
	 * @property RAD_TO_DEG
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	MathUtils.RAD_TO_DEG = 1 / MathUtils.DEG_TO_RAD;
	
	/**
	 * return the distance between the points specified by the coordinates x1,y1 and x2,y2 
	 * @method getDistanceBetween
	 * @memberOf tomahawk_ns.MathUtils
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @return {Number} the distance between the two points
	 **/
	MathUtils.getDistanceBetween = function(x1,y1,x2,y2)
	{
		var a = ( x2 - x1 ) * ( x2 - x2 );
		var b = ( y2 - y1 ) * ( y2 - y2 );
		return Math.sqrt( a + b );
	};
	
	/**
	* return the angle in pointA according to te Al Kashi's theorem
	* α = angleA, β = angleB, γ = angleC
	* a² = b² + c² − 2bc.cos(α)
	* b² = a² + c² − 2ac.cos(β)
	* c² = a² + b² − 2ab.cos(γ)
	* @method findAngleInTriangle
	* @memberOf tomahawk_ns.MathUtils
	* @param {tomahawk_ns.Point} pointA
	* @param {tomahawk_ns.Point} pointB
	* @param {tomahawk_ns.Point} pointC
	* @return {Number} the angle in pointA
	*/
	MathUtils.findAngleInTriangle = function(pointA,pointB,pointC)
	{
		var AB = tomahawk_ns.MathUtils.getDistanceBetween(pointA,pointB);
		var BC = tomahawk_ns.MathUtils.getDistanceBetween(pointB,pointC);
		var AC = tomahawk_ns.MathUtils.getDistanceBetween(pointA,pointC);
		
		var AB2 = AB * AB;
		var BC2 = BC * BC;
		var AC2 = AC * AC;
		
		var angle = Math.acos( ( AC2 + AB2 - BC2 ) /( 2*(AC*AB) ) );
		return angle;
	};
	
	/**
	* return the next power of 2 greater or equal than the value passed in parameter
	* @method getNextPowerOf2
	* @memberOf tomahawk_ns.MathUtils
	* @param {Number} value
	* @return {Number} the next power of 2
	*/
	MathUtils.getNextPowerOf2 = function(value)
	{
		var num = 1;
		while( num < value )
		{
			num *= 2;
		}
		
		return num;
	};
	
	/**
	* Converts a pair of x,y coordinates with specifics cell's width and height into a pair of row,col
	* @method screenToIso
	* @memberOf tomahawk_ns.MathUtils
	* @param {Number} x
	* @param {Number} y
	* @param {Number} cellW
	* @param {Number} cellH
	* @return {tomahawk_ns.Point} a Point Object which x  = col and y = row
	*/
	MathUtils.prototype.screenToIso = function( x, y, cellW, cellH)
	{
		var obj = new tomahawk_ns.Point();
		var divY = y / cellH;
		var divX = x / cellW;
		obj.x = divY + divX;
		obj.y = divY - divX;
		return obj;
	}

	/**
	* Converts a pair of row,col coordinates with specifics cell's width and height into a pair of x,y
	* @method isoToScreen
	* @memberOf tomahawk_ns.MathUtils
	* @param {Number} row
	* @param {Number} col
	* @param {Number} cellW
	* @param {Number} cellH
	* @return {tomahawk_ns.Point} a Point Object
	*/
	MathUtils.prototype.isoToScreen = function(  row, col, cellW, cellH )
	{
		var x = ( col - row ) * ( cellW * 0.5 );
		var y = ( col + row ) * ( cellH * 0.5 );
		var pt = new tomahawk_ns.Point(x >> 0 , y >> 0);
		
		return pt;
	}
	
	tomahawk_ns.MathUtils = MathUtils;
})();