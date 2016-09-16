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
	* @class Bitmap
	* @memberOf tomahawk_ns
	* @description The Bitmap class represents display objects that represent bitmap images. 
	* @param {tomahawk_ns.Texture} [texture=undefined] the bitmap drawing texture.
	* @augments tomahawk_ns.DisplayObject
	* @constructor
	*/
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		
		if( texture == undefined )
			return;
			
		this.setTexture(texture);
	}

	Tomahawk.registerClass( Bitmap, "Bitmap" );
	Tomahawk.extend( "Bitmap", "DisplayObject" );

	/**
	 * @description The current drawing texture.
	 * @member texture
	 * @type {tomahawk_ns.Texture}
	 * @memberOf tomahawk_ns.Bitmap.prototype
	 * @default null
	 */
	Bitmap.prototype.texture = null;
	
	/**
	* @description Sets the Bitmap current Texture.
	* @method setTexture
	* @param {tomahawk_ns.Texture} texture 
	* @memberOf tomahawk_ns.Bitmap.prototype
	**/
	Bitmap.prototype.setTexture = function(texture)
	{
		this.texture = texture;
		this.width = this.texture.rect[2];
		this.height = this.texture.rect[3];
	};

	Bitmap.prototype.draw = function( context )
	{	
		var rect = this.texture.rect;
		var data = this.texture.data;
			
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	};
	
	Bitmap.prototype.toFlatObject	= function()
	{
		var copy 			= tomahawk_ns.DisplayObject.prototype.toFlatObject.apply(this);
		var texObj			= new Object();
		
		texObj.data 		= this.snapshot().toDataURL("image/png");
		texObj.rect			= this.texture.rect;
		texObj.name			= this.texture.name;
		
		copy.texture		= texObj;
		
		return copy;
	};
	
	tomahawk_ns.Bitmap = Bitmap;

})();


