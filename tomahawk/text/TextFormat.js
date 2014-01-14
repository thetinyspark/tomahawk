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

	TextFormat.prototype.updateContext = function(context)
	{
		var bold = ( this.bold ) ? "bold" : "";
		var italic = ( this.italic ) ? "italic" : "";
		
		context.font = italic+' '+bold+' '+this.size+'px '+this.font;
		context.fillStyle = this.textColor;
		
		if( this.underline == true )
		{
			context.strokeStyle = this.textColor;
		}
	};

	TextFormat.prototype.clone = function()
	{
		var format = new tomahawk_ns.TextFormat();
		format.textColor = this.textColor+"";
		format.font = this.font+"";
		format.bold = ( this.bold == true );
		format.underline = ( this.underline == true );
		format.italic = ( this.italic == true );
		format.size = parseInt( this.size );
		
		return format;
	};
	
	tomahawk_ns.TextFormat = TextFormat;
})();