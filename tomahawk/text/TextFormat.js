/**
 * @author The Tiny Spark
 */
(function() {
	
	function TextFormat(){}
	Tomahawk.registerClass( TextFormat, "TextFormat" );

	TextFormat.prototype.textColor = "black";
	TextFormat.prototype.textAlign = "center";
	TextFormat.prototype.underline = false;
	TextFormat.prototype.backgroundSelectedColor = "blue";
	TextFormat.prototype._updateFont = true;
	TextFormat.prototype._fontString = "";
	TextFormat.prototype._font = "Arial";
	TextFormat.prototype._bold = false;
	TextFormat.prototype._italic = false;
	TextFormat.prototype._size = 12;

	TextFormat.prototype.updateContext = function(context)
	{
		if( this._updateFont == true )
		{
			this._updateFont == false;	
			var bold = ( this._bold ) ? "bold" : "";
			var italic = ( this._italic ) ? "italic" : "";
			this._fontString = italic+' '+bold+' '+this._size+'px '+this._font;
		}
		
		context.font = this._fontString;
		context.fillStyle = this.textColor;
		//context.textAlign = this.textAlign;
		
		if( this.underline == true )
		{
			context.strokeStyle = this.textColor;
		}
	};

	TextFormat.prototype.clone = function()
	{
		var format = new tomahawk_ns.TextFormat();
		format.textColor = new String(this.textColor);
		format.textAlign = new String( this.textAlign );
		format.font = new String( this.font );
		format.bold = ( this.bold == true );
		format.underline = ( this.underline == true );
		format.italic = ( this.italic == true );
		format.size = new Number( this.size );
		
		return format;
	};
	
	TextFormat.prototype.setBold = function(value){ this._bold = value; this._updateFont = true; };
	TextFormat.prototype.setItalic = function(value){ this._italic = value; this._updateFont = true; };
	TextFormat.prototype.setSize = function(value){ this._size = value; this._updateFont = true; };
	TextFormat.prototype.setFont = function(value){ this._font = value; this._updateFont = true; };
	
	TextFormat.prototype.getBold = function(){ return this._bold };
	TextFormat.prototype.getItalic = function(){ return this._italic };
	TextFormat.prototype.getFont = function(){ return this._font };
	TextFormat.prototype.getSize = function(){ return this._size };

	
	Object.defineProperty( TextFormat.prototype, "bold", {
		set: TextFormat.prototype.setBold,
		get: TextFormat.prototype.getBold,
		enumerable: true
	} );
	Object.defineProperty( TextFormat.prototype, "italic", {
		set: TextFormat.prototype.setItalic,
		get: TextFormat.prototype.getItalic,
		enumerable: true
	} );
	Object.defineProperty( TextFormat.prototype, "size", {
		set: TextFormat.prototype.setSize,
		get: TextFormat.prototype.getSize,
		enumerable: true
	} );
	Object.defineProperty( TextFormat.prototype, "font", {
		set: TextFormat.prototype.setFont,
		get: TextFormat.prototype.getFont,
		enumerable: true
	} );
	
	tomahawk_ns.TextFormat = TextFormat;
})();