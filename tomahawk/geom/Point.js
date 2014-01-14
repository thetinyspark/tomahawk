/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function Point(x,y)
	{
		this.x = x, this.y = y
	}
	
	Tomahawk.registerClass( Point, "Point" );
	
	
	Point.prototype.x = 0;
	Point.prototype.y = 0;
	
	
	tomahawk_ns.Point = Point;
})();