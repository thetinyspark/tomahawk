/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var canvas = document.getElementById("tomahawk"); // gets the canvas element
	// creates a new shape instance
	var shape = new tomahawk_ns.Shape();
	
	shape.x = shape.y = 50; // sets the bitmap coordinates
	shape.beginPath();
	shape.fillStyle("#004080");
	shape.fillRect(0,0,100,100);
	shape.fill();
	
	stage.init(canvas); // initialize the stage
	stage.addChild( shape ); // add a child to the stage
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};