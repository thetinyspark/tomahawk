/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype._progression = 0;

Main.prototype.init = function()
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrieve the stage instance
	var canvas = document.getElementById("tomahawk"); // gets the canvas element
	var bar = new tomahawk_ns.ScrollBar();
	var bar2 = new tomahawk_ns.ScrollBar();
	var behavior = new tomahawk_ns.DragAndDropBehavior();
	
	behavior.enableDragAndDrop(bar2, true);
	
	stage.init(canvas);
	
	bar.reset(300, 15, "#232323", "#0080C0","#C00000");
	bar.x = 50;
	bar.y = 180;
	
	bar2.reset(300, 15, "#232323", "#004000","#C00000");
	bar2.x = 50;
	bar2.y = 200;
	stage.addChild(bar);
	stage.addChild(bar2);
	
	this._tictacHandler();
};

Main.prototype._tictacHandler = function()
{
	var stage = tomahawk_ns.Stage.getInstance();
	var bar = stage.getChildAt(0);
	var bar2 = stage.getChildAt(1);
	
	this._progression += 0.01;
	
	
	if( this._progression > 0.5 )
	{
		bar2.error();
	}
	else
	{
		bar2.setProgression(this._progression);
	}
	
	bar.setProgression(this._progression);
	
	if( this._progression >= 1 )
		return;
		
	setTimeout( this._tictacHandler.bind(this), 10 );
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};

