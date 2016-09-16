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
	 * @author The Tiny Spark
	 */
 
	/**
	 * @class SWFAnim
	 * @memberOf tomahawk_ns
	 * @description The SWFAnim class is a basic export 
	 * @constructor
	 * @augments tomahawk_ns.SWFAnim
	 **/

	function SWFAnim()
	{
		tomahawk_ns.Sprite.apply(this);
		this._frames 	= new Array();
		this._symbols 	= new Array();
		this._labels 	= new Array();
		this._scripts 	= new Array();
	}

	Tomahawk.registerClass( SWFAnim, "SWFAnim" );
	Tomahawk.extend( "SWFAnim", "Sprite" );

	SWFAnim.prototype._labels 				= null;
	SWFAnim.prototype._frames 				= null;
	SWFAnim.prototype._symbols 				= null;
	SWFAnim.prototype.currentFrame 			= 0;
	SWFAnim.prototype.minFrame 				= 0;
	SWFAnim.prototype.maxFrame 				= 0;
	SWFAnim.prototype.loop 					= false;
	SWFAnim.prototype.reverse 				= false;
	SWFAnim.prototype.yoyo 					= false;
	SWFAnim.prototype.fps 					= 60;
	SWFAnim.prototype._timer 				= -1;
	SWFAnim.prototype._playing 				= false;
	SWFAnim.prototype._scripts 				= null;

	SWFAnim.prototype.getFrames 			= function()
	{
		return this._frames;
	};
	
	SWFAnim.prototype.addFrameScript 		= function(frameIndex, callback)
	{
		this._scripts[frameIndex] = callback;
	};
	
	SWFAnim.prototype.removeFrameScript 	= function(frameIndex)
	{
		this._scripts[frameIndex] = null;
	};
	
	SWFAnim.prototype._enterFrameHandler 	= function()
	{
		var currentFrame = null;
		var script = null;
		var i = 0;
		var max = 0;
		var obj = null;
		var child = null;
		var mat = null;
		
		if( this.currentFrame > this.maxFrame )
		{
			if( this.yoyo == true )
			{
				this.reverse = true;
				this.currentFrame = this.maxFrame - 1;
			}
			else if( this.loop == true )
			{
				this.currentFrame = this.minFrame;
			}
			else
			{
				this.currentFrame = this.maxFrame;
				this.stop();
				this._playing = false;
				return;
			}
		}
		
		if( this.currentFrame < this.minFrame )
		{
			if( this.yoyo == true )
			{
				this.reverse = false;
				this.currentFrame = this.minFrame + 1;
			}
			else if( this.loop == true )
			{
				this.currentFrame = this.maxFrame;
			}
			else
			{
				this.currentFrame = this.minFrame;
				this._playing = false;
				this.stop();
				return;
			}
		}
		
		this.removeChildren();
		
		currentFrame = this._frames[this.currentFrame];
		max = currentFrame.length;
		script = this._scripts[this.currentFrame];
		
		if( script != undefined && script != null)
		{
			script.apply(this);
		}
		
		for( i = 0; i < max; i++ )
		{
			
			obj 					= currentFrame[i];
			child 					= this._getSymbolByName(obj.symbol);
			child.pixelPerfect 		= this.pixelPerfect;
			child.pixelAlphaLimit 	= this.pixelAlphaLimit;
			child.width 			= obj.width;
			child.height 			= obj.height;
			child.name 				= obj.name;
			child.alpha 			= obj.alpha;
			
			if( child != null )
			{
				mat 		= new tomahawk_ns.Matrix2D();
				mat.a 		= obj.a;
				mat.b 		= obj.b;
				mat.c 		= obj.c;
				mat.d 		= obj.d;
				mat.tx 		= obj.tx;
				mat.ty 		= obj.ty;
				
				mat.decompose(child);
				this.addChild(child);
			}
		}
			
		if( this._playing == true )
		{
			clearTimeout(this._timeout);
			this._timeout = setTimeout( this.nextFrame.bind(this), 1000 / this.fps );
		}
	};
	
	SWFAnim.prototype.nextFrame 			= function()
	{
		this.currentFrame += ( this.reverse == true ) ? -1 : 1;
		this._enterFrameHandler();
	};
	
	SWFAnim.prototype._getLabelByName 		= function(labelName)
	{
		var i = this._labels.length;
		while( --i > -1 )
		{
			if( this._labels[i].name == labelName )
				return this._labels[i];
		}
		
		return null;
	};
	
	SWFAnim.prototype._getSymbolByName 		= function(name)
	{
		var i = this._symbols.length;
		while( --i > -1 )
		{
			if( this._symbols[i].texture.name == name )
			{
				return this._symbols[i];
			}
		}
		
		return null;
	};
	
	SWFAnim.prototype.setSymbols 			= function(symbols)
	{
		this._symbols = symbols;
	};
	
	SWFAnim.prototype.setFrames 			= function(data)
	{
		this._frames = data;
		this.maxFrame = this._frames.length - 1;
	};
	
	SWFAnim.prototype.setLabels 			= function(labels)
	{
		this._labels = labels;
	};
	
	SWFAnim.prototype.gotoAndStop 			= function(labelName)
	{
		var labelData = this._getLabelByName(labelName);
		
		if (labelData == null )
		{
			this.currentFrame = parseInt(labelName);
			this.minFrame = 0;
			this.maxFrame = this._frames.length - 1;
		}
		else
		{			
			this.minFrame = labelData.startFrame;
			this.maxFrame = labelData.endFrame;
		}
		
		this.stop();
		this._enterFrameHandler();
	};
	
	SWFAnim.prototype.play 					= function(labelName)
	{
		this.stop();
		labelName = ( labelName == undefined ) ? this.currentFrame : labelName;
		var labelData = this._getLabelByName(labelName);
		
		if (labelData == null )
		{
			this.currentFrame = parseInt(labelName);
			this.minFrame = 0;
			this.maxFrame = this._frames.length - 1;
		}
		else
		{			
			this.minFrame = labelData.startFrame;
			this.maxFrame = labelData.endFrame;
		}
		
		this._playing = true;
		this._enterFrameHandler();
	};
	
	SWFAnim.prototype.destroy 				= function()
	{
		this.stop();
		this.removeChildren();
		this.removeEventListeners();
		this._symbols = new Array();
		this._frames = new Array();
		tomahawk_ns.Sprite.prototype.destroy.apply(this);
	};

	SWFAnim.prototype.stop 					= function()
	{
		clearTimeout( this._timeout );
		this._playing = false;
	};

	tomahawk_ns.SWFAnim = SWFAnim;
})();