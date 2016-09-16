/**
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{

	function BlendMode(){}
	
	Tomahawk.registerClass( BlendMode, "BlendMode" );

	tomahawk_ns.BlendMode = BlendMode;
	
	
	BlendMode.init = function(gl)
	{
		tomahawk_ns.BlendMode.NORMAL         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
		//tomahawk_ns.BlendMode.NORMAL         = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.ADD            = [gl.SRC_ALPHA, gl.DST_ALPHA];
        tomahawk_ns.BlendMode.MULTIPLY       = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.SCREEN         = [gl.SRC_ALPHA, gl.ONE];
        tomahawk_ns.BlendMode.OVERLAY        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.DARKEN         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.LIGHTEN        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.COLOR_DODGE    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.COLOR_BURN     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.HARD_LIGHT     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.SOFT_LIGHT     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.DIFFERENCE     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.EXCLUSION      = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.HUE            = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.SATURATION     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.COLOR          = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        tomahawk_ns.BlendMode.LUMINOSITY     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
	}
	
	BlendMode.NORMAL = 0;
	BlendMode.ADD = 1;
	BlendMode.MULTIPLY = 2;
	BlendMode.SCREEN = 3;
	BlendMode.OVERLAY = 4;
	BlendMode.DARKEN = 5;
	BlendMode.LIGHTEN = 6;
	BlendMode.COLOR_DODGE = 7;
	BlendMode.COLOR_BURN = 8;
	BlendMode.HARD_LIGHT = 9;
	BlendMode.SOFT_LIGHT = 10;
	BlendMode.DIFFERENCE = 11;
	BlendMode.EXCLUSION = 12;
	BlendMode.HUE = 13;
	BlendMode.SATURATION = 14;
	BlendMode.COLOR = 15;
	BlendMode.LUMINOSITY = 16;
	
})();