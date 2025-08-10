/**
 * 
 * @param {Object} setup
 * @returns {Sprite}
 */
function Sprite( setup ){

    var _sprite = {
        'image': typeof setup.image === 'string' ? setup.image : false,
        'rows': typeof setup.rows === 'number' ? setup.rows : 1,
        'cols': typeof setup.cols === 'number' ? setup.cols : 1,
        'width': typeof setup.width === 'number' ? setup.width : 0,
        'height': typeof setup.height === 'number' ? setup.height : 0,
        'name': typeof setup.name === 'string' ? setup.name : 'New Sprite',

        'speed': new Vector(0,0,'speed'),
        'position': new Vector(0,0,'position'),
        //'location': new Area(0,0,
        //    typeof setup.width === 'number' ? setup.width : 0 ,
        //    typeof setup.height === 'number' ? setup.height : 0 ,),
        'scale': 1.0,
        //sprite runtime properties
        'ticks': typeof setup.ticks === 'number' ? setup.ticks : 100,
        //frame collection (columns and rows)
        //'frames': Array.isArray( setup.frames ) ? setup.frames : [0],
        //'frames': Array.isArray( setup.frames ) ? this.addState('default',setup.frames) : this.addState('default',[0]),
        'frames': [],
        //frame index
        'frame_id': 0,
        'status': Sprite.Status.Invalid,
        
        //rendering
        'blendMode': Sprite.BlendMode.Normal,
        'opacity': 255,
        'color': '#ffffff',
        'state': 'default',
        /**
         * @type Array
         */
        'events': []
    };
    /**
     * @returns {Object}
     */
    this.export = () => {
        
        var sprite = Object.assign( _sprite );
        sprite.position = new Vector(0,0,'position');
        sprite.speed = new Vector(0,0,'speed');
        sprite.scale = 1;
        
        return sprite;
    };
    /**
     * @param {Number} scale
     * @param {Number|Vector} position
     * @param {Number|Vector} scale
     * @param {Number} alpha 
     * @param {String} blendMode 
     * @returns {Sprite}
     */
    this.instance = function( scale , position , speed , alpha , blendMode ){
        
        var spr = new Sprite( this.export( ) );
        
        for( var state in _sprite.frames ){
            if( _sprite.frames.hasOwnProperty(state)){
                spr.addState(state,_sprite.frames[state]);
            }
        }
        
        spr.scale( scale );
        
        spr.position().set(position);
        
        spr.speed().set(speed);
        
        spr.status( Sprite.Status.Active );

        spr.setOpacity( alpha || _sprite.opacity )
                .setBlendMode( blendMode || _sprite.blendMode );
        
        return spr;
    };
    /**
     * @returns {Number}
     */
    this.X = function( ){
    
        return _sprite.position.X;
    };
    /**
     * @returns {Number}
     */
    this.Y = function( y ){
    
        if( typeof y === 'number'){

            _sprite.position.Y = y;
        }

        return _sprite.position.Y;
    };
    /**
     * @param {Number} scale
     * @returns {Sprite}
     */
    this.scale = ( scale ) =>{
        
        if( typeof scale === 'number' ){
            _sprite.scale = scale;
        }

        return this;
    };
    /**
     * @param {Number|Vector} speed 
     * @returns {Vector}
     */
    this.speed = ( speed ) => {

        switch( true ){
            case speed === 'random':
                _sprite.speed.set( Math.random() * 2 - 1, Math.random() * 2 - 1);
                break;
            case typeof speed === 'number':
                _sprite.speed.set(speed);
                break;
            case speed instanceof Vector:
                _sprite.speed.set(speed.X,speed.Y);
                break;
        }
        
        return _sprite.speed;
    };
    /**
     * @param {String} color
     * @returns {Sprite}
     */
    this.setColor = ( color ) => { _sprite.color = color ; return this; };
    /**
     * @returns {String}
     */
    this.color = () => _sprite.color;
    /**
     * @param {Number} opacity
     * @returns {Sprite}
     */
    this.setOpacity = ( opacity ) =>{

        if( typeof opacity === 'number' ){
            
            _sprite.opacity = opacity % 256;
        }
        
        return this;
    };
    /**
     * @returns {Number}
     */
    this.opacity = ( ) => _sprite.opacity;
    /**
     * @param {String} blending
     * @returns {Sprite}
     */
    this.setBlendMode = ( blending ) => {
        //if (Object.values(obj).indexOf('test1') > -1) {
        //if( typeof blendMode === 'string' && Object.values( Sprite.BlendMode ).indexOf(blendMode) > -1 ){
        if( typeof blending === 'string' ){

            _sprite.blendMode = blending;
        }
        return this;
    };
    /**
     * @returns {String}
     */
    this.blendMode = ( ) => _sprite.blendMode;
    /**
     * @returns {Boolean}
     */
    this.validate = function(){

        if( _sprite.image !== false && _sprite.image.length ){
            
            if( _sprite.status === Sprite.Status.Invalid ){
                
                _sprite.status = Sprite.Status.Hidden;
            }
            
            return true;
        }
        
        return false;
    };
    /**
     * @returns {Boolean}
     */
    this.valid = function(){ return _sprite.status > Sprite.Status.Invalid; };
    
    /**
     * @returns {Object}
     */
    this.dump = () => _sprite;
    /**
     * 
     * @param {String} event
     * @param {String|Int} action
     * @returns {Sprite}
     */
    this.addEvent = ( event , action ) => {
        
        
        
        return this;
    }; 
    /**
     * @param {String} name
     * @param {Array|Int} frames
     * @returns {Sprite}
     */
    this.addState = ( name , frames ) => {
        
        if( typeof _sprite.frames[name] === 'undefined' || name === 'default' ){
            
            if( Array.isArray(frames) ){
                _sprite.frames[ name ] =  frames;
            }
            else if( typeof frames === 'number' ){
                _sprite.frames[ name ] =  [frames];
            }
        }
        
        return this;
    };
    /**
     * 
     * @param {String} name
     * @returns {Sprite}
     */
    this.setState = ( name ) =>{
        if( _sprite.frames.hasOwnProperty(name)){
            _sprite.state = name;
            _sprite.frame_id = 0;
        }
        return this;
    };
    /**
     * @param {Number} status
     * @returns {Sprite}
     */
    this.setStatus = ( status ) => {

        if( typeof status === 'number' && _sprite.status !== status && status > Sprite.Status.Invalid ){
        
            _sprite.status = status;
        }

        return this;
    };
    /**
     * @param {Number} newStatus 
     * @returns {Number}
     */
    this.status = function( newStatus ){

        if( typeof newStatus === 'number' && _sprite.status !== newStatus && newStatus > Sprite.Status.Invalid ){
            _sprite.status = newStatus;
        }
        
        return _sprite.status;
    };
    /**
     * @returns {Number}
     */
    this.width = function(){ return Math.floor( _sprite.width / _sprite.cols ) * _sprite.scale; };
    /**
     * @returns {Number}
     */
    this.height = function(){ return Math.floor( _sprite.height / _sprite.rows ) * _sprite.scale; };
    /**
     * @returns {Number} 
     */
    this.tileWidth = () => parseInt( _sprite.width / _sprite.cols );
    /**
     * @returns {Number} 
     */
    this.tileHeight = () => parseInt( _sprite.height / _sprite.rows );
    /**
     * @returns {Number}
     */
    this.columns = () => _sprite.cols;
    /**
     * @returns {Number}
     */
    this.rows = () => _sprite.rows;
    /**
     * @returns {Number}
     */
    this.index = function(){ return 0; };
    /**
     * @returns {String}
     */
    this.name = function(){ return _sprite.name; };
    /**
     * @returns {Number}
     */
    this.image = function(){ return _sprite.image; };
    /**
     * @returns {Number}
     */
    this.ticks = function(){ return _sprite.ticks; };
    /**
     * @returns {Number}
     */
    this.frameCount = function(){ return _sprite.frames.length; };
    /**
     * @param {String} state
     * @returns {Array}
     */
    this.frames = ( state ) => _sprite.frames[ state || 'default'];
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Sprite}
     */
    this.move = ( x , y ) => {

        if( typeof x === 'number' ){
            _sprite.position.X += x;
        }
        
        if( typeof y === 'number' ){
            _sprite.position.Y += y;
        }
        
        return this;
    };
    /**
     * @returns {Vector}
     */
    this.position = function( ){ return _sprite.position; };
    /**
     * @returns {Area}
     */
    this.area = () => new Area( _sprite.position.X , _sprite.position.Y , this.width() , this.height() );
    /**
     * @returns {Area}
     */
    //this.location = () => _sprite.location;
    /**
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    this.click = function( x ,y ){
        
        if( this.area().intersect(new Vector(x,y))){

            return true;
        }
        
        return false;
    };
    /**
     * @param {Number} elapsed
     * @returns {Sprite}
     */
    this.update = function( elapsed ){
        
        if( _sprite.frame_id < _sprite.frames[ _sprite.state ].length - 1 ){
            _sprite.frame_id++;
        }
        else{
            _sprite.frame_id = 0;
        }
        
        _sprite.position.combine( _sprite.speed );
        
        return this;
    };
    /**
     * 
     * @returns {Int}
     */
    this.getState = () => _sprite.frames[ _sprite.state ][ _sprite.frame_id ];
    /**
     * @type Sprite.currentFrame
     */
    this.currentFrame = {
        'id': ()=> _sprite.frames[ _sprite.state ][ _sprite.frame_id ],
        'column': () => parseInt( _sprite.frames[ _sprite.state ][ _sprite.frame_id ] % _sprite.cols ),
        'row': () => parseInt( _sprite.frames[ _sprite.state ][ _sprite.frame_id ] / _sprite.cols ),
        'drawable': () => {
            //trim from bitmap source this frame
            return new Area(
                    //X position to start clipping
                    parseInt( _sprite.frames[ _sprite.state ][ _sprite.frame_id ] % _sprite.cols ) * this.tileWidth(),
                    //Y position to start clipping
                    parseInt( _sprite.frames[ _sprite.state ][ _sprite.frame_id ] / _sprite.cols ) * this.tileHeight(),
                    //size of the clip
                    this.tileWidth(),this.tileHeight() );
        }
    };
    
    return this.addState('default',Array.isArray( setup.frames ) ? setup.frames : [0]);
}
/**
 * @type Object
 */
Sprite.Status = {
    'Invalid': 0,
    'Template': 1,
    'Active': 2,
    'Removed':3
};
/**
 * @type Object
 */
Sprite.BlendMode = {
    'Normal':'normal',
    'Multiply':'multiply',
    'Screen':'screen',
    'Overlay':'overlay',
    'Darken':'darken',
    'Lighten':'lighten',
    'ColorDodge':'color-dodge',
    'ColorBurn':'color-burn',
    'HardLight':'hard-light',
    'SoftLight':'soft-light',
    'Difference':'difference',
    'Exclusion':'exclusion',
    'Hue':'hue',
    'Saturation':'saturation',
    'Color':'color',
    'Luminosity':'luminosity',
};
/**
 * @returns {String}
 */
Sprite.BlendMode.Random = () =>{
    
    var modes = Object.values( Sprite.BlendMode );
    
    var selected = parseInt( Math.random() * modes.length );
    
    return modes[ selected ];
};
/**
 * @type Sprite.Event
 */
Sprite.Event = {
    'Nothing':'nothing',
    'Wait':'wait',
    'ChangeState':'change-state',
    'PlaySound':'play-sound',
    'PlaySoundBank':'play-sound-bank',

    // ...
    'Remove':'remove'
};