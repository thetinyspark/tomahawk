/**
 * @author The Tiny Spark
 */
 
 (function() {
	 
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	Screen.getInnerWidth = function(stage)
	{
		return stage.getCanvas().parentNode.offsetWidth;
	};

	Screen.getInnerHeight = function(stage)
	{
		return stage.getCanvas().parentNode.offsetHeight;
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