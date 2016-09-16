/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	// retrieve the stage instance
	var stage = tomahawk_ns.Stage.getInstance(); 
	 // gets the canvas element
	var canvas = document.getElementById("tomahawk");
	// gets the DataLoader instance
	var loader = tomahawk_ns.DataLoader.getInstance();
	
	stage.init(canvas); // initialize the stage
	loader.clean();
	loader.addEventListener(tomahawk_ns.Event.COMPLETE, this, this._completeHandler);
	loader.addFile("assets/data1.json","data1", "GET", null);
	loader.addFile("assets/data2.json","data2", "GET", null);
	loader.load();
};

Main.prototype._completeHandler = function(event)
{
	var stage = tomahawk_ns.Stage.getInstance(); 
	var loader = tomahawk_ns.DataLoader.getInstance();
	var data1 = loader.getData()["data1"];
	var data2 = loader.getData()["data2"];
	var myData = data1+" ***** \n "+data2;
	var field = new tomahawk_ns.TextField();
	loader.removeEventListeners();
	
	field.width = field.height = 800;
	field.autoSize = true;
	field.defaultTextFormat.size = 20;
	field.setText(myData);
	field.defaultTextFormat.textAlign = "center";
	field.setTextFormat(field.defaultTextFormat,0,1);
	field.y = 0;
	field.name = "text";
	
	stage.addChild(field);
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};