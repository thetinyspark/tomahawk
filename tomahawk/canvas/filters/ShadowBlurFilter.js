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
	 * @class ShadowBlurFilter
	 * @description a basic ShadowBlurFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @param {Number} x the x coordinates of top left corner of the region.
	 * @param {Number} y the y coordinates of top left corner of the region.
	 * @param {String} color the css color of the shadow.
	 * @param {Number} quality the blur quality.
	 * @constructor
	 **/
	function ShadowBlurFilter(x,y,color, quality)
	{
		this.shadowOffsetX = x || this.shadowOffsetX;
		this.shadowOffsetY = y || this.shadowOffsetY;
		this.shadowColor = color || this.shadowColor;
		this.shadowBlur = quality || this.shadowBlur;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ShadowBlurFilter, "ShadowBlurFilter" );
	Tomahawk.extend( "ShadowBlurFilter", "PixelFilter" );
	
	/**
	* @member {Number} shadowOffsetX shadow offset on the x axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetX = 0;
	/**
	* @member {Number} shadowOffsetY shadow offset on the y axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetY = 0;
	/**
	* @member {Number} shadowBlur intensity of the shadow blur.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowBlur 	= 2;
	/**
	* @member {Number} shadowColor the color of the shadow.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowColor 	= "black";
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ShadowBlurFilter.prototype.process = function()
	{
		var context = this._context;
		var canvas = this._canvas;
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		var bounds = this._offsetBounds;
		
		buffer.width = canvas.width + bounds.width;
		buffer.height = canvas.height + bounds.height;
		
		
		bufferContext.save();
		bufferContext.shadowBlur = this.shadowBlur;
		bufferContext.shadowColor = this.shadowColor;
		bufferContext.shadowOffsetX = this.shadowOffsetX;
		bufferContext.shadowOffsetY = this.shadowOffsetY;
		bufferContext.drawImage( canvas, bounds.x, bounds.y );
		bufferContext.restore();
		
		context.clearRect(0,0,canvas.width,canvas.height);
		
		context.save();
		context.drawImage( buffer, 0, 0 );
		context.restore();
	};
	
	ShadowBlurFilter.prototype.getOffsetBounds = function(canvas, context, object)
	{ 
		var width = Math.abs( this.shadowOffsetX ) + (this.shadowBlur * 2);
		var height = Math.abs( this.shadowOffsetY ) + (this.shadowBlur * 2);
		
		this._offsetBounds = this._offsetBounds || new tomahawk_ns.Rectangle();
		this._offsetBounds.x = width >> 1;
		this._offsetBounds.y = height >> 1;
		this._offsetBounds.width = Math.abs( this.shadowOffsetX ) + width;
		this._offsetBounds.height = Math.abs( this.shadowOffsetY ) + height;
		
		return this._offsetBounds;
	};

	tomahawk_ns.ShadowBlurFilter = ShadowBlurFilter;

})();