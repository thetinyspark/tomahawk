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
	 * @constructor
	 **/
	function ShadowBlurFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ShadowBlurFilter, "ShadowBlurFilter" );
	Tomahawk.extend( "ShadowBlurFilter", "PixelFilter" );
	
	ShadowBlurFilter.prototype._extraBounds = null;
	
	/**
	* @member {Number} shadowOffsetX shadow offset on the x axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetX = 1;
	/**
	* @member {Number} shadowOffsetY shadow offset on the y axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetY = 1;
	/**
	* @member {Number} shadowBlur intensity of the shadow blur.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowBlur 	= 100;
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
		var context = this._canvas.getContext("2d");
		this._canvas.width += this.shadowBlur + this.shadowOffsetX;
		this._canvas.height += this.shadowBlur + this.shadowOffsetY;
		context.shadowBlur = this.shadowBlur;
		context.shadowColor = this.shadowColor;
		context.shadowOffsetX = this.shadowOffsetX;
		context.shadowOffsetY = this.shadowOffsetY;
	};
	
	ShadowBlurFilter.prototype.getOffsetBounds = function()
	{ 
		var width = this.shadowBlur;
		var mid = width >> 1;
		
		this._extraBounds = this._extraBounds || new tomahawk_ns.Rectangle();
		this._extraBounds.x = this.shadowOffsetX - mid;
		this._extraBounds.y = this.shadowOffsetY - mid;
		this._extraBounds.width = Math.abs(this.shadowOffsetX) + width;
		this._extraBounds.height = Math.abs(this.shadowOffsetY) + width;
		this._extraBounds.x = ( this._extraBounds.x > 0 ) ? 0 : this._extraBounds.x;
		this._extraBounds.y = ( this._extraBounds.y > 0 ) ? 0 : this._extraBounds.y;
		
		return this._extraBounds;
	};

	tomahawk_ns.ShadowBlurFilter = ShadowBlurFilter;

})();