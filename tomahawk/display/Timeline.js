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
	 * @class Timeline
	 * @memberOf tomahawk_ns
	 * @description A basic Timeline class
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 **/
	function Timeline()
	{
		this._frames = new Array();
		this._tweens = new Array();
		tomahawk_ns.EventDispatcher.apply(this);
	}

	Tomahawk.registerClass( Timeline, "Timeline" );
	Tomahawk.extend( "Timeline", "EventDispatcher" );
	
	Timeline.prototype._currentFrame = 0;
	Timeline.prototype._frames = null;
	Timeline.prototype._tweens = null;
	Timeline.prototype.totalFrames = 0;

	Timeline.prototype.setPosition = function(index)
	{
		var i = 0;
		var max = this._tweens.length;
		var tween = null;
		var lastTween = this._tweens[this._tweens.length-1];
		var totalFrames = lastTween.delay + lastTween.duration + 1;
		
		totalFrames = ( totalFrames < this._frames.length ) ? this._frames.length : totalFrames;
		
		this.totalFrames = totalFrames;
		this._currentFrame = index;
		
		if( this._currentFrame >= this.totalFrames )
			this._currentFrame = 0;
			
		if( this._currentFrame < 0 )
			this._currentFrame = this.totalFrames;
		
		for( i = 0; i < max; i++ )
		{
			tween = this._tweens[i];
			tween.update(this._currentFrame);
		}
	};
	
	Timeline.prototype.nextFrame = function()
	{
		this.setPosition(this._currentFrame + 1);
	};
	
	Timeline.prototype.prevFrame = function()
	{
		this.setPosition(this._currentFrame - 1);
	};
	
	Timeline.prototype.goToLabel = function(label)
	{
		var frame = this.getFrameByLabel(label);
		
		if( frame != null )
			this.setPosition(frame.index);
	};
	
	
	Timeline.prototype.getCurrentFrameLabel = function()
	{
		return this.getFrameAt(this._currentFrame).label;
	};
	
	Timeline.prototype.getCurrentFrameIndex = function()
	{
		return this._currentFrame;
	};

	Timeline.prototype.getFrameByLabel = function(label)
	{
		var i = this._frames.length;
		while( --i > -1 )
		{
			if( this._frames[i] != undefined && this._frames[i].label == label )
			{
				return this._frames[i];
			}
		}
		
		return null;
	};
	
	Timeline.prototype.addFrameAt = function(frame,index)
	{
		frame.index = index;
		this._frames[index] = frame;
	};
	
	Timeline.prototype.addFrame = function(frame)
	{
		frame.index = this._frames.length;
		this._frames.push(frame);
	};
	
	Timeline.prototype.getFrameAt = function(index)
	{
		var currentIndex = index;
		var frame = null;
		
		while( currentIndex > -1 )
		{
			frame = this._frames[currentIndex];
			
			if( frame != undefined && frame != null )
				return frame;
				
			currentIndex--;
		}
			
		return null;
	};
		
	Timeline.prototype.removeFrameAt = function(index)
	{
		var frame = this.getFrameAt(index);
		
		if( frame == null )
			return;
			
		if( index > -1 )
		{
			frame.destroy();
			this._frames[index] = null;
		}
	};
	
	
	Timeline.prototype.getTweens = function()
	{
		return this._tweens;
	};
	
	Timeline.prototype.addTween = function(tween)
	{
		this._tweens.push( tween );
		this._tweens.sort(this._sortTweens);
	};
	
	Timeline.prototype.removeTween = function(tween)
	{
		var index = this._tweens.indexOf(tween);
		if( index > -1 )
		{
			this._tweens.splice(index,1);
		}
		this._tweens.sort(this._sortTweens);
	};
	
	Timeline.prototype.destroy = function()
	{
		this.stop();
		tomahawk_ns.Sprite.prototype.destroy.apply(this);
	};

	Timeline.prototype._sortTweens = function(a,b)
	{
		if( a.delay == b.delay )
		{
			return ( a.duration < b.duration ) ? -1 : 1;
		}
		else
		{
			return ( a.delay < b.delay ) ? -1 : 1;
		}
	};
	
	
	tomahawk_ns.Timeline = Timeline;

})();
