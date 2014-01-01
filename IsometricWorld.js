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
	var cloundsContainer = new tomahawk_ns.Sprite();
	var numRows = 50;
	var numCols = 50;
	var sky = new tomahawk_ns.Shape();
	
	
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
	
	
	i = 5;
	
	texture = new tomahawk_ns.Texture();
	texture.data = data["clouds"];
	texture.rect = [0,0,150,91];
	
	while( --i > -1 )
	{
		bmp = new tomahawk_ns.Bitmap(texture);
		bmp.x = Math.random() * 800;
		bmp.y = Math.random() * 400;
		bmp.mouseEnabled = false;
		bmp.alpha = 0.8;
		
		cloundsContainer.addChild(bmp);
	}
	
	cloundsContainer.mouseEnabled = false;
	
	
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
	
	container.addChild(bmp);
	
	bounds = container.getBoundingRect();
	//container.x = tomahawk_ns.Stage.getInstance().getCanvas().width * 0.5;
	container.name = "narnia";
	container.cacheAsBitmap = true;
	cloundsContainer.name = "clouds";
	
	
	tomahawk_ns.Stage.getInstance().addChild(sky);
	tomahawk_ns.Stage.getInstance().addChild(container);
	tomahawk_ns.Stage.getInstance().addChild(cloundsContainer);
	tomahawk_ns.Stage.getInstance().addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this.onFrame);
};

Main.prototype.onFrame = function()
{
	tomahawk_ns.Stage.getInstance().drawFPS();
	var container = tomahawk_ns.Stage.getInstance().getChildByName("narnia");
	var cloundsContainer = tomahawk_ns.Stage.getInstance().getChildByName("clouds");
	this._counter++;
	//return;
	
	var i = cloundsContainer.children.length;
	while( --i > -1 )
	{
		cloundsContainer.getChildAt(i).x -= 0.1;
	}
	
	if( container == null )
	{
		return;
	}
	
	if( this._counter > 240 )
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
		cloundsContainer.x -= 0.5;
		cloundsContainer.y -= 0.5;
	}
	else if( this._direction == 1 )
	{
		container.x++;
		container.y--;
		cloundsContainer.x += 0.5;
		cloundsContainer.y -= 0.5;
	}
	else if( this._direction == 2 )
	{
		container.x++;
		container.y++;
		cloundsContainer.x += 0.5;
		cloundsContainer.y += 0.5;
	}
	else if( this._direction == 3 )
	{
		container.x--;
		container.y++;
		cloundsContainer.x -= 0.5;
		cloundsContainer.y += 0.5;
	}
};

window.onload = function()
{
	var main = new Main();
	main.init();
};