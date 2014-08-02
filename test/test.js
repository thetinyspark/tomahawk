window.onload = function()
{
	Tomahawk.run();
	var canvas = document.getElementById("tomahawk");
	var report = document.getElementById("report");
	var stage = tomahawk_ns.Stage.getInstance("unit_test");
	var list = [test_addCharAt,test_removeCharAt,test_addTextAt,
				test_removeTextBetween,test_setText,test_focus,
				test_index,test_align,test_format,
				test_getLetterAt,test_getLetters,test_getWordAt,
				test_addLetterWord,test_bounds,test_autoUpdate,
				test_localToGlobal,test_globalToLocal,test_isChildOf,
				test_getBoundingRectIn,test_addChild,test_addChildAt,
				test_getChildByName,test_getChildAt,test_removeChild,
				test_removeChildAt, test_getChildIndex,test_setChildIndex,
				test_pixelPerfect, test_pivot, test_dispatchEvent, test_addEventListener,
				test_removeEventListener,test_removeEventListeners, test_newBitmap, test_setTexture,
				test_newTexture, test_mat3x3_translate, test_mat3x3_scale,test_mat3x3_rotate,
				test_mat_transformPoint,test_assetsManager];
				
	var i = list.length;
	var func = null;
	var errors = "";
	var k = 0;
	var funcName = "";
	var result = true;
	
	stage.init(canvas);
	
	while( --i > -1 )
	{
		func = list[i];
		funcName = func.toString().replace( "function", "" );
		funcName = funcName.substring(0,funcName.indexOf("("));
		
		try
		{ 
			result = func(); 
		}
		catch(e)
		{
			result = false;
			errors += funcName + ": exec error "+e.toString()+"<br/>";
			k++;
			continue;
		}
		
		result = ( result == true );
		
		if( result == false )
		{
			errors += funcName + ": failed <br/>";
			k++;
		}
	}
	
	report.innerHTML = ( list.length - k ) +"/"+list.length+" success. <br/>"+ errors;
};


function test_assetsManager()
{
	var manager = tomahawk_ns.AssetsManager.getInstance();
	var img1 = new Image();
	var img2 = new Image();
	var atlas1 = new tomahawk_ns.TextureAtlas();
	var atlas2 = new tomahawk_ns.TextureAtlas();
	var tex1 = new tomahawk_ns.Texture();
	var tex2 = new tomahawk_ns.Texture();
	var tab = null;
	
	manager.addImage(img1, "img1");
	manager.addImage(img2, "img2");
	
	manager.addAtlas(atlas1, "atlas1");
	manager.addAtlas(atlas2, "atlas2");
	
	manager.addTexture(tex1, "tex1");
	manager.addTexture(tex2, "tex2");
	
	
	if( 
		manager.getTextureByAlias("tex1") != tex1 ||
		manager.getTextureByAlias("tex2") != tex2 ||
		manager.getAtlasByAlias("atlas1") != atlas1 ||
		manager.getAtlasByAlias("atlas2") != atlas2 ||
		manager.getImageByAlias("img1") != img1 ||
		manager.getImageByAlias("img2") != img2
	)
	{
		return false;
	}
	
	tab = manager.getTextures();
	
	if( tab["tex1"] != tex1 || tab["tex2"] != tex2 )
		return false;
	
	tab = manager.getImages();
	if( tab["img1"] != img1 || tab["img2"] != img2 )
		return false;
	
	tab = manager.getAtlases();
	if( tab["atlas1"] != atlas1 || tab["atlas2"] != atlas2 )
		return false;
		
	
	return true;
}

function test_mat_transformPoint()
{
	var pt = new tomahawk_ns.Point(0,0);
	var mat = new tomahawk_ns.Matrix2D();
	
	mat.translate(10,10);
	mat.scale(2,2);
	mat.transformPoint(0,0,pt);
	
	return ( pt.x == 20 && pt.y == 20 );
}

function test_mat3x3_translate()
{
	var mat = new tomahawk_ns.Matrix2D();
	mat.translate(10,10);
	
	if( mat.tx != 10 || mat.ty != 10 )
		return false;
		
	return true;
}

function test_mat3x3_scale()
{
	var mat = new tomahawk_ns.Matrix2D();
	mat.scale(2,2);
	
	if( mat.a != 2 || mat.d != 2 )
		return false;
		
	return true;
}

function test_mat3x3_rotate()
{
	var mat = new tomahawk_ns.Matrix2D();
	mat.rotate(90);
	
	if( mat.a != mat.d || mat.b != -mat.c )
		return true;
		
	return true;
}

function test_newTexture()
{
	var canvas = document.createElement("canvas");
	var texture = new tomahawk_ns.Texture(canvas,[0,0,1,1],"texture");
	
	return ( 	texture.name == "texture" 	&&
				texture.data == canvas		&&
				texture.rect[0] == 0		&&
				texture.rect[1] == 0		&&
				texture.rect[2] == 1		&&
				texture.rect[3] == 1 );		
}

function test_newBitmap()
{
	var canvas = document.createElement("canvas");
	var texture = new tomahawk_ns.Texture(canvas,[0,0,1,1],"texture");
	var bmp = new tomahawk_ns.Bitmap(texture);
	canvas.height = canvas.width = 1;
	
	return ( bmp.texture == texture );
}

function test_setTexture()
{
	var canvas = document.createElement("canvas");
	var texture1 = new tomahawk_ns.Texture(canvas,[0,0,1,1],"texture1");
	var texture2 = new tomahawk_ns.Texture(canvas,[0,0,1,1],"texture2");
	var bmp = new tomahawk_ns.Bitmap(texture1);
	canvas.height = canvas.width = 1;
	
	bmp.setTexture(texture2);
	
	return ( bmp.texture == texture2 );
}

function test_removeEventListeners()
{
	var spr = new tomahawk_ns.Sprite();
	var result = false;
	var callback = function(){};
	
	spr.addEventListener("test",this,callback);
	spr.removeEventListeners();
	
	result = spr.hasEventListener("test");
	return ( result == false );
}

function test_removeEventListener()
{
	var spr = new tomahawk_ns.Sprite();
	var result = false;
	var callback = function(){};
	
	spr.addEventListener("test",this,callback);
	spr.removeEventListener("test",this,callback);
	
	
	result = spr.hasEventListener("test");
	return ( result == false );
}

function test_addEventListener()
{
	var spr = new tomahawk_ns.Sprite();
	var result = false;
	var callback = function(){};
	
	spr.addEventListener("test",this,callback);
	result = spr.hasEventListener("test");
	return result;
}

function test_dispatchEvent()
{
	var spr = new tomahawk_ns.Sprite();
	var result = false;
	var callback = function()
	{
		result = true;
	};
	
	spr.addEventListener("test", this, callback, false );
	spr.dispatchEvent( new tomahawk_ns.Event("test",true,true) );
	
	return result;
}

function test_pivot()
{
	var spr = new tomahawk_ns.Sprite();
	var pt1 = null;
	
	spr.width = spr.height = spr.x = spr.y = 100;
	spr.pivotX = spr.pivotY = spr.width >> 1;
	spr.scaleX = spr.scaleY = 2;
	spr.updateMatrix();
	spr.updateBounds();
	
	pt1 = spr.localToGlobal(0,0);
	
	return ( pt1.x == 50 && pt1.y == 50 );
}

function test_pixelPerfect()
{
	var shape = new tomahawk_ns.Shape();
	var radius = 200;
	var x = radius;
	var y = radius;
	var hit1 = null;
	var hit2 = null;
	
	shape.width = shape.height = radius * 2;
	shape.beginPath();
	shape.fillStyle("red");
	shape.arc( x, y, radius, 0, 360 * (Math.PI/180), false);
	shape.fill();
	
	shape.pixelPerfect = false;
	hit1 = shape.hitTest(0,0);
	
	shape.pixelPerfect = true;
	hit2 = shape.hitTest(0,0);
	
	return ( ( hit1 == true ) && ( hit2 == false ) );
}

function test_setChildIndex()
{
	var spr = new tomahawk_ns.Sprite();
	var shape1 = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	
	spr.addChild(shape1);
	spr.addChild(shape2);
	
	shape1.name = "shape1";
	shape2.name = "shape2";
	
	spr.setChildIndex(shape2,0);
	spr.addChildAt(shape2,0);
	return ( spr.getChildIndex(shape2) == 0 );
}

function test_getChildIndex()
{
	var spr = new tomahawk_ns.Sprite();
	var shape1 = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	spr.addChild(shape1);
	spr.addChild(shape2);
	
	shape1.name = "shape1";
	shape2.name = "shape2";
	
	return ( spr.getChildIndex(shape2) == 1 );
}

function test_removeChildAt()
{
	var spr = new tomahawk_ns.Sprite();
	var shape1 = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	spr.addChild(shape1);
	spr.addChild(shape2);
	spr.removeChildAt(0)
	
	shape1.name = "shape1";
	shape2.name = "shape2";
	
	return ( spr.getChildByName("shape1") == null );
}

function test_removeChild()
{
	var spr = new tomahawk_ns.Sprite();
	var shape1 = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	spr.addChild(shape1);
	spr.addChild(shape2);
	spr.removeChild(shape1)
	
	shape1.name = "shape1";
	shape2.name = "shape2";
	
	return ( spr.getChildByName("shape1") == null );
}

function test_getChildByName()
{
	var spr = new tomahawk_ns.Sprite();
	var shape1 = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	spr.addChild(shape1);
	spr.addChild(shape2);
	
	shape1.name = "shape1";
	shape2.name = "shape2";
	
	return ( spr.getChildByName("shape1") == shape1 );
}

function test_getChildAt()
{
	var spr = new tomahawk_ns.Sprite();
	var shape = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	spr.addChild(shape);
	spr.addChildAt(shape2,0);
	
	return ( spr.getChildAt(0) == shape2 );
}

function test_addChildAt()
{
	var spr = new tomahawk_ns.Sprite();
	var shape = new tomahawk_ns.Shape();
	var shape2 = new tomahawk_ns.Sprite();
	spr.addChild(shape);
	spr.addChildAt(shape2,0);
	
	return ( spr.getChildAt(0) == shape2 );
}

function test_addChild()
{
	var spr = new tomahawk_ns.Sprite();
	var spr2 = new tomahawk_ns.Sprite();
	var shape = new tomahawk_ns.Shape();
	spr2.addChild(shape);
	spr.addChild(shape);
	
	return ( shape.parent == spr );
}

function test_getBoundingRectIn()
{
	var shape = new tomahawk_ns.Shape();
	var sprite = new tomahawk_ns.Sprite();
	var container = new tomahawk_ns.Sprite();
	var bounds = null;
	
	shape.width = shape.height = 100;
	sprite.width = sprite.height = 100;
	sprite.x = sprite.y = 50;
	
	container.addChild(sprite);
	container.addChild(shape);
	
	container.y = container.x = 100;
	
	container.updateMatrix();
	container.updateBounds();
	
	bounds = shape.getBoundingRectIn(sprite);
	
	return ( 	bounds.left == -50 &&
				bounds.top == -50 &&
				bounds.right == 50 && 
				bounds.bottom == 50 );
}

function test_isChildOf()
{
	var shape = new tomahawk_ns.Shape();
	var sprite = new tomahawk_ns.Sprite();
	var subsprite = new tomahawk_ns.Sprite();
	
	subsprite.addChild(shape);
	sprite.addChild(subsprite);
	
	return shape.isChildOf(sprite);
}

function test_globalToLocal()
{
	var shape = new tomahawk_ns.Shape();
	var sprite = new tomahawk_ns.Sprite();
	var pt = null;
	
	shape.width = shape.height = 100;
	shape.scaleX = shape.scaleY = 2;
	sprite.addChild(shape);
	sprite.updateMatrix();
	sprite.updateBounds();
	pt = shape.globalToLocal(100,100);
	
	return ( pt.x == 50 && pt.y == 50 );
}

function test_localToGlobal()
{
	var shape = new tomahawk_ns.Shape();
	var sprite = new tomahawk_ns.Sprite();
	var pt = null;
	
	shape.width = shape.height = 100;
	shape.scaleX = shape.scaleY = 2;
	sprite.addChild(shape);
	sprite.updateMatrix();
	sprite.updateBounds();
	pt = shape.localToGlobal(50,50);
	
	return ( pt.x == 100 && pt.y == 100 );
}

function test_autoUpdate()
{
	var shape = new tomahawk_ns.Shape();
	shape.width = shape.height = 100;
	shape.scaleX = shape.scaleY = 2;
	shape.x = shape.y = 100;
	shape.autoUpdate = false;
	shape.updateNextFrame = false;
	shape.updateMatrix();
	shape.updateBounds();
	
	return ( 	
				shape.bounds.left == 0 && 
				shape.bounds.top == 0 && 
				shape.bounds.right == 100 && 
				shape.bounds.bottom == 100
	);
}

function test_bounds()
{
	var shape = new tomahawk_ns.Shape();
	var sprite = new tomahawk_ns.Sprite();
	shape.width = shape.height = 100;
	shape.scaleX = shape.scaleY = 2;
	shape.x = shape.y = 100;
	shape.updateMatrix();
	shape.updateBounds();
	
	sprite.addChild(shape);
	sprite.updateMatrix();
	sprite.updateBounds();
	
	return ( 	
				shape.bounds.left == 100 && 
				shape.bounds.top == 100 && 
				shape.bounds.right == 300 && 
				shape.bounds.bottom == 300 &&
				sprite.bounds.left == 0 && 
				sprite.bounds.top == 0 && 
				sprite.bounds.right == 300 && 
				sprite.bounds.bottom == 300
	);
}

function test_addLetterWord()
{
	var word = new tomahawk_ns.Word();
	var letter = null;
	var str = "tomahawk";
	var max = str.length;
	var i = 0;
	
	for( ; i < max; i++ )
	{
		word.addLetter(new tomahawk_ns.Letter(str[i]));
	}
	
	return ( word.getLetterAt(1).value == "o" );
}

function test_getWordAt()
{
	var field = new tomahawk_ns.TextField();
	var str = "tomahawk canvas 2d engine";
	field.setText(str);
	var word = field.getWordAt(10);
	var letters = word.getLetters();
	
	return ( word != null );
}

function test_getLetters()
{
	var field = new tomahawk_ns.TextField();
	var letters = null;
	var str = "tomahawk";
	var i = 0;
	field.setText(str);
	letters = field.getLetters();
	
	while( --i > -1 )
	{
		if( letters[i].value != str.charAt(i) )
			return false;
	}
	
	return true;
}

function test_getLetterAt()
{
	var field = new tomahawk_ns.TextField();
	field.setText("tomahawk");
	return ( 
				field.getLetterAt(0).value == "t" && 
				field.getLetterAt(1).value == "o" && 
				field.getLetterAt(2).value == "m" && 
				field.getLetterAt(3).value == "a" && 
				field.getLetterAt(4).value == "h" && 
				field.getLetterAt(5).value == "a" && 
				field.getLetterAt(6).value == "w" && 
				field.getLetterAt(7).value == "k" 
	);
}

function test_format()
{
	var field = new tomahawk_ns.TextField();
	var format = new tomahawk_ns.TextFormat();
	format.bold = true;
	format.textColor = "red";
	field.setText("tomahawk");
	field.setTextFormat(format,0,5);
	
	return ( 
				field.getTextFormat(0).textColor == "red" &&
				field.getTextFormat(0).bold == true &&
				field.getTextFormat(1).textColor == "red" &&
				field.getTextFormat(1).bold == true 
	);
}

function test_align()
{
	var field = new tomahawk_ns.TextField();
	field.setTextAlign(tomahawk_ns.TextField.ALIGN_CENTER);
	return ( field.getTextAlign() == tomahawk_ns.TextField.ALIGN_CENTER );
}

function test_index()
{
	var field = new tomahawk_ns.TextField();
	field.setCurrentIndex(10);
	return ( field.getCurrentIndex() == 0 );
}

function test_focus()
{
	var field = new tomahawk_ns.TextField();
	field.setFocus(true);
	return ( field.getFocus() == true );
}

function test_setText()
{
	var field = new tomahawk_ns.TextField();
	field.setText("a\nbcd");
	return ( field.getText() == "a\nbcd" );
}

function test_addTextAt()
{
	var field = new tomahawk_ns.TextField();
	field.addCharAt("a",0);
	field.addTextAt("a\nbcd",0);
	return ( field.getText() == "a\nbcda" );
}

function test_removeCharAt()
{
	var field = new tomahawk_ns.TextField();
	field.addCharAt("a",0);
	field.removeCharAt(0);
	return ( field.getText() == "" );
}

function test_addCharAt()
{
	var field = new tomahawk_ns.TextField();
	field.addCharAt("a",0);
	field.addCharAt("\n",0);
	field.addCharAt("i",0);
	return ( field.getText() == "i\na" );
}

function test_removeTextBetween()
{
	var field = new tomahawk_ns.TextField();
	field.addTextAt("abcdefghij",0);
	field.removeTextBetween(2,4);
	return ( field.getText() == "abfghij" );
}

