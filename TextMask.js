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
	var text ="Tomahawk engine";
	var report = new tomahawk_ns.TextField();
	
	var i = 1000;
	while( --i > -1 )
	{
		text += "aa";
	}
	
	
	report.name = "report";
	report.autoSize = true;
	report.defaultTextFormat.size = 20;
	report.setText(text.length);
	report.width = 250;
	report.height = 250;
	
	report.x = 900;
	
	stage.init(document.getElementById("tomahawk"));
	
	shape.width = shape.height = 800;
	field.width = field.height = 800;
	field.autoSize = true;
	field.defaultTextFormat.size = 20;
	field.setText(text);
	field.defaultTextFormat.textAlign = "center";
	field.setTextFormat(field.defaultTextFormat,0,1);
	field.y = 0;
	field.name = "text";
	
	shape.beginPath();
	shape.createLinearGradient(0,0,0,400);
	shape.addColorStop(0,"red");
	shape.addColorStop(1,"green");
	shape.fillWithCurrentGradient();
	shape.fillRect(0,0,800,800);
	
	shape.setMask(field);
	container.scaleX = container.scaleY = 0.5;
	container.name = "container";
	field.setFocus(false);
	//field.cacheAsBitmap = true;
	
	document.getElementById("toggleMask").onchange = function(event)
	{
		var mask = ( event.target.checked == true ) ? field : null;
		shape.setMask(mask);
	};
	
	stage.addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this._enterFrame );
	
	
	container.addChild(shape);
	container.addChild(field);
	container.addChild(report);
	container.mouseEnabled = true;
	stage.addChild(container);
};

Main.prototype._enterFrame = function(event)
{
	var stage = event.target;
	var field = stage.getChildByName("container").getChildByName("text");
	var report = stage.getChildByName("container").getChildByName("report");
	var text = field.getText();
	stage.drawFPS();
	report.setText( ""+text.length+" chars" );
};

window.onload = function()
{
	var main = new Main();
	main.init();
};