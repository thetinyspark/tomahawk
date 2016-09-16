(function() {
	
	if( Tomahawk.glEnabled == false )
		return;
	
	tomahawk_ns.Bitmap.prototype.draw 	= function( renderTask )
	{
		
		if( this.autoUpdate == true || this.updateNextFrame == true )
			this.updateMatrix();
			
		//renderTask.batchQuad(this, this.getConcatenedMatrix());
		 this.getConcatenedMatrix();
		
		this.autoUpdate = false;
	};

})();