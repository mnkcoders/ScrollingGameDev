import { Area } from "./core";


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
 * @class {Content}
 */
class Content{
        /**
         * @param {*} name 
         * @param {*} type 
         */
        constructor( name = '' , type = ''){
            this._name = name || Content.name;
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
    Audio:'audio',
    Drawable:'drawable',
    Image:'image',
    Map:'map',
    TileSet:'tileset',
    SpriteSet:'spriteset',
};
/**
 * @class {Audio}
 */
class AudioContent extends Content{
    /**
     * @param {String} name 
     */
    constructor(name = ''){
        super(name || AudioContent.name,Content.Type.Audio);
    }
}
/**
 * @class {Image}
 */
class ImageContent extends Content{
    /**
     * @param {String} name 
     * @param {Number} cols
     * @param {Number} rows
     */
    constructor(name = '' , cols = 1 , rows = 1 ){
        super(name || ImageContent.name,Content.Type.Image);
        this._cols = cols || 1;
        this._rows = rows || 1;
        this._width = 0;
        this._height = 0;
    }
    /**
     * 
     */
    initialize(){
        this._width = 0;
        this._height = 0;
    }
    /**
     * @param {Function} onLoad 
     * @returns {ImageContent}
     */
    load( onLoad ){
        super.load( () => {
            onLoad(this);
            this.initialize();
        });
        return this;
    }
    /**
     * @returns {CanvasImageSource}
     */
    image(){
        return this.content();
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
    /**
     * @returns {Number}
     */
    cols(){
        return this._cols;
    }
    /**
     * @returns {Number}
     */
    rows(){
        return this._rows;
    }
    /**
     * @returns {Number}
     */
    frameWidth(){
        return this.width() / this.cols();
    }
    /**
     * @returns {Number}
     */
    frameHeight(){
        return this.height() / this.rows();
    }
    /**
     * @returns {Boolean}
     */
    boxed(){
        return this.frameWidth() === this.frameHeight();
    }
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Number}
     */
    get( x = 0, y = 0){
        return y * this.cols() + x;
    }
    /**
     * @param {Number} index 
     * @returns {Area}
     */
    extract( index = 0){
        const width = this.frameWidth();
        const height = this.frameHeight();
        const x = index % this.cols();
        const y = index / this.rows();
        return new Area(x * width, y * height,width,height);
    }
}



export {ContentProvider, Content, AudioContent,ImageContent};