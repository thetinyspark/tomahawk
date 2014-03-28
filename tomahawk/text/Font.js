/**
 * @author The Tiny Spark
 */
(function() {
	
	function Font(fontName)
	{
		this.fontName = fontName;
		this.refresh();
	}
	
	Tomahawk.registerClass(Font,"Font");

	Font.prototype.name = null;
	Font.prototype.baseWidth = 1;
	Font.prototype.baseHeight = 1;
	Font.prototype.baseSize = 10;
	
	Font.prototype.refresh = function()
	{
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
		var i = letters.length;
		var pixels = null;
		var alpha = -1;
		var rowLength = 0;
		var measure = null;
		
		canvas.width = canvas.height = 100;
		context.font = this.baseSize+'px '+this.fontName;
		context.textBaseline = 'top';
		context.textAlign = 'start';
		
		while( --i > -1 )
		{
			context.save();
			context.beginPath();
			
			measure = context.measureText(letters.charAt(i)).width;
			this.baseWidth = ( this.baseWidth < measure ) ? measure : this.baseWidth;
			
			context.fillText(letters.charAt(i),0,0);
			context.restore();
		}
		
		this.baseWidth += 5;

		pixels = context.getImageData(0,0,100,100).data;
		
		i = pixels.length / 4;
		
		while( --i > -1 )
		{
			alpha = pixels[i*4 + 3];
			
			if( alpha > 0 )
			{
				this.baseHeight = parseInt(i / canvas.height) + 2;
				break;
			}
		}
	};

	tomahawk_ns.Font = Font;
})();