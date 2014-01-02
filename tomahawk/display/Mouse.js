/**
 * @author The Tiny Spark
 */
(function() {
	
	function Mouse(){}

	Tomahawk.registerClass( Mouse, "Mouse" );
	
	Mouse.RESIZE = "se-resize";
	Mouse.MOVE = "move";
	Mouse.POINTER = "pointer";
	Mouse.DEFAULT = "default";

	Mouse.setCursor = function(value,domElement)
	{
		domElement.style.cursor = value;
	};
	
	tomahawk_ns.Mouse = Mouse;
	
})();