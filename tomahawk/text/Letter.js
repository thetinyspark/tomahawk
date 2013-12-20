/**
 * ...
 * @author Hatshepsout
 */

function Letter()
{
	DisplayObject.apply(this);
	this.format = new TextFormat();
}

Tomahawk.registerClass(Letter,"Letter");
Tomahawk.extend("Letter","DisplayObject");

Letter.prototype.value 				= "";
Letter.prototype.format 			= null;
Letter.prototype.newline 			= false;
Letter.prototype.index 				= 0;
Letter.prototype.row 				= 0;	
Letter.prototype.textWidth 			= 0;	
Letter.prototype.textHeight 		= 0;	
Letter.prototype.selected			= false;
Letter.prototype.cursor				= false;		
Letter.prototype._drawCursor	 	= false;
Letter.prototype._drawCursorTime 	= 0;

Letter.prototype.updateMetrics = function(context)
{
	context.save();
	this.format.updateContext(context);
	this.textHeight = context.measureText('M').width;
	this.textWidth = context.measureText(this.value).width;
	this.width = this.textWidth;
	this.height = this.textHeight;
	
	context.restore();
};


Letter.prototype.draw = function(context,transformMatrix)
{
	this.updateMetrics(context);
	
	if( this.newline == true )
		return;
		
	if( this.selected == true )
	{
		context.globalCompositeOperation = "xor";
		
		context.save();
		context.beginPath();
		context.fillStyle = "black";
		context.fillRect(0, 0, this.textWidth, this.textHeight);
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
	
	
	

		
	if( this.cursor == true )
	{
		var time = new Date().getTime();
		if( time - this._drawCursorTime > 500 )
		{
			this._drawCursor = ( this._drawCursor == true ) ? false: true;
			this._drawCursorTime = time;
		}
		
		if( this._drawCursor == true )
		{
			context.save();
			context.beginPath();
			context.moveTo(this.textWidth,0);
			context.lineTo(this.textWidth,this.textHeight);
			context.stroke();
			context.restore();
		}
	}
};