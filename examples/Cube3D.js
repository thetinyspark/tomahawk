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
	
	this.front.name = "front";
	this.back.name = "back";
	this.left.name = "left";
	this.right.name = "right";
	this.top.name = "top";
	this.bottom.name = "bottom";
	
	this.addChild(this.front);
	this.addChild(this.back);
	this.addChild(this.left);
	this.addChild(this.right);
	this.addChild(this.bottom);
	this.addChild(this.top);
	//this.replace(100);
}

Cube3D.prototype.replace = function(radius)
{
	var midSize = radius * 0.5;
	
	this.front.pivotX = this.front.pivotY = this.front.pivotZ = midSize;
	this.back.pivotX = this.back.pivotY = this.back.pivotZ = midSize;
	this.left.pivotX = this.left.pivotY = this.left.pivotZ = midSize;
	this.right.pivotX = this.right.pivotY = this.right.pivotZ = midSize;
	this.top.pivotX = this.top.pivotY = this.top.pivotZ = midSize;
	this.bottom.pivotX = this.bottom.pivotY = this.bottom.pivotZ = midSize;
	
	this.front.rotationY = 0;
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
	
	this.children.sort(this._sortFaces);
};

Cube3D.prototype._sortFaces = function(faceA,faceB)
{
	var a = faceA.localToGlobal3D(faceA.pivotX,faceA.pivotY,0);
	var b = faceB.localToGlobal3D(faceB.pivotX,faceB.pivotX,0);
	
	return ( a.z > b.z ) ? -1 : 1;
};

Cube3D.prototype.draw = function(context)
{
	this.children.sort(this._sortFaces);	
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

