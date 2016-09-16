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
	 * @class BlendColorFilter
	 * @description a basic BlendColorFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function BlendColorFilter(srcColor, destColor, intensity,deltaRed, deltaGreen, deltaBlue, deltaAlpha)
	{
		this.intensity = intensity || this.intensity;
		this.deltaGreen = deltaGreen || this.deltaGreen;
		this.deltaRed = deltaRed || this.deltaRed;
		this.deltaBlue = deltaBlue || this.deltaBlue;
		this.deltaAlpha = deltaAlpha || this.deltaAlpha;
		this.srcColor = srcColor || this.srcColor;
		this.destColor = destColor || this.destColor;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( BlendColorFilter, "BlendColorFilter" );
	Tomahawk.extend( "BlendColorFilter", "PixelFilter" );

	/**
	* @member {Number} intensity value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.intensity = 0;
	/**
	* @member {Number} ARGB srcColor value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.srcColor = 0xFFFFFF;
	/**
	* @member {Number} ARGB destColor value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.destColor = 0xFFFFFF;
	/**
	* @member {Number} deltaRed value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaRed = 0;
	/**
	* @member {Number} deltaGreen value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaGreen = 0;
	/**
	* @member {Number} deltaBlue value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaBlue = 0;
	/**
	* @member {Number} deltaAlpha value.
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	**/
	BlendColorFilter.prototype.deltaAlpha = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.BlendColorFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	BlendColorFilter.prototype.process = function()
	{
		
		if( this.intensity == 0 )
			return;
		
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var a1 = (this.srcColor >> 24) & 0xFF;
		var r1 = (this.srcColor >> 16) & 0xFF;
		var g1 = (this.srcColor >> 8) & 0xFF;
		var b1 = this.srcColor & 0xFF;
		var a2 = (this.destColor >> 24) & 0xFF;
		var r2 = (this.destColor >> 16) & 0xFF;
		var g2 = (this.destColor >> 8) & 0xFF;
		var b2 = this.destColor & 0xFF;
		var distRed = 0;
		var distGreen = 0;
		var distBlue = 0;
		var distAlpha = 0;
		
		var i = 0, a = 0, r = 0, g = 0, b = 0, max = data.length;
		
		for ( i=0; i < max; i+=4) 
		{
			r = data[i];
			g = data[i+1];
			b = data[i+2];
			a = data[i+3];
			
			distRed = r1 - r;
			distRed = ( distRed < 0 ) ? -distRed : distRed;
			
			distGreen = g1 - g;
			distGreen = ( distGreen < 0 ) ? -distGreen : distGreen;
			
			distBlue = b1 - b;
			distBlue = ( distBlue < 0 ) ? -distBlue : distBlue;
			
			distAlpha = a1 - a;
			distAlpha = ( distAlpha < 0 ) ? -distAlpha : distAlpha;
			
			if( distRed > this.deltaRed ||
				distGreen > this.deltaGreen ||
				distAlpha > this.deltaAlpha ||
				distBlue > this.deltaBlue 
			)
			{
				continue;
			}
			
			data[i+0] = ((r2 * this.intensity) + r) / (this.intensity+1);
			data[i+1] = ((g2 * this.intensity) + g) / (this.intensity+1);
			data[i+2] = ((b2 * this.intensity) + b) / (this.intensity+1);
			data[i+3] = ((a2 * this.intensity) + a) / (this.intensity+1);
		}
		
		this.setPixels(pixels,0,0);
	};

	tomahawk_ns.BlendColorFilter = BlendColorFilter;

})();