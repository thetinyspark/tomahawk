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
	 * @class Tween
	 * @memberOf tomahawk_ns
	 * @description a basic Tween Object used to update object properties with custom easing functions
	 * @constructor
	**/
	function Tween(target,duration,from,to,easing,delay)
	{
		this.target = target || null;
		this.delay = delay || 0;
		this.duration = duration || 0;
		this.easing = easing || tomahaw_ns.Linear.easeIn;
		this.from = from || {};
		this.to = to || {};
	}
	
	Tomahawk.registerClass(Tween,"Tween");
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {String}
	* @description The name of the Tween instance.
	**/
	Tween.prototype.name = null;
	/**
	* @member target
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Object}
	* @description The target object on which the tween is applied.
	**/
	Tween.prototype.target = null;
	/**
	* @member delay
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Number}
	* @description The amount of time before the tween effect is applied.
	**/
	Tween.prototype.delay = 0;
	/**
	* @member from
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Object}
	* @description Defines the starting values of the target properties.
	**/
	Tween.prototype.from = null;
	/**
	* @member to
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Object}
	* @description Defines the ending values of the target properties.
	**/
	Tween.prototype.to = null;
	/**
	* @member duration
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Number}
	* @description The duration of the tween ( in frames ).
	**/
	Tween.prototype.duration = 0;
	/**
	* @member easing
	* @memberOf tomahawk_ns.Tween.prototype
	* @type {Function}
	* @description The easing function used to interpolate the values during the tween process.
	**/
	Tween.prototype.easing = null
	
	/**
	* @method update
	* @description Updates the target values according to the time ( in frame ) passed in parameter.
	* @memberOf tomahawk_ns.Tween.prototype
	* @param {Number} time The current tween time ( in frame )
	**/
	Tween.prototype.update = function(time)
	{
		var prop = null;
		var ratio = 1;
		
		if( this.target == null || time < this.delay )
		{
			return;
		}
			
		// instant tween
		if( this.duration == 0 || time > this.delay + this.duration )
		{
			for( prop in this.to )
			{
				this.target[prop] = this.to[prop];
			}
		}
		else
		{
			ratio = this.easing(time-this.delay,0,1,this.duration);
			for( prop in this.from )
			{
				this.target[prop] = this.from[prop] + ( this.to[prop] - this.from[prop] ) * ratio;
			}
		}
	};
	
	
	
	
	
	/**
	* @method destroy
	* @description Stops and kill the tween properly.
	* @memberOf tomahawk_ns.Tween.prototype
	**/
	Tween.prototype.destroy = function()
	{
		this.name = null;
		this.target = null;
		this.delay = null;
		this.from = null;
		this.to = null;
		this.duration = null;
		this.easing = null;
	};
	
	tomahawk_ns.Tween = Tween;

})();
	

	
	

