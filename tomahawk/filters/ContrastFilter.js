	

(function() {

	function ContrastFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ContrastFilter, "ContrastFilter" );
	Tomahawk.extend( "ContrastFilter", "PixelFilter" );
	
	ContrastFilter.prototype.value = 0;

	ContrastFilter.prototype.process = function()
	{
		if( this.value == 0 )
			return;
			
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var r = 0, g = 0, b = 0, a = 0;
		var value = parseFloat(this.value);

		for (var i=0; i<data.length; i+=4) 
		{
			r = data[i+0]; r/=255; r -= 0.5; r *= value; r += 0.5; r *= 255;
			g = data[i+1]; g/=255; g -= 0.5; g *= value; g += 0.5; g *= 255;
			b = data[i+2]; b/=255; b -= 0.5; b *= value; b += 0.5; b *= 255;
			
			r = parseInt(r); r = ( r > 255 ) ? 255 : r; r = ( r < 0 ) ? 0 : r;
			g = parseInt(g); g = ( g > 255 ) ? 255 : g; g = ( g < 0 ) ? 0 : g;
			b = parseInt(b); b = ( b > 255 ) ? 255 : b; b = ( b < 0 ) ? 0 : b;
			
			data[i] = r;
			data[i+1] = g;
			data[i+2] = b;
		}
		
		this.setPixels(pixels,0,0);
	};
	
	
	tomahawk_ns.ContrastFilter = ContrastFilter;

})();