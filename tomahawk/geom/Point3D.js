/**
 * @author The Tiny Spark
 */
 
(function() {
	

	function Point3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Point3D, "Point3D" );
	
	
	Point3D.prototype.x = 0;
	Point3D.prototype.y = 0;
	Point3D.prototype.z = 0;
	
	
	tomahawk_ns.Point3D = Point3D;
})();