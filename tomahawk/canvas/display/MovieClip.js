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
	 * @class MovieClip
	 * @memberOf tomahawk_ns
	 * @description The MovieClip class inherits from the following classes: Sprite,DisplayObjectContainer, DisplayObject, and EventDispatcher. Unlike the Sprite object, a MovieClip object has a timeline.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function MovieClip()
	{
		tomahawk_ns.Sprite.apply(this);
		this._symbols = new Object();
		this._timeline = new tomahawk_ns.Timeline();
	}

	Tomahawk.registerClass( MovieClip, "MovieClip" );
	Tomahawk.extend( "MovieClip", "Sprite" );
	
	
	MovieClip.prototype.fps 				= 1;
	MovieClip.prototype.isMovieClip 		= true;
	MovieClip.prototype._timer 				= 0;
	MovieClip.prototype._lastFrame 			= null;
	MovieClip.prototype.reverse 			= false;
	MovieClip.prototype._symbols 			= null;
	
	MovieClip.prototype.setSymbols 			= function(symbols)
	{
		this._symbols = symbols;
	};
	
	MovieClip.prototype._refresh 			= function()
	{
		var i = 0
		var frame = null;
		var tween = null;
		var currentChild = null;
		var currentFrame = this._timeline.getCurrentFrameIndex();
		
		frame = this._timeline.getFrameAt(currentFrame);
		
		if(  frame != null )
		{		
			if( this._lastFrame != frame )
			{
				this._lastFrame = frame;
				this.removeChildren();
				i = frame.children.length;
				
				while( --i > -1 )
				{
					currentChild = this._symbols[frame.children[i].symbol];
					
					if( currentChild == undefined || currentChild == null )
						continue;
						
					this.addChildAt(currentChild,0);
				
					if( currentChild.isMovieClip == true )
					{
						currentChild.gotoAndStop(currentFrame - frame.index);
					}
				}
				
				frame.runScript(this);
			}
		}
	};
	
	MovieClip.prototype.gotoLabelAndStop 	= function(label)
	{
		this.stop();
		this._timeline.goToLabel(label);
		this._refresh();
	};
	
	MovieClip.prototype.gotoAndStop 		= function(index)
	{
		this.stop();
		this._timeline.setPosition(index);
		this._refresh();
	};
	
	MovieClip.prototype.gotoLabelAndPlay 	= function(label)
	{
		this.stop();
		this._timeline.goToLabel(label);
		this._refresh();
		this.play();
	};	
	
	MovieClip.prototype.gotoAndPlay 		= function(index)
	{
		this.stop();
		this._timeline.setPosition(index);
		this._refresh();
		this.play();
	};

	MovieClip.prototype.nextFrame 			= function()
	{
		this._timeline.setPosition(this._timeline.getCurrentFrameIndex()+1);
		this._refresh();
	};
	
	MovieClip.prototype.prevFrame 			= function()
	{
		this._timeline.setPosition(this._timeline.getCurrentFrameIndex()-1);
		this._refresh();
	};
	
	MovieClip.prototype.getTimeline 		= function()
	{
		return this._timeline;
	};
	
	MovieClip.prototype.play 				= function()
	{
		this.stop();
		
		if( this.reverse == true )
		{
			this.prevFrame();
		}
		else
		{
			this.nextFrame();
		}
		
		this._timer = setTimeout(this.play.bind(this), 1000 / this.fps );
	};

	MovieClip.prototype.stop 				= function()
	{
		clearTimeout(this._timer); 
	};
	
	MovieClip.prototype.destroy 			= function()
	{
		this.stop();
		this._timeline.destroy();
		tomahawk_ns.Sprite.prototype.destroy.apply(this);
	};

	
	tomahawk_ns.MovieClip = MovieClip;

})();
