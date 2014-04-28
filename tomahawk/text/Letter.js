/*
* Visit http://the-tiny-spark.com/tomahawk/ for documentation, updates and examples.
*
* Copyright (c) 2014 the-tiny-spark.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.

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
		var font = tomahawk_ns.Font.getFont( this.format.font );
		var measure = font.measureText(this.value, this.format.size);
		
		context.save();
		
		if( this.value == " " )
		{
			this.format.updateContext(context);
			measure.width = context.measureText(" ").width;
		}
		
		this.textWidth = measure.width;
		this.textHeight = measure.height;
		this.width = this.textWidth;
		this.height = this.textHeight;
		
		context.restore();
		// TODO
		
		//var context = Letter._metricsContext;
		//context.save();
		//
		//this.format.updateContext(context);
		//this.textHeight = ( context.measureText('M').width );
		//this.textWidth = context.measureText(this.value).width;
		//this.width = this.textWidth;
		//this.height = this.textHeight * 1.4;
		//
		//context.restore();
	};

	Letter.prototype.draw = function(context)
	{
		if( this.selected == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.format.backgroundSelectedColor;
			context.fillRect(0, 0, this.width, this.height);
			context.fill();
			context.restore();
		}
		
		if( this.format.textBorder == true )
		{
			context.beginPath();
			this.format.updateBorderContext(context);
			context.strokeText(this.value,this.format.textBorderOffsetX,this.format.textBorderOffsetY);
			context.closePath();
		}
		
	
		this.format.updateContext(context);
		
		
		context.beginPath();
		context.fillText(this.value,0,0);
		context.closePath();
		
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
		letter.height = this.height;
		letter.width = this.width;
		letter.selected = this.selected;
		
		return letter;
	};
	
	tomahawk_ns.Letter = Letter;
})();