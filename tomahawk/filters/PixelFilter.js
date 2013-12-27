/**
 * ...
 * @author Hatshepsout
 */

function PixelFilter(){}
Tomahawk.registerClass( PixelFilter, "PixelFilter" );

PixelFilter.prototype._canvas = null;
PixelFilter.prototype._context = null;
PixelFilter.prototype._object = null;

PixelFilter.prototype.getPixels = function(x,y,width,height)
{
	var x1 = ( x < 0 ) ? 0 : x;
	var y1 = ( y < 0 ) ? 0 : y;
	var width1 = ( width > this._canvas.width ) ? this._canvas.width : width;
	var height1 = ( height > this._canvas.height ) ? this._canvas.height : height;
	return this._context.getImageData(x1,y1,width1,height1);
};

PixelFilter.prototype.setPixels = function(pixels,x,y)
{
	var x1 = ( x < 0 ) ? 0 : x;
	var y1 = ( y < 0 ) ? 0 : y;
	this._context.putImageData(pixels,x1,y1);
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