/**
 * ...
 * @author Hatshepsout
 */

function PixelFilter(){}
Tomahawk.registerClass( PixelFilter, "PixelFilter" );

PixelFilter.prototype._canvas = null;
PixelFilter.prototype._context = null;

PixelFilter.prototype.getPixels = function()
{
	return this._context.getImageData(0,0,this._canvas.width,this._canvas.height);
};

PixelFilter.prototype.setPixels = function(pixels)
{
	this._context.putImageData(pixels,0,0);
};

PixelFilter.prototype.process = function()
{
	//code de notre filtre ici
};

PixelFilter.prototype.apply = function(canvas,context)
{
	this._canvas = canvas;
	this._context = context;
	this.process();
};