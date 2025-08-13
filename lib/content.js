

/**
 * @class {ContentProvider}
 */
class ContentProvider{
    /**
     * 
     * @returns {ContentProvider}
     */
    constructor(){
        if( ContentProvider._instance){
            return ContentProvider._instance;
        }

        this._contents = {};

        ContentProvider._instance = this.initialize();
    }
    /**
     * @returns {ContentProvider}
     */
    initialize(){
        
        this._ready = false;

        return this;
    }
    /**
     * @returns {Object}
     */
    contents( ){
        return this._contents;
    }
    /**
     * @returns {Content[]}
     */
    list(){
        const contents = [];
        Object.values(this.contents()).forEach( collection => {
            collection.forEach( content => contents.push(content));
        });
        return contents;
    }
    /**
     * 
     * @param {Content} content 
     * @returns {ContentProvider}
     */
    add( content ){
        if( content instanceof Content ){
            if( !this.hasType(content.type())){
                this.contents()[content.type()] = {};
            }
            this.contents()[content.type()][content.name()] = content;
        }
        return this;
    }
    /**
     * 
     * @param {String} type 
     * @returns {Boolean}
     */
    hasType( type = ''){
        return type && this.contents().hasOwnProperty(type ) || false;
    }
    /**
     * 
     * @param {Function} onReady 
     * @returns {ContentProvider}
     */
    loadContents( onReady ){
        if( typeof onReady === 'function'){
            //prepare here the assync loading callback
            this._ready = true;
            onReady();
        }
        return this;
    }


    /**
     * 
     * @returns {ContentProvider}
     */
    static manager(){
        
        return ContentProvider._instance || new ContentProvider();
    }
}

/**
 * Content
 */
class Content{
        /**
         * @param {*} name 
         * @param {*} type 
         */
        constructor( name = '' , type = ''){
            this._name = name || 'content';
            this._type = type || ''
            this._buffer = null;
        }
        /**
         * @returns {String}
         */
        name(){
            return this._name;
        }
        /**
         * @returns {String}
         */
        type(){
            return this._type;
        }
        /**
         * @returns {*}
         */
        content(){
            return this._buffer;
        }
        /**
         * @returns {String}
         */
        path(){
            return `assets/${this.type()}/${this.name()}`;
        }
        /**
         * @returns {Boolean}
         */
        ready(){
            return this._buffer !== null;
        }
        /**
         * @param {Function} onLoad 
         * @returns {Content}
         */
        load( onLoad ){
            if( typeof onLoad === 'function'){
                onLoad( this );
            }
            return this;
        }
}
/**
 * @type {Content.Type}
 */
Content.Type = {
    'Audio':'audio',
    'Image':'image',
    'Map':'map',
    'TileSet':'tileset',
    'SpriteSet':'spriteset',
};
/**
 * 
 */
class Audio extends Content{
    /**
     * @param {String} name 
     */
    constructor(name = ''){
        super(name,Content.Type.Audio);
    }
}
/**
 * 
 */
class Image extends Content{
    /**
     * @param {String} name 
     */
    constructor(name = ''){
        super(name,Content.Type.Image);
        this._width = 0;
        this._height = 0;
    }
    /**
     * @param {Function} onLoad 
     * @returns {Image}
     */
    load( onLoad ){
        super.load( () => {
            onLoad(this);
            //catch buffer content's width and height into the properties
            this._width = 0;
            this._height = 0;
        });
        return this;
    }
    /**
     * @returns {Number}
     */
    width(){
        return this._width;
    }
    /**
     * @returns {Number}
     */
    height(){
        return this._height;
    }
}
/**
 * @class {TileSet}
 */
class TileSet extends Content{
    /**
     * @param {String} name 
     */
    constructor( name = 'tileset' , size = 32 ){
        super(name , Content.Type.TileSet);

        this._size = size || 32;
    }
    /**
     * @returns {Number}
     */
    size(){
        return this._size;
    }
}

/**
 * 
 */
class MapData extends Content{
    /**
     * 
     * @param {String} name 
     */
    constructor(name = ''){
        super(name,Content.Type.Map);
    }
}
/**
 * 
 */
class ParticleData extends Content{
    /**
     * @param {String} name 
     */
    constructor( name = '' ){
        super( name , Content.Type.Sprite);
    }
}




export {ContentProvider, Content, Audio,Image,MapData,TileSet,ParticleData };