/**
 * @author The Tiny Spark
 */

function Main(){}

Main.prototype._direction = 0;

Main.prototype.init = function()
{
	Tomahawk.run();
	tomahawk_ns.Stage.getInstance().init(document.getElementById("tomahawk"));
	tomahawk_ns.Stage.getInstance().background = true;
	tomahawk_ns.Stage.getInstance().backgroundColor = "#73D3F9";
	
	tomahawk_ns.AssetsLoader.getInstance().addFile("./assets/perso1.png","perso1");
	tomahawk_ns.AssetsLoader.getInstance().addEventListener(tomahawk_ns.Event.COMPLETE, this, this.complete);
	tomahawk_ns.AssetsLoader.getInstance().load();
};

Main.prototype.complete = function()
{
	var data = tomahawk_ns.AssetsLoader.getInstance().getData();
	var bmp = null;
	var texture = new tomahawk_ns.Texture();
	texture.name = "perso1";
	texture.data = data["perso1"];
	texture.rect = [0,0,texture.data.naturalWidth,texture.data.naturalHeight];
	
	bmp = new tomahawk_ns.BitmapMesh(texture);
	bmp.showLines = true;
	
	
	var res = 4;
	var j = 0;
	var i = 0;
	var indStep = 0;
	var hStep = bmp.width/res;
	var vStep = bmp.height/res;
	var vertices = new Array();
	var uvs = new Array();
	var indices = new Array();
	var offset = 0;
   
	for(j=0;j<res;j++)
	{
		
		for(i=0;i<res;i++)
		{
			vertices.push([i * hStep, j * vStep]);
			vertices.push([(i + 1) * hStep, j * vStep]);
			vertices.push([i * hStep, (j + 1) * vStep]);
			vertices.push([(i + 1) * hStep, (j + 1) * vStep]);
			
			uvs.push([i / res, j / res] );
			uvs.push([(i + 1) / res, j / res]);
			uvs.push([i / res, (j + 1) / res]);
			uvs.push([(i + 1) / res, (j + 1) / res]);
		
			indices.push(indStep);
			indices.push(indStep + 1);
			indices.push(indStep + 2);
			indices.push(indStep + 1);
			indices.push(indStep + 2);
			indices.push(indStep + 3);
			
			indStep+=4;
		}
	}
	
	
	bmp.vertices = vertices;
	bmp.uvs = uvs;
	bmp.indices = indices;
	
	tomahawk_ns.Stage.getInstance().addChild(bmp);
	tomahawk_ns.Stage.getInstance().addEventListener(tomahawk_ns.Event.ENTER_FRAME, this, this.onFrame);
};

Main.prototype.onFrame = function()
{
	tomahawk_ns.Stage.getInstance().drawFPS();
};

window.onload = function()
{
	var main = new Main();
	main.init();
};