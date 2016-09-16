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
	 * @class GridList
	 * @memberOf tomahawk_ns
	 * @description The GridList class provides an grid list of display objects
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function GridList(texture)
	{
		tomahawk_ns.Sprite.apply(this);
	}

	Tomahawk.registerClass( GridList, "GridList" );
	Tomahawk.extend( "GridList", "Sprite" );
	
	
	GridList.prototype.elementsPerPage	= 12;
	GridList.prototype.elementsPerRow	= 4;
	GridList.prototype.elementWidth 	= 100;
	GridList.prototype.elementHeight 	= 100;
	GridList.prototype.margin			= 10;
	GridList.prototype.ratioMax			= 1;
	GridList.prototype._currentPage		= 0;
	
	GridList.prototype.refresh		= function(numPage)
	{
		var max 			= this.getMaxPage();
		var start 			= 0;
		var end	 			= 0;
		var currentCol 		= 0;
		var currentRow 		= 0;
		var counter			= 0;
		var ratioX			= 0;
		var ratioY			= 0;
		var ratio			= 0;
		var currentChild	= null;
		var i				= this.children.length;
		var gapX 			= this.elementWidth + this.margin;
		var gapY 			= this.elementHeight + this.margin;
		
		this._currentPage 	= numPage || 0;
		this._currentPage 	= ( this._currentPage < 0 ) ? 0 : this._currentPage;
		this._currentPage 	= ( this._currentPage > max ) ? max : this._currentPage;
		
		
		start 				= Math.min( this.children.length, this._currentPage * this.elementsPerPage );
		end 				= start + this.elementsPerPage;
		
		
		while( --i > -1 )
		{
			this.children[i].visible = false;
		}
		
		for( i = start; i < end; i ++ )
		{
			currentCol = parseInt( counter % this.elementsPerRow );
			currentRow = parseInt( counter / this.elementsPerRow );
			
			currentChild 					= this.children[i];
			currentChild.updateNextFrame 	= true;
			currentChild.updateBounds();
			
			ratioX 							=  this.elementWidth / currentChild.width;
			ratioY 							=  this.elementHeight / currentChild.height;
			ratio							= ( ratioX < ratioY ) ? ratioX : ratioY;
			ratio							= ( ratio > this.ratioMax ) ? this.ratioMax : ratio;
			
			currentChild.scaleX 			= ratio;
			currentChild.scaleY 			= ratio;
			
			currentChild.x 					= parseInt( currentCol * gapX ) + ( (this.elementWidth - currentChild.width * ratio ) / 2 );
			currentChild.y 					= parseInt( currentRow * gapY ) + ( (this.elementHeight - currentChild.height * ratio ) / 2 );
			currentChild.visible 			= true;
			
			counter++;
		}
	};
	
	GridList.prototype.getMaxPage	= function()
	{
		var max = Math.ceil( this.children.length / this.elementsPerPage ) - 1;
		return max;
	};
	
	GridList.prototype.next			= function()
	{
		this.refresh(this._currentPage + 1);
	};
	
	GridList.prototype.prev			= function()
	{
		this.refresh(this._currentPage - 1);
	};
	
	tomahawk_ns.GridList = GridList;
})();
