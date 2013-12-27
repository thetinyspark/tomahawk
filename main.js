/**
 * ...
 * @author Thot
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
	Stage.getInstance().init(document.getElementById("tomahawk"));
	Stage.getInstance().setDebug(true);
	
	AssetsLoader.getInstance().addFile("./assets/ground.png","ground");
	AssetsLoader.getInstance().addFile("./assets/perso1.png","perso1");
	AssetsLoader.getInstance().addFile("./assets/perso2.png","perso2");
	AssetsLoader.getInstance().addFile("./assets/perso3.png","perso3");
	AssetsLoader.getInstance().onComplete = function()
	{
		scope.complete();
	};
	
	AssetsLoader.getInstance().load();
};

Main.prototype.complete = function()
{
	var data = AssetsLoader.getInstance().getData();
	var bmp = null;
	var texture = null;
	var coords = null;
	var container = new DisplayObjectContainer();
	var i = 15;
	var j = 0;
	
	while( --i > -1 )
	{
		j = 100;
		
		while( --j > -1 )
		{
			coords = this.isoToScreen(i,j,64,32);
			
			texture = new Texture();
			texture.data = data["ground"]
			texture.rect = [0,0,64,43];
			
			bmp = new Bitmap();
			bmp.texture = texture;
			bmp.width = 64;
			bmp.height = 43;
			bmp.x = coords.x + 400;
			bmp.y = coords.y;
			bmp.name = "bmp_"+i+'_'+j;
			
			container.addChildAt(bmp,0);
		}
	}
	
	
	coords = this.isoToScreen(5,5,64,32);
	
	texture = new Texture();
	texture.data = data["perso1"]
	texture.rect = [0,0,110,224];
	
	var mymask = new Bitmap();
	mymask.texture = texture;
	mymask.width = 64;
	mymask.height = 113;
	mymask.x = coords.x + 410;
	mymask.y = coords.y - ( mymask.height - 32 );
	
	bmp = new Bitmap();
	bmp.texture = texture;
	bmp.width = 64;
	bmp.height = 113;
	bmp.x = coords.x + 400;
	bmp.y = coords.y - ( bmp.height - 32 );
	
	//container.addChild(mymask);
	container.addChild(bmp);
	
	
	//bmp.setMask( mymask );
	//container.filters = [new GrayScaleFilter()];
	
	if( Screen.getWindowWidth() < 800 )
	{	
		Stage.getInstance().getCanvas().width = Screen.getWindowWidth();
		Stage.getInstance().getCanvas().height = Screen.getWindowHeight();
	}
	Stage.getInstance().addChild(container);
	Stage.getInstance().addEventListener(Event.ENTER_FRAME, this, this.onFrame);
	
};

Main.prototype.onFrame = function()
{
	Stage.getInstance().getChildAt(0).getChildAt(0).x++;
	//Stage.getInstance().getChildAt(0).x++;
	//Stage.getInstance().getChildAt(0).updateNextFrame = true;
};

window.onload = function()
{
	var main = new Main();
	main.init();
};