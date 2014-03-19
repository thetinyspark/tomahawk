/**
 * @author The Tiny Spark
 */
(function() {
	
	function BrightnessFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( BrightnessFilter, "BrightnessFilter" );
	Tomahawk.extend( "BrightnessFilter", "PixelFilter" );
	
	BrightnessFilter.prototype.value = 0;

	BrightnessFilter.prototype.process = function()
	{
		if( this.value == 0 )
			return;
			
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var value = parseInt(this.value);
		
		for (var i=0; i<data.length; i+=4) 
		{
			data[i]	  = data[i] + value;
			data[i+1] = data[i+1] + value;
			data[i+2] = data[i+2] + value;
		}
		
		this.setPixels(pixels,0,0);
	};
	
	tomahawk_ns.BrightnessFilter = BrightnessFilter;

})();