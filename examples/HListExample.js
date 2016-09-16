/**
 * ...
 * @author Thot
 */

function Main(){}

Main.prototype.init = function()
{
	var stage = tomahawk_ns.Stage.getInstance(); // retrive the stage instance
	var canvas = document.getElementById("tomahawk"); // gets the canvas element
	var bar = new tomahawk_ns.ScrollBar();
	var loader = tomahawk_ns.AssetsLoader.getInstance();
	// creates a new shape instance
	stage.init(canvas); // initialize the stage
	
	loader.addFile("./assets/boots.png","boots");
	loader.addFile("./assets/bag_grey.png","bag_grey");
	loader.addFile("./assets/bag_red.png","bag_red");
	loader.addFile("./assets/bomb.png","bomb");
	loader.addFile("./assets/potion_life.png","potion_life");
	loader.addFile("./assets/potion_mana.png","potion_mana");
	loader.addFile("./assets/saphir.png","saphir");
	loader.addFile("./assets/gold.png","gold");
	loader.addFile("./assets/clouds.png","clouds");
	loader.addFile("./assets/perso1.png","perso1");
	loader.addFile("./assets/perso2.png","perso2");
	loader.addFile("./assets/perso3.png","perso3");
	loader.addFile("./assets/ground.png","ground");
	loader.addEventListener( tomahawk_ns.Event.COMPLETE, this, this._completeHandler );
	loader.addEventListener( tomahawk_ns.Event.PROGRESS, this, this._progressHandler );
	loader.addEventListener( tomahawk_ns.Event.IO_ERROR, this, this._errorHandler );
	loader.load();
	
	stage.addChild(bar);
};

Main.prototype._completeHandler = function(event)
{
	var stage = tomahawk_ns.Stage.getInstance();
	var bar = stage.getChildAt(0);
	var loader = event.target;
	var data = loader.getData();
	var prop = null;
	var list = new tomahawk_ns.HList();
	
	stage.removeChildren();
	stage.addChild(list);
	
	for( prop in data )
	{
		list.addChild( 
						new tomahawk_ns.Bitmap	(
													new tomahawk_ns.Texture	(	
																				data[prop], 
																				[
																					0,
																					0,
																					data[prop].naturalWidth,
																					data[prop].naturalHeight
																				],
																				prop
																			)
												) 
					);
	}
	
	
	list.listWidth = 400;
	list.elementWidth = 50;
	list.elementHeight = 50;
	list.refresh();
	
	document.getElementById("prevBtn").addEventListener("click", list.left.bind(list));
	document.getElementById("nextBtn").addEventListener("click", list.right.bind(list));
};



Main.prototype._progressHandler = function(event)
{
	var stage = tomahawk_ns.Stage.getInstance();
	var bar = stage.getChildAt(0);
	var loader = event.target;
	var progression = loader.getProgression();
	bar.setProgression(progression);
};

Main.prototype._errorHandler = function(event)
{
	var stage = tomahawk_ns.Stage.getInstance();
	var bar = stage.getChildAt(0);
	var loader = event.target;
	
	loader.removeEventListeners();
	bar.error();
	loader.clean();
};

window.onload = function()
{
	Tomahawk.run(); // runs the engine
	var main = new Main(); //creates a new Main instance
	main.init(); // init the main instance
};

