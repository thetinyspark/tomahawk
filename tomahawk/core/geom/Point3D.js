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
	 * @class Point3D
	 * @memberOf tomahawk_ns
	 * @description a basic 3D point
	 * @constructor
	 * @param {Number} x the value on the x axis
	 * @param {Number} y the value on the y axis
	 * @param {Number} z the value on the z axis
	 **/
	function Point3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Point3D, "Point3D" );
	
	/**
	* @member x
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the x axis.
	**/
	Point3D.prototype.x = 0;
	/**
	* @member y
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the y axis.
	**/
	Point3D.prototype.y = 0;
	/**
	* @member z
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the z axis.
	**/
	Point3D.prototype.z = 0;
	
	
	tomahawk_ns.Point3D = Point3D;
})();