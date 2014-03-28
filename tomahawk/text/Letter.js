/**
 * @author The Tiny Spark
 */

(function() {
	
 
	function Letter(value)
	{
		tomahawk_ns.DisplayObject.apply(this);		
		Letter._metricsContext = Letter._metricsContext || document.createElement("canvas").getContext("2d");
		this.setTextFormat( new tomahawk_ns.TextFormat() );
		this.value = ( value == undefined ) ? "" : value;
	}

	Tomahawk.registerClass(Letter,"Letter");
	Tomahawk.extend("Letter","DisplayObject");

	Letter.prototype.newline 			= false;
	Letter.prototype.value 				= "";
	Letter.prototype.format 			= null;
	Letter.prototype.index 				= 0;
	Letter.prototype.textWidth 			= 0;	
	Letter.prototype.textHeight 		= 0;	
	Letter.prototype.selected			= false;
	Letter._metricsContext				= null;
	
	
	Letter.prototype.setTextFormat = function(value)
	{
		this.format = value;
		this.updateMetrics();
	};

	Letter.prototype.updateMetrics = function()
	{
		var context = Letter._metricsContext;
		context.save();
		
		this.format.updateContext(context);
		this.textHeight = ( context.measureText('M').width ) * 1.4;
		this.textWidth = context.measureText(this.value).width;
		this.width = this.textWidth;
		this.height = this.textHeight;
		
		context.restore();
	};

	Letter.prototype.draw = function(context)
	{
		if( this.selected == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.format.backgroundSelectedColor;
			context.textBaseline = 'top';
			//context.fillRect(0, 0, this.textWidth, this.textHeight );
			context.fillRect(0, 0, this.textWidth, 0);
			context.fill();
			context.restore();
		}
		
		this.format.updateContext(context);
		context.fillText(this.value,0,this.textHeight);
		
		if( this.format.underline == true )
		{
			context.save();
			context.beginPath();
			context.moveTo(0,this.textHeight + 2);
			context.lineTo( this.textWidth,this.textHeight + 2);
			context.stroke();
			context.restore();
		}	
	};

	Letter.prototype.clone = function()
	{
		var letter = new tomahawk_ns.Letter(this.value);
		letter.format = this.format.clone();
		letter.index = this.index;
		letter.row = this.row;
		letter.textWidth = this.textWidth;
		letter.textHeight = this.textHeight;
		letter.selected = this.selected;
		
		return letter;
	};
	
	tomahawk_ns.Letter = Letter;
})();