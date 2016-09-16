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
* @deprecated
*/


(function() {
	
	/**
	 * @class ConvolutionFilter
	 * @description a basic ConvolutionFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @param {Array} matrix the convolution matrix.
	 * @constructor
	 **/
	function ConvolutionFilter(matrix)
	{
		this.matrix = matrix || this.matrix;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ConvolutionFilter, "ConvolutionFilter" );
	Tomahawk.extend( "ConvolutionFilter", "PixelFilter" );
	
	/**
	* @member {Array} the convolution matrix
	* @memberOf tomahawk_ns.ConvolutionFilter.prototype
	**/
	ConvolutionFilter.prototype.matrix 	= [1];
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ConvolutionFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ConvolutionFilter.prototype.process = function()
	{
		var pixels = this.getPixels(0,0,this._object.width, this._object.height);
		var weights = this.matrix;
		var opaque = false;
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side/2);
		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;
		// pad output by the convolution matrix
		var w = sw;
		var h = sh;
		var r=0, g=0, b=0, a=0, sy = 0, sx = 0, x = 0, y = 0, cy = 0, cx = 0, dstOff = 0, scx = 0, scy = 0, srcOff = 0, wt = 0;
		var output = pixels;
		//var output = this._context.createImageData(this._object.width, this._object.height);
		var dst = output.data;
		// go through the destination image pixels
		var alphaFac = opaque ? 1 : 0;
		
		for (y=0; y<h; y++) 
		{
			for ( x=0; x<w; x++) 
			{
				sy = y;
				sx = x;
				dstOff = (y*w+x)*4;
				// calculate the weighed sum of the source image pixels that
				// fall under the convolution matrix
				r = 0; g = 0; b = 0; a = 0;
				
				for (cy=0; cy<side; cy++) 
				{
					for (cx=0; cx<side; cx++) 
					{
						scy = sy + cy - halfSide;
						scx = sx + cx - halfSide;
						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) 
						{
							srcOff = (scy*sw+scx)*4;
							wt = weights[cy*side+cx];
							r += src[srcOff] * wt;
							g += src[srcOff+1] * wt;
							b += src[srcOff+2] * wt;
							a += src[srcOff+3] * wt;
						}
					}
				}
				dst[dstOff] = r;
				dst[dstOff+1] = g;
				dst[dstOff+2] = b;
				dst[dstOff+3] = a + alphaFac*(255-a);
			}
		}
		
		this.setPixels(output,0,0);
	};
	
	ConvolutionFilter.prototype.getOffsetBounds = function(canvas, context, object)
	{ 
		this._offsetBounds = this._offsetBounds || new tomahawk_ns.Rectangle();
		return this._offsetBounds;
	};

	tomahawk_ns.ConvolutionFilter = ConvolutionFilter;

})();