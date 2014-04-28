/**
 * @author The Tiny Spark
 */
(function() {
	
	function TextFormat(){}
	Tomahawk.registerClass( TextFormat, "TextFormat" );

	TextFormat.prototype.textColor = "black";
	TextFormat.prototype.underline = false;
	TextFormat.prototype.backgroundSelectedColor = "blue";
	TextFormat.prototype.font = "Arial";
	TextFormat.prototype.bold = false;
	TextFormat.prototype.italic = false;
	TextFormat.prototype.size = 12;
	TextFormat.prototype.textBorder = false;
	TextFormat.prototype.textBorderColor = "black";
	TextFormat.prototype.textBorderOffsetX = 0;
	TextFormat.prototype.textBorderOffsetY = 0;
	TextFormat.prototype.textBorderThickness = 2;
	
	TextFormat.prototype.customMetrics = false;
	TextFormat.prototype.fontBaseWidth = -1;
	TextFormat.prototype.fontBaseHeight = -1;
	TextFormat.prototype.fontBaseSize = 0;
	
	TextFormat.prototype.smooth = false;
	TextFormat.prototype.smoothQuality = 1;

	TextFormat.prototype.updateContext = function(context)
	{
		var bold = ( this.bold ) ? "bold" : "";
		var italic = ( this.italic ) ? "italic" : "";
		
		context.font = italic+' '+bold+' '+this.size+'px '+this.font;
		context.fillStyle = this.textColor;
		context.textBaseline = 'top';
		
		if( this.underline == true )
		{
			context.strokeStyle = this.textColor;
		}
	};
	
	TextFormat.prototype.updateBorderContext = function(context)
	{
		this.updateContext(context);
		
		if( this.smooth == true )
		{
			context.shadowColor = this.textBorderColor;
			context.shadowBlur = this.smoothQuality;
		}
		
		context.lineWidth = this.textBorderThickness;
		context.strokeStyle = this.textBorderColor;
	};

	TextFormat.prototype.clone = function()
	{
		var format = new tomahawk_ns.TextFormat();
		format.textColor = this.textColor+"";
		format.font = this.font+"";
		format.size = parseInt( this.size );
		format.fontBaseWidth = parseInt(this.fontBaseWidth);
		format.fontBaseHeight = parseInt(this.fontBaseHeight);
		format.fontBaseSize = parseInt(this.fontBaseSize);
		format.smoothQuality = parseInt(this.smoothQuality);
		
		
		format.textBorderColor = this.textBorderColor;
		format.textBorderOffsetY = parseInt(this.textBorderOffsetX);
		format.textBorderOffsetY = parseInt(this.textBorderOffsetY);
		format.textBorderThickness = parseInt(this.textBorderThickness);
		
		format.bold = ( this.bold == true );
		format.underline = ( this.underline == true );
		format.italic = ( this.italic == true );
		format.textBorder = ( this.textBorder == true );
		format.customMetrics = ( this.customMetrics == true );
		format.smooth = (this.smooth == true);
		
		return format;
	};
	
	tomahawk_ns.TextFormat = TextFormat;
})();