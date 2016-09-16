/**
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{

	function DefaultShader()
	{
		//this.init();
	}
	
	Tomahawk.registerClass( DefaultShader, "DefaultShader" );

	
	DefaultShader.prototype.id = 0;
	DefaultShader.prototype.fragmentShader = null;
	DefaultShader.prototype.vertexShader = null;
	DefaultShader.prototype.program = null;
	DefaultShader.prototype.projectionPointer = null;
	DefaultShader.VERTEX_SIZE = 6;
	
	
	DefaultShader.prototype._compile = function(context, source, type)
	{
		var shader = context.createShader(type);
	
		context.shaderSource(shader, source);
		context.compileShader(shader);

		if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) 
		{
			alert(context.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	};
	
	DefaultShader.prototype.init = function(context, source, type)
	{
		
		var vertexPosAttribPointer = 0;
		var colorAttribPointer = 0;
		var uvsAttribPointer = 0;
		var samplerPointer = 0;
		var projectionPointer = 0;
		var stride = tomahawk_ns.DefaultShader.VERTEX_SIZE * 4;
		
		this.fragmentShader = this._compile(context, this._getFragmentSource(), context.FRAGMENT_SHADER );
		this.vertexShader = this._compile(context, this._getVertexSource(), context.VERTEX_SHADER );
		
		if( this.program != null )
		{
			context.deleteProgram( this.program );
		}
		
		this.program = context.createProgram();
		
		context.attachShader(this.program, this.vertexShader); // attach vertexShader
		context.attachShader(this.program, this.fragmentShader); // attach fragmentShader
		context.linkProgram(this.program); // links program to webgl context
		
		
		/* if the program is not linked...*/
		if (!context.getProgramParameter(this.program, context.LINK_STATUS)) 
		{
			alert("Could not initialise shaders");
		}
	
		context.useProgram(this.program); // use the shaderProgram
		
		
		vertexPosAttribPointer = context.getAttribLocation(this.program, "aVertexPosition"); 
		colorAttribPointer = context.getAttribLocation(this.program, "aColor"); 
		uvsAttribPointer = context.getAttribLocation(this.program, "aTextureCoord"); 
		context.enableVertexAttribArray(vertexPosAttribPointer);
		context.enableVertexAttribArray(colorAttribPointer);
		context.enableVertexAttribArray(uvsAttribPointer);
		
		
		context.vertexAttribPointer(vertexPosAttribPointer, 2, context.FLOAT, false, stride, 0);
		context.vertexAttribPointer(colorAttribPointer, 2, context.FLOAT, false, stride, 2*4);
		context.vertexAttribPointer(uvsAttribPointer, 2, context.FLOAT, false, stride, 4*4);
		
		samplerPointer = context.getUniformLocation(this.program,"uSampler");
		projectionPointer = context.getUniformLocation(this.program,"uProjection");
		context.uniform1i(samplerPointer, 0);
		
		this.projectionPointer = projectionPointer;
	};
	
	DefaultShader.prototype._getVertexSource = function ()
	{
		var VERTEX_SRC = ''+
		
		'attribute vec2 aVertexPosition;'+
		'attribute vec2 aColor;'+
		'attribute vec2 aTextureCoord;'+
		'varying vec4 vColor;'+
		'varying vec2 vTextureCoord;'+
		'uniform vec2 uProjection;'+
		'const vec2 center = vec2(-1.0, 1.0);'+
		
		
		'void main(void) {'+
			//'gl_Position = vec4( ( aVertexPosition / uProjection) + center , 0.0, 1.0);'+
			//'vTextureCoord = aTextureCoord;'+
			//'vec3 color = mod(vec3(aColor.x/65536.0, aColor.x/256.0, aColor.x), 256.0) / 256.0;'+
			//'vColor = vec4( color * aColor.y, aColor.y );'+
			'gl_Position = vec4( ( aVertexPosition / uProjection) + center , 0.0, 1.0);'+
			'vTextureCoord = aTextureCoord;'+
			'vec3 color = mod(vec3(aColor.x/65536.0, aColor.x/256.0, aColor.x), 256.0) / 256.0;'+
			'vColor = vec4( color * aColor.y, aColor.y );'+
		'}';
		
		return VERTEX_SRC;
	};
	
	DefaultShader.prototype._getFragmentSource = function ()
	{
		var FRAG_SRC = ''+
		
		'precision lowp float;'+
		'varying vec4 vColor;'+
		'varying vec2 vTextureCoord;'+
		'uniform sampler2D uSampler;'+

		'void main(void) {'+
			'gl_FragColor = texture2D(uSampler,vTextureCoord) * vColor.a;'+
		'}';
		
		return FRAG_SRC;
	};
	
	tomahawk_ns.DefaultShader = DefaultShader;
	
	
	
})();