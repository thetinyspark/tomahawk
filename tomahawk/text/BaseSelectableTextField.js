/**
 * ...
 * @author Hatshepsout
 */

function BaseSelectableTextField()
{
	BaseTextField.apply(this);
	this.mouseEnabled = true;
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler,true );
	Stage.getInstance().addEventListener( MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler,true );
	this.addEventListener( MouseEvent.CLICK, this, this._mouseEventHandler );
	this.addEventListener( MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_UP, this, this._mouseEventHandler, true );
	Stage.getInstance().addEventListener( MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
}

Tomahawk.registerClass(BaseSelectableTextField,"BaseSelectableTextField");
Tomahawk.extend("BaseSelectableTextField","BaseTextField");

BaseSelectableTextField.prototype._ignoreNextClick = false;
BaseSelectableTextField.prototype._startPoint = null;
BaseSelectableTextField.prototype._down = false;

BaseSelectableTextField.prototype.getObjectUnder = function(x,y)
{
	if( DisplayObject.prototype.hitTest.apply(this,[x,y] ) )
		return this;
		
	return null;
};

BaseSelectableTextField.prototype._selectCurrentWord = function()
{
	this.unSelect();
	var range = this.getWordRangeAt(this.getCurrentIndex());
	this.selectBetween(range.start,range.end);
};

BaseSelectableTextField.prototype._setIndexUnderMouse = function(x,y)
{
	var pt = this.globalToLocal(x, y);
	var letters = this.getLettersIn(pt.x,pt.y,1,1);
	this.unSelect();
	this.setFocus(true);
	
	if( letters.length > 0 )
	{
		this.setCurrentIndex( letters[0].index );
	}
};

BaseSelectableTextField.prototype._mouseEventHandler = function(event)
{
	
	if( event.type == MouseEvent.DOUBLE_CLICK )
	{
		this.setFocus( event.target == this );
		
		if( this.getFocus() == true )
		{
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._selectCurrentWord();
		}
	}
	
	if( event.type == MouseEvent.MOUSE_DOWN && this._focused == true && event.target != this )
	{
		this.setFocus(false);
	}
	
	// if non focused return
	if( this._focused == false )
	{
		this.unSelect();
		return;
	}
		
	if( event.type == MouseEvent.MOUSE_UP )
	{
		this._down = false;
	}
	
	if( event.type == MouseEvent.CLICK )
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
	
	if( event.type == MouseEvent.MOUSE_DOWN)
	{
		this._down = true;
		this._setIndexUnderMouse(event.stageX,event.stageY);
		this._startPoint = this.globalToLocal(event.stageX, event.stageY);
		return;
	}
	
	if( event.type == MouseEvent.MOUSE_MOVE && this._down == true && this._startPoint != null)
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
};

BaseSelectableTextField.prototype.selectInto = function(x,y,width,height)
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

BaseSelectableTextField.prototype.getLettersIn = function(x,y,width,height)
{
	var i = this.children.length;
	var letter = null;
	var result = new Array();
	
	while( --i > -1 )
	{
		letter = this.children[i];
		
		if( 
			letter.x > x + width ||
			letter.x + letter.width < x || 
			letter.y + letter.height < y || 
			letter.y > y + height 
		)
		{
			continue;
		}
		
		result.push( letter );
	}
	
	return result;
};

BaseSelectableTextField.prototype.getSelectionRange = function()
{
	var start = -1;
	var end = -1;
	var i = this.children.length;
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
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

BaseSelectableTextField.prototype.isSelected = function()
{
	var range =  this.getSelectionRange();
	return ( range.start > 0 && range.end > 0 );
};

BaseSelectableTextField.prototype.selectAll = function()
{
	this.selectBetween(0,this.children.length);
};

BaseSelectableTextField.prototype.unSelect = function()
{
	var i = this.children.length;
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
		letter.selected = false;
	}
};

BaseSelectableTextField.prototype.selectBetween = function(startIndex, endIndex)
{
	var i = this.children.length;
	var letter = null;
	
	while( --i > -1 )
	{
		letter = this.children[i];
		letter.selected = ( i >= startIndex && i <= endIndex );
	}
};


