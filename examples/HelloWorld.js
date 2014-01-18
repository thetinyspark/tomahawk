/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.getLoremIpsum = function()
{
	var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vel sodales libero. Nulla odio odio, fermentum ut nulla at, posuere dignissim felis. Aliquam sit amet orci non mauris adipiscing malesuada a in lectus. Nunc sed arcu ante. Sed accumsan nisi metus, non posuere odio aliquet semper. Morbi vulputate mauris sed libero luctus blandit. Pellentesque fermentum posuere magna sit amet condimentum. Etiam et elit at risus dictum cursus eget et ante. Mauris ut molestie metus. Integer euismod pulvinar odio, eget scelerisque erat mollis nec.Proin pretium faucibus erat eu venenatis. Curabitur pretium lorem non justo mattis, nec vehicula augue fringilla. Nullam eu pharetra nisl, vitae tristique neque. Morbi convallis ullamcorper erat nec dignissim. Aenean luctus adipiscing gravida. Nullam fermentum diam lorem, non fermentum ante varius et. Pellentesque quis diam in nisi volutpat mattis. Duis ut pharetra risus. Pellentesque id purus eros. Sed consectetur, risus in pharetra tristique, ante turpis porta arcu, et egestas sapien nisl eu enim. Aliquam nisl ante, luctus nec dolor non, sagittis posuere quam.Sed ac imperdiet lectus. Mauris eros ipsum, tempus nec elementum a, vulputate eu turpis. Praesent sem libero, commodo eget pellentesque vitae, facilisis a enim. Pellentesque quis lorem ante. Nam placerat pulvinar tempor. Duis neque enim, ullamcorper non pharetra ac, volutpat at libero. Morbi vestibulum fringilla libero, ac elementum felis ullamcorper nec. Proin vel mi laoreet, interdum dui quis, porttitor urna. Integer a tempor eros. Aenean ut venenatis tellus, vitae lacinia augue. Ut at malesuada ligula.In hac habitasse platea dictumst. Etiam et rutrum felis. Phasellus sollicitudin justo quis ipsum tristique, vel tempus velit mattis. Integer ultrices porttitor laoreet. Nam elementum lorem nulla, vel lobortis lacus tincidunt non. Etiam eget turpis nec lorem vehicula dictum. Nullam sed placerat tortor. Maecenas sollicitudin a quam id viverra. In et vestibulum tellus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum sit amet urna urna. Proin viverra sapien et tortor hendrerit pulvinar. Pellentesque a tempor augue. In ultrices nisi pretium metus auctor feugiat. Aenean imperdiet massa mattis sapien posuere rutrum. Non mergitur sub di parenti";
	
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