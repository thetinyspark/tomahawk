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
	 * @abstract
	 * @class DragAndDropBehavior
	 * @memberOf tomahawk_ns
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 * @description The DragAndDropBehavior class adds a classic drag and drop behavior to a display object
	 **/
	function DragAndDropBehavior()
	{
		tomahawk_ns.EventDispatcher.apply(this);
	}

	Tomahawk.registerClass( DragAndDropBehavior, "DragAndDropBehavior" );
	Tomahawk.extend( "DragAndDropBehavior", "EventDispatcher" );
	
	
	DragAndDropBehavior.prototype._lastPoint = null;
	DragAndDropBehavior.prototype._dragging = false;
	DragAndDropBehavior.prototype._target = null;
	
	DragAndDropBehavior.prototype.___getDragDropMovement___ 		= function(event)
	{
		if( this._target == null )
			return;
		
		this._lastPoint = this._lastPoint || new tomahawk_ns.Point(0,0);
		
		var newPoint = new tomahawk_ns.Point(event.stageX, event.stageY);
		var movement = new tomahawk_ns.Point(0,0);
		
		if( this._target.parent != null )
		{
			newPoint = this._target.parent.globalToLocal(event.stageX, event.stageY);
		}
		
		movement.x = newPoint.x - this._lastPoint.x;
		movement.y = newPoint.y - this._lastPoint.y;
		
		this._lastPoint.x = newPoint.x;
		this._lastPoint.y = newPoint.y;
		
		return movement;
	};
	
	DragAndDropBehavior.prototype.___dragDropHandler___ 			= function(event)
	{
		if( this._dragging == false || this._target == null )
			return;

		var movement = this.___getDragDropMovement___(event);
		
		this._target.x += movement.x;
		this._target.y += movement.y;
	};
	
	DragAndDropBehavior.prototype.___toggleDragDropHandler___ 		= function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN )
		{
			this.startDrag();
		}
		else
		{
			this.stopDrag();
		}
		
		this.___getDragDropMovement___(event);
	};
	
	/**
	* @method enableDragAndDrop
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @param {Boolean} value Indicates if the drag and drop feature is enabled or not. 
	* @description Enables or Disables the drag and drop feature.
	**/
	DragAndDropBehavior.prototype.enableDragAndDrop 				= function(target,value)
	{
		this.stopDrag();
		this._target = target;
		
		this._target.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
		this._target.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		
		if( value == true )
		{
			this._target.addEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
			this._target.addEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		}
		
		this._target.mouseEnabled = true;
	};
	
	/**
	* @method startDrag
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @description Start the dragging operation.
	**/
	DragAndDropBehavior.prototype.startDrag 						= function()
	{
		if( this._target == null )
			return;
			
		this.stopDrag();
		this._dragging = true;
		this._target.addEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___,true );
		this._target.mouseEnabled = true;
	};
	
	/**
	* @method stopDrag
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @description Stop the dragging operation.
	**/
	DragAndDropBehavior.prototype.stopDrag 							= function()
	{
		if( this._target == null )
			return;
			
		this._dragging = false;
		this._target.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___, true );
	};
	
	/**
	* @method destroy
	* @memberOf tomahawk_ns.DragAndDropBehavior.prototype
	* @description Destroys the behavior
	**/
	DragAndDropBehavior.prototype.destroy							= function()
	{
		this.stopDrag();
		this._dragging = false;
		this._target = null;
		this._lastPoint = null;
		this.removeEventListeners();
	};


	tomahawk_ns.DragAndDropBehavior = DragAndDropBehavior;

})();



