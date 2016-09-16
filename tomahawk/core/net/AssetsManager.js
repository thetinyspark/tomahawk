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
	 * @class AssetsManager
	 * @memberOf tomahawk_ns
	 * @description The AssetsManager class is used to stores and restitutes assets objects like Textures, TextureAtlases, Images.
	 * @constructor
	 **/
	function AssetsManager()
	{
		this._images 	= new Object();
		this._atlases 	= new Object();
		this._data 		= new Object();
		this._textures 	= new Object();
	};

	Tomahawk.registerClass( AssetsManager, "AssetsManager" );

	// singleton
	AssetsManager._instance 					= null;
	
	/**
	* @description Returns a unique instance of AssetsManager, singleton implementation.
	* @method getInstance
	* @memberOf tomahawk_ns.AssetsManager
	* @returns {tomahawk_ns.AssetsManager}
	**/
	AssetsManager.getInstance 					= function()
	{
		if( tomahawk_ns.AssetsManager._instance == null )
			tomahawk_ns.AssetsManager._instance = new tomahawk_ns.AssetsManager();
			
		return tomahawk_ns.AssetsManager._instance;
	};

	AssetsManager.prototype._images 			= null;
	AssetsManager.prototype._atlases 			= null;
	AssetsManager.prototype._textures 			= null;
	AssetsManager.prototype._data 				= null;


	// images
	/**
	* @description Returns a key indexed objects with all the HTMLImageElement stored within the manager
	* @method getImages
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} a key indexed objects
	**/
	AssetsManager.prototype.getImages 			= function()
	{
		return this._images;
	};
	
	/**
	* @description returns an HTMLImageElement that matches with the "alias" parameter
	* @method getImageByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {DOMImageElement} an HTMLImageElement object
	**/
	AssetsManager.prototype.getImageByAlias 	= function(alias)
	{
		if( this._images[alias] )
			return this._images[alias];
			
		return null;
	};

	/**
	* @description Adds an HTMLImageElement object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getImageByAlias" method.
	* @method addImage
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {HTMLImageElement} image an HTMLImageElement object
	* @param {String} alias
	**/
	AssetsManager.prototype.addImage 			= function(image, alias)
	{
		this._images[alias] = image;
	};

	//atlases
	
	/**
	* @description Adds a TextureAtlas object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getAtlasByAlias" method.
	* @method addAtlas
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {tomahawk_ns.TextureAtlas} atlas a TextureAtlas object
	* @param {String} alias
	**/
	AssetsManager.prototype.addAtlas 			= function(atlas, alias)
	{
		this._atlases[alias] = atlas;
	};
	
	/**
	* @method getAtlases
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the atlases stored within the manager
	**/
	AssetsManager.prototype.getAtlases 			= function()
	{
		return this._atlases;
	};
	
	/**
	* @description returns an TextureAtlas instance that matches with the "alias" parameter
	* @method getAtlasByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {tomahawk_ns.TextureAtlas} a TextureAtlas object
	**/
	AssetsManager.prototype.getAtlasByAlias 	= function(alias)
	{
		if( this._atlases[alias] )
			return this._atlases[alias];
			
		return null;
	};

	//textures
	/**
	* @description Adds a Texture object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getTextureByAlias" method.
	* @method addAtlas
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {tomahawk_ns.Texture} texture a Texture object
	* @param {String} alias
	**/
	AssetsManager.prototype.addTexture 			= function(texture, alias)
	{
		this._textures[alias] = texture;
	};

	/**
	* @method getTextures
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the textures stored within the manager
	**/
	AssetsManager.prototype.getTextures 		= function()
	{
		return this._textures;
	};
	
	/**
	* @description returns an Texture instance that matches with the "alias" parameter
	* @method getTextureByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {tomahawk_ns.Texture} a Texture object
	**/
	AssetsManager.prototype.getTextureByAlias 	= function(alias)
	{
		if( this._textures[alias] )
			return this._textures[alias];
			
		return null;
	};

	//data objects
	/**
	* @description Add a data object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getDataObjectByAlias" method.
	* @method addDataObject
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {Object} a data Object
	* @param {String} alias
	**/
	AssetsManager.prototype.addDataObject 		= function(data, alias)
	{
		this._data[alias] = data;
	};
	
	/**
	* @description returns a data Object instance that matches with the "alias" parameter
	* @method getDataObjectByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} a data object
	**/
	AssetsManager.prototype.getDataObjectByAlias = function(alias)
	{
		if( this._data[alias] )
			return this._data[alias];
			
		return null;
	};
	
	/**
	* @method getDataObjects
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the data objects stored within the manager
	**/
	AssetsManager.prototype.getDataObjects 		= function()
	{
		return this._data;
	};

	tomahawk_ns.AssetsManager = AssetsManager;
})();

