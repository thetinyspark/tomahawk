/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function Word()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.mouseEnabled = true;
	}
	
	Tomahawk.registerClass(Word,"Word");
	Tomahawk.extend("Word","DisplayObjectContainer");
	
	Word.prototype.row = 0;
	Word.prototype.newline = false;
	Word.prototype.marginLeft = 0;
	Word.prototype.index = 0;
	Word.prototype.text = "";
	Word.prototype.needRefresh = false;
	
	Word.prototype.getNumLetters = function()
	{
		return this.children.length;
	};
	
	Word.prototype.getStartIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt(0).index;
	};
	
	Word.prototype.getEndIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt( this.children.length - 1 ).index;
	};
	
	Word.prototype.addLetter = function(letter)
	{
		this.text = this.text + letter.value;
		this.needRefresh = true;
		return this.addChild(letter);
	};
	
	Word.prototype.removeLetterAt = function(index)
	{
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		this.needRefresh = true;
		return this.removeChildAt(index);
	};
	
	Word.prototype.removeLetter = function(letter)
	{
		var index = this.getChildIndex(letter);
		
		if( index == -1 )
			return letter;
	
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		return this.removeChild(letter);
	};
	
	Word.prototype.getLetterAt = function(index)
	{
		return this.getChildAt(index);
	};
		
	Word.prototype.addLetterAt = function(letter,index)
	{
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + letter.value + this.text.substr(index);
		this.addChildAt(letter,index);
	};
	
	Word.prototype.getLetters = function()
	{
		return this.children;
	};
	
	Word.prototype.refresh = function()
	{
		if( this.needRefresh != true )
			return;
			
		var max = this.children.length;
		var i = 0;
		var currentX = 0;
		this.height = 0;
		this.width = 0;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			
			if( currentLetter.value == " " && i == 0)
			{
				this.marginLeft = currentLetter.width;
			}
			
			currentLetter.updateMetrics();
			currentLetter.x = currentX;
			currentX += currentLetter.width;
			this.height = ( this.height < currentLetter.textHeight ) ? currentLetter.textHeight : this.height;
		}
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			currentLetter.y = this.height - currentLetter.textHeight;
		}
		
		this.width = currentX;
		this.needRefresh = false;
		this._cache = null;
		this.updateCache();
		this.cacheAsBitmap = true;
	};
	
	Word.prototype.cut = function(index)
	{
		var word = new tomahawk_ns.Word();
		var i = index;
		var max = this.children.length;
		
		for( i = index; i < max; i++ )
		{
			word.addLetter(this.removeLetterAt(index));
		}
		
		word.needRefresh = this.needRefresh = true;
		return word;
	};
	
	tomahawk_ns.Word = Word;
})();