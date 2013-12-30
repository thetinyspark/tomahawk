/**
 * ...
 * @author Hatshepsout
 */
 
 (function() {
	 
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	Screen.getInnerWidth = function()
	{
		return Stage.getInstance().getCanvas().parent.offsetWidth;
	};

	Screen.getInnerHeight = function()
	{
		return Stage.getInstance().getCanvas().parent.offsetHeight;
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