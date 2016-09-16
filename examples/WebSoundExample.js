/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype._sound = null;
Main.prototype.mutator = 0.05;
Main.prototype.progression = 0;

Main.prototype.init = function()
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var canvas = document.getElementById("tomahawk"); // gets the canvas element
	var sound = new tomahawk_ns.WebAudioSound();
	var bar = new tomahawk_ns.ScrollBar();
	sound.addEventListener(tomahawk_ns.Event.COMPLETE, this, this._soundHandler );
	sound.load("assets/sw.mp3");
	stage.init(canvas); // initialize the stage
	stage.addChild(bar);
	
	stage.background = true;
	stage.backgroundColor = "#000000";
	
	bar.name = "bar";
	bar.setProgression(0);
	bar.x = 50;
	bar.y = 190;
	bar.reset(300, 10 );
};

Main.prototype._soundHandler = function(event)
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var bar = stage.getChildAt(0);
	var sound = event.target;
	var loader = tomahawk_ns.AssetsLoader.getInstance();
	this._sound = sound;
	
	sound.removeEventListener(tomahawk_ns.Event.COMPLETE, this, this._soundHandler );
	bar.setProgression(0.5);
	
	loader.clean();
	loader.addEventListener(tomahawk_ns.Event.COMPLETE, this, this._completeHandler);
	loader.addFile("./assets/vador.jpg","vador");
	loader.addFile("./assets/lightsaber.png","saber");
	loader.load();
};


Main.prototype._completeHandler = function(event)
{
	var stage 		= tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var loader 		= tomahawk_ns.AssetsLoader.getInstance();
	var data 		= loader.getData();
	var bar 		= stage.getChildByName("bar");
	var img 		= data["vador"];
	var img2 		= data["saber"];
	var texture 	= new tomahawk_ns.Texture(img, [0,0,img.naturalWidth, img.naturalHeight], "vador");
	var texture2 	= new tomahawk_ns.Texture(img2, [0,0,img2.naturalWidth, img2.naturalHeight], "saber");
	var filter 		= new tomahawk_ns.ShadowBlurFilter(0,0,"#c00000", 20);
	var bmp 		= new tomahawk_ns.Bitmap(texture);
	var saber 		= new tomahawk_ns.Bitmap(texture2);
	var sound 		= this._sound;
	
	loader.clean();
	loader.removeEventListeners();
	
	stage.removeChildren();
	stage.addChild(bmp);
	stage.addChild(bar);
	stage.addChild(saber);
	
	bar.reset(300,10, "#cacaca", "#cacaca", "#80FF80");
	bar.setProgression(1);
	
	saber.name = "saber";
	saber.x = 0;
	saber.y = 185;
	saber.pivotX = saber.width >> 1;
	saber.scaleX = -1
	
	bar.y = saber.y + 9;
	bar.x = saber.x + saber.width - 10;
	bar.filters = [filter, filter];
	
	document.getElementById("playBtn").addEventListener("click", sound.play.bind(sound, [0]));
	document.getElementById("stopBtn").addEventListener("click", sound.stop.bind(sound, [0]));
	document.getElementById("resumeBtn").addEventListener("click", sound.resume.bind(sound, [0]));
	document.getElementById("pauseBtn").addEventListener("click", sound.pause.bind(sound, [0]));
	
	setTimeout( this._start.bind(this), 1000 );
};

Main.prototype._start = function()
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var bar = stage.getChildByName("bar");
	var sound = this._sound;
	sound.play(0);
	
	stage.addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this._soundDrawHandler );
};

Main.prototype._soundDrawHandler = function(event)
{
	var stage = tomahawk_ns.Stage.getInstance();
	var bar = stage.getChildByName("bar");
	var sound = this._sound;
	var progression = sound.getElapsedTime() / sound.getDuration();
	var filter = bar.filters[0];
	
	
	if( parseInt( progression * 100 ) > this.progression )
	{
		this.progression = progression * 100;
		this.mutator = -this.mutator;
	}
	
	console.log();
	filter.shadowBlur += this.mutator;
	//bar.setProgression(progression);
	
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
	window.main = main;
};