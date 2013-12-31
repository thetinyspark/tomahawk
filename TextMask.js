/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	Tomahawk.run();
	
	var stage = tomahawk_ns.Stage.getInstance();
	var field = new tomahawk_ns.InputTextField();
	var shape = new tomahawk_ns.Shape();
	var container = new tomahawk_ns.Sprite();
	
	stage.init(document.getElementById("tomahawk"));
	
	container.addChild(shape);
	container.addChild(field);
	
	shape.width = shape.height = 800;
	field.width = field.height = 800;
	field.autoSize = true;
	field.defaultTextFormat.size = 90;
	field.setText("Tomahawk");
	field.defaultTextFormat.textAlign = "center";
	field.setTextFormat(field.defaultTextFormat,0,1);
	field.y = 0;
	
	shape.beginPath();
	shape.createLinearGradient(0,0,0,400);
	shape.addColorStop(0,"red");
	shape.addColorStop(1,"green");
	shape.fillWithCurrentGradient();
	shape.fillRect(0,0,800,800);
	
	shape.setMask(field);
	
	stage.addChild(container);
	container.scaleX = container.scaleY = 0.5;
	
	field.setFocus(false);
	
	document.getElementById("toggleMask").onchange = function(event)
	{
		var mask = ( event.target.checked == true ) ? field : null;
		shape.setMask(mask);
	};
};

window.onload = function()
{
	var main = new Main();
	main.init();
};