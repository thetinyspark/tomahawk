/**
 * ...
 * @author Thot
 */


function Main(){}

Main.prototype.init = function()
{
	Tomahawk.run();
	var loader = tomahawk_ns.AssetsLoader.getInstance();
	loader.addEventListener( tomahawk_ns.Event.COMPLETE, this, this._completeHandler );
	loader.addFile("./assets/perso1.png","perso1");
	loader.load();
};

Main.prototype._completeHandler = function()
{
	var texture = new tomahawk_ns.Texture();
	texture.data = tomahawk_ns.AssetsLoader.getInstance().getData()['perso1'];
	texture.rect = [0,0,110,224];
	
	var stage = tomahawk_ns.Stage.getInstance("movieclip_example");
	var bmp = new tomahawk_ns.Bitmap(texture);
	var canvas = document.getElementById("tomahawk");
	var mc = new tomahawk_ns.MovieClip();

	
	stage.background = true;
	stage.backgroundColor = "black";
	stage.init(canvas);
	stage.addChild(mc);
	
		
	mc.fps = 60;
	mc.x = mc.y = 100;
	
	mc.setSymbols([bmp]);
	
	var info = 
	mc.getTimeline().addFrameAt(	new tomahawk_ns.Frame(	{
																label:"start",
																children:[
																	{	
																		"symbol":"perso1",
																		"alpha":1,
																		"a":1,
																		"b":0,
																		"ty":58,
																		"height":123,
																		"name":"mon_perso",
																		"c":0,
																		"width":45,
																		"d":1,
																		"tx":32
																	}
																]
															}
														), 0);
	
	mc.getTimeline().addFrameAt( mc.getTimeline().getFrameAt(0).clone(), 60 );
	mc.getTimeline().getFrameAt(60).label = "middle";
	
	mc.getTimeline().addTween( new tomahawk_ns.Tween(bmp,0,{x:0},{x:0},tomahawk_ns.Linear.easeIn,0) );
	mc.getTimeline().addTween( new tomahawk_ns.Tween(bmp,120,{x:0},{x:100},tomahawk_ns.Linear.easeIn,0) );

	//mc.stop();
	//mc.gotoLabelAndPlay("middle");
	mc.play();
	
	stage.addEventListener(tomahawk_ns.Event.ENTER_FRAME,this,this._enterFrame);
};

Main.prototype._enterFrame = function(event)
{
	var stage = event.target;
	stage.drawFPS();
};

window.onload = function()
{
	var main = new Main();
	main.init();
};