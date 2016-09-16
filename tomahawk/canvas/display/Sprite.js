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
	 * @description The Sprite class is a basic display list building block: a display list node that can contain children.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Sprite()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
	}
	
	Tomahawk.registerClass( Sprite, "Sprite" );
	Tomahawk.extend( "Sprite", "DisplayObjectContainer" );
	
	Sprite.prototype._behaviorDrag = null;
	
	/**
	* @method enableDragAndDrop
	* @memberOf tomahawk_ns.Sprite.prototype
	* @deprecated prefer to use DragAndDropBehavior class
	* @param {Boolean} value Indicates if the drag and drop feature is enabled or not. 
	* @description Enables or Disables the drag and drop feature.
	**/
	Sprite.prototype.enableDragAndDrop 				= function(value)
	{
		if( this._behaviorDrag != null )
			this._behaviorDrag.destroy();
			
		if( value == false )
			return;
			
		this._behaviorDrag = new tomahawk_ns.DragAndDropBehavior();
		this._behaviorDrag.enableDragAndDrop(this, value);
	};
	
	/**
	* @method startDrag
	* @memberOf tomahawk_ns.Sprite.prototype
	* @description Start the dragging operation.
	**/
	Sprite.prototype.startDrag 						= function()
	{
		if( this._behaviorDrag != null )
			this._behaviorDrag.startDrag();
	};
	
	/**
	* @method stopDrag
	* @memberOf tomahawk_ns.Sprite.prototype
	* @description Stop the dragging operation.
	**/
	Sprite.prototype.stopDrag 						= function()
	{
		if( this._behaviorDrag != null )
			this._behaviorDrag.stopDrag();
	};

	tomahawk_ns.Sprite = Sprite;
})();

