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
	 * @class Point
	 * @description Represents a basic 2d point
	 * @memberOf tomahawk_ns
	 * @param {Number} x the x value of the point on the x axis
	 * @param {Number} y the y value of the point on the y axis
	 * @constructor
	 **/
	function Point(x,y)
	{
		this.x = x, this.y = y
	}
	
	Tomahawk.registerClass( Point, "Point" );
	
	/**
	* @member {Number} x the x position of  the point
	* @memberOf tomahawk_ns.Point.prototype
	**/
	Point.prototype.x = 0;
	/**
	* @member {Number} y the y position of  the point
	* @memberOf tomahawk_ns.Point.prototype
	**/
	Point.prototype.y = 0;
	
	
	/**
	* @method distanceBetween
	* @description returns a distance between two points
	* @memberOf tomahawk_ns.Point
	* @param {tomahawk_ns.Point} pointA
	* @param {tomahawk_ns.Point} pointB
	* @returns {Number}
	**/
	Point.distanceBetween = function(pointA, pointB)
	{
		var distX = ( pointB.x - pointA.x ) * ( pointB.x - pointA.x );
		var distY = ( pointB.y - pointA.y ) * ( pointB.y - pointA.y );
		var segLength = Math.sqrt( distX + distY );  
		return segLength;
	};
	

	
	tomahawk_ns.Point = Point;
})();