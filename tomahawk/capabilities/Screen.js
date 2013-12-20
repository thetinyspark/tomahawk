/**
 * ...
 * @author Hatshepsout
 */

function Screen(){}

Tomahawk.registerClass(Screen,"Screen");


Screen.getInnerWidth = function()
{
	return Stage.getInstance().getCanvas().parent.offsetWidth;
};

Screen.getInnerHeight = function()
{
	return Stage.getInstance().getCanvas().parent.offsetHeight;
};

Screen.getWindowWidth = function()
{
	return window.innerWidth;
};