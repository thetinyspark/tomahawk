(function() {
	
	if( Tomahawk.glEnabled == false )
		return;
	
	tomahawk_ns.DisplayObject._buffer2D						= null;
	tomahawk_ns.DisplayObject.prototype.color 				= null;
	tomahawk_ns.DisplayObject.prototype.drawComposite 		= function(){};
	tomahawk_ns.DisplayObject.prototype.snapshot 			= function(transformMatrix){};
	tomahawk_ns.DisplayObject.prototype.updateCache 		= function(){};
	tomahawk_ns.DisplayObject.prototype.draw 				= function( renderTask ){};
	
	// reste à refaire le pixel perfect
	tomahawk_ns.DisplayObject.prototype.hitTest				= function(x,y)
	{
		var pt1 	= this.globalToLocal(x,y);
		var buffer 	= null;
		var mat 	= null;
		var pixels 	= null;
		var task 	= null;
		
		if( pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height )
			return false;
			
		if( this.pixelPerfect == false )
			return true;
		
		//mat = this.matrix.clone();
		//mat.identity();
		//mat.tx = -pt1.x;
		//mat.ty = -pt1.y;
		
		//
		//task = this.stage.getRenderTask();
		//pixels = task.getPixels(this, mat, this.width, this.height);
		
		
		//console.log(pixels);
		//pixels = context.getImageData(0,0,1,1).data;
		//
		//return ( pixels[3] > this.pixelAlphaLimit );
		
		
		return true;
	};
	
	tomahawk_ns.DisplayObject.prototype.getConcatenedMatrix = function(forceUpdate)
	{
		//var tab 		= new Array();
		//var current 	= this;
		
		//while( current != null )
		//{
			//if( forceUpdate == true )
			//{
				//current.updateNextFrame = true;
				//current.updateMatrix();
			//}
			//
			//tab.unshift(current.matrix);
			//
			//current = current.parent;
		//}
		
		if( this.parent == null )
		{
			this._concatenedMatrix = this.matrix;
		}
		else
		{
			this._concatenedMatrix.combine([this.parent._concatenedMatrix, this.matrix]);
		}
		
		return this._concatenedMatrix;
	};

})();