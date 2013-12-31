/**
 * ...
 * @author Hatshepsout
 */
 
 (function() {
	 
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	Screen.getInnerWidth = function(stage)
	{
		return stage.getCanvas().parent.offsetWidth;
	};

	Screen.getInnerHeight = function(stage)
	{
		return stage.getCanvas().parent.offsetHeight;
	};

	Screen.getWindowWidth = function()
	{
		return window.innerWidth;
	};

	Screen.getWindowHeight = function()
	{
		return window.innerHeight;
	};
	
	tomahawk_ns.Screen = Screen;
})();