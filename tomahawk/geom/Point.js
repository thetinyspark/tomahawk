/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function Point(){}
	Tomahawk.registerClass( Point, "Point" );
	
	
	Point.prototype.x = 0;
	Point.prototype.y = 0;
	
	
	tomahawk_ns.Point = Point;
})();