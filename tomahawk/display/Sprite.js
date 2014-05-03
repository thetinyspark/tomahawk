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
	 * @class Sprite
	 * @memberOf tomahawk_ns
	 * @description ...
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Sprite()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
	}
	
	Tomahawk.registerClass( Sprite, "Sprite" );
	Tomahawk.extend( "Sprite", "DisplayObjectContainer" );
	
	Sprite.prototype.___lastPoint = null;
	Sprite.prototype.___dragging = false;
	
	Sprite.prototype.___getDragDropMovement___ 		= function(event)
	{
		this.___lastPoint = this.___lastPoint || new tomahawk_ns.Point(0,0);
		
		var newPoint = new tomahawk_ns.Point(event.stageX, event.stageY);
		var movement = new tomahawk_ns.Point(0,0);
		
		if( this.parent != null )
		{
			newPoint = this.parent.globalToLocal(event.stageX, event.stageY);
		}
		
		movement.x = newPoint.x - this.___lastPoint.x;
		movement.y = newPoint.y - this.___lastPoint.y;
		
		this.___lastPoint.x = newPoint.x;
		this.___lastPoint.y = newPoint.y;
		
		return movement;
	};
	
	Sprite.prototype.___dragDropHandler___ 			= function(event)
	{
		if( this.___dragging == false )
			return;

		var movement = this.___getDragDropMovement___(event);
		
		this.x += movement.x;
		this.y += movement.y;
	};
	
	Sprite.prototype.___toggleDragDropHandler___ 	= function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN )
		{
			this.___dragging = true;
			this.startDrag();
		}
		else
		{
			this.___dragging = false;
			this.stopDrag();
		}
		
		this.___getDragDropMovement___(event);
	};
	
	Sprite.prototype.enableDragAndDrop 				= function(value)
	{
		this.stopDrag();
		
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		
		if( value == true )
		{
			this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
			this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		}
		
		this.mouseEnabled = true;
	};
	
	Sprite.prototype.startDrag 						= function()
	{
		this.stopDrag();
		this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___ );
		this.mouseEnabled = true;
	};
	
	Sprite.prototype.stopDrag 						= function()
	{
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___, true );
	};

	tomahawk_ns.Sprite = Sprite;
})();

