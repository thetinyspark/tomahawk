/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	Tomahawk.run();
	
	var stage = tomahawk_ns.Stage.getInstance();
	var field = new tomahawk_ns.TextField();
	var shape = new tomahawk_ns.Shape();
	var container = new tomahawk_ns.Sprite();
	
	stage.init(document.getElementById("tomahawk"));
	
	container.addChild(shape);
	container.addChild(field);
	
	shape.width = shape.height = 800;
	field.width = field.height = 800;
	field.autoSize = true;
	field.defaultTextFormat.size = 90;
	field.setText("TextMask Example");
	field.y = 230;
	
	shape.beginPath();
	shape.createLinearGradient(0,0,0,80);
	shape.addColorStop(0,"red");
	shape.addColorStop(1,"green");
	shape.fillWithCurrentGradient();
	shape.fillRect(0,0,800,100);
	shape.y = 230;
	
	shape.setMask(field);
	
	stage.addChild(container);
	container.scaleX = container.scaleY = 0.5;
	
};

window.onload = function()
{
	var main = new Main();
	main.init();
};