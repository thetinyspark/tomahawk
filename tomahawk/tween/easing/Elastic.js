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
	 * @class Elastic
	 * @memberOf tomahawk_ns
	 * @description an elastic easing class effect
	 * @constructor
	 **/
	function Elastic() {}

	Elastic._2PI = Math.PI * 2;
		
	Elastic.easeIn = function(t, b, c, d, a, p) 
	{

		var s;
		a = a || 0;
		p = p || 0;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
		else s = p/Elastic._2PI * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Elastic._2PI/p )) + b;
	};

	Elastic.easeOut  = function(t, b, c, d, a, p ) 
	{
		var s;
		a = a || 0;
		p = p || 0;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
		else s = p/Elastic._2PI * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*Elastic._2PI/p ) + c + b);
	};

	Elastic.easeInOut = function (t, b, c, d, a, p) 
	{
		var s;
		a = a || 0;
		p = p || 0;
		if (t==0) return b;  if ((t/=d*0.5)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (!a || (c > 0 && a < c) || (c < 0 && a < -c)) { a=c; s = p/4; }
		else s = p/Elastic._2PI * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Elastic._2PI/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*Elastic._2PI/p )*.5 + c + b;
	};
	
	tomahawk_ns.Elastic = Elastic;

})();