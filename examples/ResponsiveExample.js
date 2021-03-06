/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype._progression = 0;

Main.prototype.init = function()
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrieve the stage instance
	var canvas = document.getElementById("tomahawk"); // get the canvas element
	var bar = new tomahawk_ns.ScrollBar();
	stage.init(canvas);
	stage.appWidth = 800;
	stage.appHeight = 600;
	stage.resizeMode = tomahawk_ns.Stage.RESIZE_BY_WIDTH;
	stage.setResponsive(true);
	
	bar.reset(300, 15, "#232323", "#0080C0","#C00000");
	bar.x = 50;
	bar.y = 180;
	stage.addChild(bar);
	
	this._tictacHandler();
};

Main.prototype._tictacHandler = function()
{
	this._progression += 0.01;
	var stage = tomahawk_ns.Stage.getInstance();
	var bar = stage.getChildAt(0);
	bar.setProgression(this._progression);
	
	if( this._progression >= 1 )
		this._progression = 0;
		
	setTimeout( this._tictacHandler.bind(this), 10 );
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};

