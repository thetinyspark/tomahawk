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
	 * @class Sprite3D
	 * @memberOf tomahawk_ns
	 * @description The Sprite3d class is a basic display list building block, a display list node that can contain children on which pseudo3D effects can be applied.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function Sprite3D()
	{
		tomahawk_ns.Sprite.apply(this);
		this.matrix3D = new tomahawk_ns.Matrix4x4();
	}
	
	/**
	* @member matrix3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Matrix4x4}
	* @description The transformation matrix (3d) of the Sprite3D
	* @default null
	**/
	Sprite3D.prototype.matrix3D = null;
	
	/**
	* @member scaleZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 1
	* @description Indicates the depth scale (percentage) of the object as applied from the registration point.
	**/
	Sprite3D.prototype.scaleZ = 1;
	
	/**
	* @member z
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the z coordinate of the Sprite3D instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	Sprite3D.prototype.z = 0;
	
	/**
	* @member pivotZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the z coordinate of the Sprite3D instance registration point
	**/
	Sprite3D.prototype.pivotZ = 0;
	
	/**
	* @member rotationX
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the x axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationX = 0;
	
	/**
	* @member rotationY
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the y axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationY = 0;
	
	/**
	* @member rotationZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the z axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationZ = 0;
	
	/**
	* @member useReal3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Boolean}
	* @default false
	* @description Indicates wether the Sprite3D instance will convert his parent's transformation matrixes in 3d matrixes before rendering. If true it will results in a better 3d transformation.
	**/
	Sprite3D.prototype.useReal3D = false;
	
	/**
	* @description Returns a vector that represents the normale of the Sprite3D instance.
	* @method getNormalVector
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @returns {tomahawk_ns.Vector3D} returns a Vector3D object
	**/
	Sprite3D.prototype.getNormalVector = function()
	{
		var mat = tomahawk_ns.Matrix4x4.toMatrix2D(this.getConcatenedMatrix3D(true));
		var pt1 = mat.transformPoint(0,0);
		var pt3 = mat.transformPoint(0,100);
		var pt2 = mat.transformPoint(100,0);
		
		var vec1 = new tomahawk_ns.Vector3D(pt2.x - pt1.x, pt2.y - pt1.y,0);
		var vec2 = new tomahawk_ns.Vector3D(pt3.x - pt1.x, pt3.y - pt1.y,0);
		vec1.crossProduct(vec2);

		return vec1;
	};
	
	/**
	* @description Returns the combined 3d and 2d transformation matrixes of the Sprite3D instance and all of its parent objects, back to the stage level. If one of the parents of the Sprite3D instance is classical 2d display object, his matrix is converted into a Matrix4x4.
	* @method getConcatenedMatrix3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @returns {tomahawk_ns.Matrix4x4} returns a Matrix4x4 object
	**/
	Sprite3D.prototype.getConcatenedMatrix3D = function()
	{
		this.updateNextFrame = true;
		this.updateMatrix();
		var current = this.parent;
		var mat3D = this.matrix3D.clone();
		
		while( current != null )
		{
			current.updateNextFrame = true;
			current.updateMatrix();
			
			if( current.matrix3D && current.matrix3D != null )
			{
				mat3D.prependMatrix( current.matrix3D );
			}
			else
			{
				mat3D.prependMatrix( tomahawk_ns.Matrix4x4.toMatrix4x4(current.matrix) );
			}
			current = current.parent;
		}
		
		return mat3D;
	};
	
	/**
	* @method localToGlobal3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @param {string} {param} myparam
	* @returns {Number} returns a number
	* @description Converts the point object specified by x,y,z parameters from the DisplayObject's (local) coordinates to the Stage (global) coordinates.
	**/
	Sprite3D.prototype.localToGlobal3D = function(x,y,z)
	{
		var mat = this.getConcatenedMatrix3D();
		var pt = new tomahawk_ns.Point3D(x,y,z);
		mat.transformPoint3D(pt);
		return pt;
	};

	
	
	Sprite3D.prototype.updateMatrix = function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
			
		this.rotationX %= 360;
		this.rotationY %= 360;
		this.rotationZ %= 360;
			
		this.matrix3D.identity().appendTransform(	this.x, 
													this.y, 
													this.z,
													this.scaleX, 
													this.scaleY, 
													this.scaleZ,
													this.rotationX, 
													this.rotationY, 
													this.rotationZ,
													this.pivotX,
													this.pivotY,
													this.pivotZ
												);
												
		this.matrix = tomahawk_ns.Matrix4x4.toMatrix2D(this.matrix3D);
		this.updateNextFrame = false;
	};
	
	Sprite3D.prototype.draw = function(context)
	{
		context.save();
		
		if( this.useReal3D == true )
		{
			var mat = tomahawk_ns.Matrix4x4.toMatrix2D(this.getConcatenedMatrix3D());
			context.setTransform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		}
		
		tomahawk_ns.Sprite.prototype.draw.apply(this,[context]);
		context.restore();
	};
	
	
	Tomahawk.registerClass( Sprite3D, "Sprite3D" );
	Tomahawk.extend( "Sprite3D", "Sprite" );
	

	tomahawk_ns.Sprite3D = Sprite3D;
})();

