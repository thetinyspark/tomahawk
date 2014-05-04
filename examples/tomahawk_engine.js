

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

/** 
*@namespace 
**/
var tomahawk_ns = new Object();
tomahawk_ns.version = 1.0;

/**
* @class Tomahawk
* Core Framework class
* @constructor
*/
function Tomahawk(){}

Tomahawk._classes = new Object();
Tomahawk._extends = new Array();
	

	Tomahawk._funcTab = null;

	/**
	* @method registerClass
	* @memberOf Tomahawk
	* @description Register a class definition
	* @params {class} the class definition
	* @params {string} the class definition alias which will be used for inheritance
	*/
	Tomahawk.registerClass = function( classDef, className )
	{
		Tomahawk._classes[className] = classDef;
	};

	/**
	* @method extend
	* @memberOf Tomahawk
	* @description Make child Inherits ancestor
	* @params {class} childAlias the child definition alias
	* @params {string} ancestorAlias the ancestor definition alias
	*/
	Tomahawk.extend = function( p_child, p_ancestor )
	{
		Tomahawk._extends.push({"child":p_child,"ancestor":p_ancestor,"done":false});
	};

	/**
	* @method run
	* @memberOf Tomahawk
	* @description run the framework, apply inheritances to classes
	*/
	Tomahawk.run = function()
	{
		var obj = null;
		var i = 0;
		var max = Tomahawk._extends.length;
		
		Tomahawk._funcTab = new Object();
		
		for (i = 0; i < max; i++ )
		{
			obj = Tomahawk._extends[i];
			Tomahawk._inherits( obj );
		}
	}
	
	Tomahawk._getParentClass = function(child)
	{
		var i = 0;
		var max = Tomahawk._extends.length;
		
		for (i = 0; i < max; i++ )
		{
			obj = Tomahawk._extends[i];
			if( obj["child"] == child )
				return obj;
		}
		return null;
	};
	
	Tomahawk._inherits = function( obj )
	{
		var child = null;
		var ancestor = null;
		var superParent = Tomahawk._getParentClass(obj["ancestor"]);
		
		if( superParent != null && superParent.done == false)
			Tomahawk._inherits(superParent);

		child = Tomahawk._classes[obj["child"]];
		ancestor = Tomahawk._classes[obj["ancestor"]];
		obj.done = true;
		
		var func = new Object();
	
		if( child != null && ancestor != null )
		{	
			for( var prop in ancestor.prototype )
			{
				func[prop] = ancestor.prototype[prop];
			}
			
			for( var prop in child.prototype )
			{
				func[prop] = child.prototype[prop];
			}
		}
		
		child.prototype = func;
	};





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
 * @class AssetsLoader
 * @memberOf tomahawk_ns
 * @description The AssetsLoader class is a basic Image mass loader.
 * @constructor
 * @augments tomahawk_ns.EventDispatcher
 **/
function AssetsLoader()
{
	this._loadingList = new Array();
};

Tomahawk.registerClass( AssetsLoader, "AssetsLoader" );
Tomahawk.extend("AssetsLoader", "EventDispatcher" );

// singleton
AssetsLoader._instance = null;

/**
* @description Returns a unique instance of AssetsLoader, singleton implementation.
* @method getInstance
* @memberOf tomahawk_ns.AssetsLoader
* @returns {tomahawk_ns.AssetsLoader} returns a number
**/
AssetsLoader.getInstance = function()
{
	if( tomahawk_ns.AssetsLoader._instance == null )
		tomahawk_ns.AssetsLoader._instance = new tomahawk_ns.AssetsLoader();
		
	return tomahawk_ns.AssetsLoader._instance;
};

AssetsLoader.prototype.onComplete = null;
AssetsLoader.prototype._loadingList = null;
AssetsLoader.prototype._data = null;
AssetsLoader.prototype._numFiles = 0;

/**
* @description Returns a key indexed object which contains the loaded data.
* @method getData
* @memberOf tomahawk_ns.AssetsLoader.prototype
* @returns {Object} a key indexed object
**/
AssetsLoader.prototype.getData = function()
{
	return this._data;
};

/**
* @description Cleans the internal loaded data object, call it before another loading task in order to save memory.
* @method clean
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.clean = function()
{
	this._data = new Object();
};

/**
* @description Adds an image to the loading list, with the url specified by the "fileURL" parameter and an alias specified by the "fileAlias" parameter.
* @method load
* @param {String] fileURL the url of the image.
* @param {String] fileAlias The alias of the image used as a key within the object returned by the "getData()" method.
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.addFile = function(fileURL, fileAlias)
{
	// on réinitialise les data
	this.clean();
	
	// on stocke un objet contenant l"url et l'alias du fichier que l'on
	// utilisera pour le retrouver
	this._loadingList.push({url:fileURL,alias:fileAlias});
	this._numFiles++;
};

/**
* @description Starts the loading process.
* @method load
* @memberOf tomahawk_ns.AssetsLoader.prototype
**/
AssetsLoader.prototype.load = function()
{
	if( this._loadingList.length == 0 )
	{
		if( this.onComplete != null )
		{
			this.onComplete();
		}
		
		this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.COMPLETE, true, true) );
		this._numFiles = 0;
	}
	else
	{
		var obj = this._loadingList.shift();
		var scope = this;
		var image = new Image();
		
		image.onerror = function()
		{
			scope._errorHandler();
		};
		
		image.onload = function()
		{
			scope._progressHandler(image, obj.alias);
		};
		
		image.src = obj.url;
	}
};

/**
* @description Returns the loading progression ( between 0.0 and 1.0 )
* @method getProgression
* @memberOf tomahawk_ns.AssetsLoader.prototype
* @returns {Number}
**/
AssetsLoader.prototype.getProgression = function()
{
	var progression = ( this._numFiles - this._loadingList.length ) / this._numFiles;
	return progression;
};

AssetsLoader.prototype._progressHandler = function(image,alias)
{
	this._data[alias] = image;
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.PROGRESS, true, true) );
	this.load();
};

AssetsLoader.prototype._errorHandler = function()
{
	this.load();
	this.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.IO_ERROR, true, true) );
};

tomahawk_ns.AssetsLoader = AssetsLoader;
})();




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
	 * @class AssetsManager
	 * @memberOf tomahawk_ns
	 * @description The AssetsManager class is used to stores and restitutes assets objects like Textures, TextureAtlases, Images.
	 * @constructor
	 **/
	function AssetsManager()
	{
		this._images = new Object();
		this._atlases = new Object();
		this._textures = new Object();
	};

	Tomahawk.registerClass( AssetsManager, "AssetsManager" );

	// singleton
	AssetsManager._instance = null;
	
	/**
	* @description Returns a unique instance of AssetsManager, singleton implementation.
	* @method getInstance
	* @memberOf tomahawk_ns.AssetsManager
	* @returns {tomahawk_ns.AssetsManager}
	**/
	AssetsManager.getInstance = function()
	{
		if( tomahawk_ns.AssetsManager._instance == null )
			tomahawk_ns.AssetsManager._instance = new tomahawk_ns.AssetsManager();
			
		return tomahawk_ns.AssetsManager._instance;
	};

	AssetsManager.prototype._images = null;
	AssetsManager.prototype._atlases = null;
	AssetsManager.prototype._textures = null;


	// images
	
	/**
	* @description Returns a key indexed objects with all the HTMLImageElement stored within the manager
	* @method getImages
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} a key indexed objects
	**/
	AssetsManager.prototype.getImages = function()
	{
		return this._images;
	};
	
	/**
	* @description returns an HTMLImageElement that matches with the "alias" parameter
	* @method getImageByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {DOMImageElement} an HTMLImageElement object
	**/
	AssetsManager.prototype.getImageByAlias = function(alias)
	{
		if( this._images[alias] )
			return this._images[alias];
			
		return null;
	};

	/**
	* @description Adds an HTMLImageElement object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getImageByAlias" method.
	* @method addImage
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {HTMLImageElement} image an HTMLImageElement object
	* @param {String} alias
	**/
	AssetsManager.prototype.addImage = function(image, alias)
	{
		this._images[alias] = image;
	};

	//atlases
	
	/**
	* @description Adds a TextureAtlas object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getAtlasByAlias" method.
	* @method addAtlas
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {tomahawk_ns.TextureAtlas} atlas a TextureAtlas object
	* @param {String} alias
	**/
	AssetsManager.prototype.addAtlas = function(atlas, alias)
	{
		this._atlases[alias] = atlas;
	};
	
	/**
	* @method getAtlases
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the atlases stored within the manager
	**/
	AssetsManager.prototype.getAtlases = function()
	{
		return this._atlases;
	};
	
	/**
	* @description returns an TextureAtlas instance that matches with the "alias" parameter
	* @method getAtlasByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {tomahawk_ns.TextureAtlas} a TextureAtlas object
	**/
	AssetsManager.prototype.getAtlasByAlias = function(alias)
	{
		if( this._atlases[alias] )
			return this._atlases[alias];
			
		return null;
	};

	//textures
	/**
	* @description Adds a Texture object to the manager and register it with the alias specified by the "alias" parameter. This alias will be reused with the "getTextureByAlias" method.
	* @method addAtlas
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @param {tomahawk_ns.Texture} texture a Texture object
	* @param {String} alias
	**/
	AssetsManager.prototype.addTexture = function(texture, alias)
	{
		this._textures[alias] = texture;
	};

	/**
	* @method getTextures
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {Object} returns a key indexed objects with all the textures stored within the manager
	**/
	AssetsManager.prototype.getTextures = function()
	{
		return this._textures;
	};
	
	/**
	* @description returns an Texture instance that matches with the "alias" parameter
	* @method getTextureByAlias
	* @memberOf tomahawk_ns.AssetsManager.prototype
	* @returns {tomahawk_ns.Texture} a Texture object
	**/
	AssetsManager.prototype.getTextureByAlias = function(alias)
	{
		if( this._textures[alias] )
			return this._textures[alias];
			
		return null;
	};


	tomahawk_ns.AssetsManager = AssetsManager;
})();





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
	 * @class Mouse
	 * @memberOf tomahawk_ns
	 * @description The methods of the Mouse class are used to set the pointer to a specific style. The Mouse class is a top-level class whose properties and methods you can access without using a constructor.
	 * @constructor
	 **/
	function Mouse(){}

	Tomahawk.registerClass( Mouse, "Mouse" );
	
	/**
	* @property {String} RESIZE
	* @memberOf tomahawk_ns.Mouse
	* @default "se-resize"
	**/
	Mouse.RESIZE = "se-resize";
	
	/**
	* @property {String} MOVE
	* @memberOf tomahawk_ns.Mouse
	* @default "move"
	**/
	Mouse.MOVE = "move";
	
	/**
	* @property {String} POINTER
	* @memberOf tomahawk_ns.Mouse
	* @default "pointer"
	**/
	Mouse.POINTER = "pointer";

	/**
	* @property {String} DEFAULT
	* @memberOf tomahawk_ns.Mouse
	* @default "default"
	**/
	Mouse.DEFAULT = "default";

	/**
	* @member setCursor
	* @memberOf tomahawk_ns.Mouse
	* @param {String} value the cursor style value.
	* @param {DOMElement} domElement the domElement on which the cursor style is applied.
	* @description Sets the cursor style for the DOMElement specified by the "domElement" parameter.
	**/
	Mouse.setCursor = function(value,domElement)
	{
		domElement.style.cursor = value;
	};
	
	tomahawk_ns.Mouse = Mouse;
})();



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
	 * @class Screen
	 * @memberOf tomahawk_ns
	 * @description The Screen class is used to get information about the screen or the canvas sizes.
	 * @constructor
	 **/
	function Screen(){}

	Tomahawk.registerClass(Screen,"Screen");
	
	/**
	* @description Returns the width of the HTMLCanvasElement's DOM parent node associated to the stage instance specified by the "stage" parameter.
	* @method getInnerWidth
	* @memberOf tomahawk_ns.Screen
	* @param {tomahawk_ns.Stage} stage an instance stage of .
	* @returns {Number} 
	**/
	Screen.getInnerWidth = function(stage)
	{
		return stage.getCanvas().parentNode.offsetWidth;
	};
	
	/**
	* @description Returns the height of the HTMLCanvasElement's DOM parent node associated to the stage instance specified by the "stage" parameter.
	* @method getInnerHeight
	* @memberOf tomahawk_ns.Screen
	* @param {tomahawk_ns.Stage} stage an instance stage of .
	* @returns {Number} 
	**/
	Screen.getInnerHeight = function(stage)
	{
		return stage.getCanvas().parentNode.offsetHeight;
	};

	/**
	* @description Returns the current window width.
	* @method getWindowWidth
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getWindowWidth = function()
	{
		return window.innerWidth;
	};
	
	/**
	* @description Returns the current window height.
	* @method getWindowHeight
	* @memberOf tomahawk_ns.Screen
	* @returns {Number} 
	**/
	Screen.getWindowHeight = function()
	{
		return window.innerHeight;
	};
	
	tomahawk_ns.Screen = Screen;
})();



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
	* @class Bitmap
	* @memberOf tomahawk_ns
	* @description The Bitmap class represents display objects that represent bitmap images. 
	* @param {tomahawk_ns.Texture} [texture=undefined] the bitmap drawing texture.
	* @augments tomahawk_ns.DisplayObject
	* @constructor
	*/
	function Bitmap(texture)
	{
		tomahawk_ns.DisplayObject.apply(this);
		
		if( texture == undefined )
			return;
			
		this.setTexture(texture);
	}

	Tomahawk.registerClass( Bitmap, "Bitmap" );
	Tomahawk.extend( "Bitmap", "DisplayObject" );

	/**
	 * @description The current drawing texture.
	 * @member texture
	 * @type {tomahawk_ns.Texture}
	 * @memberOf tomahawk_ns.Bitmap.prototype
	 * @default null
	 */
	Bitmap.prototype.texture = null;
	
	/**
	* @description Sets the Bitmap current Texture.
	* @method setTexture
	* @param {tomahawk_ns.Texture} texture 
	* @memberOf tomahawk_ns.Bitmap.prototype
	**/
	Bitmap.prototype.setTexture = function(texture)
	{
		this.texture = texture;
		this.width = this.texture.rect[2];
		this.height = this.texture.rect[3];
	};

	Bitmap.prototype.draw = function( context )
	{	
		var rect = this.texture.rect;
		var data = this.texture.data;
			
		context.drawImage(	data, rect[0], rect[1], rect[2], rect[3], 0, 0, this.width, this.height );
	};
	
	tomahawk_ns.Bitmap = Bitmap;

})();






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
	 * @class BitmapMesh
	 * @memberOf tomahawk_ns
	 * @description The BitmapMesh class represents display objects that represent bitmap images. The main difference between a BitmapMesh and a Bitmap instance is that you can deform the current texture with the vertices, uvs and indices properties which defines triangles.
	 * @constructor
	 * @augments tomahawk_ns.Bitmap
	 **/
	function BitmapMesh(texture)
	{
		tomahawk_ns.Bitmap.apply(this,[texture]);
		this._canvas = document.createElement("canvas");
	}

	Tomahawk.registerClass( BitmapMesh, "BitmapMesh" );
	Tomahawk.extend( "BitmapMesh", "Bitmap" );
	
	/**
	* @member vertices
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Array}
	* @description An Array of vertices, used with indices, they defines a sets of triangles.
	**/
	BitmapMesh.prototype.vertices = null;
	
	/**
	* @member uvs
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Array}
	* @description The Array of UV coordinates attached to each vertex.
	**/
	BitmapMesh.prototype.uvs = null;
	
	/**
	* @member indices
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Array}
	* @description An Array of indices, used with vertices, they defines a sets of triangles.
	**/
	BitmapMesh.prototype.indices = null;
	
	/**
	* @member showLines
	* @memberOf tomahawk_ns.BitmapMesh.prototype
	* @type {Boolean}
	* @description Indicates wether the BitmapMesh instance will display the triangle's lines.
	**/
	BitmapMesh.prototype.showLines = false;
	
	BitmapMesh.prototype.setTexture = function(texture)
	{
		tomahawk_ns.Bitmap.prototype.setTexture.apply(this,[texture]);
		this.vertices = [[0,0],[this.width,0],[0,this.height],[this.width,this.height]];
		this.uvs = [[0,0],[1,0],[0,1],[1,1]];
		this.indices = [0,1,2,1,2,3];
	};

	BitmapMesh.prototype.draw = function(context)
	{
		var vertices = this.vertices;
		var uvtData = this.uvs;
		var indices = this.indices;
		var max = indices.length;
		var i = 0;
		var width = this.texture.rect[2];
		var height = this.texture.rect[3];
		var data = this.texture.data;
		var vertex1 = null;
		var vertex2 = null;
		var vertex3 = null;
		var index1 = 0;
		var index2 = 0;
		var index3 = 0;
		var uv1 = null;
		var uv2 = null;
		var uv3 = null;
		
		for( i = 0; i < max; i+=3 )
		{
			index1 = indices[i];
			index2 = indices[i + 1];
			index3 = indices[i + 2];
			vertex1 = vertices[index1];
			vertex2 = vertices[index2];
			vertex3 = vertices[index3];
			
			uv1 = uvtData[index1];
			uv2 = uvtData[index2];
			uv3 = uvtData[index3];
			this._drawTriangle( vertex1,vertex2,vertex3,uv1,uv2,uv3, context, data, width, height );
		}
	};
	
	BitmapMesh.prototype._drawTriangle = function(v1,v2,v3,uv1,uv2,uv3, ctx, texture, texW, texH ) 
	{
        ctx.save(); 
		
        var x0 = v1[0], x1 = v2[0], x2 = v3[0];
        var y0 = v1[1], y1 = v2[1], y2 = v3[1];
		
        var u0 = uv1[0], u1 = uv2[0], u2 = uv3[0];
        var v0 = uv1[1], v1 = uv2[1], v2 = uv3[1];
		
		u0 *= texW;
		u1 *= texW;
		u2 *= texW;
		v0 *= texH;
		v1 *= texH;
		v2 *= texH;

        // Set clipping area so that only pixels inside the triangle will
        // be affected by the image drawing operation
        
		
		ctx.beginPath(); 
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;
		
		ctx.moveTo(x0, y0 ); 
		ctx.lineTo(x1, y1 );
        ctx.lineTo(x2, y2 ); 
		ctx.lineTo(x0,y0);
		
		ctx.closePath(); 
		ctx.clip();
		
        // Compute matrix transform
        var delta 	= u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

		
		
		
        // Draw the transformed image
        ctx.transform(delta_a/delta, delta_d/delta,
                      delta_b/delta, delta_e/delta,
                      delta_c/delta, delta_f/delta);
					  
        ctx.drawImage(texture, 0,0,texW,texH );
		
        ctx.restore();
		
		if( this.showLines == true )
		{
			ctx.save();
			ctx.beginPath(); 
			ctx.strokeStyle = "black";
			ctx.lineWidth = 1;
			ctx.moveTo(x0, y0 ); 
			ctx.lineTo(x1, y1 );
			ctx.lineTo(x2, y2 ); 
			ctx.lineTo(x0,y0);
			ctx.stroke();
			ctx.closePath(); 
			ctx.restore();
		}
	};

	tomahawk_ns.BitmapMesh = BitmapMesh;

})();




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
	 * @abstract
	 * @class DisplayObject
	 * @memberOf tomahawk_ns
	 * @constructor
	 * @augments tomahawk_ns.EventDispatcher
	 * @description The DisplayObject class is the base class for all objects that can be placed on the display list.
	 * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced properties of the object such as its transformation matrix. DisplayObject is an abstract base class; therefore, you cannot call DisplayObject directly. All display objects inherit from the DisplayObject class.
	 **/
	function DisplayObject()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		this.matrix = new tomahawk_ns.Matrix2D();
		this._concatenedMatrix = new tomahawk_ns.Matrix2D();
		this.bounds = new tomahawk_ns.Rectangle();
	}

	Tomahawk.registerClass( DisplayObject, "DisplayObject" );
	Tomahawk.extend( "DisplayObject", "EventDispatcher" );

	/**
	* @member name
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {String}
	* @description Indicates the instance name of the DisplayObject.
	* @default null
	**/
	DisplayObject.prototype.name 				= null;
	
	/**
	* @member parent
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.DisplayObjectContainer}
	* @description Indicates the DisplayObjectContainer object that contains this display object.
	* @default null
	**/
	DisplayObject.prototype.parent 				= null;
	
	/**
	* @member x
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	DisplayObject.prototype.x 					= 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	DisplayObject.prototype.y 					= 0;
	
	/**
	* @member pivotX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the x coordinate of the DisplayObject instance registration point
	**/
	DisplayObject.prototype.pivotX 				= 0;
	
	/**
	* @member pivotY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the y coordinate of the DisplayObject instance registration point
	**/
	DisplayObject.prototype.pivotY 				= 0;
	
	/**
	* @member skewX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the skew on the x axis of the DisplayObject instance
	**/
	DisplayObject.prototype.skewX 				= 0;
	
	/**
	* @member skewY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the skew on the y axis of the DisplayObject instance
	**/
	DisplayObject.prototype.skewY 				= 0;
	
	/**
	* @member scaleX
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the horizontal scale (percentage) of the object as applied from the registration point.
	* @default 1
	**/
	DisplayObject.prototype.scaleX 				= 1;
	
	/**
	* @member scaleY
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @default 1
	* @description Indicates the vertical scale (percentage) of the object as applied from the registration point.
	**/
	DisplayObject.prototype.scaleY 				= 1;
	
	/**
	* @default 0
	* @member width
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the width of the display object, in pixels.
	**/
	DisplayObject.prototype.width 				= 0;
	
	/**
	* @default 0
	* @member height
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the height of the display object, in pixels.
	**/
	DisplayObject.prototype.height 				= 0;
	
	/**
	* @member rotation
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation.
	* @default 0
	**/
	DisplayObject.prototype.rotation 			= 0;
	
	/**
	* @member stage
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Stage}
	* @description The Stage of the display object.
	* @default null
	**/
	DisplayObject.prototype.stage 				= null;
	
	/**
	* @member alpha
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Number}
	* @description Indicates the alpha transparency value of the object specified.
	* @default 1
	**/
	DisplayObject.prototype.alpha 				= 1;
	
	/**
	* @member mouseEnabled
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Specifies whether this object receives mouse, or other user input, messages.
	* @default true
	**/
	DisplayObject.prototype.mouseEnabled 		= true;
	
	/**
	* @member handCursor
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description A Boolean value that indicates whether the pointing hand (hand cursor) appears when the pointer rolls over this sprite
	* @default false
	**/
	DisplayObject.prototype.handCursor 			= false;
	
	/**
	* @member visible
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Whether or not the display object is visible.
	* @default true
	**/
	DisplayObject.prototype.visible 			= true;
	
	/**
	* @member isMask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description Defines if the current DisplayObject is masking another one
	* @default false
	**/
	DisplayObject.prototype.isMask				= false;
	
	/**
	* @member filters
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Array}
	* @description An indexed array that contains each filter object currently associated with the display object.
	* @default null
	**/
	DisplayObject.prototype.filters 			= null;
	
	/**
	* @member mask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.DisplayObject}
	* @description The calling display object is masked by the specified mask object.
	* @default null
	**/
	DisplayObject.prototype.mask 				= null;
	
	/**
	* @member matrix
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Matrix2D}
	* @description The transformation matrix of the DisplayObject
	* @default null
	**/
	DisplayObject.prototype.matrix 				= null;
	
	/**
	* @member bounds
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {tomahawk_ns.Rectangle}
	* @description Indicates a rectangle that defines the area of the display object relative to his parent coordinate system. You must set the updateNextFrame ( or the autoUpdate ) property to true and call the updateBounds method to actualize this Rectangle.
	* @default null
	**/
	DisplayObject.prototype.bounds 				= null;
	
	/**
	* @member cacheAsBitmap
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description If set to true, the object is caching an internal representation of the display object.
	* @default true
	**/
	DisplayObject.prototype.cacheAsBitmap		= false;
	
	/**
	* @member autoUpdate
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @description If set to true, the matrix of the DisplayObject will be computed every frame, if not, the matrix will not change.
	* @default true
	**/
	DisplayObject.prototype.autoUpdate			= true;
	
	/**
	* @member updateNextFrame
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @type {Boolean}
	* @default true
	* @description If set to true, the transformation matrix will be update at next frame.
	**/
	DisplayObject.prototype.updateNextFrame		= true;
	
	DisplayObject.prototype._concatenedMatrix 	= null;
	DisplayObject.prototype._cache 				= null;
	DisplayObject.prototype._cacheOffsetX 		= 0;
	DisplayObject.prototype._cacheOffsetY 		= 0;
	
	/**
	* @method updateBounds
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Updates the bounds of the current DisplayObject if his updateNextFrame || autoUpdate = true
	**/
	DisplayObject.prototype.updateBounds = function()
	{		
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		var mat = this.matrix;
	
		points.push(mat.transformPoint(0,0));
		points.push(mat.transformPoint(this.width,0));
		points.push(mat.transformPoint(0,this.height));
		points.push(mat.transformPoint(this.width, this.height));
	
		rect.left = 2147483648;
		rect.top = 2147483648;
		rect.bottom = -2147483648;
		rect.right = -2147483648;
	
		var i = points.length;
		while( --i > -1 )
		{
			rect.left = ( points[i].x < rect.left ) ? points[i].x : rect.left;
			rect.right = ( points[i].x > rect.right ) ? points[i].x : rect.right;
			rect.top = ( points[i].y < rect.top ) ? points[i].y : rect.top;
			rect.bottom = ( points[i].y > rect.bottom ) ? points[i].y : rect.bottom;
		}
	
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		this.bounds = rect;
	};
	
	/**
	* @method setMask
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} the new mask of the current DisplayObject
	* @description Defines the DisplayObject passed in param as the mask of the current DisplayObject 
	**/
	DisplayObject.prototype.setMask = function( mask )
	{
		if( this.mask != null )
		{
			this.mask.isMask = false;
		}
		
		this.mask = mask;
		
		if( this.mask != null )
		{
			this.mask.isMask = true;
		}
	};

	/**
	* @method updateMatrix
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Updates the matrix of the DisplayObject if his updateNextFrame || autoUpdate = true
	**/
	DisplayObject.prototype.updateMatrix = function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
			
		var mat = this.matrix;
		
		mat.d = mat.a = 1;
		mat.b = mat.c = mat.tx = mat.ty = 0;
		
		
		mat.appendTransform(	this.x, 
								this.y, 
								this.scaleX, 
								this.scaleY, 
								this.rotation, 
								this.skewX, 
								this.skewY, 
								this.pivotX, 
								this.pivotY);
										
		this.updateNextFrame = false;
	};

	/**
	* @description Updates the cache of the DisplayObject instance and returns it.
	* @method updateCache
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @returns {HTMLCanvasElement} the cache canvas of the DisplayObject
	**/
	DisplayObject.prototype.updateCache = function()
	{	
		var buffer = null;
		var context = null;
		var filters = this.filters;
		var i = 0;
		var offX = 0;
		var offY = 0;
		var bounds = this.getBoundingRectIn(this);
		var cacheAsBitmap = this.cacheAsBitmap;
		
		if( this._cache == null )
		{
			buffer = document.createElement("canvas");
		}
		else
		{
			buffer = this._cache;
		}
		
		buffer.width = ( bounds.width < 1 ) ? 1 : bounds.width ;
		buffer.height = ( bounds.height < 1 ) ? 1 : bounds.height ;

		
		offX = bounds.left;
		offY = bounds.top;
		
		context = buffer.getContext("2d");
		
		
		// before drawing filters
		if( filters != null )
		{		
			//i = filters.length;
			//
			//while( --i > -1 )
			//{
				//buffer.width += filters[i].getOffsetX();
				//buffer.height += filters[i].getOffsetY();
			//}
			
			i = filters.length;
			
			while( --i > -1 )
			{
				if( filters[i].type == tomahawk_ns.PixelFilter.BEFORE_DRAWING_FILTER )
					filters[i].apply(buffer,context,this);
			}
		}
		
		
		context.save();
			context.globalAlpha = this.alpha;
			context.translate( -offX, -offY );
			this.cacheAsBitmap = false;
			this.draw(context);
			this.cacheAsBitmap = cacheAsBitmap;
		context.restore();
		
		// after drawing filters
		if( filters != null )
		{		
			i = filters.length;
			
			while( --i > -1 )
			{
				if( filters[i].type == tomahawk_ns.PixelFilter.AFTER_DRAWING_FILTER )
					filters[i].apply(buffer,context,this);
			}
		}
		
		this._cache = buffer;
		this._cacheOffsetX = offX;
		this._cacheOffsetY = offY;
		return buffer;
	};
	
	/**
	* @method drawComposite
	* @description Draw the DisplayObject instance into the specified context with mask and filters.
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {CanvasRenderingContext2D} drawContext the CanvasRenderingContext2D context on which you want to draw.
	**/
	DisplayObject.prototype.drawComposite = function(drawContext)
	{
		if( this._cache == null || this.cacheAsBitmap == false )
			this.updateCache();
			
		var buffer = this._cache;
		var context = null;
		var mat = null;
		var i = 0;
		var mask = this.mask;
		
		if( mask != null )
		{
			buffer = document.createElement("canvas");
			buffer.width = this._cache.width;
			buffer.height = this._cache.height;
			
			context = buffer.getContext("2d");
			mat = mask.getConcatenedMatrix().prependMatrix( this.getConcatenedMatrix().invert() );
			
			context.save();
				context.globalAlpha = mask.alpha;
				context.setTransform(	mat.a,
										mat.b,
										mat.c,
										mat.d,
										mat.tx,
										mat.ty);
					
				mask.draw(context);
			context.restore();
			
			context.save();
				context.globalCompositeOperation = "source-in";
				context.drawImage(	this._cache, this._cacheOffsetX , this._cacheOffsetY , this._cache.width , this._cache.height );
			context.restore();
			
			drawContext.drawImage(buffer,0, 0, buffer.width, buffer.height );
		}
		else
		{
			drawContext.drawImage(	buffer, this._cacheOffsetX, this._cacheOffsetY, buffer.width, buffer.height);	
		}
	};

	/**
	* @method draw
	* @description Draws the DisplayObject instance into the specified context
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {CanvasRenderingContext2D} drawContext the CanvasRenderingContext2D context on which you want to draw.
	**/
	DisplayObject.prototype.draw = function(context)
	{
	};
	
	/**
	* @method getConcatenedMatrix
	* @description Returns the combined transformation matrixes of the DisplayObject instance and all of its parent objects, back to the stage level.
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Boolean} forceUpdate Forces the update of the current DisplayObject and all his parents
	**/
	DisplayObject.prototype.getConcatenedMatrix = function(forceUpdate)
	{
		var current = this;
		var mat = new tomahawk_ns.Matrix2D();
		
		while( current != null )
		{
			if( forceUpdate == true )
			{
				current.updateNextFrame = true;
				current.updateMatrix();
			}
			mat.prependMatrix(current.matrix );
			current = current.parent;
		}
		
		this._concatenedMatrix = mat;
		return this._concatenedMatrix;
	};

	/**
	* @method localToGlobal
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Number} x
	* @param {Number} y
	* @returns {tomahawk_ns.Point}
	* @description Converts the point object specified by x,y parameters from the DisplayObject's (local) coordinates to the Stage (global) coordinates.
	**/
	DisplayObject.prototype.localToGlobal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix();
		var pt = matrix.transformPoint(x,y);
		return new tomahawk_ns.Point(pt.x,pt.y);
	};

	/**
	* @method globalToLocal
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Number} x
	* @param {Number} y
	* @returns {tomahawk_ns.Point}
	* @description Converts the point object specified by x,y parameters from the Stage (global) coordinates to the DisplayObject's (local) coordinates.
	**/
	DisplayObject.prototype.globalToLocal = function(x,y)
	{
		var matrix = this.getConcatenedMatrix().clone().invert();
		var pt = matrix.transformPoint(x,y);
		return new tomahawk_ns.Point(pt.x,pt.y);
	};

	/**
	* @method hitTest
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {Number} x
	* @param {Number} y
	* @returns {Boolean}
	* @description Evaluates the DisplayObject instance to see if it overlaps or intersects with the point specified by the x and y parameters. The x and y parameters specify a point in the coordinate space of the Stage, not the display object container that contains the display object (unless that display object container is the Stage).
	**/
	DisplayObject.prototype.hitTest = function(x,y)
	{		
		var pt1 = this.globalToLocal(x,y);
		
		if( pt1.x < 0 || pt1.x > this.width || pt1.y < 0 || pt1.y > this.height )
			return false;
		else
			return true;
	};

	/**
	* @method isChildOf
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} obj
	* @returns {Boolean}
	* @description Indicates if the DisplayObject "obj" is a child of the DisplayObject instance
	**/
	DisplayObject.prototype.isChildOf = function( obj )
	{
		var curParent = this.parent;
		while( curParent != null )
		{
			if( curParent == obj )
				return true;
				
			curParent = curParent.parent;
		}
		
		return false;
	};

	/**
	* @method getBoundingRectIn
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.DisplayObject} spaceCoordinates
	* @returns {tomahawk_ns.Rectangle}
	* @description Returns a rectangle that defines the area of the display object relative to the coordinate system of the spaceCoordinates object.
	**/
	DisplayObject.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		this.updateNextFrame = true;
		this.updateMatrix();
		
		var rect = new tomahawk_ns.Rectangle();
		var points = new Array();
		var pt1 = this.localToGlobal(0,0);
		var pt2 = this.localToGlobal(this.width,0);
		var pt3 = this.localToGlobal(0,this.height);
		var pt4 = this.localToGlobal(this.width,this.height);
		
		pt1 = spaceCoordinates.globalToLocal(pt1.x,pt1.y);
		pt2 = spaceCoordinates.globalToLocal(pt2.x,pt2.y);
		pt3 = spaceCoordinates.globalToLocal(pt3.x,pt3.y);
		pt4 = spaceCoordinates.globalToLocal(pt4.x,pt4.y);
		
		points.push(pt1,pt2,pt3,pt4);
		
		rect.left = 2147483648;
		rect.top = 2147483648;
		rect.bottom = -2147483648;
		rect.right = -2147483648;
		
		var i = points.length;
		while( --i > -1 )
		{
			rect.left = ( points[i].x < rect.left ) ? points[i].x : rect.left;
			rect.right = ( points[i].x > rect.right ) ? points[i].x : rect.right;
			rect.top = ( points[i].y < rect.top ) ? points[i].y : rect.top;
			rect.bottom = ( points[i].y > rect.bottom ) ? points[i].y : rect.bottom;
		}
		
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		return rect;
	};

	/**
	* @method snapshot
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @param {tomahawk_ns.Matrix2D} [transformMatrix=undefined] The transformation matrix to apply
	* @returns {HTMLCanvasElement}
	* @description Returns a snapshot of the DisplayObject instance, applying the transformMatrix
	**/
	DisplayObject.prototype.snapshot = function(transformMatrix)
	{
		var mat = transformMatrix || new tomahawk_ns.Matrix2D();
		var oldMat = this.matrix.clone();
		
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		this.matrix = mat;
		
		this.updateNextFrame = true;
		this.updateBounds();
		
		canvas.width = this.bounds.width;
		canvas.height = this.bounds.height;
		
		context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		this.draw(context);
		
		this.matrix = oldMat;
		this.updateNextFrame = true;
		this.updateBounds();
		
		return canvas;
	};
	
	/**
	* @method destroy
	* @memberOf tomahawk_ns.DisplayObject.prototype
	* @description Kill the DisplayObject instance and free all his ressources
	**/
	DisplayObject.prototype.destroy = function()
	{
		this._cache = null;
		this.setMask(null);
		
		if( this.parent != null )
		{
			this.parent.removeChild(this);
		}
		
		tomahawk_ns.EventDispatcher.prototype.destroy.apply(this);
	};
	
	tomahawk_ns.DisplayObject = DisplayObject;

})();







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
	 * @class DisplayObjectContainer
	 * @memberOf tomahawk_ns
	 * @description The DisplayObjectContainer class is the base class for all objects that can serve as display object containers on the display list. The display list manages all objects displayed in the canvas. Use the DisplayObjectContainer class to arrange the display objects in the display list. Each DisplayObjectContainer object has its own child list for organizing the z-order of the objects. The z-order is the front-to-back order that determines which object is drawn in front, which is behind, and so on. DisplayObjectContainer is an abstract base class; therefore, you cannot call DisplayObjectContainer directly.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObject
	 **/
	function DisplayObjectContainer()
	{
		tomahawk_ns.DisplayObject.apply(this);
		this.children = new Array();
	}

	Tomahawk.registerClass( DisplayObjectContainer, "DisplayObjectContainer" );
	Tomahawk.extend( "DisplayObjectContainer", "DisplayObject" );

	/**
	* @member children
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @type {Array}
	* @description the child list of the DisplayObjectContainer instance
	* @default null
	**/
	DisplayObjectContainer.prototype.children = null;
	
	/**
	* @member isContainer
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @type {Boolean}
	* @description Defines if the current DisplayObjectContainer is a container or not ( actually always sets to true )
	* @default true
	**/
	DisplayObjectContainer.prototype.isContainer = true;

	/**
	* @method setChildIndex
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The child DisplayObject instance for which you want to change the index number.
	* @param {Number} index The resulting index number for the child display object.
	* @description Changes the position of an existing child in the display object container.
	**/
	DisplayObjectContainer.prototype.setChildIndex = function(child,index)
	{
		this.addChildAt(child,index);
	};
	
	/**
	* @method addChild
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance that you pass in the child parameter.
	* @description Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added to the front (top) of all other children in this DisplayObjectContainer instance. (To add a child to a specific index position, use the addChildAt() method.) If you add a child object that already has a different display object container as a parent, the object is removed from the child list of the other display object container.
	**/
	DisplayObjectContainer.prototype.addChild = function(child)
	{
		if( child.parent )
		{
			child.parent.removeChild(child);
		}
		
		child.parent = this;
		this.children.push(child);
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED, true, true) );
	};

	/**
	* @method getChildAt
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {Number} index The index position of the child object.
	* @returns {tomahawk_ns.DisplayObject} The child display object at the specified index position.
	* @description Returns the child display object instance that exists at the specified index.
	**/
	DisplayObjectContainer.prototype.getChildAt = function (index)
	{
		return this.children[index];
	};

	/**
	* @method getChildByName
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {String} name The name of the child to return.
	* @returns {tomahawk_ns.DisplayObject} The child display object with the specified name.
	* @description Returns the child display object that exists with the specified name. If more that one child display object has the specified name, the method returns the first object in the child list.
	**/
	DisplayObjectContainer.prototype.getChildByName = function(name)
	{
		var children = this.children;
		var i = children.length;
		
		while( --i > -1 )
		{
			if( children[i].name == name )
				return children[i];
		}
		
		return null;
	};

	/**
	* @method addChildAt
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @param {Number} index The index position to which the child is added. If you specify a currently occupied index position, the child object that exists at that position and all higher positions are moved up one position in the child list.
	* @description Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added at the index position specified. An index of 0 represents the back (bottom) of the display list for this DisplayObjectContainer object.
	**/
	DisplayObjectContainer.prototype.addChildAt = function(child, index)
	{
		if( child.parent != null )
		{
			child.parent.removeChild(child);
		}
		var children = this.children;
		var tab1 = this.children.slice(0,index);
		var tab2 = this.children.slice(index);
		this.children = tab1.concat([child]).concat(tab2);
		
		child.parent = this;
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.ADDED, true, true) );
	};
	
	/**
	* @method getChildIndex
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to identify.
	* @returns {Number}  The index position of the child display object to identify.
	* @description Returns the index position of a child DisplayObject instance.
	**/
	DisplayObjectContainer.prototype.getChildIndex = function(child)
	{
		return this.children.indexOf(child);
	};

	/**
	* @method removeChildAt
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {Number} index The child index of the DisplayObject to remove.
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance that was removed.
	* @description Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
	**/
	DisplayObjectContainer.prototype.removeChildAt = function(index)
	{
		var child = this.children[index];
		if( child == undefined )
			return null;
			
		child.parent = null;
		this.children.splice(index,1);
		child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.REMOVED, true, true) );
		return child;
	};
	
	/**
	* @method removeChildren
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @description Removes all child DisplayObject instances from the child list of the DisplayObjectContainer instance.
	**/
	DisplayObjectContainer.prototype.removeChildren = function()
	{
		while( this.children.length > 0 )
		{
			this.removeChildAt(0);
		}
	};
	
	/**
	* @method removeChild
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @param {tomahawk_ns.DisplayObject} child The DisplayObject instance to remove
	* @returns {tomahawk_ns.DisplayObject} The DisplayObject instance to remove
	* @description Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
	**/
	DisplayObjectContainer.prototype.removeChild = function(child)
	{
		var index = this.children.indexOf(child);
		var child = null;
		
		if( index > -1 )
		{
			child = this.children[index];
			this.children.splice(index,1);
			child.parent = null;
			child.dispatchEvent( new tomahawk_ns.Event(tomahawk_ns.Event.REMOVED, true, true) );
		}
		
		return child;
	};

	/**
	* @method getObjectUnder
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @returns {Array}
	* @description Returns an Array with the first nested child of the DisplayObjectContainer instance which overlaps or intersects with the point specified by the x and y parameters. The x and y parameters specify a point in the coordinate space of the Stage, not the display object container that contains the display object (unless that display object container is the Stage).
	**/
	DisplayObjectContainer.prototype.getObjectUnder = function(x,y)
	{
		var under = null;
		var children = this.children;
		var i = children.length;
		var child = null;
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.mouseEnabled == false )
				continue;
					
			if( child.isContainer )
			{				
				under = child.getObjectUnder(x,y);
				
				if( under != null )
				{
					return under;
				}
			}
			else
			{	
				if( child.hitTest(x,y) == true )
				{
					return child;
				}
			}
		}
		
		return null;
	};
	
	/**
	* @method getNestedChildren
	* @memberOf tomahawk_ns.DisplayObjectContainer.prototype
	* @returns {Array}
	* @description Returns an Array with all the nested children of the DisplayObjectContainer instance 
	**/
	DisplayObjectContainer.prototype.getNestedChildren = function()
	{
		var list = new Array();
		var subChild = null;
		var i = this.children.length;
		
		while( --i > -1 )
		{
			subChild = this.children[i];
			if( subChild.isContainer == true )
			{
				list = list.concat(subChild.getNestedChildren());
			}
			
			list.push(subChild);
		}
		
		return list;
	}
	
	DisplayObjectContainer.prototype.draw = function( context )
	{	
		var children = this.children;
		var i = 0;
		var max = children.length;
		var child = null;
		var mat = null;
		
		for( ; i < max; i++ )
		{
			child = children[i];
			
			if( !child.visible )
				continue;
			
			child.updateMatrix();
			
			if( child.isMask == true )
				continue;
			
			mat = child.matrix;
			
			context.save();
			context.globalAlpha *= child.alpha;
			context.transform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
			
			if( child.cacheAsBitmap == true || child.mask != null || child.filters != null )
			{
				child.drawComposite(context);
			}
			else
			{
				child.draw(context);
			}
			
			context.restore();
		}
	};

	DisplayObjectContainer.prototype.updateBounds = function()
	{
		var children = this.children;
		var i = children.length;
		var child = null;
		var rect = new tomahawk_ns.Rectangle();
		var childRect = null;
		var mat = this.matrix;
		var points = new Array();
		
		i = children.length;
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.updateNextFrame == true || child.autoUpdate == true )
			{
				child.updateMatrix();
				child.updateBounds();
			}
			
			childRect = child.bounds;
			rect.left = ( childRect.left < rect.left ) ? childRect.left : rect.left;
			rect.right = ( childRect.right > rect.right ) ? childRect.right : rect.right;
			rect.top = ( childRect.top < rect.top ) ? childRect.top : rect.top;
			rect.bottom = ( childRect.bottom > rect.bottom ) ? childRect.bottom : rect.bottom;
		}
		
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		this.width = rect.width;
		this.height = rect.height;
		
		tomahawk_ns.DisplayObject.prototype.updateBounds.apply(this);
	};	
	
	DisplayObjectContainer.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		var children = this.children;
		var i = children.length;
		var child = null;
		var rect = new tomahawk_ns.Rectangle();
		var childRect = null;
		
		i = children.length;
		
		while( --i > -1 )
		{
			child = children[i];
			childRect = child.getBoundingRectIn(spaceCoordinates);
			rect.left = ( childRect.left < rect.left ) ? childRect.left : rect.left;
			rect.right = ( childRect.right > rect.right ) ? childRect.right : rect.right;
			rect.top = ( childRect.top < rect.top ) ? childRect.top : rect.top;
			rect.bottom = ( childRect.bottom > rect.bottom ) ? childRect.bottom : rect.bottom;
		}
		
		rect.x = rect.left;
		rect.y = rect.top;
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		return rect;
	};
	
	DisplayObjectContainer.prototype.hitTest = function(x,y)
	{
		var children = this.children;
		var i = children.length;
		var child = null;
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.hitTest(x,y) )
				return true;
		}
		
		return false;
	};

	DisplayObjectContainer.prototype.destroy = function()
	{
		var child = null;
		
		while( this.children.length > 0 )
		{
			child = this.getChildAt(0);
			child.destroy();
		}
		
		tomahawk_ns.DisplayObject.prototype.destroy.apply(this);
	};
	
	tomahawk_ns.DisplayObjectContainer = DisplayObjectContainer;
})();



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
	 * @class MovieClip
	 * @memberOf tomahawk_ns
	 * @description This class is undocumented because she will change very soon
	 * @note The MovieClip class inherits from the following classes: Bitmap, DisplayObject, and EventDispatcher. Unlike the Sprite object, a MovieClip object has a timeline.
	 * @constructor
	 * @augments tomahawk_ns.Bitmap
	 **/
	function MovieClip(texture)
	{
		tomahawk_ns.Bitmap.apply(this, [texture]);
		this._frames = new Array();
	}

	Tomahawk.registerClass( MovieClip, "MovieClip" );
	Tomahawk.extend( "MovieClip", "Bitmap" );

	MovieClip.prototype._frames = null;
	MovieClip.prototype.currentFrame = 0;
	MovieClip.prototype._enterFrameHandler = null;
	MovieClip.prototype.fps = 1;
	MovieClip.prototype._timer = 0;

	MovieClip.prototype._enterFrameHandler = function(event)
	{
		this.currentFrame++;
		
		if( this.currentFrame >= this._frames.length )
			this.currentFrame = 0;
			
		if( this._frames[this.currentFrame] )
		{
			this.texture = this._frames[this.currentFrame];
		}
		
		this._timer = setTimeout(this._enterFrameHandler.bind(this), 1000 / this.fps );
	};

	MovieClip.prototype.setFrame = function( frameIndex, texture )
	{
		if( this.texture == null)
		{
			this.setTexture(texture);
		}
		
		this._frames[frameIndex] = texture;
	};

	MovieClip.prototype.play = function()
	{
		this.stop();
		this._enterFrameHandler();
	};

	MovieClip.prototype.stop = function()
	{
		clearTimeout(this._timer); 
	};
	
	MovieClip.prototype.destroy = function()
	{
		this.stop();
		tomahawk_ns.Bitmap.prototype.destroy.apply(this);
	};

	tomahawk_ns.MovieClip = MovieClip;

})();




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
	 * @class Shape
	 * @memberOf tomahawk_ns
	 * @description This class is used to create lightweight shapes using the CanvasRenderingContext2D vectorial drawing API.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObject
	 **/
	function Shape()
	{
		tomahawk_ns.DisplayObject.apply(this);
	}

	Tomahawk.registerClass( Shape, "Shape" );
	Tomahawk.extend( "Shape", "DisplayObject" );


	Shape.prototype._commands = null;

	Shape.prototype._getCommands = function()
	{
		if( this._commands == null )
			this._commands = new Array();
			
		return this._commands;
	};

	/**
	* @method clear
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Cleans the current Shape.
	**/
	Shape.prototype.clear = function()
	{
		this._commands = new Array();
	};

	/**
	* @method stroke
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Strokes the subpaths with the current stroke style.
	**/
	Shape.prototype.stroke = function()
	{
		this._getCommands().push( [1,"stroke",null] ); 
	};

	/**
	* @method fill
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Fills the subpaths with the current fill style.
	**/
	Shape.prototype.fill = function()
	{
		this._getCommands().push( [1,"fill",null] ); 
	};

	/**
	* @method beginPath
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Starts a new path by resetting the list of sub-paths. Call this method when you want to create a new path.
	**/
	Shape.prototype.beginPath = function()
	{
		this._getCommands().push( [1,"beginPath",null] ); 
	};
	
	/**
	* @method closePath
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Tries to draw a straight line from the current point to the start. If the shape has already been closed or has only one point, this function does nothing.
	**/
	Shape.prototype.closePath = function()
	{
		this._getCommands().push( [1,"closePath",null] );
	};

	/**
	* @method rect
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Adds a new closed subpath to the path, representing the given rectangle.
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	**/
	Shape.prototype.rect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"rect",[x, y, width, height]] );
	};

	/**
	* @method fillRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Draws a filled rectangle at (x, y) position whose size is determined by width and height.
	**/
	Shape.prototype.fillRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"fillRect",[x, y, width, height]] );
	};
	
	/**
	* @method clearRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Sets all pixels in the rectangle defined by starting point (x, y) and size (width, height) to transparent black.
	**/
	Shape.prototype.clearRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"clearRect",[x, y, width, height]] );
	};
	
	/**
	* @method strokeRect
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} width
	* @param {Number} height
	* @description Paints a rectangle which has a starting point at (x, y) and has a w width and an h height onto the canvas, using the current stroke style.
	**/
	Shape.prototype.strokeRect = function(x, y, width, height)
	{
		this._getCommands().push( [1,"strokeRect",[x, y, width, height]] );
	};

	/**
	* @method moveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @description Moves the starting point of a new subpath to the (x, y) coordinates.
	**/
	Shape.prototype.moveTo = function(x,y)
	{
		this._getCommands().push( [1,"moveTo",[x,y]] );
	};
	
	/**
	* @method lineTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @description Connects the last point in the subpath to the x, y coordinates with a straight line.
	**/
	Shape.prototype.lineTo = function(x,y)
	{
		this._getCommands().push( [1,"lineTo",[x,y]] );
	};
	
	/**
	* @method arc
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} x
	* @param {Number} y
	* @param {Number} radius
	* @param {Number} startAngle
	* @param {Number} endAngle
	* @param {Boolean} antiClockwise
	* @description Adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
	**/
	Shape.prototype.arc = function(x, y, radius, startAngle, endAngle, antiClockwise)
	{
		this._getCommands().push( [1,"arc",[x, y, radius, startAngle, endAngle, antiClockwise]] );
	};
	
	/**
	* @method arcTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX
	* @param {Number} controlY
	* @param {Number} endX
	* @param {Number} endY
	* @param {Number} radius
	* @description Adds an arc to the path with the given control points and radius, connected to the previous point by a straight line
	**/
	Shape.prototype.arcTo = function(controlX,controlY,endX,endY,radius)
	{
		this._getCommands().push( [1,"arcTo",[controlX,controlY,endX,endY,radius]] );
	};
	
	/**
	* @method quadraticCurveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX
	* @param {Number} controlY
	* @param {Number} endX
	* @param {Number} endY
	* @description Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.
	**/
	Shape.prototype.quadraticCurveTo = function(controlX, controlY, endX, endY)
	{
		this._getCommands().push( [1,"quadraticCurveTo",[controlX, controlY, endX, endY]] );
	};
	
	/**
	* @method bezierCurveTo
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} controlX1
	* @param {Number} controlY1
	* @param {Number} controlX2
	* @param {Number} controlY2
	* @param {Number} endX
	* @param {Number} endY
	* @description Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.
	**/
	Shape.prototype.bezierCurveTo = function(controlX1, controlY1, controlX2, controlY2, endX, endY)
	{
		this._getCommands().push( [1,"bezierCurveTo",[controlX1, controlY1, controlX2, controlY2, endX, endY]] );
	};
	
	/**
	* @method fillWithCurrentGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @description Sets the current gradient as the current fillStyle
	**/
	Shape.prototype.fillWithCurrentGradient = function()
	{
		this._getCommands().push( [1,"fillWithCurrentGradient",null] );
	};
	
	/**
	* @method addColorStop
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} offset
	* @param {String} color
	* @description Adds a color stop with the given color to the gradient at the given offset. 0.0 is the offset at one end of the gradient, 1.0 is the offset at the other end.
	**/
	Shape.prototype.addColorStop = function(offset, color)
	{
		this._getCommands().push( [1,"addColorStop",[offset, color]] );
	};
	
	/**
	* @method createLinearGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} endX
	* @param {Number} endY
	* @description Creates a gradient along the line given by the coordinates represented by the parameters.
	**/
	Shape.prototype.createLinearGradient = function(startX, startY, endX, endY)
	{
		this._getCommands().push( [1,"createLinearGradient",[startX, startY, endX, endY]] );
	};
	
	/**
	* @method createRadialGradient
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} startRadius
	* @param {Number} endX
	* @param {Number} endY
	* @param {Number} endRadius
	* @description Creates a CanvasGradient object that represents a radial gradient that paints along the cone given by the circles represented by the arguments. If either of the radii are negative, throws an IndexSizeError exception.
	**/
	Shape.prototype.createRadialGradient = function(startX, startY, startRadius, endX, endY, endRadius)
	{
		this._getCommands().push( [1,"createRadialGradient",[startX, startY, startRadius, endX, endY, endRadius]] );
	};
	
	/**
	* @description Sets width of lines, default 1.0
	* @method lineWidth
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Number} value the new line width.
	**/
	Shape.prototype.lineWidth = function(value)
	{
		this._getCommands().push( [0,"lineWidth",value] );
	};
	
	/**
	* @description Defines the type of endings on the end of lines. Possible values: butt (default), round, square
	* @method lineCap
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {String} value 
	**/
	Shape.prototype.lineCap = function(value)
	{
		this._getCommands().push( [0,"lineCap",value] );
	};

	/**
	* @description Defines the type of corners where two lines meet. Possible values: round, bevel, miter (default)
	* @method strokeStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {String} value 
	**/
	Shape.prototype.lineJoin = function(value)
	{
		this._getCommands().push( [0,"lineJoin",value] );
	};
	
	/**
	* @description Defines the style used for stroking shapes. It can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	* @method strokeStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Object} value 
	**/
	Shape.prototype.strokeStyle = function(value)
	{
		this._getCommands().push( [0,"strokeStyle",value] );
	};
	
	/**
	* @description Defines the style used for filling shapes. It can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	* @method fillStyle
	* @memberOf tomahawk_ns.Shape.prototype
	* @param {Object} value 
	**/
	Shape.prototype.fillStyle = function(value)
	{
		this._getCommands().push( [0,"fillStyle",value] );
	};

	Shape.prototype.draw = function(context)
	{
		var commands = this._getCommands();
		var command = null;
		var i = 0;
		var max = commands.length;
		var type = null;
		var prop = null;
		var args = null;
		var gradient = null;
		
		//type = 0 : set; type = 1 : method
		
		for (i = 0; i < max; i++ )
		{
			command = commands[i];
			type = command[0];
			prop = command[1];
			args = command[2];
			
			if( type == 0 )
			{
				if( context[prop] )
				{
					context[prop] = args;				
				}
				else if( gradient != null )
				{
					if( gradient[prop] )
						gradient[prop] = args;
				}
			}
			else
			{
				if( prop == "createLinearGradient" || prop == "createRadialGradient" )
				{
					gradient = context[prop].apply(context,args);
				}
				else if( prop == "fillWithCurrentGradient" )
				{
					context.fillStyle = gradient;
				}
				else
				{
					if( context[prop] )
					{
						context[prop].apply(context,args);
					}
					else if( gradient != null )
					{
						if( gradient[prop] )
							gradient[prop].apply(gradient,args);
					}
				}
			}
			
		}
	};

	
	tomahawk_ns.Shape = Shape;

})();



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
	 * @class Sprite
	 * @memberOf tomahawk_ns
	 * @description The Sprite class is a basic display list building block: a display list node that can contain children.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Sprite()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
	}
	
	Tomahawk.registerClass( Sprite, "Sprite" );
	Tomahawk.extend( "Sprite", "DisplayObjectContainer" );
	
	Sprite.prototype.___lastPoint = null;
	Sprite.prototype.___dragging = false;
	
	Sprite.prototype.___getDragDropMovement___ 		= function(event)
	{
		this.___lastPoint = this.___lastPoint || new tomahawk_ns.Point(0,0);
		
		var newPoint = new tomahawk_ns.Point(event.stageX, event.stageY);
		var movement = new tomahawk_ns.Point(0,0);
		
		if( this.parent != null )
		{
			newPoint = this.parent.globalToLocal(event.stageX, event.stageY);
		}
		
		movement.x = newPoint.x - this.___lastPoint.x;
		movement.y = newPoint.y - this.___lastPoint.y;
		
		this.___lastPoint.x = newPoint.x;
		this.___lastPoint.y = newPoint.y;
		
		return movement;
	};
	
	Sprite.prototype.___dragDropHandler___ 			= function(event)
	{
		if( this.___dragging == false )
			return;

		var movement = this.___getDragDropMovement___(event);
		
		this.x += movement.x;
		this.y += movement.y;
	};
	
	Sprite.prototype.___toggleDragDropHandler___ 	= function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN )
		{
			this.___dragging = true;
			this.startDrag();
		}
		else
		{
			this.___dragging = false;
			this.stopDrag();
		}
		
		this.___getDragDropMovement___(event);
	};
	
	/**
	* @method enableDragAndDrop
	* @memberOf tomahawk_ns.Sprite.prototype
	* @param {Boolean} value Indicates if the drag and drop feature is enabled or not. 
	* @description Enables or Disables the drag and drop feature.
	**/
	Sprite.prototype.enableDragAndDrop 				= function(value)
	{
		this.stopDrag();
		
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		
		if( value == true )
		{
			this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this.___toggleDragDropHandler___,true);
			this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_UP, this, this.___toggleDragDropHandler___,true);
		}
		
		this.mouseEnabled = true;
	};
	
	/**
	* @method startDrag
	* @memberOf tomahawk_ns.Sprite.prototype
	* @description Start the dragging operation.
	**/
	Sprite.prototype.startDrag 						= function()
	{
		this.stopDrag();
		this.addEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___ );
		this.mouseEnabled = true;
	};
	
	/**
	* @method stopDrag
	* @memberOf tomahawk_ns.Sprite.prototype
	* @description Stop the dragging operation.
	**/
	Sprite.prototype.stopDrag 						= function()
	{
		this.removeEventListener(tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this.___dragDropHandler___, true );
	};

	tomahawk_ns.Sprite = Sprite;
})();





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
	 * @class Stage
	 * @memberOf tomahawk_ns
	 * @description The Stage class represents the main drawing area, it is the top of the display list.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function Stage()
	{
		tomahawk_ns.DisplayObject._collide = 0;
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.setFPS(1000);
		this.stage = this;
	}

	Tomahawk.registerClass( Stage, "Stage" );
	Tomahawk.extend( "Stage", "DisplayObjectContainer" );

	Stage._instances = new Object();
	
	/**
	* @method getInstance
	* @memberOf tomahawk_ns.Stage
	* @param {string} stageName 
	* @returns {tomahawk_ns.Stage} returns a Stage object that matches the "stageName" parameter. If none of the Stage instances corresponds to the "stageName" parameter, one is automatically created and returned. It is a (Multiton || Factory) implementation of the Stage class.
	**/
	Stage.getInstance = function(stageName)
	{
		stageName = stageName || "defaultStage";
		
		if( !tomahawk_ns.Stage._instances[stageName] )
			tomahawk_ns.Stage._instances[stageName] = new tomahawk_ns.Stage();
			
		return tomahawk_ns.Stage._instances[stageName];
	};

	/**
	* @member mouseX
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description the x mouse coordinates on the stage.
	**/
	Stage.prototype.mouseX = 0;
	
	/**
	* @member mouseY
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Number}
	* @description the y mouse coordinates on the stage.
	**/
	Stage.prototype.mouseY = 0;
	
	/**
	* @member background
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the stage has a background fill. If true, the stage has a background fill. If false, stage has no background fill. Use the backgroundColor property to set the background color of the stage instance.
	**/
	Stage.prototype.background = false;
	
	/**
	* @member backgroundColor
	* @memberOf tomahawk_ns.Stage.prototype
	* @type {string}
	* @description The color of the stage background.
	* @default "#0080C0"
	**/
	Stage.prototype.backgroundColor = "#0080C0";
	
	Stage.prototype._lastTime = 0;
	Stage.prototype._frameCount = 0;
	Stage.prototype._fps = 0;
	Stage.prototype._canvas = null;
	Stage.prototype._context = null;
	Stage.prototype._lastActiveChild = null;
	Stage.prototype._focused = false;
	Stage.prototype._focusedElement = null;
	Stage.prototype._cache = null;
	Stage.prototype._stop = false;

	/**
	* @description  Associates the canvas element specified by the "canvas" parameter  to this stage and runs the rendering loop.
	* @method init
	* @memberOf tomahawk_ns.Stage.prototype
	* @param {HTMLCanvasElement} canvas the HTMLCanvasElement element associated to this stage object.
	**/
	Stage.prototype.init = function(canvas)
	{
		var callback = this._mouseHandler.bind(this);
		
		this._canvas = canvas;
		this._context = this._getContext();
		this.addEventListener(tomahawk_ns.Event.ADDED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.FOCUSED, this, this._eventHandler,true);
		this.addEventListener(tomahawk_ns.Event.UNFOCUSED, this, this._eventHandler,true);
		this._canvas.addEventListener("click",callback);
		this._canvas.addEventListener("touchstart",callback);
		this._canvas.addEventListener("touchmove",callback);
		this._canvas.addEventListener("touchend",callback);
		this._canvas.addEventListener("mousemove",callback);
		this._canvas.addEventListener("mousedown",callback);
		this._canvas.addEventListener("mouseup",callback);
		this._canvas.addEventListener("dblclick",callback);
		
		this._enterFrame = this.enterFrame.bind(this);
		this.enterFrame();		
	};
	
	/**
	* @description Returns a point object which determines the movement on x and y axises since the last frame ( in local stage coordinates system ).
	* @method getMovement
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {tomahawk_ns.Point} a Point object
	**/
	Stage.prototype.getMovement = function()
	{
		var pt = new Object();
		pt.x = this.mouseX - this._lastMouseX;
		pt.y = this.mouseY - this._lastMouseY;
		
		return pt;
	};

	/**
	* @description The main rendering loop, automatically called at each frame.
	* @method enterFrame
	* @memberOf tomahawk_ns.Stage.prototype
	**/
	Stage.prototype.enterFrame = function()
	{
		var curTime = new Date().getTime();
		var scope = this;
		var context = this._context;
		var canvas = this._canvas;
		
		this.width = this._canvas.width;
		this.height = this._canvas.height;
		
		this._frameCount++;
		
		if( curTime - this._lastTime > 1000 )
		{
			this._fps = this._frameCount;
			this._frameCount = 0;
			this._lastTime = curTime;
		}
		
		if( this.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.backgroundColor;
			context.fillRect( 0, 0, canvas.width, canvas.height );
			context.fill();
			context.restore();
		}
		else
		{
			context.clearRect(0,0,canvas.width,canvas.height);
		}
		
		context.save();
		this.draw(context);
		context.restore();
		
		this.dispatchEvent(new tomahawk_ns.Event(tomahawk_ns.Event.ENTER_FRAME,true,true));
		window.requestAnimationFrame(this._enterFrame);
	};

	/**
	* @description Sets the current fps but only if the browser doesn't have a valid implementation of window.requestAnimationFrame or equivalent. If there's one, it will be used instead even if you specify another fps value.
	* @method setFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @param {Number} value the new current fps
	**/
	Stage.prototype.setFPS = function(value)
	{
		this._fps = value;
		
		window.requestAnimationFrame = (function()
		{
			
			return  window.requestAnimationFrame       ||  //Chromium 
					window.webkitRequestAnimationFrame ||  //Webkit
					window.mozRequestAnimationFrame    || //Mozilla Geko
					window.oRequestAnimationFrame      || //Opera Presto
					window.msRequestAnimationFrame     || //IE Trident?
					function(callback, element){ //Fallback function
						window.setTimeout(callback, parseInt(1000/value));                
					}
			 
		})();
	};

	/**
	* @method drawFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Draws the current fps on the top left corner of the stage.
	**/
	Stage.prototype.drawFPS = function()
	{
		this._context.save();
		this._context.beginPath();
		this._context.fillStyle = "black";
		this._context.fillRect(0,0,50,15);
		this._context.fill();
		this._context.fillStyle = "red";
		this._context.font = '10pt Arial';
		this._context.fillText("fps: "+this._fps, 0,15);
		this._context.restore();
	};

	/**
	* @method getCanvas
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {HTMLCanvasElement} An HTMLCanvasElement DOM object
	* @description Returns the HTMLCanvasElement associated to this stage.
	**/
	Stage.prototype.getCanvas = function()
	{
		return this._canvas;
	};
	
	/**
	* @method getContext
	* @memberOf tomahawk_ns.Stage.prototype
	* @returns {CanvasRenderingContext2D} A CanvasRenderingContext2D object
	* @description Returns the CanvasRenderingContext2D associated to this stage's canvas.
	**/
	Stage.prototype.getContext = function()
	{
		return this._context;
	};

	/**
	* @member getFPS
	* @memberOf tomahawk_ns.Stage.prototype
	* @description Returns the current fps.
	* @returns {Number} the current fps
	**/
	Stage.prototype.getFPS = function()
	{
		return this._fps;
	};

	
	Stage.prototype._getContext  = function()
	{
		return this._canvas.getContext("2d");
	};

	Stage.prototype._mouseHandler = function(event)
	{
		var bounds = this._canvas.getBoundingClientRect();
		var x = 0;
		var y = 0;
		var touch = null;
		
		if( event.type == "touchstart" || 
			event.type == "touchmove" || 
			event.type == "touchend" 
		)
		{
			touch = event.touches[0];
			
			if( event.type == "touchmove" )
			{
				event.preventDefault();
				//event.stopImmediatePropagation();
				//event.stopPropagation();
			}
			
			
			if( event.type != "touchend" )
			{			
				x = parseInt(touch.clientX) - bounds.left;
				y = parseInt(touch.clientY) - bounds.top;
			}
			else
			{
				x = this.mouseX;
				y = this.mouseY;
			}
			
		}
		else
		{
			event.preventDefault();
			event.stopImmediatePropagation();
			event.stopPropagation();
			x = event.clientX - bounds.left;
			y = event.clientY - bounds.top;
		}
		var activeChild = this.getObjectUnder(x,y);
		var mouseEvent = null;
		var i = 0;
		this._lastMouseX = this.mouseX >> 0;
		this._lastMouseY = this.mouseY >> 0;
		this.mouseX = x >> 0;
		this.mouseY = y >> 0;
		
		if( activeChild == null )
			activeChild = this;
		
			
		if( event.type == "mousemove" && this._lastActiveChild != activeChild )
		{
			if( activeChild != null )
			{		
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
				mouseEvent.type = tomahawk_ns.MouseEvent.ROLL_OVER;
				activeChild.dispatchEvent(mouseEvent);
			}
			
			if( this._lastActiveChild != null )
			{		
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);
				mouseEvent.type = tomahawk_ns.MouseEvent.ROLL_OUT;
				this._lastActiveChild.dispatchEvent(mouseEvent);
			}
		}
		else
		{
			if( activeChild != null )
			{
				mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);			
				activeChild.dispatchEvent(mouseEvent);
			}
		}
		
		if( event.type == "mousedown" )
		{
			this._lastMouseDownChild = activeChild;
		}
		
		if( 	event.type == "mouseup" && 
				activeChild != this._lastMouseDownChild && 
				this._lastMouseDownChild != null
		)
		{
			mouseEvent = tomahawk_ns.MouseEvent.fromNativeMouseEvent(event,true,true,x,y);	
			mouseEvent.type == tomahawk_ns.MouseEvent.RELEASE_OUTSIDE;
			this._lastMouseDownChild.dispatchEvent(mouseEvent);
			this._lastMouseDownChild = null;
		}
		
		this._lastActiveChild = activeChild;
		
		var handCursor = false;
		var current = activeChild;
		
		while( current != null )
		{
			handCursor = handCursor || current.handCursor;
			current = current.parent;
		}
		
		if( activeChild != null && handCursor == true )
			tomahawk_ns.Mouse.setCursor(tomahawk_ns.Mouse.POINTER, this.getCanvas());
		else
			tomahawk_ns.Mouse.setCursor(tomahawk_ns.Mouse.DEFAULT, this.getCanvas());
		
		
		if( event.type != "mousemove" && this._focusedElement != null && activeChild != this._focusedElement )
		{
			this._focusedElement.setFocus(false);
			this._focusedElement = null;
			this._focused = false;
		}
	};

	Stage.prototype._eventHandler = function(event)
	{
		var list = null;
		var i = 0;
		var max = 0;
		var child = null;
		var type = null;
		
		switch( event.type )
		{
			case tomahawk_ns.Event.FOCUSED: 
				this._focused = true;
				this._focusedElement = event.target;
				break;
				
			case tomahawk_ns.Event.UNFOCUSED: 
				this._focused = false;
				break;
				
			case tomahawk_ns.Event.ADDED: 
			case tomahawk_ns.Event.REMOVED: 
				
				list = event.target.getNestedChildren();
				list.push(event.target);
				max = list.length;
				
				for( i= 0; i < max; i++ )
				{
					list[i].stage = this;
				}
				
				type = ( event.type == tomahawk_ns.Event.ADDED ) ? tomahawk_ns.Event.ADDED_TO_STAGE : tomahawk_ns.Event.REMOVED_FROM_STAGE;
				
				for( i= 0; i < max; i++ )
				{
					list[i].dispatchEvent( new tomahawk_ns.Event(type, true, true) ); 
				}
				
				break;
		}
	};


	tomahawk_ns.Stage = Stage;

})();






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
	 * @class QuadTreeContainer
	 * @memberOf tomahawk_ns
	 * @description The QuadTreeContainer class is a basic display list building block: a display list node that can contain children. The only difference with the basic Sprite class is that QuadTreeContainer orders his children in an internal quadtree structure. Each child which needs to be updated ( updateNextFrame || autoUpdate to true ) will be removed and added to the quadtree every frame. It means that the QuadTreeContainer is a very good container for a large subset of statics objects, so you can set the children autoUpdate property to false. It will results to a large gain of performances. Elsewhere, you can put a little subset of children with the autoUpdate property to true depending of the performances of the targeted devices.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function QuadTreeContainer(left,right,top,bottom,childrenPerNode, maxDepth)
	{
		tomahawk_ns.Sprite.apply(this);
		
		left = left || -2147483648;
		right = right || 2147483648;
		top = top || -2147483648;
		bottom = bottom || 2147483648;
		maxDepth = maxDepth || 24;
		childrenPerNode = childrenPerNode || 100;
		
		this._root = new tomahawk_ns.QuadTreeNode(left,right,top,bottom,0,childrenPerNode,maxDepth);
	}

	Tomahawk.registerClass( QuadTreeContainer, "QuadTreeContainer" );
	Tomahawk.extend( "QuadTreeContainer", "Sprite" );
	
	QuadTreeContainer.prototype._root = null;

	/**
	* @description Returns all the children of the QuadTreeContainer that are visibles on the canvas area.
	* @method getVisiblesChildren
	* @memberOf tomahawk_ns.QuadTreeContainer.prototype
	* @returns {Array} an array of DisplayObject instances.
	**/
	QuadTreeContainer.prototype.getVisiblesChildren = function()
	{
		var i = this.children.length;
		var child = null;
		var visibles = null;
		
		if( this.stage == null )
			return new Array();
			
		while( --i > -1 )
		{
			child = this.children[i];
			child.__index__ = i;
			
			if( child.updateNextFrame == true || child.autoUpdate == true )
			{
				this._root.add(child);
			}
		}
		
		var width = this.stage.getCanvas().width;
		var height = this.stage.getCanvas().height;
		var pt1 = this.globalToLocal(0,0);
		var pt2 = this.globalToLocal(width,height);
		var left = pt1.x;
		var right = pt2.x;
		var top = pt1.y;
		var bottom = pt2.y;
		
		visibles = this._root.get(left, right, top, bottom);
		visibles.sort(this._sortVisiblesChildren);
		
		return visibles;
	};
	
	/**
	* @description Returns the top node of the internal quadtree structure.
	* @method getRoot
	* @memberOf tomahawk_ns.QuadTreeContainer.prototype
	* @returns {tomahawk_ns.QuadTreeNode} the root node of the internal quadtree structure
	**/
	QuadTreeContainer.prototype.getRoot = function()
	{
		return this._root;
	};

	
	QuadTreeContainer.prototype.addChild = function(child)
	{
		child.updateNextFrame = true;
		this._root.add(child);
		return tomahawk_ns.Sprite.prototype.addChild.apply(this,[child]);
	};

	QuadTreeContainer.prototype.addChildAt = function(child, index)
	{
		child.updateNextFrame = true;
		this._root.add(child);
		return tomahawk_ns.Sprite.prototype.addChildAt.apply(this,[child,index]);
	};

	QuadTreeContainer.prototype.removeChildAt = function(child, index)
	{
		child.updateNextFrame = true;
		this._root.remove(child);
		return tomahawk_ns.Sprite.prototype.removeChildAt.apply(this,[child,index]);
	};
	
	QuadTreeContainer.prototype.removeChild = function(child)
	{
		child.updateNextFrame = true;
		this._root.remove(child);
		return tomahawk_ns.Sprite.prototype.removeChild.apply(this,[child]);
	};
	
	QuadTreeContainer.prototype._sortVisiblesChildren = function(a,b)
	{
		return ( a.__index__ < b.__index__ ) ? -1 : 1;
	};
	
	QuadTreeContainer.prototype.draw = function(context)
	{
		var all = this.children;
		this.children = this.getVisiblesChildren();
		tomahawk_ns.Sprite.prototype.draw.apply(this,[context]);
		this.children = all;
	};

	QuadTreeContainer.prototype.hitTest = function(x,y)
	{
		var pt1 = this.globalToLocal(x,y);
		var pt2 = this.globalToLocal(x + 5,y  + 5);
		var left = pt1.x;
		var right = pt1.x + 1;
		var top = pt1.y;
		var bottom = pt1.y + 1;
		var child = null;
		var children = this._root.get(left,right,top,bottom);
		var i = children.length;
		children.sort(this._sortVisiblesChildren);
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.hitTest(x,y) )
				return true;
		}
		
		return false;
	};
	
	QuadTreeContainer.prototype.getObjectUnder = function(x,y)
	{
		var pt1 = this.globalToLocal(x,y);
		var left = pt1.x;
		var right = pt1.x + 1;
		var top = pt1.y;
		var bottom = pt1.y + 1;
		var under = null;
		var child = null;
		var children = this._root.get(left, right, top, bottom);
		var i = children.length;
		
		children.sort(this._sortVisiblesChildren);
		
		while( --i > -1 )
		{
			child = children[i];
			
			if( child.mouseEnabled == false )
				continue;
					
			if( child.isContainer )
			{				
				under = child.getObjectUnder(x,y);
				
				if( under != null )
				{
					return under;
				}
			}
			else
			{	
				if( child.hitTest(x,y) == true )
				{
					return child;
				}
			}
		}
		
		return null;
	};
	tomahawk_ns.QuadTreeContainer = QuadTreeContainer;
})();



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
	 * @class QuadTreeNode
	 * @memberOf tomahawk_ns
	 * @description A QuadTreeNode Object defines a leaf of a quadtree structure. Quadtrees are a derived implementation of binary trees which are very efficient in 2d plans.
	 * @constructor	
	 **/
	function QuadTreeNode(left,right,top,bottom, depth, maxChildren, maxDepth)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		this.maxChildren = maxChildren;
		this.maxDepth = maxDepth;
		this.depth = depth;

		this.limitX = this.left + ( this.right - this.left ) * 0.5;
		this.limitY = this.top + ( this.bottom - this.top ) * 0.5;
		
		this.children = new Array();
	}
	
	Tomahawk.registerClass( QuadTreeNode, "QuadTreeNode" );
	
	QuadTreeNode._tick = 0;
	QuadTreeNode.prototype._cache = null;
	
	
	// iterative  methods
	
	/**
	* @description Adds a display object to the tree node
	* @method add
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @param {tomahawk_ns.DisplayObject} element the display object you want to add to the tree node
	**/
	QuadTreeNode.prototype.add = function(element)
	{
		this.remove(element);
		
		if( element.updateNextFrame == true || element.autoUpdate == true )
		{
			element.updateMatrix();
			element.updateBounds();
		}
		
		var nodes = new Array();
		var currentNode = this;
		var bounds = element.bounds;
		var out = false;
		var left = bounds.left;
		var right = bounds.right;
		var top = bounds.top;
		var bottom = bounds.bottom;
		nodes.push(this);
		
		while( nodes.length > 0 )
		{
			currentNode = nodes.shift();
			
			out =	( 	left > currentNode.right || 
						right < currentNode.left || 
						top > currentNode.bottom || 
						bottom < currentNode.top );
						
			if( out == true )
				continue;
			
			if( currentNode.children.length > currentNode.maxChildren && currentNode.depth < currentNode.maxDepth)
			{
				currentNode.split();
			}
		
			if( currentNode.full == false )
			{
				currentNode.children.push(element);
			}
			else
			{
				nodes.push(currentNode.node1);
				nodes.push(currentNode.node2);
				nodes.push(currentNode.node3);
				nodes.push(currentNode.node4);
			}
		}
	};
	
	/**
	* @description Removes a display object from the tree node
	* @method remove
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @param {tomahawk_ns.DisplayObject} element the display object you want to remove from the tree node
	**/
	QuadTreeNode.prototype.remove = function( element )
	{
		var index = -1;
		var nodes = new Array();
		var currentNode = this;
		var bounds = element.bounds;
		nodes.push(this);
		
		while( nodes.length > 0 )
		{
			currentNode = nodes.shift();
			
			if( currentNode.full == true )
			{
				nodes.push(currentNode.node1);
				nodes.push(currentNode.node2);
				nodes.push(currentNode.node3);
				nodes.push(currentNode.node4);
				continue;
			}
			
			index = currentNode.children.indexOf(element);
			if( index > -1 )
				currentNode.children.splice(index,1);
		}
	};
	
	/**
	* @description Returns an Array of DisplayObjects that are visible in the area defined by the left,right,top,bottom parameters.
	* @method get
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @param {Number} left 
	* @param {Number} right 
	* @param {Number} top 
	* @param {Number} bottom 
	* @returns {Array} An array of DisplayObject
	**/
	QuadTreeNode.prototype.get = function( left, right, top, bottom )
	{
		var tick = tomahawk_ns.QuadTreeNode._tick + 1;
		var result = new Array();
		var nodes = new Array();
		var currentNode = this;
		var out = false;
		var child = null;
		var i = 0;
		
		nodes.push(this);
		
		while( nodes.length > 0 )
		{
			currentNode = nodes.shift();
			
			out = ( left > currentNode.right || 
					right < currentNode.left || 
					top > currentNode.bottom || 
					bottom < currentNode.top );
					
			if( out == true )
				continue;
				
			if( currentNode.full == true )
			{
				nodes.push(currentNode.node1);
				nodes.push(currentNode.node2);
				nodes.push(currentNode.node3);
				nodes.push(currentNode.node4);
				continue;
			}
				
			i = currentNode.children.length;
			
			while( --i > -1 )
			{
				child = currentNode.children[i];
				bounds = child.bounds;
				
				out = ( bounds.left > right || 
						bounds.right < left ||
						bounds.top > bottom ||
						bounds.bottom < top || 
						child.__tick__ == tick);
						
				if( out == true )
					continue;
				
				result.push(child);
				child.__tick__ = tick;
			}
		}
		
		tomahawk_ns.QuadTreeNode._tick = tick;
		return result;
	};
	
	/**
	* @description Splits the current node into four child nodes. The children of the node will be redispatched throught those new four nodes.
	* @method split
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	**/
	QuadTreeNode.prototype.split = function()
	{
		var child = null;
		var e = this.depth + 1;
		var f = this.maxChildren;
		var g = this.maxDepth;
		
		this.node1 = new tomahawk_ns.QuadTreeNode(this.left,	this.limitX	, this.top	 , this.limitY	,e,f,g);
		this.node2 = new tomahawk_ns.QuadTreeNode(this.left,	this.limitX	, this.limitY, this.bottom	,e,f,g);
		this.node3 = new tomahawk_ns.QuadTreeNode(this.limitX,	this.right	, this.top	 , this.limitY	,e,f,g);
		this.node4 = new tomahawk_ns.QuadTreeNode(this.limitX,	this.right	, this.limitY, this.bottom	,e,f,g);
		
		while( this.children.length > 0)
		{
			child = this.children.shift();
			this.node1.add(child);
			this.node2.add(child);
			this.node3.add(child);
			this.node4.add(child);
		}
		
		this.full = true;
	};
	
	/**
	* @member full
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Boolean}
	* @default false
	* @description Indicates wether the node is full.
	**/
	QuadTreeNode.prototype.full = false;
	
	/**
	* @default 0
	* @member left
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the node's area.
	**/
	QuadTreeNode.prototype.left = 0;
	
	/**
	* @default 0
	* @member right
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The x coordinate of the bottom-right corner of the node's area.
	**/
	QuadTreeNode.prototype.right = 0;
	
	/**
	* @default 0
	* @member top
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the node's area.
	**/
	QuadTreeNode.prototype.top = 0;
	
	
	/**
	* @default 0
	* @member bottom
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description The y coordinate of the bottom-right corner of the node's area.
	**/
	QuadTreeNode.prototype.bottom = 0;
	
	/**
	* @default 20
	* @member maxChildren
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description Indicates the maximum amount of children of that node can stores before splitting itself.
	**/
	QuadTreeNode.prototype.maxChildren = 20;
	
	/**
	* @default 0
	* @member depth
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {Number}
	* @description Indicates the depth of the node within the quadtree structure
	**/
	QuadTreeNode.prototype.depth = 0;
	
	/**
	* @default null
	* @member node1
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the top-left child node of the node.
	**/
	QuadTreeNode.prototype.node1 = null;
	
	/**
	* @default null
	* @member node2
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the bottom-left child node of the node.
	**/
	QuadTreeNode.prototype.node2 = null;
	
	/**
	* @default null
	* @member node3
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the top-right child node of the node.
	**/
	QuadTreeNode.prototype.node3 = null;
	
	/**
	* @default null
	* @member node4
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the bottom-right child node of the node.
	**/
	QuadTreeNode.prototype.node4 = null;
	
	/**
	* @default 0
	* @member limitX
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the x coordinate of the splitting boundary within this node.
	**/
	QuadTreeNode.prototype.limitX = 0;
	
	/**
	* @default 0
	* @member limitY
	* @memberOf tomahawk_ns.QuadTreeNode.prototype
	* @type {tomahawk_ns.QuadTreeNode}
	* @description Indicates the y coordinate of the splitting boundary within this node.
	**/
	QuadTreeNode.prototype.limitY = 0;
	
	
	tomahawk_ns.QuadTreeNode = QuadTreeNode;
	
})();



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
	 * @class Sprite3D
	 * @memberOf tomahawk_ns
	 * @description The Sprite3d class is a basic display list building block, a display list node that can contain children on which pseudo3D effects can be applied.
	 * @constructor
	 * @augments tomahawk_ns.Sprite
	 **/
	function Sprite3D()
	{
		tomahawk_ns.Sprite.apply(this);
		this.matrix3D = new tomahawk_ns.Matrix4x4();
	}
	
	/**
	* @member matrix3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Matrix4x4}
	* @description The transformation matrix (3d) of the Sprite3D
	* @default null
	**/
	Sprite3D.prototype.matrix3D = null;
	
	/**
	* @member scaleZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 1
	* @description Indicates the depth scale (percentage) of the object as applied from the registration point.
	**/
	Sprite3D.prototype.scaleZ = 1;
	
	/**
	* @member z
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the z coordinate of the Sprite3D instance relative to the local coordinates of the parent DisplayObjectContainer.
	**/
	Sprite3D.prototype.z = 0;
	
	/**
	* @member pivotZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the z coordinate of the Sprite3D instance registration point
	**/
	Sprite3D.prototype.pivotZ = 0;
	
	/**
	* @member rotationX
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the x axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationX = 0;
	
	/**
	* @member rotationY
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the y axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationY = 0;
	
	/**
	* @member rotationZ
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Number}
	* @default 0
	* @description Indicates the rotation on the z axis of the Sprite3D instance, in degrees, from its original orientation.
	**/
	Sprite3D.prototype.rotationZ = 0;
	
	/**
	* @member useReal3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @type {Boolean}
	* @default false
	* @description Indicates wether the Sprite3D instance will convert his parent's transformation matrixes in 3d matrixes before rendering. If true it will results in a better 3d transformation.
	**/
	Sprite3D.prototype.useReal3D = false;
	
	/**
	* @description Returns a vector that represents the normale of the Sprite3D instance.
	* @method getNormalVector
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @returns {tomahawk_ns.Vector3D} returns a Vector3D object
	**/
	Sprite3D.prototype.getNormalVector = function()
	{
		var mat = tomahawk_ns.Matrix4x4.toMatrix2D(this.getConcatenedMatrix3D(true));
		var pt1 = mat.transformPoint(0,0);
		var pt3 = mat.transformPoint(0,100);
		var pt2 = mat.transformPoint(100,0);
		
		var vec1 = new tomahawk_ns.Vector3D(pt2.x - pt1.x, pt2.y - pt1.y,0);
		var vec2 = new tomahawk_ns.Vector3D(pt3.x - pt1.x, pt3.y - pt1.y,0);
		vec1.crossProduct(vec2);

		return vec1;
	};
	
	/**
	* @description Returns the combined 3d and 2d transformation matrixes of the Sprite3D instance and all of its parent objects, back to the stage level. If one of the parents of the Sprite3D instance is classical 2d display object, his matrix is converted into a Matrix4x4.
	* @method getConcatenedMatrix3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @returns {tomahawk_ns.Matrix4x4} returns a Matrix4x4 object
	**/
	Sprite3D.prototype.getConcatenedMatrix3D = function()
	{
		this.updateNextFrame = true;
		this.updateMatrix();
		var current = this.parent;
		var mat3D = this.matrix3D.clone();
		
		while( current != null )
		{
			current.updateNextFrame = true;
			current.updateMatrix();
			
			if( current.matrix3D && current.matrix3D != null )
			{
				mat3D.prependMatrix( current.matrix3D );
			}
			else
			{
				mat3D.prependMatrix( tomahawk_ns.Matrix4x4.toMatrix4x4(current.matrix) );
			}
			current = current.parent;
		}
		
		return mat3D;
	};
	
	/**
	* @method localToGlobal3D
	* @memberOf tomahawk_ns.Sprite3D.prototype
	* @param {string} {param} myparam
	* @returns {Number} returns a number
	* @description Converts the point object specified by x,y,z parameters from the DisplayObject's (local) coordinates to the Stage (global) coordinates.
	**/
	Sprite3D.prototype.localToGlobal3D = function(x,y,z)
	{
		var mat = this.getConcatenedMatrix3D();
		var pt = new tomahawk_ns.Point3D(x,y,z);
		mat.transformPoint3D(pt);
		return pt;
	};

	
	
	Sprite3D.prototype.updateMatrix = function()
	{
		if( this.autoUpdate == false && this.updateNextFrame == false )
			return;
			
		this.rotationX %= 360;
		this.rotationY %= 360;
		this.rotationZ %= 360;
			
		this.matrix3D.identity().appendTransform(	this.x, 
													this.y, 
													this.z,
													this.scaleX, 
													this.scaleY, 
													this.scaleZ,
													this.rotationX, 
													this.rotationY, 
													this.rotationZ,
													this.pivotX,
													this.pivotY,
													this.pivotZ
												);
												
		this.matrix = tomahawk_ns.Matrix4x4.toMatrix2D(this.matrix3D);
		this.updateNextFrame = false;
	};
	
	Sprite3D.prototype.draw = function(context)
	{
		context.save();
		
		if( this.useReal3D == true )
		{
			var mat = tomahawk_ns.Matrix4x4.toMatrix2D(this.getConcatenedMatrix3D());
			context.setTransform(mat.a,mat.b,mat.c,mat.d,mat.tx,mat.ty);
		}
		
		tomahawk_ns.Sprite.prototype.draw.apply(this,[context]);
		context.restore();
	};
	
	
	Tomahawk.registerClass( Sprite3D, "Sprite3D" );
	Tomahawk.extend( "Sprite3D", "Sprite" );
	

	tomahawk_ns.Sprite3D = Sprite3D;
})();





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
	 * @class Event
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	 
	function Event(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( Event, "Event" );

	/**
	* @member {String} type the type of the event.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.type = null;
	
	/**
	* @member {Boolean} bubbles indicates if the event can "bubble" or not.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.bubbles = false;
	
	/**
	* @member {Boolean} cancelable indicates if the event is cancelable or not.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.cancelable = true;
	
	/**
	* @member {Object} data an object attached to the event.
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.data = null;
	
	/**
	* @member {tomahawk_ns.EventDispatcher} target the original dispatcher of the event
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.target = null;
	
	/**
	* @member {tomahawk_ns.EventDispatcher} currentTarget the actual dispatcher of the event
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.currentTarget = null;

	/**
	* @method stopPropagation stop the bubbling phase
	* @memberOf tomahawk_ns.Event.prototype
	**/
	Event.prototype.stopPropagation = function()
	{
		if( this.cancelable == true )
			this.bubbles = false;
	};

	/**
	* @property {String} FOCUSED focused
	* @memberOf tomahawk_ns.Event
	**/
	Event.FOCUSED			= "focused";
	/**
	* @property {String} UNFOCUSED unfocused
	* @memberOf tomahawk_ns.Event
	**/
	Event.UNFOCUSED			= "unfocused";
	/**
	* @property {String} ADDED added
	* @memberOf tomahawk_ns.Event
	**/
	Event.ADDED 			= "added";
	/**
	* @property {String} ADDED_TO_STAGE addedToStage
	* @memberOf tomahawk_ns.Event
	**/
	Event.ADDED_TO_STAGE 	= "addedToStage";
	/**
	* @property {String} ENTER_FRAME enterFrame
	* @memberOf tomahawk_ns.Event
	**/
	Event.ENTER_FRAME 		= "enterFrame";
	/**
	* @property {String} REMOVED removed
	* @memberOf tomahawk_ns.Event
	**/
	Event.REMOVED 			= "removed";
	/**
	* @property {String} REMOVED_FROM_STAGE removedFromStage
	* @memberOf tomahawk_ns.Event
	**/
	Event.REMOVED_FROM_STAGE= "removedFromStage";
	/**
	* @property {String} IO_ERROR ioError
	* @memberOf tomahawk_ns.Event
	**/
	Event.IO_ERROR			= "ioError";
	/**
	* @property {String} PROGRESS progress
	* @memberOf tomahawk_ns.Event
	**/
	Event.PROGRESS			= "progress";
	/**
	* @property {String} COMPLETE complete
	* @memberOf tomahawk_ns.Event
	**/
	Event.COMPLETE			= "complete";
	
	
	tomahawk_ns.Event = Event;

})();



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
	 * @class EventDispatcher
	 * @memberOf tomahawk_ns
	 * @constructor
	 **/
	function EventDispatcher()
	{
		this._listeners = new Array();
	}

	Tomahawk.registerClass( EventDispatcher, "EventDispatcher" );

	/**
	* @member {tomahawk_ns.EventDispatcher} parent the parent of the current EventDispatcher
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.parent = null;
	EventDispatcher.prototype._listeners = null;

	/**
	* Add an event listener to the current EventDispatcher
	* @method addEventListener
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @param {String} type The event type.
	* @param {Object} scope the scope of the callback function
	* @param {Function} a callback function which will be called when a matching event will be dispatch.
	**/
	EventDispatcher.prototype.addEventListener = function( type, scope, callback, useCapture )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		obj.type = type;
		obj.scope = scope;
		obj.callback = callback;
		obj.useCapture = useCapture;
		this._listeners.push(obj);
	};
	
	/**
	* @description indicates if the current EventDispatcher has an event listener for the type passed in parameter.
	* @method hasEventListener 
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @returns {Boolean}
	* @params {String} type the type of the event listener
	**/
	EventDispatcher.prototype.hasEventListener = function(type)
	{
		if( this._listeners == null )
			return false;
			
		var obj = new Object();
		var i = this._listeners.length;
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type == type )
				return true;
		}
	};

	/**
	* @description send an event trought all the Display list from the current EventDispatcher to the stage
	* @method dispatchEvent 
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @returns {Boolean}
	* @param {tomahawk_ns.Event} event the event to dispatch
	**/
	EventDispatcher.prototype.dispatchEvent = function( event )
	{
		this._listeners = this._listeners || new Array();
		var obj = new Object();
		var i = this._listeners.length;
		var toDispatch = new Array();
		
		if( event.target == null )
			event.target = this;
			
		event.currentTarget = this;
		
		while( --i > -1 )
		{
			obj = this._listeners[i];
			
			if( obj.type == event.type )
			{
				if( event.target != this && obj.useCapture == false )
				{
					continue;
				}
				
				toDispatch.push(obj);
			}
		}
		
		i = toDispatch.length;
		
		while( --i > -1 )
		{
			obj = toDispatch[i];
			obj.callback.apply( obj.scope, [event] );
		}
		
		if( event.bubbles == true && this.parent != null && this.parent.dispatchEvent )
		{
			this.parent.dispatchEvent(event);
		}
	};

	/**
	* Remove ( if exists ) an event listener to the current EventDispatcher
	* @method removeEventListener
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	* @param {String} type The event type.
	* @param {Object} scope the scope of the callback function
	* @param {Function} a callback function which will be called when a matching event will be dispatch.
	**/
	EventDispatcher.prototype.removeEventListener = function( type, scope, callback, useCapture )
	{
		var obj = new Object();
		var i = this._listeners.length;
		var arr = new Array();
			
		while( --i > -1 )
		{
			obj = this._listeners[i];
			if( obj.type != type || obj.scope != scope || obj.callback != callback || obj.useCapture != useCapture )
				arr.push(obj);
		}
			
		this._listeners = arr;
	};

	/**
	* Remove all event listeners of the current EventDispatcher
	* @method removeEventListeners
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.removeEventListeners = function()
	{
		this._listeners = new Array();
	};
	
	/**
	* Destroy properly the current EventDispatcher
	* @method destroy
	* @memberOf tomahawk_ns.EventDispatcher.prototype
	**/
	EventDispatcher.prototype.destroy = function()
	{
		this.removeEventListeners();
		this.parent = null;
	};
	
	tomahawk_ns.EventDispatcher = EventDispatcher;

})();




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
	 * @class KeyEvent
	 * @memberOf tomahawk_ns
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function KeyEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( KeyEvent, "KeyEvent" );
	Tomahawk.extend( "Keyboard", "Event" );

	/**
	* @member {String} value the value of the event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.value = "";
	
	/**
	* @member {Number} keyCode the keyCode of the event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.keyCode = 0;
	
	/**
	* @member {Boolean} isCharacter Indicates if the touch pressed corresponds to a character
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.isCharacter = false;
	
	/**
	* @member {Number} charCode the charCode of the event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.charCode = 0;
	
	/**
	* @member {Boolean} ctrlKey Indicates weither the ctrlKey is pressed or not
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.crtlKey = false;
	
	/**
	* @member {Boolean} shiftKey Indicates weither the shiftKey is pressed or not
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.shiftKey = false;
	
	/**
	* @member {Boolean} altKey Indicates weither the altKey is pressed or not
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.altKey = false;
	
	/**
	* @member {KeyboardEvent} nativeEvent the native javascript event
	* @memberOf tomahawk_ns.KeyEvent.prototype
	**/
	KeyEvent.prototype.nativeEvent = null;

	/**
	* @method fromNativeEvent
	* @memberOf tomahawk_ns.KeyEvent
	* @description converts the native javascript event to a regular tomahawk_ns.KeyEvent one.
	* @param {String} type The event type.
	* @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	* @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	* @returns {tomahawk_ns.KeyEvent}
	**/
	KeyEvent.fromNativeEvent = function(event,bubbles,cancelable)
	{
		var type = "";
		var newEvent = null;
		var charCode = event.which || event.keyCode;
		
		switch( event.type )
		{
			case "keyup": type = KeyEvent.KEY_UP; break;
			case "keypress": type = KeyEvent.KEY_PRESS; break;
			case "keydown": type = KeyEvent.KEY_DOWN; break;
		}
		
		newEvent = new KeyEvent(type,bubbles,cancelable);
		newEvent.nativeEvent = event;
		newEvent.keyCode = event.keyCode;
		newEvent.charCode = event.charCode;
		newEvent.ctrlKey = event.ctrlKey;
		newEvent.shiftKey = event.shiftKey;
		newEvent.altKey = event.altKey;
		//newEvent.value = ( event.type == "keypress" ) ? String.fromCharCode(charCode) : tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode);
		newEvent.value = tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode);
		newEvent.isCharacter = tomahawk_ns.Keyboard.isMapped(event.keyCode);
		newEvent.which = event.which;
		return newEvent;
		
		//tomahawk_ns.Keyboard.keyCodeToChar(event.keyCode, event.shiftKey, event.ctrlKey, event.altKey);
	};


	/**
	* @property {String} KEY_UP "keyup"
	* @memberOf tomahawk_ns.KeyEvent
	**/
	KeyEvent.KEY_UP = "keyup";
	
	/**
	* @property {String} KEY_DOWN "keydown"
	* @memberOf tomahawk_ns.KeyEvent
	**/
	KeyEvent.KEY_DOWN = "keydown";
	
	/**
	* @property {String} KEY_PRESS "keypress"
	* @memberOf tomahawk_ns.KeyEvent
	**/
	KeyEvent.KEY_PRESS = "keypress";

	tomahawk_ns.KeyEvent = KeyEvent;

})();











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
	 * @class MouseEvent
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.Event
	 * @param {String} type The event type.
	 * @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
	 * @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
	 * @constructor
	 **/
	function MouseEvent(type, bubbles, cancelable)
	{
		this.type = type;
		this.cancelable = cancelable;
		this.bubbles = bubbles;
	}

	Tomahawk.registerClass( MouseEvent, "MouseEvent" );
	Tomahawk.extend( "MouseEvent", "Event" );


	/**
	* @method fromNativeMouseEvent converts an original MouseEvent into a regular tomahawk_ns.MouseEvent one
	* @memberOf tomahawk_ns.MouseEvent
	* @returns {tomahawk_ns.MouseEvent}
	**/
	MouseEvent.fromNativeMouseEvent = function(event,bubbles,cancelable,x,y)
	{
		var type = "";
		var msevent = null;
		
		
		
		switch( event.type )
		{
			case "touchend": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "click": type = tomahawk_ns.MouseEvent.CLICK; break;
			case "dblclick": type = tomahawk_ns.MouseEvent.DOUBLE_CLICK; break;
			case "mousemove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "touchmove": type = tomahawk_ns.MouseEvent.MOUSE_MOVE; break;
			case "mouseup": type = tomahawk_ns.MouseEvent.MOUSE_UP; break;
			case "mousedown": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
			case "touchstart": type = tomahawk_ns.MouseEvent.MOUSE_DOWN; break;
		}
		
		msevent = new tomahawk_ns.MouseEvent(type,bubbles,cancelable);
		msevent.stageX = x;
		msevent.stageY = y;
		return msevent;
	};

	/**
	* @property {Object} CLICK
	* @memberOf tomahawk_ns.MouseEvent click
	**/
	MouseEvent.CLICK 			= "click";
	/**
	* @property {Object} DOUBLE_CLICK doubleClick
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.DOUBLE_CLICK 	= "doubleClick";
	/**
	* @property {Object} ROLL_OVER rollOver
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.ROLL_OVER 		= "rollOver";
	/**
	* @property {Object} ROLL_OUT rollOut
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.ROLL_OUT 		= "rollOut";
	/**
	* @property {Object} MOUSE_MOVE mouseMove
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_MOVE 		= "mouseMove";
	/**
	* @property {Object} MOUSE_UP mouseUp
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_UP 		= "mouseUp";
	/**
	* @property {Object} MOUSE_DOWN mouseDown
	* @memberOf tomahawk_ns.MouseEvent
	**/
	MouseEvent.MOUSE_DOWN 		= "mouseDown";

	tomahawk_ns.MouseEvent = MouseEvent;

})();



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
	 * @class BrightnessFilter
	 * @description a basic BrightnessFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function BrightnessFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( BrightnessFilter, "BrightnessFilter" );
	Tomahawk.extend( "BrightnessFilter", "PixelFilter" );
	
	/**
	* @member {Number} value brightness intensity.
	* @memberOf tomahawk_ns.BrightnessFilter.prototype
	**/
	BrightnessFilter.prototype.value = 0;
	
	/**
	* @method process
	* @memberOf tomahawk_ns.BrightnessFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	BrightnessFilter.prototype.process = function()
	{
		if( this.value == 0 )
			return;
			
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var value = parseInt(this.value);
		
		for (var i=0; i<data.length; i+=4) 
		{
			data[i]	  = data[i] + value;
			data[i+1] = data[i+1] + value;
			data[i+2] = data[i+2] + value;
		}
		
		this.setPixels(pixels,0,0);
	};
	
	tomahawk_ns.BrightnessFilter = BrightnessFilter;

})();



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
	 * @class ContrastFilter
	 * @description a basic ContrastFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function ContrastFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( ContrastFilter, "ContrastFilter" );
	Tomahawk.extend( "ContrastFilter", "PixelFilter" );
	
	/**
	* @member {Number} value contrast intensity.
	* @memberOf tomahawk_ns.ContrastFilter.prototype
	**/
	ContrastFilter.prototype.value = 0;

	/**
	* @method process
	* @memberOf tomahawk_ns.ContrastFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ContrastFilter.prototype.process = function()
	{
		if( this.value == 0 )
			return;
			
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		var r = 0, g = 0, b = 0, a = 0;
		var value = parseFloat(this.value);

		for (var i=0; i<data.length; i+=4) 
		{
			r = data[i+0]; r/=255; r -= 0.5; r *= value; r += 0.5; r *= 255;
			g = data[i+1]; g/=255; g -= 0.5; g *= value; g += 0.5; g *= 255;
			b = data[i+2]; b/=255; b -= 0.5; b *= value; b += 0.5; b *= 255;
			
			r = parseInt(r); r = ( r > 255 ) ? 255 : r; r = ( r < 0 ) ? 0 : r;
			g = parseInt(g); g = ( g > 255 ) ? 255 : g; g = ( g < 0 ) ? 0 : g;
			b = parseInt(b); b = ( b > 255 ) ? 255 : b; b = ( b < 0 ) ? 0 : b;
			
			data[i] = r;
			data[i+1] = g;
			data[i+2] = b;
		}
		
		this.setPixels(pixels,0,0);
	};
	
	
	tomahawk_ns.ContrastFilter = ContrastFilter;

})();



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
	 * @class GrayScaleFilter
	 * @description a basic GrayScaleFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function GrayScaleFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
	}
	
	Tomahawk.registerClass( GrayScaleFilter, "GrayScaleFilter" );
	Tomahawk.extend( "GrayScaleFilter", "PixelFilter" );

	/**
	* @method process
	* @memberOf tomahawk_ns.GrayScaleFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	GrayScaleFilter.prototype.process = function()
	{
		var pixels = this.getPixels(0,0,this._canvas.width,this._canvas.height);
		var data = pixels.data;
		
		for (var i=0; i<data.length; i+=4) 
		{
			var r = data[i];
			var g = data[i+1];
			var b = data[i+2];
			var v = 0.2126*r + 0.7152*g + 0.0722*b;
			data[i] = data[i+1] = data[i+2] = v;
		}
		
		this.setPixels(pixels,0,0);
	};

	tomahawk_ns.GrayScaleFilter = GrayScaleFilter;

})();



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
	 * @class PixelFilter
	 * @description the base class for all filters
	 * @memberOf tomahawk_ns
	 * @constructor
	 **/
	function PixelFilter(){}
	
	Tomahawk.registerClass( PixelFilter, "PixelFilter" );

	/**
	* @property {Number} BEFORE_DRAWING_FILTER 0
	* @memberOf tomahawk_ns.PixelFilter
	**/
	PixelFilter.BEFORE_DRAWING_FILTER = 0;
	
	/**
	* @property {Number} BEFORE_DRAWING_FILTER 0
	* @memberOf tomahawk_ns.PixelFilter
	**/
	PixelFilter.AFTER_DRAWING_FILTER = 1;
	
	PixelFilter.prototype._canvas = null;
	PixelFilter.prototype._context = null;
	PixelFilter.prototype._object = null;
	PixelFilter.prototype.type = 1;
	
	/**
	* @method getPixels
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description return the pixels of the linked DisplayObject into the region defined by (x,y,width,height)
	* @param {Number} x the x coordinates of top left corner of the region.
	* @param {Number} y the y coordinates of top left corner of the region.
	* @param {Number} width the width of the region.
	* @param {Number} height the height of the region.
	* @returns {ImageData}
	**/
	PixelFilter.prototype.getPixels = function(x,y,width,height)
	{
		return this._context.getImageData(x,y,width,height);
	};

	/**
	* @method setPixels
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description set the pixels of the linked DisplayObject from the point defined by (x,y)
	* @param {ImageData} pixels an ImageData object
	* @param {Number} x the x coordinates of top left corner from which the pixels will be set.
	* @param {Number} y the y coordinates of top left corner from which the pixels will be set.
	**/
	PixelFilter.prototype.setPixels = function(pixels,x,y)
	{
		this._context.putImageData(pixels,x,y);
	};

	/**
	* @method process
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	PixelFilter.prototype.process = function()
	{
		//code de notre filtre ici
	};

	/**
	* @method apply
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description apply the filter on the canvas passed in param
	* @param {HTMLCanvasElement} canvas the canvas used by the current filter.
	* @param {CanvasRenderingContext2D} context the context used by the current filter.
	* @param {tomahawk_ns.DisplayObject} object the DisplayObject on which the filter will be applied to
	**/
	PixelFilter.prototype.apply = function(canvas, context, object)
	{
		this._canvas = canvas;
		this._object = object;
		this._context = context;
		this.process();
	};

	/**
	* @method getOffsetX
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description returns the extra pixels generated by the filter on the x axis
	* @returns {Number}
	**/
	PixelFilter.prototype.getOffsetX = function(){ return 0};
	
	/**
	* @method getOffsetY
	* @memberOf tomahawk_ns.PixelFilter.prototype
	* @description returns the extra pixels generated by the filter on the y axis
	* @returns {Number}
	**/
	PixelFilter.prototype.getOffsetY = function(){ return 0};
	
	tomahawk_ns.PixelFilter = PixelFilter;

})();



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
	 * @class ShadowBlurFilter
	 * @description a basic ShadowBlurFilter
	 * @memberOf tomahawk_ns
	 * @augments tomahawk_ns.PixelFilter
	 * @constructor
	 **/
	function ShadowBlurFilter()
	{
		tomahawk_ns.PixelFilter.apply(this);
		this.type = tomahawk_ns.PixelFilter.BEFORE_DRAWING_FILTER;
	}
	
	Tomahawk.registerClass( ShadowBlurFilter, "ShadowBlurFilter" );
	Tomahawk.extend( "ShadowBlurFilter", "PixelFilter" );
	
	/**
	* @member {Number} shadowOffsetX shadow offset on the x axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetX = 1;
	/**
	* @member {Number} shadowOffsetY shadow offset on the y axis.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowOffsetY = 1;
	/**
	* @member {Number} shadowBlur intensity of the shadow blur.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowBlur 	= 100;
	/**
	* @member {Number} shadowColor the color of the shadow.
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	**/
	ShadowBlurFilter.prototype.shadowColor 	= "white";
	
	/**
	* @method process
	* @memberOf tomahawk_ns.ShadowBlurFilter.prototype
	* @description apply the filter process on the DisplayObject
	**/
	ShadowBlurFilter.prototype.process = function()
	{
		var context = this._canvas.getContext("2d");
		this._canvas.width += this.shadowBlur + this.shadowOffsetX;
		this._canvas.height += this.shadowBlur + this.shadowOffsetY;
		context.shadowBlur = this.shadowBlur;
		context.shadowColor = this.shadowColor;
		context.shadowOffsetX = this.shadowOffsetX;
		context.shadowOffsetY = this.shadowOffsetY;
	};

	tomahawk_ns.ShadowBlurFilter = ShadowBlurFilter;

})();



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

/**
 * original file extracted from createJs ( http://www.createjs.com ) 
 * and modified a bit for Tomahawk
 */

(function() {
	 /**
	 * @class Matrix2D
	 * @description A Basic implementation of a Matrix3x3 
	 * @memberOf tomahawk_ns
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @constructor
	 **/
	function Matrix2D(a, b, c, d, tx, ty)
	{
		this.initialize(a, b, c, d, tx, ty);
		this._stack = new Array();
	}

	Tomahawk.registerClass( Matrix2D, "Matrix2D" );
	
	Matrix2D.prototype._stack = null;
	
	// static public properties:
	/**
	 * An identity matrix, representing a null transformation.
	 * @memberOf tomahawk_ns.Matrix2D
	 * @property identity
	 * @static
	 * @type Matrix2D
	 * @memberOf tomhawk_ns.Matrix2D
	 * @readonly
	 **/
	Matrix2D.identity = null;// set at bottom of class definition.

	/**
	 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
	 * @memberOf tomahawk_ns.Matrix2D
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
	Matrix2D.DEG_TO_RAD = Math.PI/180;

	
	
	

// public properties:
	/**
	 * Position (0, 0) in a 3x3 affine transformation matrix.
	 * @member a
	 * @type Number
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 **/
	Matrix2D.prototype.a = 1;

	/**
	 * Position (0, 1) in a 3x3 affine transformation matrix.
	 * @member b
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.b = 0;

	/**
	 * Position (1, 0) in a 3x3 affine transformation matrix.
	 * @member c
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.c = 0;

	/**
	 * Position (1, 1) in a 3x3 affine transformation matrix.
	 * @member d
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.d = 1;

	/**
	 * Position (2, 0) in a 3x3 affine transformation matrix.
	 * @member tx
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.tx = 0;

	/**
	 * Position (2, 1) in a 3x3 affine transformation matrix.
	 * @member ty
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @type Number
	 **/
	Matrix2D.prototype.ty = 0;



// constructor:
	/**
	 * Initialization method. Can also be used to reinitialize the instance.
	 * @method initialize
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This instance. Useful for chaining method calls.
	*/
	Matrix2D.prototype.initialize = function(a, b, c, d, tx, ty) {
		this.a = (a == null) ? 1 : a;
		this.b = b || 0;
		this.c = c || 0;
		this.d = (d == null) ? 1 : d;
		this.tx = tx || 0;
		this.ty = ty || 0;
		return this;
	};

// public methods:
	/**
	 * Concatenates the specified matrix properties with this matrix. All parameters are required.
	 * @method prepend
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.prepend = function(a, b, c, d, tx, ty) {
		var tx1 = this.tx;
		if (a != 1 || b != 0 || c != 0 || d != 1) {
			var a1 = this.a;
			var c1 = this.c;
			this.a  = a1*a+this.b*c;
			this.b  = a1*b+this.b*d;
			this.c  = c1*a+this.d*c;
			this.d  = c1*b+this.d*d;
		}
		this.tx = tx1*a+this.ty*c+tx;
		this.ty = tx1*b+this.ty*d+ty;
		return this;
	};

		/**
	 * @description Save the current Matrix state
	 * @method save
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return null
	 **/
	Matrix2D.prototype.save = function()
	{
		this._stack.push(this.a,this.b,this.c,this.d,this.tx,this.ty);
	};

	/**
	 * Restore the las saved matrix state
	 * @method save
	 * @memberOf tomhawk_ns.Matrix2D.prototype
	 * @return null
	 **/
	Matrix2D.prototype.restore = function()
	{
		this.ty = this._stack.pop();
		this.tx = this._stack.pop();
		this.d = this._stack.pop();
		this.c = this._stack.pop();
		this.b = this._stack.pop();
		this.a = this._stack.pop();
	};

	
	/**
	 * Appends the specified matrix properties with this matrix. All parameters are required.
	 * @method append
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.append = function(a, b, c, d, tx, ty) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;

		this.a  = a*a1+b*c1;
		this.b  = a*b1+b*d1;
		this.c  = c*a1+d*c1;
		this.d  = c*b1+d*d1;
		this.tx = tx*a1+ty*c1+this.tx;
		this.ty = tx*b1+ty*d1+this.ty;
		return this;
	};

	/**
	 * Prepends the specified matrix with this matrix.
	 * @method prependMatrix
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.prependMatrix = function(matrix) {
		this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	};

	/**
	 * Appends the specified matrix with this matrix.
	 * @method appendMatrix
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.appendMatrix = function(matrix) {
		this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
	 * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method prependTransform
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (regX || regY) {
			// append the registration offset:
			this.tx -= regX; this.ty -= regY;
		}
		if (skewX || skewY) {
			// TODO: can this be combined into a single prepend operation?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
		} else {
			this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}
		return this;
	};

	/**
	 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
	 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
	 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method appendTransform
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {

		if (rotation%360) {
			var r = rotation*Matrix2D.DEG_TO_RAD;
			var cos = Math.cos(r);
			var sin = Math.sin(r);
		} else {
			cos = 1;
			sin = 0;
		}

		if (skewX || skewY) {
			// TODO: can this be combined into a single append?
			skewX *= Matrix2D.DEG_TO_RAD;
			skewY *= Matrix2D.DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
		} else {
			this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
		}

		if (regX || regY) {
			// prepend the registration offset:
			this.tx -= regX*this.a+regY*this.c; 
			this.ty -= regX*this.b+regY*this.d;
		}
		return this;
	};

	/**
	 * Applies a rotation transformation to the matrix.
	 * @method rotate
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} angle The angle in radians. To use degrees, multiply by <code>Math.PI/180</code>.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);

		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;

		this.a = a1*cos-this.b*sin;
		this.b = a1*sin+this.b*cos;
		this.c = c1*cos-this.d*sin;
		this.d = c1*sin+this.d*cos;
		this.tx = tx1*cos-this.ty*sin;
		this.ty = tx1*sin+this.ty*cos;
		return this;
	};

	/**
	 * Applies a skew transformation to the matrix.
	 * @method skew
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} skewX The amount to skew horizontally in degrees.
	 * @param {Number} skewY The amount to skew vertically in degrees.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.skew = function(skewX, skewY) {
		skewX = skewX*Matrix2D.DEG_TO_RAD;
		skewY = skewY*Matrix2D.DEG_TO_RAD;
		this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
		return this;
	};

	/**
	 * Applies a scale transformation to the matrix.
	 * @method scale
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} x The amount to scale horizontally
	 * @param {Number} y The amount to scale vertically
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.c *= x;
		this.b *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	};

	/**
	 * Translates the matrix on the x and y axes.
	 * @method translate
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
		return this;
	};

	/**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @method identity
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.identity = function() {
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		return this;
	};

	/**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @method invert
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
	Matrix2D.prototype.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1*d1-b1*c1;

		this.a = d1/n;
		this.b = -b1/n;
		this.c = -c1/n;
		this.d = a1/n;
		this.tx = (c1*this.ty-d1*tx1)/n;
		this.ty = -(a1*this.ty-b1*tx1)/n;
		return this;
	};

	/**
	 * Returns true if the matrix is an identity matrix.
	 * @method isIdentity
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {Boolean}
	 **/
	Matrix2D.prototype.isIdentity = function() {
		return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
	};

	/**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point}
	 **/
	Matrix2D.prototype.transformPoint = function(x, y, pt) {
		pt = pt||{};
		pt.x = x*this.a+y*this.c+this.tx;
		pt.y = x*this.b+y*this.d+this.ty;
		return pt;
	};

	/**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @method decompose
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.decompose = function(target) {
		// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
		// even when scale is negative
		if (target == null) { target = {}; }
		target.x = this.tx;
		target.y = this.ty;
		target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
		target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

		var skewX = Math.atan2(-this.c, this.d);
		var skewY = Math.atan2(this.b, this.a);

		if (skewX == skewY) {
			target.rotation = skewY/Matrix2D.DEG_TO_RAD;
			if (this.a < 0 && this.d >= 0) {
				target.rotation += (target.rotation <= 0) ? 180 : -180;
			}
			target.skewX = target.skewY = 0;
		} else {
			target.skewX = skewX/Matrix2D.DEG_TO_RAD;
			target.skewY = skewY/Matrix2D.DEG_TO_RAD;
		}
		return target;
	};

	/**
	 * Reinitializes all matrix properties to those specified.
	 * @method reinitialize
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.reinitialize = function(a, b, c, d, tx, ty) {
		this.initialize(a,b,c,d,tx,ty);
		return this;
	};
	
	/**
	 * Copies all properties from the specified matrix to this matrix.
	 * @method copy
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
	Matrix2D.prototype.copy = function(matrix) {
		return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	};

	/**
	 * Returns a clone of the Matrix2D instance.
	 * @method clone
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 **/
	Matrix2D.prototype.clone = function() {
		return (new Matrix2D()).copy(this);
	};

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @memberOf tomahawk_ns.Matrix2D.prototype
	 * @return {String} a string representation of the instance.
	 **/
	Matrix2D.prototype.toString = function() {
		return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
	};

	
	Matrix2D.identity = new Matrix2D();
	tomahawk_ns.Matrix2D = Matrix2D;
	
})();




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
 * @class Matrix4x4
 * @description A Basic implementation of a Matrix4x4 
 * @memberOf tomahawk_ns
 * @constructor
 **/
function Matrix4x4()
{
	this.init (1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
}

/**
 * @memberOf tomahawk_ns.Matrix2D.prototype
 * @member {Array} data
 * @description a 16 elements Array that contains the matrix data [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p]
 * @readonly
 **/
Matrix4x4.prototype.data = null;

 /**
 * @method init
 * @description initialize the matrix properties
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} e
 * @param {Number} f
 * @param {Number} g
 * @param {Number} h
 * @param {Number} i
 * @param {Number} j
 * @param {Number} k
 * @param {Number} l
 * @param {Number} m
 * @param {Number} n
 * @param {Number} o
 * @param {Number} p
 **/
Matrix4x4.prototype.init = function( 		a, b, c, d, 
											e, f, g, h, 
											i, j, k, l, 
											m, n, o, p ){
											
										
		
	var container = new Array();

	container[0] 	= a;
	container[1] 	= b;
	container[2] 	= c;
	container[3] 	= d;
	container[4] 	= e;
	container[5] 	= f;
	container[6] 	= g;
	container[7] 	= h;
	container[8] 	= i;
	container[9] 	= j;
	container[10] 	= k;
	container[11] 	= l;
	container[12] 	= m;
	container[13] 	= n;
	container[14] 	= o;
	container[15] 	= p;
	
	this.data = container;
	return this;
	
};

/**
* @method clone
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description return a clone of the matrix
* @returns {Matrix4x4}
**/
Matrix4x4.prototype.clone = function()
{
	var matrix = new tomahawk_ns.Matrix4x4();
	var i = 16;
	
	while( --i > -1 )
	{
		matrix.data[i] = this.data[i];
	}
	
	return matrix;
};

/**
* @method translate
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description translate the matrix by tx, ty, and tz
* @param {Number} tx
* @param {Number} ty
* @param {Number} tz
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.translate = function( tx, ty, tz )
{
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[3] = tx;
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[7] = ty;
	tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX.data[11] = tz;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._TRANSLATE_MATRIX );
	return this;
};

/**
* @method scale
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description scale the matrix by sx, sy, and sz
* @param {Number} sx
* @param {Number} sy
* @param {Number} sz
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.scale = function( sx, sy, sz )
{	
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[0] = sx;
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[5] = sy;
	tomahawk_ns.Matrix4x4._SCALE_MATRIX.data[10] = sz;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._SCALE_MATRIX );
	return this;
};

/**
* @method rotate
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by rx, ry, and rz
* @param {Number} rx
* @param {Number} ry
* @param {Number} rz
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.rotate =  function( rx, ry, rz )
{
	var c = tomahawk_ns.Matrix4x4._cos[rx];
	var s = tomahawk_ns.Matrix4x4._sin[rx];
	
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[5] = c;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[6] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[9] = s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[10] = c;
	
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX );
	
	c = tomahawk_ns.Matrix4x4._cos[ry];
	s = tomahawk_ns.Matrix4x4._sin[ry];
	
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[2] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[8] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[10] = c;
	
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX );
	
	c = tomahawk_ns.Matrix4x4._cos[rz];
	s = tomahawk_ns.Matrix4x4._sin[rz];
	
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[1] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[4] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[5] = c;
	
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX );
	return this;
};

/**
* @method rotateX
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by p_rotation degrees on the x axis
* @param {Number} p_rotation
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.rotateX = function( p_rotation )
{
	var c = tomahawk_ns.Matrix4x4._cos[p_rotation];
	var s = tomahawk_ns.Matrix4x4._sin[p_rotation];
	
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[5] = c;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[6] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[9] = s;
	tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX.data[10] = c;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_X_MATRIX );
	return this;
};

/**
* @method rotateY
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by p_rotation degrees on the y axis
* @param {Number} p_rotation
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.rotateY = function( p_rotation )
{
	var c = tomahawk_ns.Matrix4x4._cos[p_rotation];
	var s = tomahawk_ns.Matrix4x4._sin[p_rotation];
	
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[2] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[8] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX.data[10] = c;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Y_MATRIX );
	
	return this;
};

/**
* @method rotateZ
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description rotate the matrix by p_rotation degrees on the z axis
* @param {Number} p_rotation
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.rotateZ = function( p_rotation )
{
	var c = tomahawk_ns.Matrix4x4._cos[p_rotation];
	var s = tomahawk_ns.Matrix4x4._sin[p_rotation];
						
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[0] = c;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[1] = -s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[4] = s;
	tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX.data[5] = c;
				
	this.appendMatrix( tomahawk_ns.Matrix4x4._ROTATION_Z_MATRIX );
	
	return this;
};

/**
* @method multiplyByNumber
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description multiply the current matrix by p_number
* @param {Number} p_number
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.multiplyByNumber = function( p_number )
{
	var data1 = this.data;
	
	data1[0] *= p_number;
	data1[1] *= p_number;
	data1[2] *= p_number;
	data1[3] *= p_number;
	data1[4] *= p_number;
	data1[5] *= p_number;
	data1[6] *= p_number;
	data1[7] *= p_number;
	data1[8] *= p_number;
	data1[9] *= p_number;
	data1[10] *= p_number;
	data1[11] *= p_number;
	data1[12] *= p_number;
	data1[13] *= p_number;
	data1[14] *= p_number;
	data1[15] *= p_number;
	
	return this;
};


/**
* @method appendTransform
* @memberOf tomahawk_ns.Matrix4x4.prototype
* @description append transformation on the current matrix around the point defined by pivotX, pivotY and pivotZ
* @param {Number} p_number
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @param {Number} scaleX
* @param {Number} scaleY
* @param {Number} scaleZ
* @param {Number} rotationX
* @param {Number} rotationY
* @param {Number} rotationZ
* @param {Number} pivotX
* @param {Number} pivotY
* @param {Number} pivotZ
* @returns {Matrix4x4} This instance. Useful for chaining method calls.
**/
Matrix4x4.prototype.appendTransform = function(	x, 
												y, 
												z,
												scaleX, 
												scaleY, 
												scaleZ,
												rotationX, 
												rotationY, 
												rotationZ,
												pivotX,
												pivotY,
												pivotZ)
{
	
	return this	.translate(x + pivotX,y + pivotY,z + pivotZ)
				.scale(scaleX,scaleY,scaleZ)
				.rotate(rotationX,rotationY,rotationZ)
				.translate(-pivotX,-pivotY,-pivotZ);
};

/**
 * Prepends the specified matrix with this matrix.
 * @method prependMatrix
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {Matrix4x4} matrix
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.prependMatrix = function( p_mat )
{
	var data1 = this.data;
	var data2 = p_mat.data;
	
	var a00 = data2[0], a01 = data2[1], a02 = data2[2], a03 = data2[3];
	var a10 = data2[4], a11 = data2[5], a12 = data2[6], a13 = data2[7];
	var a20 = data2[8], a21 = data2[9], a22 = data2[10], a23 = data2[11];
	var a30 = data2[12], a31 = data2[13], a32 = data2[14], a33 = data2[15];
	
	var b00 = data1[0], b01 = data1[1], b02 = data1[2], b03 = data1[3];
	var b10 = data1[4], b11 = data1[5], b12 = data1[6], b13 = data1[7];
	var b20 = data1[8], b21 = data1[9], b22 = data1[10], b23 = data1[11];
	var b30 = data1[12], b31 = data1[13], b32 = data1[14], b33 = data1[15];
	
	data1[0] 	= a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
	data1[1] 	= a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
	data1[2] 	= a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
	data1[3] 	= a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
	
	data1[4] 	= a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
	data1[5] 	= a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
	data1[6] 	= a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
	data1[7] 	= a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
	
	data1[8] 	= a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
	data1[9] 	= a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
	data1[10] 	= a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
	data1[11] 	= a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
	
	data1[12] 	= a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
	data1[13] 	= a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
	data1[14] 	= a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
	data1[15] 	= a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
	
	return this;
};

/**
 * Appends the specified matrix with this matrix.
 * @method appendMatrix
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {Matrix4x4} matrix
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.appendMatrix = function( p_mat )
{
	var data1 = this.data;
	var data2 = p_mat.data;
	
	var a00 = data1[0], a01 = data1[1], a02 = data1[2], a03 = data1[3];
	var a10 = data1[4], a11 = data1[5], a12 = data1[6], a13 = data1[7];
	var a20 = data1[8], a21 = data1[9], a22 = data1[10], a23 = data1[11];
	var a30 = data1[12], a31 = data1[13], a32 = data1[14], a33 = data1[15];
	
	var b00 = data2[0], b01 = data2[1], b02 = data2[2], b03 = data2[3];
	var b10 = data2[4], b11 = data2[5], b12 = data2[6], b13 = data2[7];
	var b20 = data2[8], b21 = data2[9], b22 = data2[10], b23 = data2[11];
	var b30 = data2[12], b31 = data2[13], b32 = data2[14], b33 = data2[15];
	
	data1[0] 	= a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
	data1[1] 	= a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
	data1[2] 	= a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
	data1[3] 	= a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
	
	data1[4] 	= a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
	data1[5] 	= a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
	data1[6] 	= a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
	data1[7] 	= a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
	
	data1[8] 	= a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
	data1[9] 	= a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
	data1[10] 	= a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
	data1[11] 	= a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
	
	data1[12] 	= a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
	data1[13] 	= a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
	data1[14] 	= a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
	data1[15] 	= a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
	
	return this;
};

/**
 * get the matrix determinant
 * @method appendMatrix
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Number} the matrix determinant
 **/
Matrix4x4.prototype.determinant = function() 
{
		var data = this.data;
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = data[0], a01 = data[1], a02 = data[2], a03 = data[3];
        var a10 = data[4], a11 = data[5], a12 = data[6], a13 = data[7];
        var a20 = data[8], a21 = data[9], a22 = data[10], a23 = data[11];
        var a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];

        return  ( 		a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
                        a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
                        a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
                        a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
                        a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
                        a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33 	);
};

/**
 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
 * @method identity
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.identity = function()
{
	this.init( 1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1 );
	return this;
};

/**
 * Inverts the matrix, causing it to perform the opposite transformation.
 * @method invert
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.invert = function() 
{
	var data = this.data;
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = data[0], a01 = data[1], a02 = data[2], a03 = data[3];
	var a10 = data[4], a11 = data[5], a12 = data[6], a13 = data[7];
	var a20 = data[8], a21 = data[9], a22 = data[10], a23 = data[11];
	var a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];
	
	var b00 = a00*a11 - a01*a10;
	var b01 = a00*a12 - a02*a10;
	var b02 = a00*a13 - a03*a10;
	var b03 = a01*a12 - a02*a11;
	var b04 = a01*a13 - a03*a11;
	var b05 = a02*a13 - a03*a12;
	var b06 = a20*a31 - a21*a30;
	var b07 = a20*a32 - a22*a30;
	var b08 = a20*a33 - a23*a30;
	var b09 = a21*a32 - a22*a31;
	var b10 = a21*a33 - a23*a31;
	var b11 = a22*a33 - a23*a32;
	
	// Calculate the determinant (inlined to avoid double-caching)
	var d = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;
	var id = 1/d;
	
	data[0] = (a11*b11 - a12*b10 + a13*b09)*id;
	data[1] = (-a01*b11 + a02*b10 - a03*b09)*id;
	data[2] = (a31*b05 - a32*b04 + a33*b03)*id;
	data[3] = (-a21*b05 + a22*b04 - a23*b03)*id;
	data[4] = (-a10*b11 + a12*b08 - a13*b07)*id;
	data[5] = (a00*b11 - a02*b08 + a03*b07)*id;
	data[6] = (-a30*b05 + a32*b02 - a33*b01)*id;
	data[7] = (a20*b05 - a22*b02 + a23*b01)*id;
	data[8] = (a10*b10 - a11*b08 + a13*b06)*id;
	data[9] = (-a00*b10 + a01*b08 - a03*b06)*id;
	data[10] = (a30*b04 - a31*b02 + a33*b00)*id;
	data[11] = (-a20*b04 + a21*b02 - a23*b00)*id;
	data[12] = (-a10*b09 + a11*b07 - a12*b06)*id;
	data[13] = (a00*b09 - a01*b07 + a02*b06)*id;
	data[14] = (-a30*b03 + a31*b01 - a32*b00)*id;
	data[15] = (a20*b03 - a21*b01 + a22*b00)*id;
	
	return this;
};

/**
 * Transposes the matrix
 * @method transpose
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.transpose = function() 
{		
	// Cache the matrix values (makes for huge speed increases!)
	var data = this.data;
	
	var a00 = data[0], a01 = data[1], a02 = data[2], a03 = data[3];
	var a10 = data[4], a11 = data[5], a12 = data[6], a13 = data[7];
	var a20 = data[8], a21 = data[9], a22 = data[10], a23 = data[11];
	var a30 = data[12], a31 = data[13], a32 = data[14], a33 = data[15];

	data[0] = a00;
	data[1] = a10;
	data[2] = a20;
	data[3] = a30;
	data[4] = a01;
	data[5] = a11;
	data[6] = a21;
	data[7] = a31;
	data[8] = a02;
	data[9] = a12;
	data[10] = a22;
	data[11] = a32;
	data[12] = a03;
	data[13] = a13;
	data[14] = a23;
	data[15] = a33;
	
	return this;
};

/**
 * Sets the matrix frustum
 * @method frustum
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.frustum = function(left, right, bottom, top, near, far, dest) 
{
	var data = this.data;
	var temp1 = 2 * near;
	var temp2 = right - left;
	var temp3 = top - bottom;
	var temp4 = far - near;
	
	data[0] = temp1 / temp2;
	data[1] = 0;
	data[2] = 0;
	data[3] = 0;
	data[4] = 0;
	data[5] = temp1 / temp3;
	data[6] = 0;
	data[7] = 0;
	data[8] = (right + left) / temp2;
	data[9] = (top + bottom) / temp3;
	data[10] = (-far - near) / temp4;
	data[11] = -1;
	data[12] = 0;
	data[13] = 0;
	data[14] = (-temp1 * far) / temp4;
	data[15] = 0;
	return this;
};

/**
 * Applies a perspective on the current matrix
 * @method perspective
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.perspective = function(fovy, aspect, near, far) 
{
	var top = near * Math.tan(fovy * Math.PI / 360);
	var right = top * aspect;
	this.frustum(-right, right, -top, top, near, far);
	return this;
};

/**
 * Applies an orthographic projection on the current matrix
 * @method ortho
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {Matrix4x4} This matrix. Useful for chaining method calls.
 **/
Matrix4x4.prototype.ortho = function(left, right, bottom, top, near, far ) 
{
	var lr = (left - right);
	var tb = (top - bottom);
	var fn = (far - near);
	var data = this.data;
	data[0] = 2 / lr;
	data[1] = 0;
	data[2] = 0;
	data[3] = 0;
	data[4] = 0;
	data[5] = 2 / tb;
	data[6] = 0;
	data[7] = 0;
	data[8] = 0;
	data[9] = 0;
	data[10] = -2 / fn;
	data[11] = 0;
	data[12] = (left + right) / lr;
	data[13] = (top + bottom) / tb;
	data[14] = (far + near) / fn;
	data[15] = 1;
	
	return this;
};

/**
 * Returns a string representation of this object.
 * @method toString
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @return {String} a string representation of the instance.
 **/
Matrix4x4.prototype.str = function() 
{
	var data = this.data;
	return '[\n' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + data[3] + 
			'\n, '+ data[4] + ', ' + data[5] + ', ' + data[6] + ', ' + data[7] + 
			'\n, '+ data[8] + ', ' + data[9] + ', ' + data[10] + ', ' + data[11] + 
			'\n, '+ data[12] + ', ' + data[13] + ', ' + data[14] + ', ' + data[15] + ']';
};


/**
 * Transforms a Point3D according to this matrix.
 * @method transformPoint3D
 * @memberOf tomahawk_ns.Matrix4x4.prototype
 * @param {tomahawk_ns.Point3D}
 * @return {tomahawk_ns.Point3D}
 **/
Matrix4x4.prototype.transformPoint3D = function(point3D)
{	
	//var x = point3D.x, y = point3D.y, z = point3D.z;
	//var m = this.data;
    //point3D.x = m[0] * x + m[4] * y + m[8] * z + m[12];
    //point3D.y = m[1] * x + m[5] * y + m[9] * z + m[13];
    //point3D.z = m[2] * x + m[6] * y + m[10] * z + m[14];
	
	var mat1 = new tomahawk_ns.Matrix4x4();
	mat1.translate(point3D.x,point3D.y,point3D.z).prependMatrix(this);
	
	point3D.x = mat1.data[3];
	point3D.y = mat1.data[7];
	point3D.z = mat1.data[11];
	return point3D;
};

/**
 * Converts the "mat" matrix into a Matrix2D
 * @method toMatrix2D
 * @memberOf tomahawk_ns.Matrix4x4
 * @param {tomahawk_ns.Matrix4x4} mat the matrix you want to convert
 * @return {tomahawk_ns.Matrix2D}
 **/
Matrix4x4.toMatrix2D = function(mat)
{
	var matrix2D = new tomahawk_ns.Matrix2D();
	matrix2D.a = mat.data[0];
	matrix2D.b = mat.data[4];
	matrix2D.c = mat.data[1];
	matrix2D.d = mat.data[5];
	matrix2D.tx = mat.data[3];
	matrix2D.ty = mat.data[7];
	
	return matrix2D;
};

/**
 * Converts the "mat2d" matrix into a Matrix4x4
 * @method toMatrix4x4
 * @memberOf tomahawk_ns.Matrix4x4
 * @param {tomahawk_ns.Matrix2D} mat the matrix you want to convert
 * @return {tomahawk_ns.Matrix4x4}
 **/
Matrix4x4.toMatrix4x4 = function(mat2d)
{
	var mat = new tomahawk_ns.Matrix4x4();
	mat.data[0] = mat2d.a;
	mat.data[4] = mat2d.b;
	mat.data[1] = mat2d.c;
	mat.data[5] = mat2d.d;
	mat.data[3] = mat2d.tx;
	mat.data[7] = mat2d.ty;
	
	return mat;
};



Matrix4x4._getMatrixPattern = function( p_type )
{
	var c = Matrix4x4._cos[0];
	var s = Matrix4x4._sin[0];
	var sx = 1;
	var sy = 1;
	var sz = 1;
	var tx = 0;
	var ty = 0;
	var tz = 0;
	var mat = new Matrix4x4();
	
	switch( p_type )
	{
		case "translate":
			mat.init (	
							1, 	0, 	0, 	tx,
							0, 	1, 	0, 	ty,
							0, 	0, 	1, 	tz,
							0, 	0, 	0, 	1
					);
			break;
			
		case "scale":
			mat.init( 
							sx, 0, 	0, 	0,
							0, 	sy, 0, 	0,
							0, 	0, 	sz, 0,
							0, 	0, 	0, 	1
					);
			break;
			
		case "rotX":
			mat.init(
							1, 	0, 	0, 	0,
							0, 	c, -s, 	0,
							0, 	s, 	c, 	0,
							0, 	0, 	0, 	1
					);
			break;
			
		case "rotY":
			mat.init(
							c, 0, -s,0,
							0, 1, 0, 0,
							s, 0, c, 0,
							0, 0, 0, 1
						);
					
				break;
			
		case "rotZ":
			mat.init(
						c, 	-s, 0, 	0,
						s, 	c, 	0, 	0,
						0, 	0, 	1, 	0,
						0, 	0, 	0, 	1
					);
			break;
	}
	
	return mat;
};


Matrix4x4._cos = new Array();
Matrix4x4._sin = new Array();
Matrix4x4._tan = new Array();

Matrix4x4.TO_RADIANS = Math.PI / 180;
Matrix4x4.TO_DEGREES = 180 / Math.PI;


Matrix4x4.init = function()
{
	var i = 0;
	for( i = 0; i < 360; i++ )
	{
		Matrix4x4._cos[i] = Math.cos( i * Matrix4x4.TO_RADIANS );
		Matrix4x4._sin[i] = Math.sin( i * Matrix4x4.TO_RADIANS );
		Matrix4x4._tan[i] = Math.tan( i * Matrix4x4.TO_RADIANS );
	}
};

Matrix4x4.init();

Matrix4x4._ROTATION_X_MATRIX 	= Matrix4x4._getMatrixPattern("rotX");
Matrix4x4._ROTATION_Y_MATRIX 	= Matrix4x4._getMatrixPattern("rotY");
Matrix4x4._ROTATION_Z_MATRIX 	= Matrix4x4._getMatrixPattern("rotZ");
Matrix4x4._TRANSLATE_MATRIX 	= Matrix4x4._getMatrixPattern("translate");
Matrix4x4._SCALE_MATRIX			= Matrix4x4._getMatrixPattern("scale");
Matrix4x4._instance				= new Matrix4x4();

tomahawk_ns.Matrix4x4 			= Matrix4x4;
	
})();




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
	 * @class Point
	 * @description Represents a basic 2d point
	 * @memberOf tomahawk_ns
	 * @param {Number} x the x value of the point on the x axis
	 * @param {Number} y the y value of the point on the y axis
	 * @constructor
	 **/
	function Point(x,y)
	{
		this.x = x, this.y = y
	}
	
	Tomahawk.registerClass( Point, "Point" );
	
	/**
	* @member {Number} x the x position of  the point
	* @memberOf tomahawk_ns.Point.prototype
	**/
	Point.prototype.x = 0;
	/**
	* @member {Number} y the y position of  the point
	* @memberOf tomahawk_ns.Point.prototype
	**/
	Point.prototype.y = 0;
	
	
	/**
	* @method distanceBetween
	* @description returns a distance between two points
	* @memberOf tomahawk_ns.Point
	* @param {tomahawk_ns.Point} pointA
	* @param {tomahawk_ns.Point} pointB
	* @returns {Number}
	**/
	Point.distanceBetween = function(pointA, pointB)
	{
		var distX = ( pointB.x - pointA.x ) * ( pointB.x - pointA.x );
		var distY = ( pointB.y - pointA.y ) * ( pointB.y - pointA.y );
		var segLength = Math.sqrt( distX + distY );  
		return segLength;
	};
	

	
	tomahawk_ns.Point = Point;
})();



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
	 * @class Point3D
	 * @memberOf tomahawk_ns
	 * @description a basic 3D point
	 * @constructor
	 * @param {Number} x the value on the x axis
	 * @param {Number} y the value on the y axis
	 * @param {Number} z the value on the z axis
	 **/
	function Point3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Point3D, "Point3D" );
	
	/**
	* @member x
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the x axis.
	**/
	Point3D.prototype.x = 0;
	/**
	* @member y
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the y axis.
	**/
	Point3D.prototype.y = 0;
	/**
	* @member z
	* @memberOf tomahawk_ns.Point3D.prototype
	* @type {Number}
	* @description the value on the z axis.
	**/
	Point3D.prototype.z = 0;
	
	
	tomahawk_ns.Point3D = Point3D;
})();



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
	 * @class Rectangle
	 * @memberOf tomahawk_ns
	 * @description Represents a rectangle
	 * @constructor
	 **/
	function Rectangle(){}
	
	Tomahawk.registerClass(Rectangle,"Rectangle");

	/**
	* @member x
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.x 		= 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.y 		= 0;
	
	/**
	* @member width
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description the width of the rectangle, in pixels.
	**/
	Rectangle.prototype.width 	= 0;
	
	/**
	* @member height
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description the height of the rectangle, in pixels.
	**/
	Rectangle.prototype.height 	= 0;
	
	/**
	* @member left
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The x coordinate of the top-left corner of the rectangle.
	**/
	Rectangle.prototype.left 	= 0;
	
	/**
	* @member right
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The sum of the x and width properties.
	**/
	Rectangle.prototype.right 	= 0;
	
	/**
	* @member top
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The y coordinate of the top-left corner of the rectangle.
	**/
	
	Rectangle.prototype.top 	= 0;
	/**
	* @member bottom
	* @memberOf tomahawk_ns.Rectangle.prototype
	* @type {Number}
	* @description The sum of the y and height properties.
	**/
	Rectangle.prototype.bottom 	= 0;

	tomahawk_ns.Rectangle = Rectangle;

})();



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
	 * @class Vector3D
	 * @memberOf tomahawk_ns
	 * @description The Vector3D class represents a point or a location in the three-dimensional space using the Cartesian coordinates x, y, and z. As in a two-dimensional space, the x property represents the horizontal axis and the y property represents the vertical axis. In three-dimensional space, the z property represents depth.
	 * @constructor
	 **/
	function Vector3D(x,y,z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	Tomahawk.registerClass( Vector3D, "Vector3D" );
	
	/**
	* @member x
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The first element of a Vector3D object, such as the x coordinate of a point in the three-dimensional space.
	**/
	Vector3D.prototype.x = 0;
	
	/**
	* @member y
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The second element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
	**/
	Vector3D.prototype.y = 0;
	
	/**
	* @member z
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The third element of a Vector3D object, such as the z coordinate of a point in three-dimensional space.
	**/
	Vector3D.prototype.z = 0;
	
	/**
	* @member w
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @type {Number}
	* @description The fourth element of a Vector3D object (in addition to the x, y, and z properties) can hold data such as the angle of rotation.
	**/
	Vector3D.prototype.w = 0;
	
	/**
	* @method crossProduct
	* @memberOf tomahawk_ns.Vector3D.prototype
	* @param {tomahawk_ns.Vector3D} vector A second Vector3D object.
	* @returns {tomahawk_ns.Vector3D} This Vector3D. Useful for chaining method calls.
	* @description Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another Vector3D object.
	**/
	Vector3D.prototype.crossProduct = function(vector)
	{
		var x = this.y * vector.z - this.z * vector.y;
		var y = this.z * vector.x - this.x * vector.z;
		var z = this.x * vector.y - this.y * vector.x;
		
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	};
	
	tomahawk_ns.Vector3D = Vector3D;
	
	
})();



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
	 * @class Font
	 * @memberOf tomahawk_ns
	 * @description The Font class is currently useful only to find out information about fonts; you cannot alter a font by using this class. You cannot use the Font class to load external fonts.
	 * @constructor
	 **/
	function Font(fontName)
	{
		this.name = fontName;
		this.sizes = new Object();
	}
		
	/**
	* @member name
	* @memberOf tomahawk_ns.Font.prototype
	* @type {string}
	* @description the font name
	**/
	Font.prototype.name = null;
	
	/**
	* @member bold
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Boolean}
	* @description defines if the font is bold or not.
	**/
	Font.prototype.bold = false;
	
	/**
	* @member italic
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Boolean}
	* @description defines if the font is in italic or not.
	**/
	Font.prototype.italic = false;
	
	/**
	* @protected
	* @member baseSize
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description the base size of the font, used internally to measure text.
	**/
	Font.prototype.baseSize = 60;
	
	/**
	* @protected
	* @member sizes
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Object}
	* @description An object that stores all the sizes of each character in the corresponding font.
	**/
	Font.prototype.sizes = null;
		
	/**
	* @member maxWidth
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description max char width for this font
	**/
	Font.prototype.maxWidth = 0;
	
	/**
	* @member maxHeight
	* @memberOf tomahawk_ns.Font.prototype
	* @type {Number}
	* @description max char height for this font
	**/
	Font.prototype.maxHeight = 0;
	
	
	/**
	* @method addFont
	* @description create and register a new Font object, you have to specify a 'valid' font name, Arial for example.
	* @memberOf tomahawk_ns.Font
	* @param {string} fontName the font name.
	**/
	Font.addFont = function(fontName, fontURL)
	{
		var font = new tomahawk_ns.Font(fontName);
		tomahawk_ns.Font._fonts[fontName] = font;
	};	
	
	/**
	* @method getFont
	* @description get an instance of Font according to the fontName passed in param, you have to specify a 'valid' font name, Arial for example. If there's no instance of {tomahawk_ns.Font} who matches the fontName, a regular one is automatically created.
	* @memberOf tomahawk_ns.Font
	* @param {string} fontName the font name
	* @returns {tomahawk_ns.Font}
	**/
	Font.getFont = function(fontName)
	{
		if( !tomahawk_ns.Font._fonts[fontName])
		{
			tomahawk_ns.Font.addFont(fontName);
		}
		
		return tomahawk_ns.Font._fonts[fontName];
	};
	
	/**
	* @method measureText
	* @description calculate the width and the height of the text passed in param, for the font size passed in param.
	* @memberOf tomahawk_ns.Font.prototype
	* @param {string} text the text you want to measure
	* @param {Numbr} size the fontSize of the text
	* @returns {Object} an object with 'width' and 'height' properties
	**/
	Font.prototype.measureText = function(text, size)
	{
		var div = Font._div;
		var width = 0
		var height = 0;
		var obj = new Object();
		var result = new Object();
		var ratio = size / this.baseSize;
		
		if( this.sizes[text] == undefined )
		{	
			div.style.position = 'absolute';
			div.style.top = '100px';
			div.style.left = '-1000px';
			div.style.width = 'auto';
			div.style.fontFamily = this.name;
			div.style.fontWeight = ( this.bold == true ) ? 'bold' : 'normal';
			div.style.fontStyle = ( this.italic == true ) ? 'italic' : 'normal';
			div.style.fontSize = this.baseSize + 'px';
			
			if( !div.parentNode )
				document.body.appendChild(div);
		
			div.innerHTML = text;
			
			width = div.offsetWidth;
			height = div.offsetHeight;
			
			this.maxWidth = ( width > this.maxWidth ) ? width : this.maxWidth;
			this.maxHeight = ( height > this.maxHeight ) ? height : this.maxHeight;
			
			document.body.removeChild(div);
		
			obj.width = parseInt(width);
			obj.height = parseInt(height);
			
			this.sizes[text] = obj;
		}
			
		result.width = parseInt(this.sizes[text].width * ratio);
		result.height = parseInt(this.sizes[text].height * ratio);
		
		return result;
	};

	Font._div = document.createElement("div");
	Font._style = document.createElement("style");
	Font._fonts = new Object();
	
	tomahawk_ns.Font = Font;
})();



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
	 * @class InputTextField
	 * @memberOf tomahawk_ns
	 * @description The InputTextField class is used to create display objects for text display,selection and input.
	 * @constructor
	 * @augments tomahawk_ns.SelectableTextField
	 **/
	function InputTextField()
	{
		tomahawk_ns.SelectableTextField.apply(this);
		tomahawk_ns.Keyboard.getInstance().addEventListener( tomahawk_ns.KeyEvent.KEY_UP, this, this._keyHandler );
	}

	Tomahawk.registerClass(InputTextField,"InputTextField");
	Tomahawk.extend("InputTextField","SelectableTextField");

	InputTextField.prototype.setFocus = function(value)
	{
		tomahawk_ns.SelectableTextField.prototype.setFocus.apply(this,[value]);
	};
	
	InputTextField.prototype._keyHandler = function(event)
	{
		if( this.getFocus() == false )
			return;
		
		event.nativeEvent.preventDefault();
		event.nativeEvent.stopImmediatePropagation();
		event.nativeEvent.stopPropagation();
		
		var range = this.getSelectionRange();
			
		if( this.isSelected() == true && event.keyCode != tomahawk_ns.Keyboard.LEFT && event.keyCode != tomahawk_ns.Keyboard.RIGHT )
		{
			this.removeTextBetween( range.start, range.end );
		}
		
		if( event.keyCode == tomahawk_ns.Keyboard.BACKSPACE )
		{
			this.removeCharAt(this.getCurrentIndex());
		}
		else if( event.keyCode == tomahawk_ns.Keyboard.SUPPR )
		{
			this.removeCharAt(this.getCurrentIndex() + 1);
		}
		else if( event.keyCode == tomahawk_ns.Keyboard.LEFT || event.keyCode == tomahawk_ns.Keyboard.RIGHT)
		{
			var step = ( event.keyCode == tomahawk_ns.Keyboard.LEFT ) ? -1 : 1;
			this.setCurrentIndex(this.getCurrentIndex()+step);
		}
		else if( event.isCharacter == true )
		{
			var newline = false;
			 //special select all
			if( event.keyCode == tomahawk_ns.Keyboard.A && event.ctrlKey )
			{
				this.selectAll();
				return;
			}
			
			var text = event.value;
			
			if( event.keyCode == tomahawk_ns.Keyboard.V && event.ctrlKey )
			{
				text = window.prompt ("Copy to clipboard: Ctrl+C, Enter", "");
				this.addTextAt(text,this.getCurrentIndex() + 1);
			}
			else
			{
				if( event.keyCode == tomahawk_ns.Keyboard.ENTER )
				{
					text = "\n";
				}
				
				this.addCharAt(text,this.getCurrentIndex() + 1);
			}
		}
	};

	tomahawk_ns.InputTextField = InputTextField;
})();



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
	 * @class Letter
	 * @memberOf tomahawk_ns
	 * @description A Letter object is a DisplayObject that displays a Letter according to his format.
	 * @augments tomahawk_ns.DisplayObject
	 * @constructor
	 **/
	function Letter(value)
	{
		tomahawk_ns.DisplayObject.apply(this);		
		Letter._metricsContext = Letter._metricsContext || document.createElement("canvas").getContext("2d");
		this.setTextFormat( new tomahawk_ns.TextFormat() );
		this.value = ( value == undefined ) ? "" : value;
	}

	Tomahawk.registerClass(Letter,"Letter");
	Tomahawk.extend("Letter","DisplayObject");

	/**
	* @member newline
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Boolean}
	* @description Defines if the character is a newline character
	**/
	Letter.prototype.newline 			= false;
	/**
	* @member value
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {string}
	* @description The value of the character (a or b or ... )
	**/
	Letter.prototype.value 				= "";
	/**
	* @member format
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {tomahawk_ns.TextFormat}
	* @description An instance of TextFormat.
	**/
	Letter.prototype.format 			= null;
	/**
	* @member index
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {tNumber}
	* @description The position of the letter in the TextField
	**/
	Letter.prototype.index 				= 0;
	/**
	* @member textWidth
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Number}
	* @description The actual width of this letter
	**/
	Letter.prototype.textWidth 			= 0;	
	/**
	* @member textHeight
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Number}
	* @description The actual height of this letter
	**/
	Letter.prototype.textHeight 		= 0;	
	/**
	* @member selected
	* @memberOf tomahawk_ns.Letter.prototype
	* @type {Boolean}
	* @description Defines if the letter is selected or not
	**/
	Letter.prototype.selected			= false;
	Letter._metricsContext				= null;
	
	/**
	* @method setTextFormat
	* @memberOf tomahawk_ns.Letter.prototype
	* @description Sets the letter format
	* @param {tomahawk_ns.TextFormat} value the instance of TextFormat
	**/
	Letter.prototype.setTextFormat = function(value)
	{
		this.format = value;
		this.updateMetrics();
	};

	/**
	* @method updateMetrics
	* @memberOf tomahawk_ns.Letter.prototype
	* @description Update all the measure of the letter
	**/
	Letter.prototype.updateMetrics = function()
	{
		
		var context = Letter._metricsContext;
		var font = tomahawk_ns.Font.getFont( this.format.font );
		var measure = font.measureText(this.value, this.format.size);
		
		context.save();
		
		if( this.value == " " )
		{
			this.format.updateContext(context);
			measure.width = context.measureText(" ").width;
		}
		
		this.textWidth = measure.width;
		this.textHeight = measure.height;
		this.width = this.textWidth;
		this.height = this.textHeight;
		
		context.restore();
		// TODO
		
		//var context = Letter._metricsContext;
		//context.save();
		//
		//this.format.updateContext(context);
		//this.textHeight = ( context.measureText('M').width );
		//this.textWidth = context.measureText(this.value).width;
		//this.width = this.textWidth;
		//this.height = this.textHeight * 1.4;
		//
		//context.restore();
	};

	/**
	* @method draws the DisplayObject on the stage
	* @memberOf tomahawk_ns.Letter.prototype
	* @description Draws the display object into the specified context
	* @param {CanvasRenderingContext2D} the context of the canvas on which you want to draw the DisplayObject
	**/
	Letter.prototype.draw = function(context)
	{
		if( this.selected == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.format.backgroundSelectedColor;
			context.fillRect(0, 0, this.width, this.height);
			context.fill();
			context.restore();
		}
		
		if( this.format.textBorder == true )
		{
			context.beginPath();
			this.format.updateBorderContext(context);
			context.strokeText(this.value,this.format.textBorderOffsetX,this.format.textBorderOffsetY);
			context.closePath();
		}
		
	
		this.format.updateContext(context);
		
		
		context.beginPath();
		context.fillText(this.value,0,0);
		context.closePath();
		
		if( this.format.underline == true )
		{
			context.save();
			context.beginPath();
			context.moveTo(0,this.textHeight + 2);
			context.lineTo( this.textWidth,this.textHeight + 2);
			context.stroke();
			context.restore();
		}	
	};

	
	/**
	* @method clone
	* @memberOf tomahawk_ns.Letter.prototype
	* @description returns a clone of this Letter
	* @returns {tomahawk_ns.Letter} a new Letter object
	**/
	Letter.prototype.clone = function()
	{
		var letter = new tomahawk_ns.Letter(this.value);
		letter.format = this.format.clone();
		letter.index = this.index;
		letter.row = this.row;
		letter.textWidth = this.textWidth;
		letter.textHeight = this.textHeight;
		letter.height = this.height;
		letter.width = this.width;
		letter.selected = this.selected;
		
		return letter;
	};
	
	tomahawk_ns.Letter = Letter;
})();



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
	 * @class SelectableTextField
	 * @memberOf tomahawk_ns
	 * @description The SelectableTextField class is used to create display objects for text display and selection.
	 * @constructor
	 * @augments tomahawk_ns.TextField
	 **/
	function SelectableTextField()
	{
		tomahawk_ns.TextField.apply(this);
		this.mouseEnabled = true;
	}

	Tomahawk.registerClass(SelectableTextField,"SelectableTextField");
	Tomahawk.extend("SelectableTextField","TextField");

	SelectableTextField.prototype._ignoreNextClick = false;
	SelectableTextField.prototype._startPoint = null;
	SelectableTextField.prototype._down = false;

	SelectableTextField.prototype.getObjectUnder = function(x,y)
	{
		if( tomahawk_ns.DisplayObject.prototype.hitTest.apply(this,[x,y] ) )
			return this;
			
		return null;
	};

	SelectableTextField.prototype.setFocus = function(value)
	{
		tomahawk_ns.TextField.prototype.setFocus.apply(this,[value]);
		
		this.removeEventListener( tomahawk_ns.MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.CLICK, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
		this.removeEventListener( tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
		
		if( value == true )
		{
			this.addEventListener( tomahawk_ns.MouseEvent.DOUBLE_CLICK, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.CLICK, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.MOUSE_DOWN, this, this._mouseEventHandler );
			this.addEventListener( tomahawk_ns.MouseEvent.MOUSE_MOVE, this, this._mouseEventHandler, true );
		}
		
		this.unSelect();
	};
	
	SelectableTextField.prototype._selectCurrentWord = function()
	{
		this.unSelect();
		var word = this.getWordAt(this.getCurrentIndex());
		var start = -1;
		var end = -1;
		
		if( word != null )
		{			
			start = word.getStartIndex();
			end = word.getEndIndex();
		}
		
		this.selectBetween(start,end);
	};

	SelectableTextField.prototype._setIndexUnderMouse = function(x,y)
	{
		var pt = this.globalToLocal(x, y);
		var letters = this.getLettersIn(pt.x,pt.y,1,1);
		this.unSelect();
		
		if( letters.length > 0 )
		{
			this.setCurrentIndex( letters[0].index );
		}
	};

	SelectableTextField.prototype._mouseEventHandler = function(event)
	{
		if( event.type == tomahawk_ns.MouseEvent.DOUBLE_CLICK )
		{
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._selectCurrentWord();
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_UP )
		{
			this._down = false;
		}
		
		if( event.type == tomahawk_ns.MouseEvent.CLICK )
		{
			this._down = false;
			
			if( this._ignoreNextClick == true )
			{
				this._ignoreNextClick = false;
			}
			else
			{
				this._setIndexUnderMouse(event.stageX,event.stageY);
			}
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_MOVE && this._down == true && this._startPoint != null)
		{
			var endPoint = this.globalToLocal(event.stageX, event.stageY);
			var x = ( endPoint.x < this._startPoint.x ) ? endPoint.x : this._startPoint.x;
			var x2 = ( endPoint.x < this._startPoint.x ) ? this._startPoint.x : endPoint.x;
			var y = ( endPoint.y < this._startPoint.y ) ? endPoint.y : this._startPoint.y;
			var y2 = ( endPoint.y < this._startPoint.y ) ? this._startPoint.y : endPoint.y;
			var width = x2 - x;
			var height = y2 - y;
			
			this.selectInto(x,y,width,height);
			this._ignoreNextClick = true;
		}
		
		if( event.type == tomahawk_ns.MouseEvent.MOUSE_DOWN)
		{
			this._down = true;
			this._setIndexUnderMouse(event.stageX,event.stageY);
			this._startPoint = this.globalToLocal(event.stageX, event.stageY);
			return;
		}

	};

	/**
	* @method selectInto
	* @description Selects all the letters within the zone defined by the x,y,width,height parameters within the text field.
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} x the x position of the selection zone
	* @param {Number} y the y position of the selection zone
	* @param {Number} width the width of the selection zone
	* @param {Number} height the height of the selection zone
	**/
	SelectableTextField.prototype.selectInto = function(x,y,width,height)
	{
		var result = this.getLettersIn(x,y,width,height);
		var i = result.length;
		var letter = null;
		var start = -1;
		var end = -1;
		
		while( --i > -1 )
		{
			letter = result[i];
			start = ( start == -1 || letter.index < start ) ? letter.index : start;
			end = ( end == -1 || letter.index > end ) ? letter.index : end;
		}
		
		this.selectBetween(start,end);
	};

	/**
	* @description Returns an Array of letters that match the zone defined by the x,y,width,height parameters within the text field.
	* @method getLettersIn
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} x the x position of the selection zone
	* @param {Number} y the y position of the selection zone
	* @param {Number} width the width of the selection zone
	* @param {Number} height the height of the selection zone
	* @returns {Array} an Array of Letters objects
	**/
	SelectableTextField.prototype.getLettersIn = function(x,y,width,height)
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		var result = new Array();
		var word = null;
		var bounds = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			word = letter.parent;
			
			if( word == null )
				continue;
				
			if( 
				word.x > x + width ||
				word.x + word.width < x || 
				word.y + word.height < y || 
				word.y > y + height 
			)
			{
				continue;
			}
			
			bounds = letter.getBoundingRectIn(this);
			
			if( bounds.left > x + width ||
				bounds.right < x ||
				bounds.top > y + height ||
				bounds.bottom < y 
			)
			{
				continue;
			}
			
			result.push( letter );
		}
		
		return result;
	};

	/**
	* @method getSelectionRange
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @returns {Object} An object with "start" and "end" properties
	* @description Returns an object which defines the indexes between the text field is selected.
	**/
	SelectableTextField.prototype.getSelectionRange = function()
	{
		var start = -1;
		var end = -1;
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			if( letter.selected == true )
			{
				if( end == -1 )
				{
					end = i;
				}
				
				if( end > 0 )
				{
					start = i;
				}
			}
		}
		
		return {start: start, end: end};
	};

	/**
	* @method isSelected
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @returns {Boolean} true if selected, false it not.
	* @description Indicates wether a portion of the text is selected within the text field.
	**/
	SelectableTextField.prototype.isSelected = function()
	{
		var range =  this.getSelectionRange();
		return ( range.start >= 0 && range.end > range.start );
	};

	/**
	* @method selectAll
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @description Sets as selected all the text within the text field.
	**/
	SelectableTextField.prototype.selectAll = function()
	{
		this.selectBetween(0,this.getLetters().length);
	};

	/**
	* @method unSelect
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @description Removes all selection within the text field.
	**/
	SelectableTextField.prototype.unSelect = function()
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			
			if( letter.selected == true && letter.parent != null )
			{
				letter.parent.needRefresh = true;
			}
			
			letter.selected = false;
		}
		
		this._refreshNextFrame = true;
	};
	
	/**
	* @method selectBetween
	* @memberOf tomahawk_ns.SelectableTextField.prototype
	* @param {Number} startIndex The zero-based index value of the first character in the selection (for example, the first character is 0, the second character is 1, and so on).
	* @param {Number} endIndex  The zero-based index value of the last character in the selection.
	* @description Sets as selected the text designated by the index values of the first and last characters, which are specified with the beginIndex and endIndex parameters.
	**/
	SelectableTextField.prototype.selectBetween = function(startIndex, endIndex)
	{
		var letters = this.getLetters();
		var i = letters.length;
		var letter = null;
		
		while( --i > -1 )
		{
			letter = letters[i];
			
			if( i >= startIndex && i <= endIndex )
			{
				letter.selected = true;
				if( letter.parent != null )
					letter.parent.needRefresh = true;
			}
			else
			{
				if( letter.selected == true && letter.parent != null)
				{
					letter.parent.needRefresh = true;
				}
				letter.selected = false;
			}
		}
		
		this._refreshNextFrame = true;
	};

	
	tomahawk_ns.SelectableTextField = SelectableTextField;
})();




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
	 * @class TextField
	 * @memberOf tomahawk_ns
	 * @description The TextField class is used to create display objects for text display.
	 * @constructor
	 * @augments tomahawk_ns.DisplayObjectContainer
	 **/
	function TextField()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.defaultTextFormat = new tomahawk_ns.TextFormat();
		this.width = this.height = 100;
		this._letters = new Array();
		this._text = "";
	}

	Tomahawk.registerClass(TextField,"TextField");
	Tomahawk.extend("TextField","DisplayObjectContainer");

	/**
	* @member forceRefresh
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Forces the refresh of the TextField at every frame.
	**/
	TextField.prototype.forceRefresh		= false;		
	
	/**
	* @member defaultTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {tomahawk_ns.TextFormat}
	* @default null
	* @description Specifies the format applied to newly inserted text.
	**/
	TextField.prototype.defaultTextFormat 	= null;
	
	/**
	* @member currentIndex
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Number}
	* @default 0
	* @description The index of the insertion point (caret) position.
	**/
	TextField.prototype.currentIndex 		= 0;
	
	/**
	* @member background
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the text field has a background fill. If true, the text field has a background fill. If false, the text field has no background fill. Use the backgroundColor property to set the background color of a text field.
	**/
	TextField.prototype.background 			= false;
	
	/**
	* @member border
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @default false
	* @description Specifies whether the text field has a border. If true, the text field has a border. If false, the text field has no border. Use the borderColor property to set the border color.
	**/
	TextField.prototype.border 				= false;
	
	/**
	* @member padding
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Number}
	* @default 0
	* @description Specifies the internal padding of the text field. 
	**/
	TextField.prototype.padding 			= 0;
	
	/**
	* @member backgroundColor
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {string}
	* @description The color of the text field background.
	* @default "#ffffff"
	**/
	TextField.prototype.backgroundColor 	= "#ffffff";
	
	/**
	* @member borderColor
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {string}
	* @description The color of the text field border.
	* @default "#000000"
	**/
	TextField.prototype.borderColor 		= "#000000";
	
	/**
	* @member autoSize
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @description Specifies if the text field height will match the real text height.
	* @default false
	**/
	TextField.prototype.autoSize 			= false;
	
	/**
	* @member focusable
	* @memberOf tomahawk_ns.TextField.prototype
	* @type {Boolean}
	* @description Specifies if the current display object can have the focus or not.
	* @default true
	**/
	TextField.prototype.focusable			= true;
	
	
	TextField.prototype._focused 			= false;
	TextField.prototype._lastWidth 			= 0;
	TextField.prototype._refreshNextFrame 	= true;
	TextField.prototype._textAlign 			= "left";
	TextField.prototype._text 				= null;
	TextField.prototype._drawCursor	 		= false;
	TextField.prototype._drawCursorTime 	= 0;
	TextField.prototype._letters 			= null;
	
	
	/**
	* @property {String} ALIGN_LEFT left
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant aligns text to the left within the text field.
	**/
	TextField.ALIGN_LEFT 					= "left";

	/**
	* @property {String} ALIGN_CENTER center
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant centers the text in the text field.
	**/
	TextField.ALIGN_CENTER 					= "center";
	
	/**
	* @property {String} ALIGN_RIGHT right
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant aligns text to the right within the text field.
	**/
	TextField.ALIGN_RIGHT 					= "right";
	
	/**
	* @property {String} ALIGN_JUSTIFY justify
	* @memberOf tomahawk_ns.TextField
	* @type {string}
	* @description Constant justifies text within the text field.
	**/
	TextField.ALIGN_JUSTIFY 				= "justify";

	/**
	* @method getTextAlign
	* @description Returns the current text align
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {String} the current text align
	**/
	TextField.prototype.getTextAlign = function()
	{
		return this._textAlign;
	};
	
	/**
	* @method setTextAlign
	* @description Sets the current text align
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value the text align
	**/
	TextField.prototype.setTextAlign = function(value)
	{
		if( this._textAlign == value )
			return;
			
		this._textAlign = value;
		this._refreshNextFrame = true;
	};
	
	/**
	* @method setCurrentIndex
	* @description Sets the index of the insertion point (caret) position.
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the new index of the insertion point
	**/
	TextField.prototype.setCurrentIndex = function(index)
	{
		if( this.currentIndex == index )
			return;
			
		this.currentIndex = index;
		this._refreshNextFrame = true;
	};
	
	/**
	* @method getCurrentIndex
	* @description Returns the index of the insertion point (caret) position.
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Number} the index of the insertion point (caret) position
	**/
	TextField.prototype.getCurrentIndex = function()
	{
		return this.currentIndex;
	};
	
	/**
	* @method setFocus
	* @description Gives focus to the text field, specified by the value parameter. If value != true the current focus is removed.
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Boolean} value
	**/
	TextField.prototype.setFocus = function(value)
	{
		if( this._focused == value )
			return;
			
		this._focused = value;
		var type = ( this._focused == true ) ? tomahawk_ns.Event.FOCUSED : tomahawk_ns.Event.UNFOCUSED;
		var focusEvent = new tomahawk_ns.Event( type, true, true );
		this.dispatchEvent(focusEvent);
		
		if( this._focused == false )
		{
			this.setCurrentIndex(-1);
		}
		else
		{
			this.setCurrentIndex(0);
		}
	};

	/**
	* @method getFocus
	* @description Specifies whether the current text field has the focus 
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Boolean} the value of the current focus
	**/
	TextField.prototype.getFocus = function()
	{
		return this._focused;
	};

	/**
	* @method setTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @description Applies the text formatting that the format parameter specifies to the specified text in a text field.
	* @param {tomahawk_ns.TextFormat} format A TextFormat object that contains character and paragraph formatting information
	* @param {Number} startIndex an integer that specifies the zero-based index position specifying the first character of the desired range of text.
	* @param {Number} [endIndex=undefined] An integer that specifies the first character after the desired text span. As designed, if you specify startIndex and endIndex values, the text from beginIndex to endIndex-1 is updated.
	**/
	TextField.prototype.setTextFormat = function( format, startIndex, endIndex )
	{
		var end = ( endIndex == undefined ) ? startIndex : endIndex;
		var i = startIndex;
		var letter = null;
		var word = null;
		var currentWord = null;
		
		for( ; i <= end; i++ )
		{
			letter = this.getLetterAt(i);
			if( letter != null )
			{
				this._refreshNextFrame = true;
				letter.setTextFormat(format);
				if( letter.parent != null )
					letter.parent.needRefresh = true;
			}
		}
	};

	/**
	* @method getTextFormat
	* @memberOf tomahawk_ns.TextField.prototype
	* @description Returns a TextFormat object containing a copy of the text format of the character at the index position.
	* @param {Number} index An integer that specifies the location of a letter within the text field.
	* @returns {tomahawk_ns.TextFormat}
	**/
	TextField.prototype.getTextFormat = function(index)
	{
		var letter = this.getLetterAt(index);
		if( letter == null )
			return this.defaultTextFormat.clone();
			
		return letter.format.clone();
	};

	/**
	* @method getText
	* @description Returns a string that is the current text in the text field.
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {String} the current text in the text field
	**/
	TextField.prototype.getText = function()
	{
		return this._text;
	};

	/**
	* @description Set the current text of the text field specified by the "value" parameter
	* @method setText
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value the new text of the text field
	**/
	TextField.prototype.setText = function(value)
	{
		if( this._text == value )
			return;
			
		this._text = "";
		
		while( this.children.length > 0 )
			this.removeChildAt(0);
			
		this._letters = new Array();
			
		var i = 0;
		var max = value.length;
		
		for( i = 0; i < max; i++ )
		{
			this.addCharAt(value[i], i );
		}
	};

	/**
	* @description Returns all the letters objects of the text field
	* @method getLetters
	* @memberOf tomahawk_ns.TextField.prototype
	* @returns {Array} all the letters of the text field
	**/
	TextField.prototype.getLetters = function()
	{
		return this._letters;
	};

	/**
	* @description Returns the letter object at the index specified by the "index" parameter.
	* @method getLetterAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the index of the letter you want to retrieve
	* @returns {tomahawk_ns.Letter} A Letter object
	**/
	TextField.prototype.getLetterAt = function(index)
	{
		var letters = this.getLetters();
		return letters[index] || null;
	};
	
	/**
	* @description Returns the word object at the index specified by the "index" parameter within the text field
	* @method getLetterAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index the index
	* @returns {tomahawk_ns.Word} A Word object
	**/
	TextField.prototype.getWordAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var word = null;
		
		if( letter == null )
			return null;
			
		word = letter.parent;
		
		return word;
	};

	/**
	* @method addCharAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {String} value The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
	* @param {Number} index The index position to which the character is added.
	* @description Adds a character to this text field instance at the index specified by the index parameter The character is added at the index position specified. If you specify a currently occupied index position, the character that exists at that position and all higher positions are moved up one position in the text.
	**/
	TextField.prototype.addCharAt = function(value,index)
	{
		var wordIndex =  ( index == 0 ) ? 0 : index - 1 ;
		var letter = new tomahawk_ns.Letter();
		var previous = this.getLetterAt(index-1);
		var currentWord = this.getWordAt(wordIndex);
		var tab1 = this._letters.slice(0,index);
		var tab2 = this._letters.slice(index);
		
		//create letter
		isNewline = ( value == "\n" );
		letter.value = value;
		letter.newline = isNewline;
		letter.setTextFormat( ( previous == null ) ? this.defaultTextFormat.clone() : previous.format.clone() );
		
		//rebuild letters array
		tab1.push(letter);
		this._letters = tab1.concat(tab2);
		
		this.setCurrentIndex(index); //set current index
		this._refreshNextFrame = true; //refresh textfield at next frame
		this._text = this._text.substr(0,index) + value + this._text.substr(index); // rebuild text value
		
		if( currentWord == null )
		{
			currentWord = new tomahawk_ns.Word();
		}
		
		this.addChild(currentWord);
		currentWord.needRefresh = true;
		currentWord.addLetterAt(letter,index - currentWord.getStartIndex());
		
		this._resetLettersIndex(); // reset letters index
		this._cutWord(currentWord); // cut the word if necessary
	};
	
	/**
	* @method removeCharAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} index The index of the character to remove.
	* @returns {tomahawk_ns.Letter} The Letter instance that was removed.
	* @description Removes a character from the specified index position in the text of the text field.
	**/
	TextField.prototype.removeCharAt = function(index)
	{
		var letter = this.getLetterAt(index);
		var previous = this.getLetterAt(index-1);
		
		if( letter == null )
			return;
			
		var currentWord = letter.parent;
		
		this._letters.splice(index,1);
		this.setCurrentIndex(index-1);
		this._refreshNextFrame = true;
	
		//this._text = this._text.substr(0,index-1) + this._text.substr(index+1);
		this._text = this._text.substr(0,index) + this._text.substr(index+1);
		
		currentWord.removeLetterAt( index - currentWord.getStartIndex() );
		
		if( currentWord.getNumLetters() == 0 )
			this.removeChild(currentWord);
			
		this._resetLettersIndex();
	};

	/**
	* @description Adds the text specified by the "value" parameter at the index specified by the "index" parameter to the text field.
	* @method addTextAt
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {string} value the text you want to add
	* @param {string} index the index at which you want to insert your text
	**/
	TextField.prototype.addTextAt = function(value,index)
	{
		var i = value.length;
		while( --i > -1 )
		{
			this.addCharAt(value[i],index);
		}
		
		this.setCurrentIndex(index);
	};
	
	/**
	* @description Removes the text between the indexes specified by the "startIndex" and the "endIndex" parameters within the text field.
	* @method removeTextBetween
	* @memberOf tomahawk_ns.TextField.prototype
	* @param {Number} startIndex the index from which you want to remove the text
	* @param {Number} endIndex the index to which you want to remove the text
	**/
	TextField.prototype.removeTextBetween = function(startIndex,endIndex)
	{
		var i = this.getLetters().length;
		var letters = new Array();
		var letter = null;
		
		while( --i > -1 )
		{
			if( i >= startIndex && i <= endIndex )
			{
				letters.push( this.getLetterAt(i) );
			}
		}
		
		while( letters.length > 0 )
		{
			letter = letters.shift();
			this.removeCharAt(letter.index);
		}
	};
	
	
	
	TextField.prototype.getBoundingRectIn = function(spaceCoordinates)
	{
		var width = this.width;
		var height = this.height;
		var bounds = tomahawk_ns.DisplayObjectContainer.prototype.getBoundingRectIn.apply(this,[spaceCoordinates]);
		
		if( bounds.width < width ) 
			bounds.width = width;
			
		if( bounds.height < height ) 
			bounds.height = height;
			
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		return bounds;
	};	
	
	TextField.prototype.updateBounds = function()
	{
		var width = this.width;
		var height = this.height;
		tomahawk_ns.DisplayObjectContainer.prototype.updateBounds.apply(this);
		
		var bounds = this.bounds;
		
		if( bounds.width < width ) 
			bounds.width = width;
			
		if( bounds.height < height ) 
			bounds.height = height;
			
		bounds.right = bounds.left + bounds.width;
		bounds.bottom = bounds.top + bounds.height;
		
		this.width = bounds.width;
		this.height = bounds.height;
	};
	
	TextField.prototype.draw = function(context)
	{
		var currentIndexLetter = this.getLetterAt(this.currentIndex);
		var bounds = null;
		var time = null;
		
		if( this._lastWidth != this.width || this._refreshNextFrame == true )
		{
			this._refresh();	
			this._lastWidth = this.width;
			this._refreshNextFrame = false;
		}
		
		if( this.background == true )
		{
			context.save();
			context.beginPath();
			context.fillStyle = this.backgroundColor;
			context.fillRect(0,0,this.width,this.height);
			context.fill();
			context.restore();
		}
		
		if( this.border == true )
		{
			context.save();
			context.beginPath();
			context.strokeStyle = this.borderColor;
			context.moveTo(0,0);
			context.lineTo(this.width,0);
			context.lineTo(this.width,this.height);
			context.lineTo( 0,this.height);
			context.lineTo(0,0);
			context.stroke();
			context.restore();
		}
		
		tomahawk_ns.DisplayObjectContainer.prototype.draw.apply(this, [context]);		
		
		if( this._focused == true)
		{
			time = new Date().getTime();
			
			if( currentIndexLetter != null )
			{
				bounds = currentIndexLetter.getBoundingRectIn(this);
			}
			else
			{
				bounds = new tomahawk_ns.Rectangle();
				bounds.left = bounds.x = 0;
				bounds.width = bounds.right = 5;
				bounds.top = bounds.y = 0;
				bounds.bottom = bounds.height = 10;
			}
			
			if( time - this._drawCursorTime > 500 )
			{
				this._drawCursor = ( this._drawCursor == true ) ? false: true;
				this._drawCursorTime = time;
			}
			
			if( this._drawCursor == true )
			{
				context.save();
				context.beginPath();
				context.strokeStyle = "black";
				context.moveTo(	bounds.right,bounds.top);
				context.lineTo(	bounds.right,bounds.bottom );
				context.stroke();
				context.restore();
			}
		}
	};


	TextField.prototype._cutWord = function(word)
	{
		var letters = 0;
		var i = 0;
		var nextWord = null;
		var cut = true;
		var currentLetter = null;
		
		while( cut == true )
		{
			cut = false;
			letters = word.getLetters();
			i = letters.length;
			
			while( --i > -1 )
			{
				currentLetter = letters[i];
				if( ( currentLetter.value == " " || currentLetter.newline == true ) && i > 0 )
				{
					nextWord = word.cut(i);
					cut = true;
					this.addChild( nextWord );
					
					nextWord.newline = currentLetter.newline;
					nextWord.needRefresh = word.needRefresh = true;
					break;
				}
			}
		}
		
		if( word.text.length == 0 )
			this.removeChild(word);
	};

	TextField.prototype._resetLettersIndex = function(start)
	{
		var letters = this.getLetters();
		var i = 0;
		var max = letters.length;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = letters[i];
			currentLetter.index = i;
		}
	};
	
	TextField.prototype._sortWords = function(a,b)
	{
		return ( a.getStartIndex() < b.getStartIndex() ) ? -1 : 1;
	};
	
	TextField.prototype._refresh = function()
	{
		var rowIndex = 0;
		var currentRow = new Array();
		var rowWord = null;
		var word = null;
		var i = 0;
		var max = this.children.length;
		var lineY = this.padding;
		var lineX = this.padding;
		var lineHeight = 0;
		var lineWidth = 0;
		var maxWidth = this.padding + ( this.width - this.padding * 2 );
		var textWidth = 0;
		
		this.children.sort( this._sortWords );
		
		for( i = 0; i < max; i++ )
		{		
			word = this.children[i];
			word.index = i;
			word.forceRefresh = this.forceRefresh;
			word.refresh();
			lineHeight = ( lineHeight < word.height ) ? word.height : lineHeight;
			
			if( i != 0 && ( lineWidth + word.width > maxWidth || word.newline == true ) )
			{
				lineY += lineHeight;
				this._alignRow( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight );
			
				rowIndex++;
				lineWidth = 0;
				currentRow = new Array();
				lineHeight = word.height;
			}
			
			lineWidth += word.width;
			currentRow.push(word);
			
			if( i == max - 1 )
			{
				lineY += lineHeight;
				this._alignRow( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight );
			}
		}
		
		if( this.autoSize == true && word != null )
		{
			this.height = word.y + ( word.height );
		}
		
		this._lastWidth = this.width;
	};
	
	TextField.prototype._alignRow = function( currentRow, rowIndex, lineX, lineY, lineWidth, lineHeight )
	{
		if( currentRow.length == 0 )
			return;
			
		var maxWidth = this.width - ( this.padding * 2 );
		var word = currentRow[0];
		var offsetX = lineX;
		var marginLeft = 0;
		var textAlign = this._textAlign;
		var i = 0;
		var max = currentRow.length;
		var currentX = 0;
				
		if( textAlign == tomahawk_ns.TextField.ALIGN_LEFT )
		{
			offsetX = lineX;
		}
		
		if( textAlign == tomahawk_ns.TextField.ALIGN_CENTER )
		{
			offsetX = lineX + ( ( maxWidth - lineWidth ) * 0.5 );
		}
			
		if( textAlign == tomahawk_ns.TextField.ALIGN_RIGHT )
		{
			offsetX = lineX + ( maxWidth - lineWidth );
		}
		
		// on ne justifie que si la ligne est occupée à minimum 70% sinon c'est aligné à gauche
		if( textAlign == tomahawk_ns.TextField.ALIGN_JUSTIFY && lineWidth >= ( maxWidth * 0.7 ) )
		{
			offsetX = lineX;
			marginLeft = ( maxWidth - lineWidth ) / ( currentRow.length - 1 );
		}
		
		currentX = offsetX;
		
		for( i = 0; i < max; i++ )
		{
			word = currentRow[i];
			word.y = lineY - word.height;
			word.x = currentX;
			
			currentX += word.width + marginLeft;
		}
	};
	

	tomahawk_ns.TextField = TextField;
})();




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
	 * @class TextFormat
	 * @memberOf tomahawk_ns
	 * @description ....
	 * @constructor
	 **/
	function TextFormat(){}
	Tomahawk.registerClass( TextFormat, "TextFormat" );

	TextFormat.prototype.textColor = "black";
	TextFormat.prototype.underline = false;
	TextFormat.prototype.backgroundSelectedColor = "blue";
	TextFormat.prototype.font = "Arial";
	TextFormat.prototype.bold = false;
	TextFormat.prototype.italic = false;
	TextFormat.prototype.size = 12;
	TextFormat.prototype.textBorder = false;
	TextFormat.prototype.textBorderColor = "black";
	TextFormat.prototype.textBorderOffsetX = 0;
	TextFormat.prototype.textBorderOffsetY = 0;
	TextFormat.prototype.textBorderThickness = 2;
	
	TextFormat.prototype.customMetrics = false;
	TextFormat.prototype.fontBaseWidth = -1;
	TextFormat.prototype.fontBaseHeight = -1;
	TextFormat.prototype.fontBaseSize = 0;
	
	TextFormat.prototype.smooth = false;
	TextFormat.prototype.smoothQuality = 1;

	TextFormat.prototype.updateContext = function(context)
	{
		var bold = ( this.bold ) ? "bold" : "";
		var italic = ( this.italic ) ? "italic" : "";
		
		context.font = italic+' '+bold+' '+this.size+'px '+this.font;
		context.fillStyle = this.textColor;
		context.textBaseline = 'top';
		
		if( this.underline == true )
		{
			context.strokeStyle = this.textColor;
		}
	};
	
	TextFormat.prototype.updateBorderContext = function(context)
	{
		this.updateContext(context);
		
		if( this.smooth == true )
		{
			context.shadowColor = this.textBorderColor;
			context.shadowBlur = this.smoothQuality;
		}
		
		context.lineWidth = this.textBorderThickness;
		context.strokeStyle = this.textBorderColor;
	};

	TextFormat.prototype.clone = function()
	{
		var format = new tomahawk_ns.TextFormat();
		format.textColor = this.textColor+"";
		format.font = this.font+"";
		format.size = parseInt( this.size );
		format.fontBaseWidth = parseInt(this.fontBaseWidth);
		format.fontBaseHeight = parseInt(this.fontBaseHeight);
		format.fontBaseSize = parseInt(this.fontBaseSize);
		format.smoothQuality = parseInt(this.smoothQuality);
		
		
		format.textBorderColor = this.textBorderColor;
		format.textBorderOffsetY = parseInt(this.textBorderOffsetX);
		format.textBorderOffsetY = parseInt(this.textBorderOffsetY);
		format.textBorderThickness = parseInt(this.textBorderThickness);
		
		format.bold = ( this.bold == true );
		format.underline = ( this.underline == true );
		format.italic = ( this.italic == true );
		format.textBorder = ( this.textBorder == true );
		format.customMetrics = ( this.customMetrics == true );
		format.smooth = (this.smooth == true);
		
		return format;
	};
	
	tomahawk_ns.TextFormat = TextFormat;
})();



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
	 * @class Word
	 * @memberOf tomahawk_ns
	 * @description The Word object is a DisplayObjectContainer that contains several Letter objects in order to display a word.
	 * @augments tomahawk_ns.DisplayObjectContainer
	 * @constructor
	 **/
	function Word()
	{
		tomahawk_ns.DisplayObjectContainer.apply(this);
		this.mouseEnabled = true;
	}
	
	Tomahawk.registerClass(Word,"Word");
	Tomahawk.extend("Word","DisplayObjectContainer");
	
	/**
	* @member row
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Number}
	* @description The row index of this word
	**/
	Word.prototype.row = 0;
	Word.prototype.newline = false;
	Word.prototype.marginLeft = 0;
	
	/**
	* @member index
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Number}
	* @description The index of this word
	**/
	Word.prototype.index = 0;
	
	/**
	* @member text
	* @memberOf tomahawk_ns.Word.prototype
	* @type {String}
	* @description the text of this word
	**/
	Word.prototype.text = "";
	
	/**
	* @member needRefresh
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Boolean}
	* @description forces the refresh of the word at next frame
	**/
	Word.prototype.needRefresh = false;
	
	/**
	* @member forceRefresh
	* @memberOf tomahawk_ns.Word.prototype
	* @type {Boolean}
	* @description forces the refresh of the word at every frame
	**/
	Word.prototype.forceRefresh = true;
	
	/**
	* @description Returns the length of the word
	* @method getNumLetters
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number} returns the word length
	**/
	Word.prototype.getNumLetters = function()
	{
		return this.children.length;
	};
	
	/**
	* @description Returns the index of the first letter
	* @method getStartIndex
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number}
	**/
	Word.prototype.getStartIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt(0).index;
	};
	
	/**
	* @description Returns the index of the last letter
	* @method getEndIndex
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Number}
	**/
	Word.prototype.getEndIndex = function()
	{
		if( this.children.length == 0 )
			return 0;
			
		return this.getLetterAt( this.children.length - 1 ).index;
	};
	
	/**
	* @description Appends a letter to the word
	* @method addLetter
	* @param {tomahawk_ns.Letter} letter an instance of a Letter Object
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.addLetter = function(letter)
	{
		this.text = this.text + letter.value;
		this.needRefresh = true;
		return this.addChild(letter);
	};
	
	/**
	* @description Removes a letter in the word at the corresponding index 
	* @method removeLetterAt
	* @param {Number} The letter index
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.removeLetterAt = function(index)
	{
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		this.needRefresh = true;
		return this.removeChildAt(index);
	};
	
	/**
	* @description Removes the corresponding letter in the word
	* @method removeLetter
	* @param {tomahawk_ns.Letter} letter an instance of a Letter Object
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.removeLetter = function(letter)
	{
		var index = this.getChildIndex(letter);
		
		if( index == -1 )
			return letter;
	
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + this.text.substr(index+1);
		return this.removeChild(letter);
	};
	
	/**
	* @description Returns the letter at the corresponding index in the word
	* @method getLetterAt
	* @param {Number} the index of the letter
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.getLetterAt = function(index)
	{
		return this.getChildAt(index);
	};
		
	/**
	* @description Adds the letter "letter" at the specified index in the word.
	* @method addLetterAt
	* @param {tomahawk_ns.Letter} the letter you want to add
	* @param {Number} the index of the letter
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Letter}
	**/
	Word.prototype.addLetterAt = function(letter,index)
	{
		this.needRefresh = true;
		this.text = this.text.substr(0,index) + letter.value + this.text.substr(index);
		this.addChildAt(letter,index);
	};
	
	/**
	* @description Returns all the letters of the word
	* @method getLetters
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {Array} 
	**/
	Word.prototype.getLetters = function()
	{
		return this.children;
	};
	
	/**
	* @description Actualize the appearance of the word
	* @method refresh
	* @memberOf tomahawk_ns.Word.prototype
	**/
	Word.prototype.refresh = function()
	{
		if( this.needRefresh != true && this.forceRefresh != true)
			return;
			
		var max = this.children.length;
		var i = 0;
		var currentX = 0;
		this.height = 0;
		this.width = 0;
		var currentLetter = null;
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			
			if( currentLetter.value == " " && i == 0)
			{
				this.marginLeft = currentLetter.width;
			}
			
			currentLetter.updateMetrics();
			currentLetter.x = currentX;
			currentX += currentLetter.width;
			this.height = ( this.height < currentLetter.textHeight ) ? currentLetter.textHeight : this.height;
		}
		
		for( i = 0; i < max; i++ )
		{
			currentLetter = this.children[i];
			currentLetter.y = this.height - currentLetter.textHeight;
		}
		
		this.width = currentX;
		
		this.needRefresh = false;
		
		if( this.forceRefresh == false )
		{
			this._cache = null;
			this.updateCache();
			this.cacheAsBitmap = true;
		}
	};
	
	/**
	* @description Split the word in two, the cutting point is specified by the "index" parameter. Returns the second Word.
	* @method cut
	* @param {Number} the index form which you want to cut the word
	* @memberOf tomahawk_ns.Word.prototype
	* @returns {tomahawk_ns.Word}
	**/
	Word.prototype.cut = function(index)
	{
		var word = new tomahawk_ns.Word();
		var i = index;
		var max = this.children.length;
		
		for( i = index; i < max; i++ )
		{
			word.addLetter(this.removeLetterAt(index));
		}
		
		word.needRefresh = this.needRefresh = true;
		return word;
	};
	
	tomahawk_ns.Word = Word;
})();



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
	 * @class Texture
	 * @memberOf tomahawk_ns
	 * @description The Texture class represents a 2-dimensional texture which will be used in a Bitmap instance. Defines a 2D texture for use during rendering.
	 * @constructor
	 **/
	function Texture(){}

	Tomahawk.registerClass( Texture, "Texture" );

	/**
	* @description The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement
	* @member data
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Object}
	* @default null
	**/
	Texture.prototype.data = null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {String}
	* @description The name of the texture
	* @default null
	**/
	Texture.prototype.name = null;
	
	/**
	* @member rect
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {Array}
	* @description An array representating the portion of the rendering data used for the rendering. Example: [0,0,10,10] the top-left 10x10 pixels square of the data will be rendered but not the rest.
	**/
	Texture.prototype.rect = null;

	tomahawk_ns.Texture = Texture;

})();








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
	 * @class TextureAtlas
	 * @memberOf tomahawk_ns
	 * @description A texture atlas is a collection of many smaller textures in one big image. This class is used to access and create textures from such an atlas.
	 * @constructor
	 **/
	function TextureAtlas()
	{
		this._textures = new Array();
	}

	Tomahawk.registerClass( TextureAtlas, "TextureAtlas" );

	TextureAtlas.prototype._textures = null;
	
	/**
	* @description The rendering data itself, it can be an HTMLImageElement || HTMLCanvasElement || HTMLVideoElement
	* @member data
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @type {Object}
	* @default null
	**/
	TextureAtlas.prototype.data = null;
	
	/**
	* @member name
	* @memberOf tomahawk_ns.Texture.prototype
	* @type {String}
	* @description The name of the texture atlas
	* @default null
	**/
	TextureAtlas.prototype.name = null;

	/**
	* @method createTexture
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @param {Number} startX
	* @param {Number} startY
	* @param {Number} endX
	* @param {Number} endY
	* @description creates a new sub texture from the atlas which will render the region of the atlas data specified
	  by the startX, startY, endX, endY parameters with the name specified by the "name" parameter. The newly created texture is automatically stored within the atlas, it means that you can retrieve it with the "getTextureByName" method.
	**/
	TextureAtlas.prototype.createTexture = function( name, startX, startY, endX, endY )
	{
		var texture = new tomahawk_ns.Texture();
		texture.name = name;
		texture.data = this.data;
		texture.rect = [startX, startY, endX, endY];
		
		this._textures.push(texture);
	};
	
	/**
	* @method getTextureByName
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @returns {tomahawk_ns.Texture}
	* @description Returns the internal sub texture which matches the name specified by the "name" parameter.
	**/
	TextureAtlas.prototype.getTextureByName = function( name )
	{
		var i = this._textures.length;
		var currentTexture = null;
		while( --i > -1 )
		{
			currentTexture = this._textures[i];
			if( currentTexture.name == name )
				return currentTexture;
		}
		
		return null;
	};
	
	/**
	* @method removeTexture
	* @memberOf tomahawk_ns.TextureAtlas.prototype
	* @param {string} name
	* @description Removes the internal sub texture which matches the name specified by the "name" parameter.
	**/
	TextureAtlas.prototype.removeTexture = function( name )
	{
		var texture = this.getTextureByName(name);
		
		if( texture == null )
			return;
			
		var index = this._textures.indexOf(texture);
		this._textures.splice(index,1);
	};

	tomahawk_ns.TextureAtlas = TextureAtlas;

})();



