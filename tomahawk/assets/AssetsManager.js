/**
 * ...
 * @author Thot
 */

(function() {
	
		
	function AssetsManager()
	{
		this._images = new Object();
		this._atlases = new Object();
		this._textures = new Object();
	};

	Tomahawk.registerClass( AssetsManager, "AssetsManager" );

	// singleton
	AssetsManager._instance = null;
	AssetsManager.getInstance = function()
	{
		if( AssetsManager._instance == null )
			AssetsManager._instance = new AssetsManager();
			
		return AssetsManager._instance;
	};

	AssetsManager.prototype._images = null;
	AssetsManager.prototype._atlases = null;
	AssetsManager.prototype._textures = null;


	// images
	AssetsManager.prototype.getImages = function()
	{
		return this._images;
	};

	AssetsManager.prototype.getImageByAlias = function(alias)
	{
		if( this._images[alias] )
			return this._images[alias];
			
		return null;
	};

	AssetsManager.prototype.addImage = function(image, alias)
	{
		this._images[alias] = image;
	};

	//atlases
	AssetsManager.prototype.addAtlas = function(atlas, alias)
	{
		this._atlases[alias] = atlas;
	};

	AssetsManager.prototype.getAtlases = function()
	{
		return this._atlases;
	};

	AssetsManager.prototype.getAtlasByAlias = function(alias)
	{
		if( this._atlases[alias] )
			return this._atlases[alias];
			
		return null;
	};

	//textures
	AssetsManager.prototype.addTexture = function(texture, alias)
	{
		this._textures[alias] = texture;
	};

	AssetsManager.prototype.getTextures = function()
	{
		return this._textures;
	};

	AssetsManager.prototype.getTextureByAlias = function(alias)
	{
		if( this._textures[alias] )
			return this._textures[alias];
			
		return null;
	};


	tomahawk_ns.AssetsManager = AssetsManager;
})();

