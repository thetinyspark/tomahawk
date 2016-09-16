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
	 * @class RemanenceFilter
	 * @description a basic RemanenceFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @param {Number} time the time of the effect
	 * @constructor
	 **/
	function RemanenceFilter(time,power)
	{
		this.time = time || 1000;
		this.power = power || 0.5;
		this._cache = document.createElement("canvas");
		this._cache.width = this._cache.height = 1;
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( RemanenceFilter, "RemanenceFilter" );
	Tomahawk.extend( "RemanenceFilter", "PixelFilter" );
	

	RemanenceFilter.prototype._cache = null;
	
	/**
	* @member {Number} time in ms at which you want to have remanence displayed.
	* @memberOf tomahawk_ns.RemanenceFilter.prototype
	**/
	RemanenceFilter.prototype.time = 1000;
	
	/**
	* @member {Number} power the remanence power.
	* @memberOf tomahawk_ns.RemanenceFilter.prototype
	**/
	RemanenceFilter.prototype.power = 0.5;
	
	RemanenceFilter.prototype._lastTime = 0;
	RemanenceFilter.prototype._maxWidth = 0;
	RemanenceFilter.prototype._maxHeight = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.RemanenceFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	RemanenceFilter.prototype.process = function()
	{
		var canvas = this._canvas;
		var context = this._context;
		var currentTime = new Date().getTime();
		var width = ( canvas.width > this._cache.width ) ? canvas.width : this._cache.width;
		var height = ( canvas.height > this._cache.height ) ? canvas.height : this._cache.height;
		
		var buffer = tomahawk_ns.PixelFilter._buffer;
		var bufferContext = buffer.getContext("2d");
		
		// ugly hack, save memory on chrome
		width = Math.ceil(width / 100) * 100;
		height =  Math.ceil(height / 100) * 100;
		
		buffer.width = width;
		buffer.height = height;
		
		bufferContext.save();
		bufferContext.globalAlpha = this.power;
		bufferContext.drawImage( this._cache, 0, 0 );
		bufferContext.restore();
		
		bufferContext.save();
		bufferContext.drawImage(canvas, 0, 0 );
		bufferContext.restore();
		
		context.save();
		context.globalCompositeOperation = "destination-over";
		context.globalAlpha = this.power;
		context.drawImage(this._cache,0,0);
		context.restore();
		
		
		canvas.width = buffer.width;
		canvas.height = buffer.height;
		
		context.save();
		context.drawImage( buffer, 0, 0 );
		context.restore();
		
		if( currentTime - this._lastTime < this.time )
		{
			return;
		}
		
		this._lastTime = currentTime;
		
		context = this._cache.getContext("2d");
		
		this._cache.width = buffer.width;
		this._cache.height = buffer.height;
			
		context.save();
		context.drawImage(canvas,0,0);
		context.restore();
	};

	tomahawk_ns.RemanenceFilter = RemanenceFilter;

})();