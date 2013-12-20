/*source: html5rocks.com*/

function GrayScaleFilter(){}
Tomahawk.registerClass( GrayScaleFilter, "GrayScaleFilter" );
Tomahawk.extend( "GrayScaleFilter", "PixelFilter" );

GrayScaleFilter.prototype.process = function()
{
	var pixels = this.getPixels();
	var data = pixels.data;
	
	for (var i=0; i<data.length; i+=4) 
	{
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
		var v = 0.2126*r + 0.7152*g + 0.0722*b;
		data[i] = data[i+1] = data[i+2] = v;
	}
	
	this.setPixels(pixels);
};