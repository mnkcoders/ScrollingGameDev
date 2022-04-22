/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @returns {Vector}
 */
function Vector( x , y , z ){
    /**
     * 
     */
    var _vector = {
        'x': x || 0,
        'y': y || x || 0,
        'z': z || 0
    };

    //this.X = x || 0;
    //this.Y = y || this.X;
    //this.Z = z || 0;
    
    /** 
     * @returns {String}
     */
    this.toString = function(){
        return this.x().toString() + ','
            + this.y().toString() + ','
            + this.rotation().toString();
    };
    /**
     * @param {Vector|Number} source
     * @returns {Vector}
     */
    this.offset = function( source ){
        
        switch(true){
            case ( source instanceof Vector ):
                return new Vector( source.x() - this.x() , source.y() - this.y() );
            case ( Number.isInteger( source ) ):
                return new Vector( source );
        }
        
        return this;
    };
    /**
     * @param {Vector|Number} offset
     * @returns {Vector}
     */
    this.prod = function( offset ){
        switch( true ){
            case ( offset instanceof Vector ):
                _vector.x *= offset.x();
                _vector.y *= offset.y();
                break;
            case typeof offset === 'number':
                _vector.x *= parseInt( offset );
                _vector.y *= parseInt( offset );
                break;
        }
        return this;
    };
    /**
     * @param {Vector|Number} offset
     * @returns {Vector}
     */
    this.add = function( offset ){
        switch( true ){
            case ( offset instanceof Vector ):
                _vector.x += offset.x();
                _vector.y += offset.y();
                _vector.z += offset.z();
                break;
            case typeof offset === 'number':
                _vector.x += parseInt( offset );
                _vector.y += parseInt( offset );
                _vector.z += parseInt( offset );
                break;
        }
        return this;
    };
    /**
     * @param {Vector|Number} position
     * @returns {Boolean}
     */
    this.collide = function( position ){
        switch( true ){
            case ( position instanceof Vector ):
                return _vector.x === position.x() && _vector.y === position.y();
            case typeof offset === 'number':
                return _vector.x === _vector.y === parseInt( position );
        }
        return false;
    };
    /**
     * @returns {Number}
     */
    this.x = function(){ return parseInt(_vector.x); };
    /**
     * @returns {Number}
     */
    this.y = function(){ return parseInt(_vector.y); };
    /**
     * @returns {Number}
     */
    this.z = function(){ return parseInt(_vector.z); };
    /**
     * @returns {Number}
     */
    this.rotation = function(){ return this.Z % 360; };
}
/**
 * @returns {Vector}
 */
Vector.Zero = () => new Vector( 0 , 0 , 0 );

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns {Area}
 */
function Area( x , y , width , height ){
    
    var _area = {
        'x' : x || 0,
        'y' : y || x || 0,
        'width': width || 0,
        'height': height || width || 0
    };

    //this.X = x || 0;
    //this.Y = y || this.X;
    //this.Width = width || 0;
    //this.Height = height || this.Width;
    
    /**
     * @returns {Number}
     */
    this.x = () => parseInt( _area.x );
    /**
     * @returns {Number}
     */
    this.y = () => parseInt( _area.y );
    /**
     * @returns {Number}
     */
    this.width = () => parseInt( _area.width );
    /**
     * @returns {Number}
     */
    this.height = () => parseInt( _area.height );
    /**
     * @returns {Vector}
     */
    this.position = function(){
        
        return new Vector( this.x() , this.y() );
    };
    /**
     * @param {Area|Vector|Number} origin
     * @returns {Area}
     */
    this.offset = function( origin ){
        switch( true ){
            case origin instanceof Area:
                return new Area(
                        origin.x() - this.x(),
                        origin.y() - this.y() ,
                        origin.width() - this.width() ,
                        origin.height() - this.height() );
            case origin instanceof Vector:
                return new Area(
                        origin.x() - this.x() ,
                        origin.y() - this.y(),
                        this.width() , this.height( ) );
            case Number.isInteger( origin ):
                return new Area(
                    this.x() + origin ,
                    this.y() + origin ,
                    this.width(),
                    this.height() );
        }
        return this;
    };
    /**
     * @param {Area|Vector|Number} element
     * @returns {Boolean}
     */
    this.contains = function( element ){
        switch( true ){
            case element instanceof Vector:
                return element.x() >= this.left() && element.x() <= this.right() &&
                        element.y() >= this.top() && element.y() <= this.bottom();
            case element instanceof Area:
                return element.left() >= this.left() && element.right() <= this.right() &&
                        element.top() >= this.top() && element.bottom() <= this.bottom();
            case Number.isInteger( element ):
                return element >= this.left() && element <= this.right() &&
                        element >= this.top() && element <= this.bottom();
        }
        return false;
    };
    /**
     * @returns {Number}
     */
    this.size = function(){ return this.width() * this.height(); };
    /**
     * @returns {Vector}
     */
    this.center = function(){
        return new Vector(
                this.x() + parseInt( this.width() / 2 ) ,
                this.y() + parseInt( this.height() / 2 ) );
    };
    /**
     * @returns {Number}
     */
    this.left = function(){ return this.x(); };
    /**
     * @returns {Number}
     */
    this.right = function(){ return this.x() + this.width(); };
    /**
     * @returns {Number}
     */
    this.top = function(){ return this.y(); };
    /**
     * @returns {Number}
     */
    this.bottom = function(){ return this.y() + this.height(); };
}

/**
 * 
 * @param {type} r
 * @param {type} g
 * @param {type} b
 * @param {type} a
 * @returns {Color}
 */
function Color( r , g , b , a ){
    
    var _rgb = {
        R: r || 0,
        G: g || 0,
        B: b || 0,
        A: parseInt( a || 255 ) % 256
    };
    /**
     * @returns {Number}
     */
    this.r = () => _rgb.R;
    /**
     * @returns {Number}
     */
    this.g = () => _rgb.G;
    /**
     * @returns {Number}
     */
    this.b = () => _rgb.B;

    this.alpha = () => _rgb.a;
};



