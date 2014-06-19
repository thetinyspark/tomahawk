/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	var textureData = document.getElementById("perso"); // gets a DOM image
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var canvas = document.getElementById("tomahawk"); // gets the canvas element
	// creates a new texture
	var texture = new tomahawk_ns.Texture(textureData,[0,0,textureData.naturalWidth,textureData.naturalHeight],"mytexture");
	
	// creates a new bitmap instance
	var bmp = new tomahawk_ns.Bitmap(texture);
	
	bmp.shadow = true;
	bmp.shadowBlur = 100;
	bmp.shadowColor = "red";
	bmp.shadowOffsetX = 10;
	bmp.shadowOffsetY = 10;
	
	bmp.x = bmp.y = 50; // sets the bitmap coordinates

	stage.init(canvas); // initialize the stage
	stage.addChild( bmp ); // add a child to the stage
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};