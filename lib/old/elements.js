/**
 * @param {Number} x
 * @param {Number} y
 * @param {String} tag 
 * @returns {Vector}
 */
function Vector( x , y , tag ){

    this.X = typeof x === 'number' ? x : 0;
    
    this.Y = typeof y === 'number' ? y : this.X;
    
    this.tag = tag || 'point';
    /**
     * @returns {Vector}
     */
    this.normalize = () => {
        
        this.X = parseFloat(this.X.toFixed(2));
        
        this.Y = parseFloat(this.Y.toFixed(2));
        
        return this;
    };
    
    //console.log(this);
    /**
     * @returns {Number} 
     */
    this.intX = () => parseInt( this.X );
    /**
     * @returns {Number} 
     */
    this.intY = () => parseInt( this.Y );
    /**
     * @returns {Vector}
     */
    this.invert = () => {
        this.X *= -1;
        this.Y *= -1;
        return this;
    };
    /**
     * @returns {Number}
     */
    this.invertX = () => {
        this.X *= -1;
        return this.X;
    };
    /**
     * @returns {Number}
     */
    this.invertY = () => {
        this.Y *= -1;
        return this.Y;
    };
    /**
     * @returns {Vector}
     */
    this.absolute = () => new Vector( Math.abs(this.X),Math.abs(this.Y));
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    this.set = ( x , y ) => {
        
        switch( true ){
            case x instanceof Vector:
                this.X = x.X;
                this.Y = x.Y;
                break;
            case typeof x === 'number' && typeof y === 'number':
                this.X = x;
                this.Y = y;
                break;
            case typeof x === 'number':
                this.X = x;
                this.Y = this.X;
                break;
        }

        return this.normalize();
    };
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    this.add = ( x , y ) => {
        this.X += x;
        this.Y += typeof y === 'number' ? y : x;
        return this.normalize();
    };
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Vector}
     */
    this.mult = ( x , y ) => {
        this.X *= x;
        this.Y *= typeof y === 'number' ? y : x;
        return this.normalize();
    };
    /**
     * @param {Vector} vector
     * @returns {Vector}
     */
    this.combine = ( vector ) => {
        
        this.X += vector.X;
        
        this.Y += vector.Y;
        
        return this.normalize();
    };
    /**
     * @returns {Vector}
     */
    this.copy = () => new Vector( this.X , this.Y );
    
    return this.normalize();
}
/**
 * 
 * @returns {Vector}
 */
Vector.Zero = (function(){ return new Vector(0,0); })();
/**
 * @type Vector
 */
Vector.One = (function(){ return new Vector(1,1); })();
/**
 * @param {Number} factor 
 * @type Vector
 */
/**
 * @param {Number} randX 
 * @param {Number} randY
 * @type Vector
 */
Vector.Random = ( randX , randY ) => {
    
    if( !Number.isInteger( randX )){
        randX = 1;
    }
    
    if( typeof randY !== 'number' ){
        randY = randX;
    }
    
    var x = (Math.random() - Math.random()) * randX;

    var y = (Math.random() - Math.random()) * randY;
    
    return new Vector( x  , y );
};
//Object.freeze(Vector.Zero);
/**
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns {Area}
 */
function Area( x , y , width,  height ){
    
    this.X = x;
    this.Y = y;
    this.width = width;
    this.height = height;
    
    this.left = () => this.X;
    this.right = () => this.X + this.width;
    this.top = () => this.Y;
    this.bottom = () => this.Y + this.height;
    /**
     * 
     * @param {Vector|Area} element
     * @returns {Boolean}
     */
    this.intersect = ( element ) => {
        
        if( element instanceof Vector ){
            
            return ( element.X >= this.left() && element.X <= this.right() )
                && ( element.Y >= this.top() && element.Y <= this.bottom() );
        }
        
        if( element instanceof Area ){
            
            if( this.contains( element ) ){
                return true;
            }
        }
        
        return false;
    };
    /**
     * @param {Area} area
     * @returns {Boolean}
     */
    this.contains = ( area ) => {

        if( area.left() >= this.left() && area.right() <= this.right() ){
            if( area.top() >= this.top() && area.bottom() <= this.bottom() ){
                return true;
            }
        }
        
        return false;
    }; 
    
    return this;
}



