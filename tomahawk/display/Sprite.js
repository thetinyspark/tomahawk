/**
 * ...
 * @author Thot
*/

function Sprite()
{
	DisplayObjectContainer.apply(this);
}

Tomahawk.registerClass( Sprite, "Sprite" );
Tomahawk.extend( "Sprite", "DisplayObjectContainer" );

