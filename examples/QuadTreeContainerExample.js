/**
 * @author The Tiny Spark
 
 
 NOTE: QuadTreeContainer is designed to store DisplayObject's in a spatial data structure.
 This spatial data structure is recursively split in 4 nodes called "QuadTreeNode".
 
 QuadTreeContainer has sense if you don't have a lot of moving objects, those objects will just update their matrices
 on demand. In order to do that you have to pass the autoUpdate property of your DisplayObject to false.
 Each time you want to 'refresh' your DisplayObject's matrice you just have to pass his updateNextFrame property to true.
 
 Then, the matrice will be update and the DisplayObject will be replace on the QuadTree.
 
 Here's an example with a 100x100 tiles iso world, no cache, no cheat except the QuadTreeContainer.
 60 fps should be a minimum ;p
 
 If you plan to use a majority of moving objects ( with autoUpdate property to true so ) it is better for you to not use 
 QuadTreeContainer because repopulating the QuadTree has a cost. 
 
 */

function Main(){}

Main.prototype.isoToScreen = function(  p_row, p_col, p_cellW, p_cellH )
{
   var x = ( p_col - p_row ) * ( p_cellW * 0.5 );
   var y = ( p_col + p_row ) * ( p_cellH * 0.5 );
   
   x >>= 0;
   y >>= 0;
   
   return {"x":x, "y":y };
};

Main.prototype.init = function()
{
	var scope = this;
	
	Tomahawk.run();
	tomahawk_ns.Stage.getInstance().init(document.getElementById("tomahawk"));
	tomahawk_ns.Stage.getInstance().background = true;
	tomahawk_ns.Stage.getInstance().backgroundColor = "#73D3F9";
	
	tomahawk_ns.AssetsLoader.getInstance().addFile("./assets/clouds.png","clouds");
	tomahawk_ns.AssetsLoader.getInstance().addFile("./assets/ground.png","ground");
	tomahawk_ns.AssetsLoader.getInstance().addFile("./assets/perso1.png","perso1");
	tomahawk_ns.AssetsLoader.getInstance().addFile("./assets/perso2.png","perso2");
	tomahawk_ns.AssetsLoader.getInstance().addFile("./assets/perso3.png","perso3");
	tomahawk_ns.AssetsLoader.getInstance().addEventListener( tomahawk_ns.Event.COMPLETE, this, this.completeHandler );
	tomahawk_ns.AssetsLoader.getInstance().load();
};

Main.prototype.completeHandler = function(event)
{
	var data = tomahawk_ns.AssetsLoader.getInstance().getData();
	var bmp = null;
	var texture = null;
	var coords = null;
	var container = new tomahawk_ns.QuadTreeContainer(-10000,10000,-10000,10000,100,4);
	var cloudsContainer = new tomahawk_ns.Sprite();
	var numRows = 100;
	var numCols = 100;
	var sky = new tomahawk_ns.Shape();
	
	container.enableDragAndDrop(true);
	
	sky.beginPath();
	sky.createLinearGradient(0,0,0,100);
	sky.addColorStop(0,"white");
	sky.addColorStop(1,"#73D3F9");
	sky.fillWithCurrentGradient();
	sky.fillRect(0,0,800,800);
	
	
	if( tomahawk_ns.Screen.getWindowWidth() < 800 )
	{	
		tomahawk_ns.Stage.getInstance().getCanvas().width = tomahawk_ns.Screen.getWindowWidth();
		tomahawk_ns.Stage.getInstance().getCanvas().height = tomahawk_ns.Screen.getWindowHeight();
	}
	
	var i = numRows;
	var j = 0;
	var spr = new tomahawk_ns.Sprite();
	
	while( --i > -1 )
	{
		j = numCols;
		
		while( --j > -1 )
		{
			spr = new tomahawk_ns.Sprite();
			
			coords = this.isoToScreen(i,j,64,32);
			
			texture = new tomahawk_ns.Texture();
			texture.data = data["ground"]
			texture.rect = [0,0,64,43];
			
			bmp = new tomahawk_ns.Bitmap(texture);
			bmp.width = 64;
			bmp.height = 43;
			bmp.name = "bmp_"+i+'_'+j;
			
			bmp.autoUpdate = false;
			spr.autoUpdate = false;
			
			spr.name = "spr_"+i+'_'+j;
			spr.addChild(bmp);
			
			spr.x = coords.x;
			spr.y = coords.y;
			container.addChildAt(spr,0);
		}
	}
	
	
	spr = container.getChildAt(1);
	spr.updateBounds();
	bmp = spr.getChildAt(0);
	
	i = 5;
	
	texture = new tomahawk_ns.Texture();
	texture.data = data["clouds"];
	texture.rect = [0,0,150,91];
	
	while( --i > -1 )
	{
		bmp = new tomahawk_ns.Bitmap(texture);
		bmp.x = Math.random() * 800;
		bmp.y = Math.random() * 400;
		bmp.alpha = 0.8;
		
		cloudsContainer.addChild(bmp);
	}
	

	coords = this.isoToScreen(5,5,64,32);
	
	texture = new tomahawk_ns.Texture();
	texture.data = data["perso1"];
	texture.rect = [0,0,110,224];
	
	bmp = new tomahawk_ns.Bitmap(texture);
	bmp.width = 64;
	bmp.height = 113;
	bmp.x = coords.x;
	bmp.y = coords.y;
	
	bmp.pivotX =  bmp.width >> 1;
	bmp.pivotY = bmp.height >> 1;
	bmp.autoUpdate = false;
	
	container.addChild(bmp);
	container.scaleX = container.scaleY = 1;
	
	container.name = "world";
	cloudsContainer.name = "clouds";
	container.handCursor = true;
	
	tomahawk_ns.Stage.getInstance().addChild(container);
	tomahawk_ns.Stage.getInstance().addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this.onFrame);
};

Main.prototype.onFrame = function()
{
	tomahawk_ns.Stage.getInstance().drawFPS();
	
};

window.onload = function()
{
	var main = new Main();
	main.init();
};