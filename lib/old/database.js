/**
 * @returns {SceneDataBase}
 */
function SceneDataBase( ){

    var _DB = {
        /**
         * @type Image[]
         */
        'images':[],
        /**
         * @type Scene[]
         */
        'scenes':[],
        /**
         * @type Sprite[]
         */
        'sprites':[],
        /**
         * @type Audio[]
         */
        'sounds':[],
        /**
         * @type SoundBank[]
         */
        'soundBank':[]
    };
    /**
     * @returns {Object}
     */
    this.dump = () => _DB;
    
    /**
     * @param {Audio|String} source
     * @returns {SceneDataBase}
     */
    this.addMedia = function( source ){
        
        switch (true) {
            case typeof(source) === 'undefined':
                console.log('undefined media source');
                break;
            case typeof(source) === 'string':
                _DB.sounds.push( new Audio( 'media/' + source ) );
                console.log('Added [' + source + ']');
                break;
            case source instanceof 'Audio':
                _DB.sounds.push(source);
                console.log('Added [' + source + ']');
                break;
        }
        
        return this;
    };
    /**
     * @param {String} name
     * @param {Array} list
     * @param {Integer} mode
     * @param {Integer} repeat
     * @returns {SceneDataBase}
     */
    this.addSoundBank = function( name , list , type , repeat ){
        
        _DB.soundBank.push( new SoundBank( {
            'name':name,
            'sounds':list,
            'mode':type,
            'repeat':repeat
        } ) );

        console.log('Added [' + name + ']');
        
        return this;
    };
    /**
     * @param {String} source
     * @param {Integer} width
     * @param {Integer} height
     * @returns {SceneDataBase}
     */
    this.addImage = function( source ){

        if( typeof source === 'string' && source.length && !_DB.images.hasOwnProperty(source)){
            
            var img = new Image( /* no params */ );

            img.onload = function(){
                _DB.images[ source ] = this;
                console.log( '[' + source + '] loaded (' + this.width + 'x' + this.height + ')' );
            };

            img.onerror = function(){

                console.log( 'Error loading [' + source + ']' );
            };
            
            img.src = 'sprites/' + source;
        }

        return this;
    };
    /**
     * @param {Object} sprite
     * @returns {SceneDataBase}
     */
    this.addSprite = function( spriteDef ){

        var sprite = new Sprite({
            'image': typeof spriteDef.image === 'string' ? spriteDef.image : false,
            'name': typeof spriteDef.name === 'string' ? spriteDef.name : 'New Sprite',
            'src': typeof spriteDef.src === 'string' ? spriteDef.src : '',
            'rows': typeof spriteDef.rows === 'number' ? spriteDef.rows : 1,
            'cols': typeof spriteDef.cols === 'number' ? spriteDef.cols : 1,
            'width': typeof spriteDef.width === 'number' ? spriteDef.width : 0,
            'height': typeof spriteDef.height === 'number' ? spriteDef.height : 0,
            'time': typeof spriteDef.time === 'number' ? spriteDef.time : 100,
            'frames': Array.isArray( spriteDef.frames ) ? spriteDef.frames : [ 0 ],
        });
        
        if( sprite.validate() ){
            _DB.sprites.push(sprite);
        }
        
        return this;
    };
    /**
     * @param {Object} sceneDef
     * @returns {SceneDataBase}
     */
    this.addScene = function( sceneDef ) {
        
        console.log('Not implemented ' + sceneDef );
        
        return this;
    };
    
    /**
     * @param {String|Integer} id
     * @returns {Sprite}
     */
    this.sprite = ( id ) => {
        
        switch ( typeof id ){
            case 'number':
                return id >= 0 && id < _DB.sprites.length ? _DB.sprites[ id ] : null;
            case 'string':
                for( var s = 0 ; s < _DB.sprites.length ; s++ ){
                    if( _DB.sprites[ id ].name() === id ){
                        return _DB.sprites[ id ];
                    }
                }
                break;
        }
        
        return null;
    };
    /**
     * @param {String} id
     * @returns {Image}
     */
    this.image = ( id ) =>  _DB.images.hasOwnProperty( id ) ? _DB.images[ id ] : null;
    /**
     * @param {String | Integer} id
     * @returns {Boolean}
     */
    this.hasImage = ( id ) => _DB.images.hasOwnProperty( id );
    /**
     * @param {Integer} id
     * @returns {Scene}
     */
    this.scene = ( id ) => _DB.scenes.hasOwnProperty( id ) ? _DB.scenes[ id ] : null;
    /**
     * @param {Integer} id
     * @returns {Audio}
     */
    this.media = ( id ) => _DB.sounds.hasOwnProperty( id ) ? _DB.sounds[ id ]: null;
    /**
     * @param {Integer} id
     * @returns {SoundBank}
     */
    this.soundBank = ( id ) => _DB.soundBank.hasOwnProperty( id ) ? _DB.soundBank[ id ] : null;
    /**
     * @returns {SceneDataBase}
     */
    this.unload = () => {
        
        _DB.images = [];
        _DB.soundBank = [];
        _DB.sounds = [];
        _DB.scenes = [];
        _DB.sprites = [];
        
        return this;
    };
    
    return this;
}




