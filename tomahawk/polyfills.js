Function.prototype.smartBind 		= function(scope, destroy)
{	
	var obj = new Object();
	var copy = null;
	
	destroy = ( destroy === true );
	
	if( this.__bindings__ == undefined )
	{
		this.__bindings__ = new Object();
	}
	
	if( this.__bindings__[scope] == undefined )
	{
		this.__bindings__[scope] = this.bind(scope);
	}
	
	copy = this.__bindings__[scope];
	
	if( destroy == true )
	{
		this.removeSmartBind(scope)
	}
	
	return copy;
};

Function.prototype.removeSmartBind 	= function(scope)
{
	if( this.__bindings__[scope] != undefined )
		delete this.__bindings__[scope];
};



