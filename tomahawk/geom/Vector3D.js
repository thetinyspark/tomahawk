/**
 * ...
 * @author Hatshepsout
 */

(function() {
	
	function Vector3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Vector3D, "Vector3D" );
	
	
	Vector3D.prototype.x = 0;
	Vector3D.prototype.y = 0;
	Vector3D.prototype.z = 0;
	
	Vector3D.prototype.crossProduct = function(vector)
	{
		var x = this.y * vector.z - this.z * vector.y;
		var y = this.z * vector.x - this.x * vector.z;
		var z = this.x * vector.y - this.y * vector.x;
		
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	};
	
	tomahawk_ns.Vector3D = Vector3D;
	
	
})();