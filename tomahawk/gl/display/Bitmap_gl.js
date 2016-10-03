(function() {
	
	if( Tomahawk.glEnabled == false )
		return;
	
	tomahawk_ns.Bitmap.prototype.draw 	= function( renderTask )
	{
		renderTask.batchQuad(this, this._concatenedMatrix);
	};

})();