/**
 * ...
 * @author Thot
 */

function DrawUtils(){}

DrawUtils._pool = new Array();


DrawUtils.drawMask = function( canvas, drawableObject, mask )
{
	var context = canvas.getContext("2d");
	var curMatrix = mask.getConcatenedMatrix();
	
	context.save();
	
	context.globalAlpha = mask.alpha;
	context.setTransform(	curMatrix.a,
							curMatrix.b,
							curMatrix.c,
							curMatrix.d,
							curMatrix.tx,
							curMatrix.ty);
								
	mask.draw(context);
	
	context.restore();

	context.save();
	
	context.globalCompositeOperation = "source-in";
	curMatrix = drawableObject.getConcatenedMatrix();
	
	context.globalAlpha = drawableObject.alpha;
	context.setTransform(	curMatrix.a,
							curMatrix.b,
							curMatrix.c,
							curMatrix.d,
							curMatrix.tx,
							curMatrix.ty);
	
	drawableObject.draw(context);
	
	context.restore();
	return canvas;
};

DrawUtils.drawFilters = function( canvas, drawableObject )
{
	var i = 0;
	var max = drawableObject.filters.length;
	var filter = null;
	var curMatrix = drawableObject.getConcatenedMatrix();
	var context = canvas.getContext("2d");
	context.save();
	
	context.globalAlpha = drawableObject.alpha;
	context.setTransform(	curMatrix.a,
							curMatrix.b,
							curMatrix.c,
							curMatrix.d,
							curMatrix.tx,
							curMatrix.ty);
								
	drawableObject.draw(context);
	
	for( ; i < max; i++ )
	{
		filter = drawableObject.filters[i];
		filter.apply(canvas,context,drawableObject);
	}
	
	context.restore();
};

DrawUtils.getCanvas = function()
{
	var canvas = null;
	if( DrawUtils._pool.length > 0 )
	{
		canvas = DrawUtils._pool.shift();
	}
	else
	{
		canvas = document.createElement("canvas");
		canvas.width = Stage.getInstance().getCanvas().width;
		canvas.height = Stage.getInstance().getCanvas().height;
	}
	
	return canvas;
};

DrawUtils.recycleCanvas = function(canvas)
{
	DrawUtils._pool.push(canvas);
};