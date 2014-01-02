/**
 * @author The Tiny Spark
 */
(function() {
	
	function ShadowBlurFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
		this.type = tomahawk_ns.PixelFilter.BEFORE_DRAWING_FILTER;
	}
	
	Tomahawk.registerClass( ShadowBlurFilter, "ShadowBlurFilter" );
	Tomahawk.extend( "ShadowBlurFilter", "PixelFilter" );
	
	ShadowBlurFilter.prototype.shadowOffsetX = 1;
	ShadowBlurFilter.prototype.shadowOffsetY = 1;
	ShadowBlurFilter.prototype.shadowBlur 	= 100;
	ShadowBlurFilter.prototype.shadowColor 	= "white";

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

	tomahawk_ns.ShadowBlurFilter = ShadowBlurFilter;

})();