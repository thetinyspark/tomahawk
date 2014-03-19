/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function Point(x,y)
	{
		this.x = x, this.y = y
	}
	
	Tomahawk.registerClass( Point, "Point" );
	
	
	//static
	Point.distanceBetween = function(pointA, pointB)
	{
		var distX = ( pointB.x - pointA.x ) * ( pointB.x - pointA.x );
		var distY = ( pointB.y - pointA.y ) * ( pointB.y - pointA.y );
		var segLength = Math.sqrt( distX + distY );  
		return segLength;
	};
	
	Point.prototype.x = 0;
	Point.prototype.y = 0;
	
	tomahawk_ns.Point = Point;
})();