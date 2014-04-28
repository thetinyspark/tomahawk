(function() {
	
	function Font(fontName, fontURL )
	{
		this.name = fontName;
		this.url = fontURL;
		this.sizes = new Object();
	}
	
	Font._div = document.createElement("div");
	Font._style = document.createElement("style");
	Font._fonts = new Object();
	Font.prototype.maxWidth = 0;
	Font.prototype.maxHeight = 0;
	
	Font.addFont = function(fontName, fontURL)
	{
		var font = new tomahawk_ns.Font(fontName,fontURL);
		tomahawk_ns.Font._fonts[fontName] = font;
	};	
	
	Font.getFont = function(fontName)
	{
		if( !tomahawk_ns.Font._fonts[fontName])
		{
			tomahawk_ns.Font.addFont(fontName);
		}
		
		return tomahawk_ns.Font._fonts[fontName];
	};
	
	Font.prototype.name = null;
	Font.prototype.url = null;
	Font.prototype.bold = false;
	Font.prototype.italic = false;
	Font.prototype.baseSize = 60;
	Font.prototype.sizes = null;
	
	Font.prototype.measureText = function(text, size)
	{
		var div = Font._div;
		var width = 0
		var height = 0;
		var obj = new Object();
		var result = new Object();
		var ratio = size / this.baseSize;
		
		if( this.sizes[text] == undefined )
		{	
			div.style.position = 'absolute';
			div.style.top = '100px';
			div.style.left = '-1000px';
			div.style.width = 'auto';
			div.style.fontFamily = this.name;
			div.style.fontWeight = ( this.bold == true ) ? 'bold' : 'normal';
			div.style.fontStyle = ( this.italic == true ) ? 'italic' : 'normal';
			div.style.fontSize = this.baseSize + 'px';
			
			if( !div.parentNode )
				document.body.appendChild(div);
		
			div.innerHTML = text;
			
			width = div.offsetWidth;
			height = div.offsetHeight;
			
			this.maxWidth = ( width > this.maxWidth ) ? width : this.maxWidth;
			this.maxHeight = ( height > this.maxHeight ) ? height : this.maxHeight;
			
			document.body.removeChild(div);
		
			obj.width = parseInt(width);
			obj.height = parseInt(height);
			
			this.sizes[text] = obj;
		}
			
		result.width = parseInt(this.sizes[text].width * ratio);
		result.height = parseInt(this.sizes[text].height * ratio);
		
		return result;
	};

	tomahawk_ns.Font = Font;
})();