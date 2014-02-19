/**
 * @author The Tiny Spark
 */
 
 (function() {
	

function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );
Tomahawk.extend("AssetsLoader", "EventDispatcher" );

// singleton
AssetsLoader._instance = null;

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


AssetsLoader.prototype.getData = function()
{
	return this._data;
};

AssetsLoader.prototype.clean = function()
{
	this._data = new Object();
};

AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this.clean();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
	this._numFiles++;
};

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

AssetsLoader.prototype._progressHandler = function(image,alias)
{
	this._data[alias] = image;
	this.load();
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
};

AssetsLoader.prototype._errorHandler = function()
{
	this.load();
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.IO_ERROR, true, true) );
};

AssetsLoader.prototype.getProgression = function()
{
	var progression = ( this._numFiles - this._loadingList.length ) / this._numFiles;
	return progression;
};

tomahawk_ns.AssetsLoader = AssetsLoader;
})();
