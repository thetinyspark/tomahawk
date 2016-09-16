/**
 * ...
 * @author Hatshepsout
 */

(function() {

 
	function ScrollBar()
	{
		tomahawk_ns.Sprite.apply(this);
		this.reset();
	}

	Tomahawk.registerClass(ScrollBar,"ScrollBar")
	Tomahawk.extend("ScrollBar","Sprite");

	ScrollBar.prototype._background 			= null;
	ScrollBar.prototype._foreground 			= null;
	ScrollBar.prototype._field 					= null;
	ScrollBar.prototype.backgroundColor 		= "#333333";
	ScrollBar.prototype.foregroundColor 		= "#0080C0";
	ScrollBar.prototype.errorColor 				= "#c00000";
	ScrollBar.prototype.barWidth				= 100;
	ScrollBar.prototype.barHeight				= 15;

	ScrollBar.prototype.reset 			= function(barWidth, barHeight,backgroundColor, foregroundColor,errorColor)
	{
		this.removeChildren();
		
		this.barWidth 			= barWidth 			|| this.barWidth;
		this.barHeight 			= barHeight 		|| this.barHeight;
		this.foregroundColor 	= foregroundColor 	|| this.foregroundColor;
		this.backgroundColor 	= backgroundColor 	|| this.backgroundColor;
		this.errorColor 		= errorColor 		|| this.errorColor;
		
		this._background 	= new tomahawk_ns.Shape();
		this._foreground 	= new tomahawk_ns.Shape();
		
		this._background.beginPath();
		this._background.fillStyle(this.backgroundColor);
		this._background.fillRect(0,0,this.barWidth,this.barHeight);
		this._background.fill();
		this._background.closePath();
		this._background.width = this.barWidth;
		this._background.height = this.barHeight;
		this._background.cacheAsBitmap = true;
		
		this._foreground.beginPath();
		this._foreground.fillStyle(this.foregroundColor);
		this._foreground.fillRect(0,0,this.barWidth,this.barHeight);
		this._foreground.fill();
		this._foreground.closePath();
		this._foreground.width = this.barWidth;
		this._foreground.height = this.barHeight;
		this._foreground.scaleX = 0;
		//this._foreground.cacheAsBitmap = true;
		
		
		this.addChild(this._background);
		this.addChild(this._foreground);
		this.setProgression(0);
	};

	ScrollBar.prototype.error 			= function()
	{
		this._foreground.clear();
		this._foreground.beginPath();
		this._foreground.fillStyle(this.errorColor);
		this._foreground.fillRect(0,0,this.barWidth,this.barHeight);
		this._foreground.fill();
		this._foreground.closePath();
		this._foreground.width = this.barWidth;
		this._foreground.height = this.barHeight;
	};

	ScrollBar.prototype.setProgression 	= function(progression)
	{
		progression = ( progression < 1 ) ? progression : 1;
		this._foreground.scaleX = progression;
	};

	ScrollBar.prototype.complete 		= function()
	{	
		this._foreground.scaleX = 1;
	};

	ScrollBar.prototype.destroy 		= function()
	{
		this.removeChildren();
		this._foreground = null;
		this._background = null;
	};


	tomahawk_ns.ScrollBar = ScrollBar;
})();

