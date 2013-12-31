/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype._direction = 0;
Main.prototype._counter = 0;

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
	var container = new tomahawk_ns.DisplayObjectContainer();
	var numRows = 30;
	var numCols = 30;
	
	if( tomahawk_ns.Screen.getWindowWidth() < 800 )
	{	
		tomahawk_ns.Stage.getInstance().getCanvas().width = tomahawk_ns.Screen.getWindowWidth();
		tomahawk_ns.Stage.getInstance().getCanvas().height = tomahawk_ns.Screen.getWindowHeight();
	}
	
	var bounds = null;
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
			bmp.autoUpdate = false;
			
			container.addChildAt(bmp,0);
		}
	}
	
	coords = this.isoToScreen(5,5,64,32);
	
	texture = new tomahawk_ns.Texture();
	texture.data = data["perso1"];
	texture.rect = [0,0,110,224];
	
	bmp = new tomahawk_ns.Bitmap();
	bmp.texture = texture;
	bmp.width = 64;
	bmp.height = 113;
	bmp.x = coords.x;
	bmp.y = coords.y;
	
	bmp.pivotX =  bmp.width >> 1;
	bmp.pivotY = bmp.height >> 1;
	
	container.addChild(bmp);
	
	bounds = container.getBoundingRect();
	//container.x = tomahawk_ns.Stage.getInstance().getCanvas().width * 0.5;
	container.name = "narnia";
	container.cacheAsBitmap = true;
	
	tomahawk_ns.Stage.getInstance().addChild(container);
	tomahawk_ns.Stage.getInstance().addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this.onFrame);
};

Main.prototype.onFrame = function()
{
	tomahawk_ns.Stage.getInstance().drawFPS();
	var container = tomahawk_ns.Stage.getInstance().getChildByName("narnia");
	this._counter++;
	//return;
	
	if( this._counter > 120 )
	{
		this._direction++;
		if( this._direction == 4 )
			this._direction = 0;
			
		this._counter = 0;
	}
	
	if( this._direction == 0 )
	{
		container.x--;
		container.y--;
	}
	else if( this._direction == 1 )
	{
		container.x++;
		container.y--;
	}
	else if( this._direction == 2 )
	{
		container.x++;
		container.y++;
	}
	else if( this._direction == 3 )
	{
		container.x--;
		container.y++;
	}
};

window.onload = function()
{
	var main = new Main();
	main.init();
};