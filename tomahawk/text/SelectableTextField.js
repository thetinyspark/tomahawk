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
	 * @class SelectableTextField
	 * @memberOf tomahawk_ns
	 * @description The SelectableTextField class is used to create display objects for text display and selection.
	 * @constructor
	 * @augments tomahawk_ns.TextField
	 **/
	function SelectableTextField()
	{
		tomahawk_ns.TextField.apply(this);
		this.mouseEnabled = true;
	}

	Tomahawk.registerClass(SelectableTextField,"SelectableTextField");
	Tomahawk.extend("SelectableTextField","TextField");

	SelectableTextField.prototype._ignoreNextClick = false;
	SelectableTextField.prototype._startPoint = null;
	SelectableTextField.prototype._down = false;

	SelectableTextField.prototype.getObjectUnder = function(x,y)
	{
		if( tomahawk_ns.DisplayObject.prototype.hitTest.apply(this,[x,y] ) )
			return this;
			
		return null;
	};

	SelectableTextField.prototype.setFocus = function(value)
	{
		tomahawk_ns.TextField.prototype.setFocus.apply(this,[value]);
		
		this.removeEventListener( tomahawk_ns.MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.CLICK, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
		
		if( value == true )
		{
			this.addEventListener( tomahawk_ns.MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.CLICK, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
		}
		
		this.unSelect();
	};
	
	SelectableTextField.prototype._selectCurrentWord = function()
	{
		this.unSelect();
		var word = this.getWordAt(this.getCurrentIndex());
		var start = -1;
		var end = -1;
		
		if( word != null )
		{			
			start = word.getStartIndex();
			end = word.getEndIndex();
		}
		
		this.selectBetween(start,end);
	};

	SelectableTextField.prototype._setIndexUnderMouse = function(x,y)
	{
		var pt = this.globalToLocal(x, y);
		var letters = this.getLettersIn(pt.x,pt.y,1,1);
		this.unSelect();
		
		if( letters.length > 0 )
		{
			this.setCurrentIndex( letters[0].index );
		}
	};

	SelectableTextField.prototype._mouseEventHandler = function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.DOUBLE_CLICK )
		{
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._selectCurrentWord();
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_UP )
		{
			this._down = false;
		}
		
		if( event.type == tomahawk_ns.MouseEvent.CLICK )
		{
			this._down = false;
			
			if( this._ignoreNextClick == true )
			{
				this._ignoreNextClick = false;
			}
			else
			{
				this._setIndexUnderMouse(event.stageX,event.stageY);
			}
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_MOVE && this._down == true && this._startPoint != null)
		{
			var endPoint = this.globalToLocal(event.stageX, event.stageY);
			var x = ( endPoint.x < this._startPoint.x ) ? endPoint.x : this._startPoint.x;
			var x2 = ( endPoint.x < this._startPoint.x ) ? this._startPoint.x : endPoint.x;
			var y = ( endPoint.y < this._startPoint.y ) ? endPoint.y : this._startPoint.y;
			var y2 = ( endPoint.y < this._startPoint.y ) ? this._startPoint.y : endPoint.y;
			var width = x2 - x;
			var height = y2 - y;
			
			this.selectInto(x,y,width,height);
			this._ignoreNextClick = true;
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN)
		{
			this._down = true;
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._startPoint = this.globalToLocal(event.stageX, event.stageY);
			return;
		}

	};

	/**
	* @method selectInto
	* @description Selects all the letters within the zone defined by the x,y,width,height parameters within the text field.
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} x the x position of the selection zone
	* @param {Number} y the y position of the selection zone
	* @param {Number} width the width of the selection zone
	* @param {Number} height the height of the selection zone
	**/
	SelectableTextField.prototype.selectInto = function(x,y,width,height)
	{
		var result = this.getLettersIn(x,y,width,height);
		var i = result.length;
		var letter = null;
		var start = -1;
		var end = -1;
		
		while( --i > -1 )
		{
			letter = result[i];
			start = ( start == -1 || letter.index < start ) ? letter.index : start;
			end = ( end == -1 || letter.index > end ) ? letter.index : end;
		}
		
		this.selectBetween(start,end);
	};

	/**
	* @description Returns an Array of letters that match the zone defined by the x,y,width,height parameters within the text field.
	* @method getLettersIn
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} x the x position of the selection zone
	* @param {Number} y the y position of the selection zone
	* @param {Number} width the width of the selection zone
	* @param {Number} height the height of the selection zone
	* @returns {Array} an Array of Letters objects
	**/
	SelectableTextField.prototype.getLettersIn = function(x,y,width,height)
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		var result = new Array();
		var word = null;
		var bounds = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			word = letter.parent;
			
			if( word == null )
				continue;
				
			if( 
				word.x > x + width ||
				word.x + word.width < x || 
				word.y + word.height < y || 
				word.y > y + height 
			)
			{
				continue;
			}
			
			bounds = letter.getBoundingRectIn(this);
			
			if( bounds.left > x + width ||
				bounds.right < x ||
				bounds.top > y + height ||
				bounds.bottom < y 
			)
			{
				continue;
			}
			
			result.push( letter );
		}
		
		return result;
	};

	/**
	* @method getSelectionRange
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @returns {Object} An object with "start" and "end" properties
	* @description Returns an object which defines the indexes between the text field is selected.
	**/
	SelectableTextField.prototype.getSelectionRange = function()
	{
		var start = -1;
		var end = -1;
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			if( letter.selected == true )
			{
				if( end == -1 )
				{
					end = i;
				}
				
				if( end > 0 )
				{
					start = i;
				}
			}
		}
		
		return {start: start, end: end};
	};

	/**
	* @method isSelected
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @returns {Boolean} true if selected, false it not.
	* @description Indicates wether a portion of the text is selected within the text field.
	**/
	SelectableTextField.prototype.isSelected = function()
	{
		var range =  this.getSelectionRange();
		return ( range.start >= 0 && range.end > range.start );
	};

	/**
	* @method selectAll
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @description Sets as selected all the text within the text field.
	**/
	SelectableTextField.prototype.selectAll = function()
	{
		this.selectBetween(0,this.getLetters().length);
	};

	/**
	* @method unSelect
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @description Removes all selection within the text field.
	**/
	SelectableTextField.prototype.unSelect = function()
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			
			if( letter.selected == true && letter.parent != null )
			{
				letter.parent.needRefresh = true;
			}
			
			letter.selected = false;
		}
		
		this._refreshNextFrame = true;
	};
	
	/**
	* @method selectBetween
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} startIndex The zero-based index value of the first character in the selection (for example, the first character is 0, the second character is 1, and so on).
	* @param {Number} endIndex  The zero-based index value of the last character in the selection.
	* @description Sets as selected the text designated by the index values of the first and last characters, which are specified with the beginIndex and endIndex parameters.
	**/
	SelectableTextField.prototype.selectBetween = function(startIndex, endIndex)
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			
			if( i >= startIndex && i <= endIndex )
			{
				letter.selected = true;
				if( letter.parent != null )
					letter.parent.needRefresh = true;
			}
			else
			{
				if( letter.selected == true && letter.parent != null)
				{
					letter.parent.needRefresh = true;
				}
				letter.selected = false;
			}
		}
		
		this._refreshNextFrame = true;
	};

	
	tomahawk_ns.SelectableTextField = SelectableTextField;
})();
