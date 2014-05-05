/*
* Visit http://the-tiny-spark.com/tomahawk/ for documentation, updates and examples.
*
* Copyright (c) 2014 the-tiny-spark.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.

* @author The Tiny Spark
*/
(function() {
	
	/**
	 * @class Quint
	 * @memberOf tomahawk_ns
	 * @description a Quint class effect
	 * @constructor
	 **/
	function Quint() {}
		
	Quint.easeIn  = function(t, b, c, d) 
	{
		return c*(t/=d)*t*t*t*t + b;
	};

	Quint.easeOut  = function(t, b, c, d) 
	{
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	};

	Quint.easeInOut  = function(t, b, c, d) 
	{
		if ((t/=d*0.5) < 1) return c*0.5*t*t*t*t*t + b;
		return c*0.5*((t-=2)*t*t*t*t + 2) + b;
	};
	tomahawk_ns.Quint = Quint;

})();