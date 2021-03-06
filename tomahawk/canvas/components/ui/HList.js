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
	 * @class HList
	 * @memberOf tomahawk_ns
	 * @description The HList class provides an horizontal list of display objects
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function HList(texture)
	{
		tomahawk_ns.Sprite.apply(this);
	}

	Tomahawk.registerClass( HList, "HList" );
	Tomahawk.extend( "HList", "Sprite" );
	
	HList.prototype.elementWidth 	= 100;
	HList.prototype.elementHeight 	= 100;
	HList.prototype.listWidth 		= 100;
	HList.prototype.listHeight 		= 100;
	HList.prototype.margin			= 10;
	
	HList.prototype.refresh			= function()
	{
		var i 			= 0;
		var child 		= null;
		var max 		= this.children.length;
		var ratioX 		= 1;
		var ratioY 		= 1;
		var ratio		= 1;
		var currentX 	= 0; 
		var currentY 	= 0; 
		
		for( i = 0; i < max; i++ )
		{
			child = this.children[i];
			ratioX = this.elementWidth / child.width;
			ratioY = this.elementHeight / child.height;
			ratio = ( ratioX < ratioY ) ? ratioX : ratioY;
			child.scaleX = child.scaleY = ratio;
			
			child.x = currentX + ( (this.elementWidth - (child.width * child.scaleX)) >> 1);
			child.y = currentY + ( (this.elementHeight - (child.height * child.scaleY)) >> 1);
			
			currentX += this.elementWidth + this.margin;
			
			if( child.x > this.listWidth || child.y > this.listHeight )
				child.visible = false;
			else
				child.visible = true;
		}
		
	};
	
	HList.prototype.right			= function()
	{
		var child = this.children.pop();
		this.children.unshift(child);
		this.refresh();
	};
	
	HList.prototype.left			= function()
	{
		var child = this.children.shift();
		this.children.push(child);
		this.refresh();
	};
	
	tomahawk_ns.HList = HList;
})();
