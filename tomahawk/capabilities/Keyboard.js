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
	 * @class Keyboard
	 * @memberOf tomahawk_ns
	 * @description The Keyboard class is used to build an interface that can be controlled by a user with a standard keyboard.
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 **/
	function Keyboard()
	{
		var callbackKey = this._keyboardHandler.bind(this);
		window.removeEventListener("keyup",callbackKey);
		window.removeEventListener("keydown",callbackKey);
		window.removeEventListener("keypress",callbackKey);
		
		window.addEventListener("keyup",callbackKey);
		window.addEventListener("keydown",callbackKey);
		window.addEventListener("keypress",callbackKey);
	}
	
	Tomahawk.registerClass( Keyboard, "Keyboard" );
	Tomahawk.extend( "Keyboard", "EventDispatcher" );
	
	Keyboard.prototype._keyboardHandler = function(event)
	{	
		if( event.type == "keyup" )
			tomahawk_ns.Keyboard.toggleShift(event.keyCode);
			
		var keyboardEvent = tomahawk_ns.KeyEvent.fromNativeEvent(event, true, true);
		
		this.dispatchEvent(keyboardEvent);
		
		if( keyboardEvent.keyCode == tomahawk_ns.Keyboard.BACKSPACE ||
		keyboardEvent.keyCode == tomahawk_ns.Keyboard.SPACE)
		{
			event.preventDefault();
			event.stopPropagation();
		}
	};
	
	
	/**
	* @description Returns the unique instance of the Keyboard class, singleton design pattern.
	* @method getInstance
	* @memberOf tomahawk_ns.Keyboard
	* @returns {tomahawk_ns.Keyboard} An Keyboard object
	**/
	Keyboard.getInstance = function()
	{
		if( tomahawk_ns.Keyboard._instance == null )
			tomahawk_ns.Keyboard._instance = new tomahawk_ns.Keyboard();
			
		return tomahawk_ns.Keyboard._instance;
	};
	
	/**
	* @description Returns the character which corresponds to the value passed in parameters.
	* @method keyCodeToChar
	* @memberOf tomahawk_ns.Keyboard
	* @param {Number} keyCode the keycode of the character
	* @param {Boolean} shiftKey indicates wether the shift key is pressed
	* @param {Boolean} ctrlKey indicates wether the ctrl key is pressed
	* @param {Boolean} altKey indicates wether the alt key is pressed
	* @returns {String} A character corresponding to the keycode.
	**/
	Keyboard.keyCodeToChar = function(keyCode, shiftKey, ctrlKey, altKey)
	{
		var obj = Keyboard.MAP[keyCode];
		var altgr = ctrlKey && altKey;
		
		if( obj == undefined )
			return "";

		if( altgr )
			return obj.altgr;
			
		if( shiftKey || Keyboard._majActive )
			return obj.shift;
			
		return obj.normal;
	};
	
	/**
	* @description Returns a Boolean value that indicates if the keycode specified by the "keycode" parameter is mapped by the Keyboard class.
	* @method isMapped
	* @memberOf tomahawk_ns.Keyboard
	* @param {Number} keyCode the keycode of the character
	* @returns {Boolean} true if the keycode is mapped, false if not.
	**/
	Keyboard.isMapped = function(keyCode)
	{
		return Keyboard.MAP[keyCode] != undefined;
	};
	
	Keyboard.toggleShift = function(keyCode)
	{
		if( keyCode == Keyboard.CAPSLOCK )
			Keyboard._majActive = ! Keyboard._majActive;
	};

	Keyboard._majActive = false;

	/**
	* @constant {Number} BACKSPACE
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.BACKSPACE = 8;
	
	/**
	* @constant {Number} TAB
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TAB = 9;
	
	/**
	* @constant {Number} ENTER
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.ENTER = 13;
	
	/**
	* @constant {Number} SHIFT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SHIFT = 16;
	
	/**
	* @constant {Number} CTRL
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.CTRL = 17;
	
	/**
	* @constant {Number} ALT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.ALT = 18;
	
	/**
	* @constant {Number} CAPSLOCK
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.CAPSLOCK = 20;
	
	/**
	* @constant {Number} SPACE
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SPACE = 32;
	
	/**
	* @constant {Number} END
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.END = 35;
	
	/**
	* @constant {Number} START
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.START = 36;
	
	/**
	* @constant {Number} LEFT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.LEFT = 37;
	
	/**
	* @constant {Number} UP
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.UP = 38;
	
	/**
	* @constant {Number} RIGHT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.RIGHT = 39;
	
	/**
	* @constant {Number} DOWN
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.DOWN = 40;
	
	/**
	* @constant {Number} SUPPR
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SUPPR = 46;


	// > 47
	
	/**
	* @constant {Number} TOUCH_0
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_0 = 48;
	
	/**
	* @constant {Number} TOUCH_1
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_1 = 49;
	
	/**
	* @constant {Number} TOUCH_2
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_2 = 50;
	
	/**
	* @constant {Number} TOUCH_3
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_3 = 51;
	
	/**
	* @constant {Number} TOUCH_4
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_4 = 52;
	
	/**
	* @constant {Number} TOUCH_5
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_5 = 53;
	
	/**
	* @constant {Number} TOUCH_6
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_6 = 54;
	
	/**
	* @constant {Number} TOUCH_7
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_7 = 55;
	
	/**
	* @constant {Number} TOUCH_8
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_8 = 56;
	
	/**
	* @constant {Number} TOUCH_9
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TOUCH_9 = 57;
	// < 58

	// > 64
	/**
	* @constant {Number} A
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.A = 65;
	
	/**
	* @constant {Number} B
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.B = 66;
	
	/**
	* @constant {Number} C
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.C = 67;
	
	/**
	* @constant {Number} D
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.D = 68;
	
	/**
	* @constant {Number} E
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.E = 69;
	
	/**
	* @constant {Number} F
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F = 70;
	
	/**
	* @constant {Number} G
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.G = 71;
	
	/**
	* @constant {Number} H
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.H = 72;
	
	/**
	* @constant {Number} I
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.I = 73;
	
	/**
	* @constant {Number} J
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.J = 74;
	
	/**
	* @constant {Number} K
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.K = 75;
	
	/**
	* @constant {Number} L
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.L = 76;
	
	/**
	* @constant {Number} M
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.M = 77;
	
	/**
	* @constant {Number} N
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.N = 78;
	
	/**
	* @constant {Number} O
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.O = 79;
	
	/**
	* @constant {Number} P
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.P = 80;
	
	/**
	* @constant {Number} Q
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.Q = 81;
	
	/**
	* @constant {Number} R
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.R = 82;
	
	/**
	* @constant {Number} S
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.S = 83;
	
	/**
	* @constant {Number} T
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.T = 84;
	
	/**
	* @constant {Number} U
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.U = 85;
	
	/**
	* @constant {Number} V
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.V = 86;
	
	/**
	* @constant {Number} W
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.W = 87;
	
	/**
	* @constant {Number} X
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.X = 88;
	
	/**
	* @constant {Number} Y
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.Y = 89;
	
	/**
	* @constant {Number} Z
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.Z = 90;
	// < 91


	/**
	* @constant {Number} WINDOWS
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.WINDOWS = 91;
	
	/**
	* @constant {Number} SELECT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SELECT = 93;

	// > 95
	
	/**
	* @constant {Number} NUMPAD_0
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_0 = 96;
	
	/**
	* @constant {Number} NUMPAD_1
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_1 = 97;
	
	/**
	* @constant {Number} NUMPAD_2
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_2 = 98;
	
	/**
	* @constant {Number} NUMPAD_3
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_3 = 99;
	
	/**
	* @constant {Number} NUMPAD_4
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_4 = 100;
	
	/**
	* @constant {Number} NUMPAD_5
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_5 = 101;
	
	/**
	* @constant {Number} NUMPAD_6
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_6 = 102;
	
	/**
	* @constant {Number} NUMPAD_7
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_7 = 103;
	
	/**
	* @constant {Number} NUMPAD_8
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_8 = 104;
	
	/**
	* @constant {Number} NUMPAD_9
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_9 = 105;
	
	/**
	* @constant {Number} NUMPAD_MULTIPLY
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_MULTIPLY = 106;
	
	/**
	* @constant {Number} NUMPAD_PLUS
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_PLUS = 107;
	
	/**
	* @constant {Number} NUMPAD_MINUS
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_MINUS = 109;
	
	/**
	* @constant {Number} NUMPAD_DOT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_DOT = 110;
	
	/**
	* @constant {Number} NUMPAD_SLASH
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.NUMPAD_SLASH = 111;
	// < 112

	// > 111
	
	/**
	* @constant {Number} F1
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F1 = 112;
	
	/**
	* @constant {Number} F2
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F2 = 113;
	
	/**
	* @constant {Number} F3
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F3 = 114;
	
	/**
	* @constant {Number} F4
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F4 = 115;
	
	/**
	* @constant {Number} F5
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F5 = 116;
	
	/**
	* @constant {Number} F6
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F6 = 117;
	
	/**
	* @constant {Number} F7
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F7 = 118;
	
	/**
	* @constant {Number} F8
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F8 = 119;
	
	/**
	* @constant {Number} F9
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F9 = 120;
	
	/**
	* @constant {Number} F10
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F10 = 121;
	
	/**
	* @constant {Number} F11
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F11 = 122;
	
	/**
	* @constant {Number} F12
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.F12 = 123;
	// < 124
	
	/**
	* @constant {Number} VERR_NUM
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.VERR_NUM = 144;

	// > 185
	
	/**
	* @constant {Number} DOLLAR
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.DOLLAR = 186;
	
	/**
	* @constant {Number} EQUAL
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.EQUAL = 187;
	
	/**
	* @constant {Number} QUESTION
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.QUESTION = 188;
	
	/**
	* @constant {Number} DOT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.DOT = 190
	
	/**
	* @constant {Number} SLASH
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.SLASH = 191;
	
	/**
	* @constant {Number} PERCENT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.PERCENT = 192;
	
	/**
	* @constant {Number} RIGHT_PARENT
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.RIGHT_PARENT = 219;
	
	/**
	* @constant {Number} MICRO
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.MICRO = 220;
	
	/**
	* @constant {Number} TREMA
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.TREMA = 221;
	
	/**
	* @constant {Number} POWER_TWO
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.POWER_TWO = 222;
	
	/**
	* @constant {Number} EXCLAMATION
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.EXCLAMATION = 223;
	
	// < 224

	/**
	* @description a map that contains and associates all the Keyboard constants to a specific character.
	* @constant {Number} MAP
	* @memberOf tomahawk_ns.Keyboard
	**/
	Keyboard.MAP = new Array();

	//undocumented
	Keyboard.MAP[Keyboard.TOUCH_0]={normal:"à",shift:"0",altgr:"@"};
	Keyboard.MAP[Keyboard.TOUCH_1]={normal:"&",shift:"1",altgr:""};
	Keyboard.MAP[Keyboard.TOUCH_2]={normal:"é",shift:"2",altgr:"~"};
	Keyboard.MAP[Keyboard.TOUCH_3]={normal:'"',shift:"3",altgr:"#"};
	Keyboard.MAP[Keyboard.TOUCH_4]={normal:"'",shift:"4",altgr:"{"};
	Keyboard.MAP[Keyboard.TOUCH_5]={normal:"(",shift:"5",altgr:"["};
	Keyboard.MAP[Keyboard.TOUCH_6]={normal:"-",shift:"6",altgr:"|"};
	Keyboard.MAP[Keyboard.TOUCH_7]={normal:"è",shift:"7",altgr:"`"};
	Keyboard.MAP[Keyboard.TOUCH_8]={normal:"_",shift:"8",altgr:"\\"};
	Keyboard.MAP[Keyboard.TOUCH_9]={normal:"ç",shift:"9",altgr:"^"};

	Keyboard.MAP[Keyboard.A]={normal:"a",shift:"A",altgr:""};
	Keyboard.MAP[Keyboard.B]={normal:"b",shift:"B",altgr:""};
	Keyboard.MAP[Keyboard.C]={normal:"c",shift:"C",altgr:""};
	Keyboard.MAP[Keyboard.D]={normal:"d",shift:"D",altgr:""};
	Keyboard.MAP[Keyboard.E]={normal:"e",shift:"E",altgr:"€"};
	Keyboard.MAP[Keyboard.F]={normal:"f",shift:"F",altgr:""};
	Keyboard.MAP[Keyboard.G]={normal:"g",shift:"G",altgr:""};
	Keyboard.MAP[Keyboard.H]={normal:"h",shift:"H",altgr:""};
	Keyboard.MAP[Keyboard.I]={normal:"i",shift:"I",altgr:""};
	Keyboard.MAP[Keyboard.J]={normal:"j",shift:"J",altgr:""};
	Keyboard.MAP[Keyboard.K]={normal:"k",shift:"K",altgr:""};
	Keyboard.MAP[Keyboard.L]={normal:"l",shift:"L",altgr:""};
	Keyboard.MAP[Keyboard.M]={normal:"m",shift:"M",altgr:""};
	Keyboard.MAP[Keyboard.N]={normal:"n",shift:"N",altgr:""};
	Keyboard.MAP[Keyboard.O]={normal:"o",shift:"O",altgr:""};
	Keyboard.MAP[Keyboard.P]={normal:"p",shift:"P",altgr:""};
	Keyboard.MAP[Keyboard.Q]={normal:"q",shift:"Q",altgr:""};
	Keyboard.MAP[Keyboard.R]={normal:"r",shift:"R",altgr:""};
	Keyboard.MAP[Keyboard.S]={normal:"s",shift:"S",altgr:""};
	Keyboard.MAP[Keyboard.T]={normal:"t",shift:"T",altgr:""};
	Keyboard.MAP[Keyboard.U]={normal:"u",shift:"U",altgr:""};
	Keyboard.MAP[Keyboard.V]={normal:"v",shift:"V",altgr:""};
	Keyboard.MAP[Keyboard.W]={normal:"w",shift:"W",altgr:""};
	Keyboard.MAP[Keyboard.X]={normal:"x",shift:"X",altgr:""};
	Keyboard.MAP[Keyboard.Y]={normal:"y",shift:"Y",altgr:""};
	Keyboard.MAP[Keyboard.Z]={normal:"z",shift:"Z",altgr:""};


	Keyboard.MAP[Keyboard.DOLLAR]		=	{normal:"$",shift:"£",altgr:"¤"};
	Keyboard.MAP[Keyboard.EQUAL]		=	{normal:"=",shift:"+",altgr:"}"};
	Keyboard.MAP[Keyboard.QUESTION]		=	{normal:",",shift:"?",altgr:""};
	Keyboard.MAP[Keyboard.DOT]			=	{normal:";",shift:".",altgr:""};
	Keyboard.MAP[Keyboard.SLASH]		=	{normal:":",shift:"/",altgr:""};
	Keyboard.MAP[Keyboard.EXCLAMATION]	=	{normal:"!",shift:"§",altgr:""};
	Keyboard.MAP[Keyboard.POWER_TWO]	=	{normal:"!",shift:"§",altgr:""};
	Keyboard.MAP[Keyboard.PERCENT]		=	{normal:"ù",shift:"%",altgr:""};
	Keyboard.MAP[Keyboard.RIGHT_PARENT]	=	{normal:")",shift:"°",altgr:"]"};
	Keyboard.MAP[Keyboard.MICRO]		=	{normal:"*",shift:"µ",altgr:""};
	Keyboard.MAP[Keyboard.TREMA]		=	{normal:"^",shift:"¨",altgr:""};


	Keyboard.MAP[Keyboard.NUMPAD_0]		=	{normal:"0",shift:"0",altgr:"0"};
	Keyboard.MAP[Keyboard.NUMPAD_1]		=	{normal:"1",shift:"1",altgr:"1"};
	Keyboard.MAP[Keyboard.NUMPAD_2]		=	{normal:"2",shift:"2",altgr:"2"};
	Keyboard.MAP[Keyboard.NUMPAD_3]		=	{normal:"3",shift:"3",altgr:"3"};
	Keyboard.MAP[Keyboard.NUMPAD_4]		=	{normal:"4",shift:"4",altgr:"4"};
	Keyboard.MAP[Keyboard.NUMPAD_5]		=	{normal:"5",shift:"5",altgr:"5"};
	Keyboard.MAP[Keyboard.NUMPAD_6]		=	{normal:"6",shift:"6",altgr:"6"};
	Keyboard.MAP[Keyboard.NUMPAD_7]		=	{normal:"7",shift:"7",altgr:"7"};
	Keyboard.MAP[Keyboard.NUMPAD_8]		=	{normal:"8",shift:"8",altgr:"8"};
	Keyboard.MAP[Keyboard.NUMPAD_9]		=	{normal:"9",shift:"9",altgr:"9"};

	Keyboard.MAP[Keyboard.NUMPAD_MULTIPLY]	=	{normal:"*",shift:"*",altgr:"*"};
	Keyboard.MAP[Keyboard.NUMPAD_SLASH]		=	{normal:"/",shift:"/",altgr:"/"};
	Keyboard.MAP[Keyboard.NUMPAD_PLUS]		=	{normal:"+",shift:"+",altgr:"+"};
	Keyboard.MAP[Keyboard.NUMPAD_MINUS]		=	{normal:"-",shift:"-",altgr:"-"};
	Keyboard.MAP[Keyboard.NUMPAD_DOT]		=	{normal:".",shift:".",altgr:"."};

	Keyboard.MAP[Keyboard.SPACE]			=	{normal:" ",shift:" ",altgr:" "};
	Keyboard.MAP[Keyboard.ENTER]			=	{normal:"¤",shift:"¤",altgr:"¤"};

	tomahawk_ns.Keyboard = Keyboard;
})();
