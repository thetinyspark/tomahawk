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
 * @class DataLoader
 * @memberOf tomahawk_ns
 * @description The DataLoader class is a basic data (text,json,xml,binary) mass loader.
 * @constructor
 * @augments tomahawk_ns.EventDispatcher
 **/
function DataLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( DataLoader, "DataLoader" );
Tomahawk.extend("DataLoader", "EventDispatcher" );

// singleton
DataLoader._instance 				= null;

/**
* @description Returns a unique instance of DataLoader, singleton implementation.
* @method getInstance
* @memberOf tomahawk_ns.DataLoader
* @returns {tomahawk_ns.DataLoader} returns a number
**/
DataLoader.getInstance 				= function()
{
	if( tomahawk_ns.DataLoader._instance == null )
		tomahawk_ns.DataLoader._instance = new tomahawk_ns.DataLoader();
		
	return tomahawk_ns.DataLoader._instance;
};

DataLoader.prototype.onComplete 	= null;
DataLoader.prototype._loadingList 	= null;
DataLoader.prototype._data 			= null;
DataLoader.prototype._numFiles 		= 0;

/**
* @description Returns a key indexed object which contains the loaded data.
* @method getData
* @memberOf tomahawk_ns.DataLoader.prototype
* @returns {Object} a key indexed object
**/
DataLoader.prototype.getData = function()
{
	return this._data;
};

/**
* @description Cleans the internal loaded data object, call it before another loading task in order to save memory.
* @method clean
* @memberOf tomahawk_ns.DataLoader.prototype
**/
DataLoader.prototype.clean = function()
{
	this._data = new Object();
};

/**
* @description Add a file to the loading list, with the url specified by the "fileURL" parameter and an alias specified by the "fileAlias" parameter.
* @method load
* @param {String] fileURL the distant file url.
* @param {String] fileAlias The alias of the url used as a key within the object returned by the "getData()" method.
* @param {String] mode the request mode [GET or POST]
* @param {Object] params  the params sent to the distant url 
* @memberOf tomahawk_ns.DataLoader.prototype
**/
DataLoader.prototype.addFile = function(fileURL, fileAlias, mode,params)
{
	// on réinitialise les data
	this.clean();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias,params:params,mode:mode});
	this._numFiles++;
};

/**
* @description Starts the loading process.
* @method load
* @memberOf tomahawk_ns.DataLoader.prototype
**/
DataLoader.prototype.load = function()
{
	var scope 	= this;
	var obj 	= null;
	var http 	= null;
	var data 	= null;
	var alias	= null;
	var props	= null;
	
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
		obj 	= this._loadingList.shift();
		http 	= new XMLHttpRequest();
		data 	= null;
		alias 	= obj.alias
		props	= new Array();
		
		
		if( obj.params != undefined && obj.params != null )
		{
			for( prop in obj.params )
			{
				props.push( prop+"="+obj.params[prop] );
			}
			
			data = props.join("&");
		}
		
		if(obj.mode == "POST")
		{
			http.open( "POST" , obj.url, true);
		}
		else
		{
			http.open( "GET" , obj.url+"?"+data, true);
		}

		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.onreadystatechange = function() 
		{
			if(http.readyState == 4 && http.status == 200) 
			{
				scope._progressHandler(http.responseText, alias);
			}
		}
		
		if(obj.mode == "POST")
		{
			http.send(data);
		}
		else
		{
			http.send(null);
		}
	}
};

/**
* @description Returns the loading progression ( between 0.0 and 1.0 )
* @method getProgression
* @memberOf tomahawk_ns.DataLoader.prototype
* @returns {Number}
**/
DataLoader.prototype.getProgression = function()
{
	var progression = ( this._numFiles - this._loadingList.length ) / this._numFiles;
	return progression;
};

DataLoader.prototype._progressHandler = function(data,alias)
{
	this._data[alias] = data;
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
	this.load();
};

DataLoader.prototype._errorHandler = function()
{
	this.load();
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.IO_ERROR, true, true) );
};

tomahawk_ns.DataLoader = DataLoader;
})();
