/**
 * @author The Tiny Spark
 */



function Cube3D()
{
	tomahawk_ns.Sprite3D.apply(this);
	this.front = new tomahawk_ns.Sprite3D();
	this.back = new tomahawk_ns.Sprite3D();
	this.left = new tomahawk_ns.Sprite3D();
	this.right = new tomahawk_ns.Sprite3D();
	this.bottom = new tomahawk_ns.Sprite3D();
	this.top = new tomahawk_ns.Sprite3D();
	
	this.addChild(this.front);
	this.addChild(this.back);
	this.addChild(this.left);
	this.addChild(this.right);
	this.addChild(this.bottom);
	this.addChild(this.top);
	this.replace(100);
}

Cube3D.prototype.replace = function(radius)
{
	var midSize = radius * 0.5;
	
	this.front.pivotX = this.front.pivotY = midSize;
	this.back.pivotX = this.back.pivotY = midSize;
	this.left.pivotX = this.left.pivotY = midSize;
	this.right.pivotX = this.right.pivotY = midSize;
	this.top.pivotX = this.top.pivotY = midSize;
	this.bottom.pivotX = this.bottom.pivotY = midSize;
	
	this.front.pivotZ = midSize;
	this.back.pivotZ = midSize;
	this.left.pivotZ = midSize;
	this.right.pivotZ = midSize;
	this.top.pivotZ = midSize;
	this.bottom.pivotZ = midSize;
	
	this.right.rotationY = 90;
	this.back.rotationY = 180;
	this.left.rotationY = 270;
	this.top.rotationX = 270;
	this.bottom.rotationX = 90;
	
	
	this.bottom.useReal3D = true;
	this.top.useReal3D = true;
	this.back.useReal3D = true;
	this.front.useReal3D = true;
	this.left.useReal3D = true;
	this.right.useReal3D = true;
	
	this.pivotZ = midSize;
	this.pivotX = midSize;
	this.pivotY = midSize;
};

Cube3D.prototype.draw = function(context)
{
	var curFace = null;
	var faces = new Array();
	faces.push(this.front);
	faces.push(this.back);
	faces.push(this.left);
	faces.push(this.right);
	faces.push(this.top);
	faces.push(this.bottom);
	
	while( faces.length > 0 )
	{
		curFace = faces.shift();
		curFace.visible = ( curFace.getNormalVector().z > 0 ) ? 1 : 0;
	}
	
	tomahawk_ns.Sprite3D.prototype.draw.apply(this,[context]);
};


Cube3D.prototype.front = null;
Cube3D.prototype.back = null;
Cube3D.prototype.left = null;
Cube3D.prototype.right = null;
Cube3D.prototype.bottom = null;
Cube3D.prototype.top = null;

Tomahawk.registerClass( Cube3D, "Cube3D" );
Tomahawk.extend( "Cube3D", "Sprite3D" );

