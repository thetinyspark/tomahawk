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
	
	bmp.x = bmp.y = 150; // sets the bitmap coordinates
	bmp.pivotX = bmp.width >> 1;
	bmp.pivotY = bmp.height >> 1;
	bmp.scaleX = 2;
	bmp.scaleY = 2;
	bmp.alpha = 0.5;

	stage.init(canvas); // initialize the stage
	stage.addChild( bmp ); // add a child to the stage
	stage.debug = true;
	//stage.enterFrame();
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};