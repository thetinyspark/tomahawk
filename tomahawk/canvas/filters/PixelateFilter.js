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
	 * @class PixelateFilter
	 * @description a basic PixelateFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function PixelateFilter(value)
	{
		this.value = value || 0;
		this._offsetBounds = new tomahawk_ns.Rectangle();
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( PixelateFilter, "PixelateFilter" );
	Tomahawk.extend( "PixelateFilter", "PixelFilter" );

	/**
	* @member {Number} value pixelisation intensity.
	* @memberOf tomahawk_ns.PixelateFilter.prototype
	**/
	PixelateFilter.prototype.value = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.PixelateFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	PixelateFilter.prototype.process = function()
	{
		if( this.value <= 0 )
			return;
		
		var context = this._context;
		var canvas = this._canvas;
		
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		
		buffer.width =  canvas.width;
		buffer.height =  canvas.height;
		
		bufferContext.save();
		bufferContext.scale( 1/this.value, 1/this.value);
		bufferContext.drawImage(canvas, 0, 0);
		bufferContext.restore();
		
		
		context.clearRect(0,0,canvas.width,canvas.height);
		context.save();
		context.scale(this.value, this.value);
		context.drawImage(buffer, 0, 0, buffer.width, buffer.height);
		context.restore();
	};

	tomahawk_ns.PixelateFilter = PixelateFilter;

})();