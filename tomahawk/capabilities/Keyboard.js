/**
 * @author The Tiny Spark
 */
 
 (function() {
	
	 
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
	
	Keyboard.getInstance = function()
	{
		if( tomahawk_ns.Keyboard._instance == null )
			tomahawk_ns.Keyboard._instance = new tomahawk_ns.Keyboard();
			
		return tomahawk_ns.Keyboard._instance;
	};
	
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

	Keyboard.isChar = function(keyCode)
	{
		if( Keyboard.MAP[keyCode] )
			return true;
			
		return false;
	};

	Keyboard.toggleShift = function(keyCode)
	{
		if( keyCode == Keyboard.CAPSLOCK )
			Keyboard._majActive = ! Keyboard._majActive;
	};

	Keyboard._majActive = false;

	Keyboard.BACKSPACE = 8;
	Keyboard.TAB = 9;
	Keyboard.ENTER = 13;
	Keyboard.SHIFT = 16;
	Keyboard.CTRL = 17;
	Keyboard.ALT = 18;
	Keyboard.CAPSLOCK = 20;
	Keyboard.SPACE = 32;
	Keyboard.END = 35;
	Keyboard.START = 36;
	Keyboard.LEFT = 37;
	Keyboard.UP = 38;
	Keyboard.RIGHT = 39;
	Keyboard.DOWN = 40;
	Keyboard.SUPPR = 46;


	// > 47
	Keyboard.TOUCH_0 = 48;
	Keyboard.TOUCH_1 = 49;
	Keyboard.TOUCH_2 = 50;
	Keyboard.TOUCH_3 = 51;
	Keyboard.TOUCH_4 = 52;
	Keyboard.TOUCH_5 = 53;
	Keyboard.TOUCH_6 = 54;
	Keyboard.TOUCH_7 = 55;
	Keyboard.TOUCH_8 = 56;
	Keyboard.TOUCH_9 = 57;
	// < 58

	// > 64
	Keyboard.A = 65;
	Keyboard.B = 66;
	Keyboard.C = 67;
	Keyboard.D = 68;
	Keyboard.E = 69;
	Keyboard.F = 70;
	Keyboard.G = 71;
	Keyboard.H = 72;
	Keyboard.I = 73;
	Keyboard.J = 74;
	Keyboard.K = 75;
	Keyboard.L = 76;
	Keyboard.M = 77;
	Keyboard.N = 78;
	Keyboard.O = 79;
	Keyboard.P = 80;
	Keyboard.Q = 81;
	Keyboard.R = 82;
	Keyboard.S = 83;
	Keyboard.T = 84;
	Keyboard.U = 85;
	Keyboard.V = 86;
	Keyboard.W = 87;
	Keyboard.X = 88;
	Keyboard.Y = 89;
	Keyboard.Z = 90;
	// < 91



	Keyboard.WINDOWS = 91;
	Keyboard.SELECT = 93;

	// > 95
	Keyboard.NUMPAD_0 = 96;
	Keyboard.NUMPAD_1 = 97;
	Keyboard.NUMPAD_2 = 98;
	Keyboard.NUMPAD_3 = 99;
	Keyboard.NUMPAD_4 = 100;
	Keyboard.NUMPAD_5 = 101;
	Keyboard.NUMPAD_6 = 102;
	Keyboard.NUMPAD_7 = 103;
	Keyboard.NUMPAD_8 = 104;
	Keyboard.NUMPAD_9 = 105;
	Keyboard.NUMPAD_MULTIPLY = 106;
	Keyboard.NUMPAD_PLUS = 107;
	Keyboard.NUMPAD_MINUS = 109;
	Keyboard.NUMPAD_DOT = 110;
	Keyboard.NUMPAD_SLASH = 111;
	// < 112

	// > 111
	Keyboard.F1 = 112;
	Keyboard.F2 = 113;
	Keyboard.F3 = 114;
	Keyboard.F4 = 115;
	Keyboard.F5 = 116;
	Keyboard.F6 = 117;
	Keyboard.F7 = 118;
	Keyboard.F8 = 119;
	Keyboard.F9 = 120;
	Keyboard.F10 = 121;
	Keyboard.F11 = 122;
	Keyboard.F12 = 123;
	// < 124

	Keyboard.VERR_NUM = 144;

	// > 185
	Keyboard.DOLLAR = 186;
	Keyboard.EQUAL = 187;
	Keyboard.QUESTION = 188;
	Keyboard.DOT = 190;
	Keyboard.SLASH = 191;
	Keyboard.PERCENT = 192;
	Keyboard.RIGHT_PARENT = 219;
	Keyboard.MICRO = 220;
	Keyboard.TREMA = 221;
	Keyboard.POWER_TWO = 222;
	Keyboard.EXCLAMATION = 223;
	// < 224



	Keyboard.MAP = new Array();


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


	Keyboard.isMapped = function(keyCode)
	{
		return Keyboard.MAP[keyCode] != undefined;
	};
	
	
	tomahawk_ns.Keyboard = Keyboard;
})();
