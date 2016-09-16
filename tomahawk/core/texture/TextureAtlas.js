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
	 * @class TextureAtlas
	 * @memberOf tomahawk_ns
	 * @description A texture atlas is a collection of many smaller textures in one big image. This class is used to access and create textures from such an atlas.
	 * @constructor
	 **/
	function TextureAtlas()
	{
		this._textures = new Array();
	}

	Tomahawk.registerClass( TextureAtlas, "TextureAtlas" );

	TextureAtlas.prototype._textures = null;
	
	/**
	* @description The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement
	* @member data
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @type {Object}
	* @default null
	**/
	TextureAtlas.prototype.data = null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {String}
	* @description The name of the texture atlas
	* @default null
	**/
	TextureAtlas.prototype.name = null;

	/**
	* @method createTexture
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} endX
	* @param {Number} endY
	* @description creates a new sub texture from the atlas which will render the region of the atlas data specified
	  by the startX, startY, endX, endY parameters with the name specified by the "name" parameter. The newly created texture is automatically stored within the atlas, it means that you can retrieve it with the "getTextureByName" method.
	**/
	TextureAtlas.prototype.createTexture = function( name, startX, startY, endX, endY )
	{
		var texture = new tomahawk_ns.Texture();
		texture.name = name;
		texture.data = this.data;
		texture.rect = [startX, startY, endX, endY];
		
		this._textures.push(texture);
	};
	
	/**
	* @method getTextureByName
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @returns {tomahawk_ns.Texture}
	* @description Returns the internal sub texture which matches the name specified by the "name" parameter.
	**/
	TextureAtlas.prototype.getTextureByName = function( name )
	{
		var i = this._textures.length;
		var currentTexture = null;
		while( --i > -1 )
		{
			currentTexture = this._textures[i];
			if( currentTexture.name == name )
				return currentTexture;
		}
		
		return null;
	};
	
	/**
	* @method removeTexture
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @description Removes the internal sub texture which matches the name specified by the "name" parameter.
	**/
	TextureAtlas.prototype.removeTexture = function( name )
	{
		var texture = this.getTextureByName(name);
		
		if( texture == null )
			return;
			
		var index = this._textures.indexOf(texture);
		this._textures.splice(index,1);
	};

	tomahawk_ns.TextureAtlas = TextureAtlas;

})();

