/**
 * @author The Tiny Spark
 */

function Main(){}


Main.prototype._down = false;

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
	tomahawk_ns.AssetsLoader.getInstance().onComplete = function()
	{
		scope.complete();
	};
	
	tomahawk_ns.AssetsLoader.getInstance().load();
};

Main.prototype.complete = function()
{
	var data = tomahawk_ns.AssetsLoader.getInstance().getData();
	var bmp = null;
	var texture = null;
	var coords = null;
	var container = new tomahawk_ns.Sprite();
	var cloudsContainer = new tomahawk_ns.Sprite();
	var numRows = 20;
	var numCols = 20;
	var sky = new tomahawk_ns.Shape();
	
	
	sky.width = sky.height = 800;
	sky.beginPath();
	sky.createLinearGradient(0,0,0,100);
	sky.addColorStop(0,"white");
	sky.addColorStop(1,"#73D3F9");
	sky.fillWithCurrentGradient();
	sky.fillRect(0,0,800,800);
	sky.fill();
	sky.cacheAsBitmap = true;
	
	
	if( tomahawk_ns.Screen.getWindowWidth() < 800 )
	{	
		tomahawk_ns.Stage.getInstance().getCanvas().width = tomahawk_ns.Screen.getWindowWidth();
		tomahawk_ns.Stage.getInstance().getCanvas().height = tomahawk_ns.Screen.getWindowHeight();
	}
	
	var i = numRows;
	var j = 0;
	
	while( --i > -1 )
	{
		j = numCols;
		
		while( --j > -1 )
		{
			coords = this.isoToScreen(i,j,64,32);
			
			texture = new tomahawk_ns.Texture();
			texture.data = data["ground"]
			texture.rect = [0,0,64,43];
			
			bmp = new tomahawk_ns.Bitmap(texture);
			bmp.width = 64;
			bmp.height = 43;
			bmp.x = coords.x;
			bmp.y = coords.y;
			bmp.name = "bmp_"+i+'_'+j;
			bmp.autoUpdate = true;
			
			container.addChildAt(bmp,0);
		}
	}
	
	container.getChildByName("bmp_5_5").alpha = 0.1;
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
	
	cloudsContainer.mouseEnabled = false;
	coords = this.isoToScreen(5,5,64,32);
	
	texture = new tomahawk_ns.Texture();
	texture.data = data["perso1"];
	texture.rect = [0,0,110,224];
	
	bmp = new tomahawk_ns.Bitmap(texture);
	bmp.width = 64;
	bmp.height = 113;
	bmp.x = coords.x;
	bmp.y = coords.y;
	
	bmp.pivotY = bmp.height - 42 ;
	
	container.addChild(bmp);
	
	container.name = "narnia";
	cloudsContainer.name = "clouds";
	container.mouseEnabled = true;
	container.handCursor = true;
	
	tomahawk_ns.Stage.getInstance().addChild(sky);
	tomahawk_ns.Stage.getInstance().addChild(container);
	tomahawk_ns.Stage.getInstance().addChild(cloudsContainer);
	tomahawk_ns.Stage.getInstance().addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this.onFrame);
	
	
	container.enableDragAndDrop(true);
};


Main.prototype.onFrame = function()
{
	tomahawk_ns.Stage.getInstance().drawFPS();
	
	var cloudsContainer = tomahawk_ns.Stage.getInstance().getChildByName("clouds");
	
	if( cloudsContainer == null )
		return;
	
	var i = cloudsContainer.children.length;
	while( --i > -1 )
	{
		cloudsContainer.getChildAt(i).x -= 0.1;
	}
};

window.onload = function()
{
	var main = new Main();
	main.init();
};