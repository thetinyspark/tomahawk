/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	var scope = this;
	var format = new tomahawk_ns.TextFormat();
	var field = new tomahawk_ns.TextField();
	var stage = tomahawk_ns.Stage.getInstance();
	var shape = new tomahawk_ns.Shape();
	var canvas = document.getElementById("tomahawk");
	
	shape.beginPath();
	shape.fillStyle("#0080C0");
	shape.fillRect( 0, 0, canvas.width, canvas.height );
	shape.fill();
	
	Tomahawk.run();
	stage.init(canvas);
	
	format.bold = true;
	format.textColor = "red";
	format.size = 48;
	
	field.defaultTextFormat = format;
	field.setText("Hello World");
	field.width = 100;
	field.height = 100;
	field.background = true;
	field.border = true;
	field.backgroundColor = "white";
	field.borderColor = "green";
	field.autoSize = true;
	
	
	format = new tomahawk_ns.TextFormat();
	format.textColor = "red";
	
	field.setTextFormat(format,1,3);
	
	stage.addChild( shape );
	stage.addChild( field );
};

window.onload = function()
{
	var main = new Main();
	main.init();
};