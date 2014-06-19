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
	 * @class Texture
	 * @memberOf tomahawk_ns
	 * @param {Object} data The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement.
	 * @param {Array} rect The portion of the rendering data used for the rendering. Example: [0,0,10,10].
	 * @param {String} name The texture's name.
	 * @description The Texture class represents a 2-dimensional texture which will be used in a Bitmap instance. Defines a 2D texture for use during rendering.
	 * @constructor
	 **/
	function Texture(data,rect,name)
	{
		this.data = data || null;
		this.rect = rect || null;
		this.name = name || null;
	}

	Tomahawk.registerClass( Texture, "Texture" );

	/**
	* @description The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement
	* @member data
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Object}
	* @default null
	**/
	Texture.prototype.data = null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {String}
	* @description The name of the texture
	* @default null
	**/
	Texture.prototype.name = null;
	
	/**
	* @member rect
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Array}
	* @description An array representating the portion of the rendering data used for the rendering. Example: [0,0,10,10] the top-left 10x10 pixels square of the data will be rendered but not the rest.
	**/
	Texture.prototype.rect = null;

	tomahawk_ns.Texture = Texture;

})();




