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
	
	/**
	 * @class Font
	 * @memberOf tomahawk_ns
	 * @description The Font class is currently useful only to find out information about fonts; you cannot alter a font by using this class. You cannot use the Font class to load external fonts.
	 * @constructor
	 **/
	function Font(fontName)
	{
		this.name = fontName;
		this.sizes = new Object();
	}
		
	/**
	* @member name
	* @memberOf tomahawk_ns.Font.prototype
	* @type {string}
	* @description the font name
	**/
	Font.prototype.name = null;
	
	/**
	* @member bold
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Boolean}
	* @description defines if the font is bold or not.
	**/
	Font.prototype.bold = false;
	
	/**
	* @member italic
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Boolean}
	* @description defines if the font is in italic or not.
	**/
	Font.prototype.italic = false;
	
	/**
	* @protected
	* @member baseSize
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description the base size of the font, used internally to measure text.
	**/
	Font.prototype.baseSize = 60;
	
	/**
	* @protected
	* @member sizes
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Object}
	* @description An object that stores all the sizes of each character in the corresponding font.
	**/
	Font.prototype.sizes = null;
		
	/**
	* @member maxWidth
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description max char width for this font
	**/
	Font.prototype.maxWidth = 0;
	
	/**
	* @member maxHeight
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description max char height for this font
	**/
	Font.prototype.maxHeight = 0;
	
	
	/**
	* @method addFont
	* @description create and register a new Font object, you have to specify a 'valid' font name, Arial for example.
	* @memberOf tomahawk_ns.Font
	* @param {string} fontName the font name.
	**/
	Font.addFont = function(fontName, fontURL)
	{
		var font = new tomahawk_ns.Font(fontName);
		tomahawk_ns.Font._fonts[fontName] = font;
	};	
	
	/**
	* @method getFont
	* @description get an instance of Font according to the fontName passed in param, you have to specify a 'valid' font name, Arial for example. If there's no instance of {tomahawk_ns.Font} who matches the fontName, a regular one is automatically created.
	* @memberOf tomahawk_ns.Font
	* @param {string} fontName the font name
	* @returns {tomahawk_ns.Font}
	**/
	Font.getFont = function(fontName)
	{
		if( !tomahawk_ns.Font._fonts[fontName])
		{
			tomahawk_ns.Font.addFont(fontName);
		}
		
		return tomahawk_ns.Font._fonts[fontName];
	};
	
	/**
	* @method measureText
	* @description calculate the width and the height of the text passed in param, for the font size passed in param.
	* @memberOf tomahawk_ns.Font.prototype
	* @param {string} text the text you want to measure
	* @param {Numbr} size the fontSize of the text
	* @returns {Object} an object with 'width' and 'height' properties
	**/
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
			div.style.padding = '0';
			div.style.top = '100px';
			div.style.left = '-1000px';
			div.style.width = 'auto';
			div.style.fontFamily = this.name;
			div.style.fontWeight = ( this.bold == true ) ? 'bold' : 'normal';
			div.style.fontStyle = ( this.italic == true ) ? 'italic' : 'normal';
			div.style.fontSize = this.baseSize + 'px';
			
			if( !div.parentNode )
				document.body.appendChild(div);
		
			div.innerHTML = ( text == "\n" ) ? "<br />" : text;
			
			width = div.offsetWidth;
			height = div.offsetHeight;
			
			this.maxWidth = ( width > this.maxWidth ) ? width : this.maxWidth;
			this.maxHeight = ( height > this.maxHeight ) ? height : this.maxHeight;
			
			document.body.removeChild(div);
		
			obj.width = width;
			obj.height = height;
			
			this.sizes[text] = obj;
		}
			
		result.width = this.sizes[text].width * ratio;
		result.height = this.sizes[text].height * ratio;
		
		return result;
	};

	Font._div = document.createElement("div");
	Font._style = document.createElement("style");
	Font._fonts = new Object();
	
	tomahawk_ns.Font = Font;
})();