/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	var stage = tomahawk_ns.Stage.getInstance();
	var shape = new tomahawk_ns.Shape();
	var canvas = document.getElementById("tomahawk");
	var sprite = new tomahawk_ns.Sprite();
	
	stage.init(canvas);
	
	shape.beginPath();
	shape.fillStyle("red");
	shape.fillRect(00,0,100,100);
	shape.fill();
	shape.width = 100;
	shape.height = 100;
	shape.cacheAsBitmap = true;
	
	sprite.scaleX = sprite.scaleY = 3;
	sprite.addChild(shape);
	stage.addChild(sprite);
	
	
	var behavior = new tomahawk_ns.DragAndDropBehavior();
	behavior.enableDragAndDrop(sprite, true);
	//sprite.enableDragAndDrop(true); // deprecated
	stage.debug = true; //  display fps at every frame
};

window.onload = function()
{
	Tomahawk.run();
	var main = new Main();
	main.init();
};

