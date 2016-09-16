/**
 * ...
 * @author Thot
 */

function Main(){}
Main.prototype.speedX = 10;

Main.prototype.init = function()
{
	var textureData = document.getElementById("perso"); // gets a DOM image
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var canvas = document.getElementById("tomahawk"); // gets the canvas element
	// creates a new texture
	var texture = new tomahawk_ns.Texture(textureData,[0,0,textureData.naturalWidth,textureData.naturalHeight],"mytexture");
	
	// creates a new bitmap instance
	var bmp = new tomahawk_ns.Bitmap(texture);
	var bmp2 = new tomahawk_ns.Bitmap(texture);
	var spr = new tomahawk_ns.Sprite();
	
	bmp2.pivotX = bmp.pivotX = bmp.width >> 1;
	bmp2.pivotY = bmp.pivotY = bmp.height >> 1;
	bmp2.x = bmp2.y = bmp.x =  bmp.y = 50; // sets the bitmap coordinates

	//stage.background = true;
	//stage.backgroundColor = "rgba(255,255,255,0.01)";
	stage.init(canvas); // initialize the stage
	spr.addChild( bmp ); // add a child to the stage
	spr.addChild( bmp2 ); // add a child to the stage
	
	spr.filters = new Array();
	bmp.filters = new Array();
	bmp2.filters = new Array();
	//bmp2.filters = new Array();
	
	//bmp.filters.push( new tomahawk_ns.ShadowBlurFilter(15,15,"#333333", 20) );
	//bmp.filters.push( new tomahawk_ns.PixelateFilter(10) );
	//spr.filters.push( new tomahawk_ns.RemanenceFilter(100,0.5) );
	//bmp2.filters.push( new tomahawk_ns.BlurFilter() );
	//bmp2.filters.push( new tomahawk_ns.ConvolutionFilter([1/16,2/16,1/16,2/16,4/16,2/16,1/16,2/16,1/16]) );
	//bmp2.filters.push( new tomahawk_ns.ConvolutionFilter([0,0,0,-1,1,0,0,0,0]) );
	stage.addChild( spr ); // add a child to the stage
	stage.debug = true;
	
	
	stage.addEventListener( tomahawk_ns.Event.ENTER_FRAME, this, this._enterFrameHandler );
};

Main.prototype._enterFrameHandler = function(event)
{
	var stage = event.target;
	var spr = stage.getChildAt(0);
	var bmp = spr.getChildAt(0);
	bmp.x+=this.speedX;
	//
	if( bmp.x > 600 || bmp.x < 50)
	{
		this.speedX = -this.speedX;
		bmp.scaleX = -bmp.scaleX;
	}
	//var filter = spr.filters[0];
	//filter.value += 0.1;
	//if( filter.value > 100 )
		//filter.value = 100;
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};