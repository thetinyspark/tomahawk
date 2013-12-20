/**
 * ...
 * @author Thot
*/



function TextureAtlas()
{
	this._textures = new Array();
}

Tomahawk.registerClass( TextureAtlas, "TextureAtlas" );

TextureAtlas.prototype._textures = null;
TextureAtlas.prototype.data = null;
TextureAtlas.prototype.name = null;

TextureAtlas.prototype.createTexture = function( name, startX, startY, endX, endY )
{
	var texture = new Texture();
	texture.name = name;
	texture.data = this.data;
	texture.rect = [startX, startY, endX, endY];
	
	this._textures.push(texture);
};

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

TextureAtlas.prototype.removeTexture = function( name )
{
	var texture = this.getTextureByName(name);
	
	if( texture == null )
		return;
		
	var index = this._textures.indexOf(texture);
	this._textures.splice(index,1);
};




