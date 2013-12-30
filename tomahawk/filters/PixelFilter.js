/**
 * ...
 * @author Hatshepsout
 */
 
(function() {

	function PixelFilter(){}
	Tomahawk.registerClass( PixelFilter, "PixelFilter" );

	PixelFilter.prototype._canvas = null;
	PixelFilter.prototype._context = null;
	PixelFilter.prototype._object = null;

	PixelFilter.prototype.getPixels = function(x,y,width,height)
	{
		return this._context.getImageData(x,y,width,height);
	};

	PixelFilter.prototype.setPixels = function(pixels,x,y)
	{
		this._context.putImageData(pixels,x,y);
	};

	PixelFilter.prototype.process = function()
	{
		//code de notre filtre ici
	};

	PixelFilter.prototype.apply = function(canvas, context, object)
	{
		this._canvas = canvas;
		this._object = object;
		this._context = context;
		this.process();
	};

	tomahawk_ns.PixelFilter = PixelFilter;

})();