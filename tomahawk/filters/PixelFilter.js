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
	 * @class PixelFilter
	 * @description the base class for all filters
	 * @memberOf tomahawk_ns
	 * @constructor
	 **/
	function PixelFilter(){}
	
	Tomahawk.registerClass( PixelFilter, "PixelFilter" );

	/**
	* @property {Number} BEFORE_DRAWING_FILTER 0
	* @memberOf tomahawk_ns.PixelFilter
	**/
	PixelFilter.BEFORE_DRAWING_FILTER = 0;
	
	/**
	* @property {Number} BEFORE_DRAWING_FILTER 0
	* @memberOf tomahawk_ns.PixelFilter
	**/
	PixelFilter.AFTER_DRAWING_FILTER = 1;
	
	PixelFilter.prototype._canvas = null;
	PixelFilter.prototype._context = null;
	PixelFilter.prototype._object = null;
	PixelFilter.prototype.type = 1;
	
	/**
	* @method getPixels
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description return the pixels of the linked DisplayObject into the region defined by (x,y,width,height)
	* @param {Number} x the x coordinates of top left corner of the region.
	* @param {Number} y the y coordinates of top left corner of the region.
	* @param {Number} width the width of the region.
	* @param {Number} height the height of the region.
	* @returns {ImageData}
	**/
	PixelFilter.prototype.getPixels = function(x,y,width,height)
	{
		return this._context.getImageData(x,y,width,height);
	};

	/**
	* @method setPixels
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description set the pixels of the linked DisplayObject from the point defined by (x,y)
	* @param {ImageData} pixels an ImageData object
	* @param {Number} x the x coordinates of top left corner from which the pixels will be set.
	* @param {Number} y the y coordinates of top left corner from which the pixels will be set.
	**/
	PixelFilter.prototype.setPixels = function(pixels,x,y)
	{
		this._context.putImageData(pixels,x,y);
	};

	/**
	* @method process
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	PixelFilter.prototype.process = function()
	{
		//code de notre filtre ici
	};

	/**
	* @method apply
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description apply the filter on the canvas passed in param
	* @param {HTMLCanvasElement} canvas the canvas used by the current filter.
	* @param {Canvas2DRenderingContext} context the context used by the current filter.
	* @param {tomahawk_ns.DisplayObject} object the DisplayObject on which the filter will be applied to
	**/
	PixelFilter.prototype.apply = function(canvas, context, object)
	{
		this._canvas = canvas;
		this._object = object;
		this._context = context;
		this.process();
	};

	/**
	* @method getOffsetX
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description returns the extra pixels generated by the filter on the x axis
	* @returns {Number}
	**/
	PixelFilter.prototype.getOffsetX = function(){ return 0};
	
	/**
	* @method getOffsetY
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description returns the extra pixels generated by the filter on the y axis
	* @returns {Number}
	**/
	PixelFilter.prototype.getOffsetY = function(){ return 0};
	
	tomahawk_ns.PixelFilter = PixelFilter;

})();