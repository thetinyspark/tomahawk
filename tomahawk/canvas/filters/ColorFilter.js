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
	 * @class ColorFilter
	 * @description a basic ColorFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function ColorFilter(color, intensity)
	{
		this.intensity = intensity || 0;
		this.color = color || this.color;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ColorFilter, "ColorFilter" );
	Tomahawk.extend( "ColorFilter", "PixelFilter" );

	/**
	* @member {Number} coloration intensity.
	* @memberOf tomahawk_ns.ColorFilter.prototype
	**/
	ColorFilter.prototype.intensity = 0;
	
	/**
	* @member {Number} color value.
	* @memberOf tomahawk_ns.ColorFilter.prototype
	**/
	ColorFilter.prototype.color = "#004080";
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ColorFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ColorFilter.prototype.process = function()
	{
		
		if( this.intensity == 0 )
			return;
		
		var context = this._context;
		var canvas = this._canvas;
		
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		
		buffer.width =  canvas.width;
		buffer.height =  canvas.height;
		
		bufferContext.save();
		bufferContext.drawImage(canvas, 0, 0);
		bufferContext.globalCompositeOperation = "source-in";
		bufferContext.beginPath();
		bufferContext.fillStyle = this.color;
		bufferContext.globalAlpha = this.intensity;
		bufferContext.fillRect(0,0,buffer.width, buffer.height);
		bufferContext.fill();
		bufferContext.restore();
		
		
		context.save();
		context.drawImage(buffer, 0, 0, buffer.width, buffer.height);
		context.restore();
	};

	tomahawk_ns.ColorFilter = ColorFilter;

})();