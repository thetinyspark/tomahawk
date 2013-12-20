function TextFormat(){}

TextFormat.prototype.textColor = "black";
TextFormat.prototype.textAlign = "center";
TextFormat.prototype.font = "Arial";
TextFormat.prototype.bold = false;
TextFormat.prototype.italic = false;
TextFormat.prototype.size = 12;
TextFormat.prototype.underline = false;

TextFormat.prototype.updateContext = function(context)
{
	var bold = ( this.bold ) ? "bold" : "";
	var italic = ( this.italic ) ? "italic" : "";
	
	context.font = italic+' '+bold+' '+this.size+'px '+this.font;
	context.fillStyle = this.textColor;
	//context.textAlign = this.textAlign;
	
	if( this.underline == true )
	{
		context.strokeStyle = this.textColor;
	}
};

TextFormat.prototype.clone = function()
{
	var format = new TextFormat();
	format.textColor = this.textColor.substr(0,this.textColor.length);
	format.textAlign = new String( this.textAlign );
	format.font = new String( this.font );
	format.bold = ( this.bold == true );
	format.underline = ( this.underline == true );
	format.italic = ( this.italic == true );
	format.size = new Number( this.size );
	
	return format;
};