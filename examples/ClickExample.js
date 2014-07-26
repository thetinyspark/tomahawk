/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	// gets a DOM image
	var textureData = document.getElementById("perso"); 
	// retrieve the stage instance
	var stage = tomahawk_ns.Stage.getInstance(); 
	 // gets the canvas element
	var canvas = document.getElementById("tomahawk");
	// creates a new texture
	var texture = new tomahawk_ns.Texture(textureData,[0,0,textureData.naturalWidth,textureData.naturalHeight],"mytexture");
	// creates a new bitmap instance
	var bmp = new tomahawk_ns.Bitmap(texture);
	
	stage.init(canvas); // initialize the stage
	stage.addChild( bmp ); // add a child to the stage
	bmp.x = bmp.y = 50; // sets the bitmap coordinates
	bmp.pixelPerfect = true;
	bmp.pixelAlphaLimit = 0;
	
	// add an event listener 
	bmp.addEventListener(tomahawk_ns.MouseEvent.CLICK, this, this._mouseHandler);
};

Main.prototype._mouseHandler = function(event)
{
	var bmp = event.target;
	
	bmp.pivotX = bmp.width >> 1;
	bmp.pivotY = bmp.height >> 1;
	bmp.scaleX = ( bmp.scaleX == 1 ) ? 2 : 1;
	bmp.scaleY = bmp.scaleX;
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};