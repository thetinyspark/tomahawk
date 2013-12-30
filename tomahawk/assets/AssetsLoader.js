/**
 * ...
 * @author Thot
 */
 
 (function() {
	

function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );

// singleton
AssetsLoader._instance = null;
AssetsLoader.getInstance = function()
{
	if( AssetsLoader._instance == null )
		AssetsLoader._instance = new AssetsLoader();
		
	return AssetsLoader._instance;
};



AssetsLoader.prototype.onComplete = null;
AssetsLoader.prototype._loadingList = null;
AssetsLoader.prototype._data = null;

AssetsLoader.prototype.getData = function()
{
	return this._data;
};

AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this._data = new Object();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
};

AssetsLoader.prototype.load = function()
{
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete )
		{
			this.onComplete();
		}
	}
	else
	{
		var obj = this._loadingList.shift();
		var scope = this;
		var image = new Image();
		image.onload = function()
		{
			scope._onLoadComplete(image, obj.alias);
		};
		
		image.src = obj.url;
	}
};

AssetsLoader.prototype._onLoadComplete = function(image,alias)
{
	this._data[alias] = image;
	this.load();
};

tomahawk_ns.AssetsLoader = AssetsLoader;
})();
