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
	 * @class Shape
	 * @memberOf tomahawk_ns
	 * @description This class is used to create lightweight shapes using the CanvasRenderingContext2D vectorial drawing API.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObject
	 **/
	function Shape()
	{
		tomahawk_ns.DisplayObject.apply(this);
	}

	Tomahawk.registerClass( Shape, "Shape" );
	Tomahawk.extend( "Shape", "DisplayObject" );


	Shape.prototype._commands = null;

	Shape.prototype._getCommands = function()
	{
		if( this._commands == null )
			this._commands = new Array();
			
		return this._commands;
	};

	/**
	* @method clear
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Cleans the current Shape.
	**/
	Shape.prototype.clear = function()
	{
		this._commands = new Array();
	};

	/**
	* @method stroke
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Strokes the subpaths with the current stroke style.
	**/
	Shape.prototype.stroke = function()
	{
		this._getCommands().push( [1,"stroke",null] ); 
	};

	/**
	* @method fill
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Fills the subpaths with the current fill style.
	**/
	Shape.prototype.fill = function()
	{
		this._getCommands().push( [1,"fill",null] ); 
	};

	/**
	* @method beginPath
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Starts a new path by resetting the list of sub-paths. Call this method when you want to create a new path.
	**/
	Shape.prototype.beginPath = function()
	{
		this._getCommands().push( [1,"beginPath",null] ); 
	};
	
	/**
	* @method closePath
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Tries to draw a straight line from the current point to the start. If the shape has already been closed or has only one point, this function does nothing.
	**/
	Shape.prototype.closePath = function()
	{
		this._getCommands().push( [1,"closePath",null] );
	};

	/**
	* @method rect
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Adds a new closed subpath to the path, representing the given rectangle.
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	**/
	Shape.prototype.rect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"rect",[x, y, width, height]] );
	};

	/**
	* @method fillRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Draws a filled rectangle at (x, y) position whose size is determined by width and height.
	**/
	Shape.prototype.fillRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"fillRect",[x, y, width, height]] );
	};
	
	/**
	* @method clearRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Sets all pixels in the rectangle defined by starting point (x, y) and size (width, height) to transparent black.
	**/
	Shape.prototype.clearRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"clearRect",[x, y, width, height]] );
	};
	
	/**
	* @method strokeRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Paints a rectangle which has a starting point at (x, y) and has a w width and an h height onto the canvas, using the current stroke style.
	**/
	Shape.prototype.strokeRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"strokeRect",[x, y, width, height]] );
	};

	/**
	* @method moveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @description Moves the starting point of a new subpath to the (x, y) coordinates.
	**/
	Shape.prototype.moveTo = function(x,y)
	{
		this._getCommands().push( [1,"moveTo",[x,y]] );
	};
	
	/**
	* @method lineTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @description Connects the last point in the subpath to the x, y coordinates with a straight line.
	**/
	Shape.prototype.lineTo = function(x,y)
	{
		this._getCommands().push( [1,"lineTo",[x,y]] );
	};
	
	/**
	* @method arc
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} radius
	* @param {Number} startAngle
	* @param {Number} endAngle
	* @param {Boolean} antiClockwise
	* @description Adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
	**/
	Shape.prototype.arc = function(x, y, radius, startAngle, endAngle, antiClockwise)
	{
		this._getCommands().push( [1,"arc",[x, y, radius, startAngle, endAngle, antiClockwise]] );
	};
	
	/**
	* @method arcTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX
	* @param {Number} controlY
	* @param {Number} endX
	* @param {Number} endY
	* @param {Number} radius
	* @description Adds an arc to the path with the given control points and radius, connected to the previous point by a straight line
	**/
	Shape.prototype.arcTo = function(controlX,controlY,endX,endY,radius)
	{
		this._getCommands().push( [1,"arcTo",[controlX,controlY,endX,endY,radius]] );
	};
	
	/**
	* @method quadraticCurveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX
	* @param {Number} controlY
	* @param {Number} endX
	* @param {Number} endY
	* @description Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.
	**/
	Shape.prototype.quadraticCurveTo = function(controlX, controlY, endX, endY)
	{
		this._getCommands().push( [1,"quadraticCurveTo",[controlX, controlY, endX, endY]] );
	};
	
	/**
	* @method bezierCurveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX1
	* @param {Number} controlY1
	* @param {Number} controlX2
	* @param {Number} controlY2
	* @param {Number} endX
	* @param {Number} endY
	* @description Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.
	**/
	Shape.prototype.bezierCurveTo = function(controlX1, controlY1, controlX2, controlY2, endX, endY)
	{
		this._getCommands().push( [1,"bezierCurveTo",[controlX1, controlY1, controlX2, controlY2, endX, endY]] );
	};
	
	/**
	* @method fillWithCurrentGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Sets the current gradient as the current fillStyle
	**/
	Shape.prototype.fillWithCurrentGradient = function()
	{
		this._getCommands().push( [1,"fillWithCurrentGradient",null] );
	};
	
	/**
	* @method addColorStop
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} offset
	* @param {String} color
	* @description Adds a color stop with the given color to the gradient at the given offset. 0.0 is the offset at one end of the gradient, 1.0 is the offset at the other end.
	**/
	Shape.prototype.addColorStop = function(offset, color)
	{
		this._getCommands().push( [1,"addColorStop",[offset, color]] );
	};
	
	/**
	* @method createLinearGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} endX
	* @param {Number} endY
	* @description Creates a gradient along the line given by the coordinates represented by the parameters.
	**/
	Shape.prototype.createLinearGradient = function(startX, startY, endX, endY)
	{
		this._getCommands().push( [1,"createLinearGradient",[startX, startY, endX, endY]] );
	};
	
	/**
	* @method createRadialGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} startRadius
	* @param {Number} endX
	* @param {Number} endY
	* @param {Number} endRadius
	* @description Creates a CanvasGradient object that represents a radial gradient that paints along the cone given by the circles represented by the arguments. If either of the radii are negative, throws an IndexSizeError exception.
	**/
	Shape.prototype.createRadialGradient = function(startX, startY, startRadius, endX, endY, endRadius)
	{
		this._getCommands().push( [1,"createRadialGradient",[startX, startY, startRadius, endX, endY, endRadius]] );
	};
	
	/**
	* @description Sets width of lines, default 1.0
	* @method lineWidth
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} value the new line width.
	**/
	Shape.prototype.lineWidth = function(value)
	{
		this._getCommands().push( [0,"lineWidth",value] );
	};
	
	/**
	* @description Defines the type of endings on the end of lines. Possible values: butt (default), round, square
	* @method lineCap
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {String} value 
	**/
	Shape.prototype.lineCap = function(value)
	{
		this._getCommands().push( [0,"lineCap",value] );
	};

	/**
	* @description Defines the type of corners where two lines meet. Possible values: round, bevel, miter (default)
	* @method strokeStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {String} value 
	**/
	Shape.prototype.lineJoin = function(value)
	{
		this._getCommands().push( [0,"lineJoin",value] );
	};
	
	/**
	* @description Defines the style used for stroking shapes. It can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	* @method strokeStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Object} value 
	**/
	Shape.prototype.strokeStyle = function(value)
	{
		this._getCommands().push( [0,"strokeStyle",value] );
	};
	
	/**
	* @description Defines the style used for filling shapes. It can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	* @method fillStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Object} value 
	**/
	Shape.prototype.fillStyle = function(value)
	{
		this._getCommands().push( [0,"fillStyle",value] );
	};

	Shape.prototype.draw = function(context)
	{
		var commands = this._getCommands();
		var command = null;
		var i = 0;
		var max = commands.length;
		var type = null;
		var prop = null;
		var args = null;
		var gradient = null;
		
		//type = 0 : set; type = 1 : method
		
		for (i = 0; i < max; i++ )
		{
			command = commands[i];
			type = command[0];
			prop = command[1];
			args = command[2];
			
			if( type == 0 )
			{
				if( context[prop] )
				{
					context[prop] = args;				
				}
				else if( gradient != null )
				{
					if( gradient[prop] )
						gradient[prop] = args;
				}
			}
			else
			{
				if( prop == "createLinearGradient" || prop == "createRadialGradient" )
				{
					gradient = context[prop].apply(context,args);
				}
				else if( prop == "fillWithCurrentGradient" )
				{
					context.fillStyle = gradient;
				}
				else
				{
					if( context[prop] )
					{
						context[prop].apply(context,args);
					}
					else if( gradient != null )
					{
						if( gradient[prop] )
							gradient[prop].apply(gradient,args);
					}
				}
			}
			
		}
	};

	
	tomahawk_ns.Shape = Shape;

})();