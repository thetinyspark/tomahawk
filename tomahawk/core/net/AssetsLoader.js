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
 * @class AssetsLoader
 * @memberOf tomahawk_ns
 * @description The AssetsLoader class is a basic Image mass loader.
 * @constructor
 * @augments tomahawk_ns.EventDispatcher
 **/
function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );
Tomahawk.extend("AssetsLoader", "EventDispatcher" );

// singleton
AssetsLoader._instance = null;

/**
* @description Returns a unique instance of AssetsLoader, singleton implementation.
* @method getInstance
* @memberOf tomahawk_ns.AssetsLoader
* @returns {tomahawk_ns.AssetsLoader} returns a number
**/
AssetsLoader.getInstance = function()
{
	if( tomahawk_ns.AssetsLoader._instance == null )
		tomahawk_ns.AssetsLoader._instance = new tomahawk_ns.AssetsLoader();
		
	return tomahawk_ns.AssetsLoader._instance;
};

AssetsLoader.prototype.onComplete = null;
AssetsLoader.prototype._loadingList = null;
AssetsLoader.prototype._data = null;
AssetsLoader.prototype._numFiles = 0;

/**
* @description Returns a key indexed object which contains the loaded data.
* @method getData
* @memberOf tomahawk_ns.AssetsLoader.prototype
* @returns {Object} a key indexed object
**/
AssetsLoader.prototype.getData = function()
{
	return this._data;
};

/**
* @description Cleans the internal loaded data object, call it before another loading task in order to save memory.
* @method clean
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.clean = function()
{
	this._loadingList = new Array();
	this._data = new Object();
};

/**
* @description Adds an image to the loading list, with the url specified by the "fileURL" parameter and an alias specified by the "fileAlias" parameter.
* @method load
* @param {String] fileURL the url of the image.
* @param {String] fileAlias The alias of the image used as a key within the object returned by the "getData()" method.
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this._data = new Object();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
	this._numFiles++;
};

/**
* @description Aborts the loading process.
* @method abort
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.abort = function()
{
	this._loadingList = new Array();
};

/**
* @description Starts the loading process.
* @method load
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.load = function()
{
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete != null )
		{
			this.onComplete();
		}
		
		this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.COMPLETE, true, true) );
		this._numFiles = 0;
	}
	else
	{
		var obj = this._loadingList.shift();
		var scope = this;
		var image = new Image();
		
		image.onerror = function()
		{
			scope._errorHandler();
		};
		
		image.onload = function()
		{
			scope._progressHandler(image, obj.alias);
		};
		
		image.src = obj.url;
	}
};

/**
* @description Returns the loading progression ( between 0.0 and 1.0 )
* @method getProgression
* @memberOf tomahawk_ns.AssetsLoader.prototype
* @returns {Number}
**/
AssetsLoader.prototype.getProgression = function()
{
	var progression = ( this._numFiles - this._loadingList.length ) / this._numFiles;
	return progression;
};

AssetsLoader.prototype._progressHandler = function(image,alias)
{
	this._data[alias] = image;
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
	this.load();
};

AssetsLoader.prototype._errorHandler = function()
{
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.IO_ERROR, true, true) );
	this.load();
};

tomahawk_ns.AssetsLoader = AssetsLoader;
})();
