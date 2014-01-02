/**
 * @author The Tiny Spark
 */

(function() {

	function Sprite()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
	}

	Tomahawk.registerClass( Sprite, "Sprite" );
	Tomahawk.extend( "Sprite", "DisplayObjectContainer" );
	
	
	Sprite.prototype.handCursor = false;


	tomahawk_ns.Sprite = Sprite;
})();

