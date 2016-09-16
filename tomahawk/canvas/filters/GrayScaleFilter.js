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
	 * @class GrayScaleFilter
	 * @description a basic GrayScaleFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function GrayScaleFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( GrayScaleFilter, "GrayScaleFilter" );
	Tomahawk.extend( "GrayScaleFilter", "PixelFilter" );

	/**
	* @method process
	* @memberOf tomahawk_ns.GrayScaleFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	GrayScaleFilter.prototype.process = function()
	{
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		
		for (var i=0; i<data.length; i+=4) 
		{
			var r = data[i];
			var g = data[i+1];
			var b = data[i+2];
			var v = 0.2126*r + 0.7152*g + 0.0722*b;
			data[i] = data[i+1] = data[i+2] = v;
		}
		
		this.setPixels(pixels,0,0);
	};

	tomahawk_ns.GrayScaleFilter = GrayScaleFilter;

})();