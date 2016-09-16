/**
 * ...
 * @author Hatshepsout
 */

var tomahawk_ns = tomahawk_ns || new Object();

(function() 
{

	function WebAudioSound()
	{
		tomahawk_ns.EventDispatcher.apply(this);
		this._init();
	}
	
	Tomahawk.registerClass( WebAudioSound, "WebAudioSound" );
	Tomahawk.extend( "WebAudioSound", "EventDispatcher" );
	
	WebAudioSound.isSupported = function()
	{
		var contextClass = window.AudioContext || window.webkitAudioContext; 
		return ( contextClass != undefined );
	};
	
	WebAudioSound.getContext = function()
	{
		var contextClass = window.AudioContext || window.webkitAudioContext; 
		tomahawk_ns.WebAudioSound._context = tomahawk_ns.WebAudioSound._context || new contextClass();
		return tomahawk_ns.WebAudioSound._context;
	};
	
	WebAudioSound._context = null;

	WebAudioSound.prototype._buffer = null;
	WebAudioSound.prototype._context = null;
	WebAudioSound.prototype._source = null;
	WebAudioSound.prototype._gainNode = null;
	WebAudioSound.prototype._playing = false;
	WebAudioSound.prototype._startContextTime = 0;
	WebAudioSound.prototype._currentTime = 0;
	
	
	WebAudioSound.prototype._init = function()
	{
		this._context = tomahawk_ns.WebAudioSound.getContext();
	};
	
	WebAudioSound.prototype._decodeComplete = function(buffer)
	{
		this._buffer = buffer;
		this.dispatchEvent( new tomahawk_ns.Event( tomahawk_ns.Event.COMPLETE, true, true ) );
	};	
	
	WebAudioSound.prototype._decodeError = function()
	{
		this.dispatchEvent( new tomahawk_ns.Event( tomahawk_ns.Event.IO_ERROR, true, true ) );
	};
	
	WebAudioSound.prototype.load = function(url)
	{
		var soundBuffer = null;
		var request = new XMLHttpRequest();
		var context = this._context;
		var onSuccess =  this._decodeComplete.bind(this);
		var onError =   this._decodeError.bind(this);
		
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function()
		{
			context.decodeAudioData(request.response, onSuccess,onError);
		}
		
		request.send();
	};
	
	WebAudioSound.prototype.play = function(time)
	{
		time = ( isNaN(time) ) ? 0 : parseFloat(time);
		
		this.stop();
		
		if( this._playing == true )	
		{
			this.stop();
		}
			
		this._gainNode = this._context.createGain();
		this._source = this._context.createBufferSource(); 		// creates a sound source
		this._source.buffer = this._buffer;                    // tell the source which sound to play
		this._source.connect(this._gainNode);
		this._gainNode.connect(this._context.destination);
		
		if( !this._source.start )
			this._source.start = this._source.noteOn;
			
		this._source.start(0,time);
		this._playing = true;
		this._startContextTime = this._context.currentTime;
	};
	
	WebAudioSound.prototype.resume = function()
	{
		if( this._playing == true )	
			return;
			
		this.play(this._currentTime);
	};	
	
	WebAudioSound.prototype.pause = function()
	{
		if( this._playing == false )	
			return;
			
		this._source.stop();
		this._currentTime = this.getElapsedTime();
		this._playing = false;
	};
	
	WebAudioSound.prototype.stop = function()
	{
		if( this._playing == false )	
			return;
			
		this._source.stop();
		this._playing = false;
		this._currentTime = 0;
	};
	
	WebAudioSound.prototype.seek = function(time)
	{
		this.play(time);
	};
	
	WebAudioSound.prototype.getElapsedTime = function()
	{
		if( this._playing == true )
		{
			return this._currentTime + ( this._context.currentTime - this._startContextTime );
		}
		else
		{
			return this._currentTime;
		}
	};
	
	WebAudioSound.prototype.getDuration = function()
	{
		return this._buffer.duration;
	};
	
	WebAudioSound.prototype.isPlaying = function()
	{
		return this._playing;
	};
	
	WebAudioSound.prototype.setVolume = function(value)
	{
		if( this._playing == false )	
			return;
			
		this._gainNode.gain.value = value;
	};
	
	tomahawk_ns.WebAudioSound = WebAudioSound;
	
	
})();