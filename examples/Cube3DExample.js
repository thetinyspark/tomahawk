/**
 * ...
 * @author Thot
 */


function Main(){}

Main.prototype.init = function()
{
	Tomahawk.run();
	var loader = tomahawk_ns.AssetsLoader.getInstance();
	loader.addEventListener( tomahawk_ns.Event.COMPLETE, this, this._completeHandler );
	loader.addFile("./assets/perso1.png","perso1");
	loader.load();
};

Main.prototype._makeFace = function(color, width, height)
{
	var shape = new tomahawk_ns.Shape();
	shape.width = width;
	shape.height = height;
	
	shape.beginPath();
	shape.fillStyle(color);
	shape.fillRect(0,0,width,height);
	shape.fill();
	
	shape.beginPath();
	shape.strokeStyle("black");
	shape.moveTo(0,0);
	shape.lineTo(0,width);
	shape.lineTo(height,width);
	shape.lineTo(height,0);
	shape.lineTo(0,0);
	shape.stroke();
	
	return shape;
};

Main.prototype._completeHandler = function()
{
	var texture = new tomahawk_ns.Texture();
	texture.data = tomahawk_ns.AssetsLoader.getInstance().getData()['perso1'];
	texture.rect = [0,0,110,224];
	
	var stage = tomahawk_ns.Stage.getInstance();
	var bmp = new tomahawk_ns.Bitmap(texture);
	var canvas = document.getElementById("tomahawk");
	var cube = new Cube3D();
	var size = ( bmp.width > bmp.height ) ? bmp.width : bmp.height; 
	var backBmp = new tomahawk_ns.Bitmap(texture);
	
	stage.background = true;
	stage.backgroundColor = "black";
	
	cube.front.addChild( this._makeFace("white",size,size) );
	cube.back.addChild( this._makeFace("blue",size,size) );
	cube.left.addChild( this._makeFace("red",size,size) );
	cube.right.addChild( this._makeFace("yellow",size,size) );
	cube.top.addChild( this._makeFace("orange",size,size) );
	cube.bottom.addChild( this._makeFace("purple",size,size) );
	
	cube.front.addChild(bmp);
	cube.mouseEnabled = true;
	cube.front.mouseEnabled = true;
	
	bmp.mouseEnabled = true;
	bmp.addEventListener(tomahawk_ns.MouseEvent.CLICK, this, this._clickHandler );
	
	stage.init(canvas);
	
	cube.x = cube.y = 100;
	cube.useReal3D = true;
	cube.name = "cube3D";
	cube.front.alpha = 0.6;
	cube.back.alpha = 0.6;
	cube.left.alpha = 0.6;
	cube.right.alpha = 0.6;
	
	backBmp.x = 150;
	backBmp.y = 80;
	
	cube.replace(size);
	stage.addChild(backBmp);
	stage.addChild(cube);
	stage.addEventListener(tomahawk_ns.Event.ENTER_FRAME,this,this._enterFrame);
};

Main.prototype._sortPoints = function(a,b)
{
	return ( a.z < b.z ) ? -1 : 1;
};

Main.prototype._clickHandler = function(event)
{
	event.target.alpha = ( event.target.alpha == 1 ) ? 0.5 : 1;
};

Main.prototype._enterFrame = function(event)
{
	var stage = event.target;
	var cube = stage.getChildByName("cube3D");
	cube.rotationX = 20;
	cube.rotationY+=2;
	stage.drawFPS();
};

window.onload = function()
{
	var main = new Main();
	main.init();
};