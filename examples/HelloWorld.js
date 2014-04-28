/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.getLoremIpsum = function()
{
	var lorem = "Higitus figitus zombadaboum !";
	
	return lorem;
}

Main.prototype.init = function()
{
	var format = new tomahawk_ns.TextFormat();
	var field = new tomahawk_ns.InputTextField();
	var stage = tomahawk_ns.Stage.getInstance();
	var shape = new tomahawk_ns.Shape();
	var canvas = document.getElementById("tomahawk");
	var text = this.getLoremIpsum();
	
	field.setFocus(true);
	
	// init the stage
	stage.init(canvas); 
	
	
	// build background shape
	shape.beginPath();
	shape.fillStyle("#0080C0");
	shape.fillRect( 0, 0, canvas.width, canvas.height );
	shape.fill();
	
	
	// default textformat
	format.bold = false;
	format.textColor = "red";
	format.size = 14;
	
	// textfield properties
	field.background = true;
	field.backgroundColor = "white";
	field.defaultTextFormat = format;
	field.setFocus(true);
	field.setText(text);
	field.width = 600;
	field.height = 600;
	field.background = true;
	field.border = true;
	field.backgroundColor = "white";
	field.borderColor = "green";
	field.autoSize = true;
	field.name = "textfield";
	field.x = field.y = 25;
	field.setTextAlign( tomahawk_ns.TextField.ALIGN_CENTER );
	
	// set a new textformat 
	format = new tomahawk_ns.TextFormat();
	format.textColor = "red";
	format.size = 25;
	
	field.setTextFormat(format,6,160);	
	
	format = new tomahawk_ns.TextFormat();
	format.size = 48;
	format.textColor = "green";
	
	field.setTextFormat(format,160,280);	
	
	// add and listen
	stage.addChild( shape );
	stage.addChild( field );
	stage.addEventListener(tomahawk_ns.Event.ENTER_FRAME,this,this._enterFrame);
};

Main.prototype._enterFrame = function(event)
{
	var field = event.target.getChildByName("textfield");
	//field.setTextAlign(tomahawk_ns.TextField.ALIGN_JUSTIFY);
	event.target.drawFPS();
};

window.onload = function()
{
	Tomahawk.run();
	var main = new Main();
	main.init();
};