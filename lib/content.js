/**
 * 
 */
class ContentManager{
    /**
     * 
     * @returns {ContentManager}
     */
    constructor(){
        if( ContentManager._instance){
            return ContentManager._instance;
        }

        this._contents = {};

        ContentManager._instance = this.initialize();
    }
    /**
     * @returns {ContentManager}
     */
    initialize(){
        return this;
    }
    /**
     * @returns {Object}
     */
    contents(){
        return this._contents;
    }

    add( content ){
        if( content instanceof Content ){
            if( !this.hasType(content.type())){
                this.contents()[content.type()] = {};
            }
            this.contents()[content.type()][content.name()] = content;
        }
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
     * @returns {ContentManager}
     */
    static manager(){
        
        return ContentManager._instance || new ContentManager();
    }
}

/**
 * 
 */
class ContentProvider{

    constructor(){

    }

    load( content,  type ){

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
         * @param {Function} onLoad 
         * @returns {Content}
         */
        load( onLoad ){
            if( typeof onLoad === 'function'){
                onLoad();
            }
            return this;
        }
}
Content.Type = {
    'Audio':'audio',
    'Image':'image',
    'Map':'map',
};
/**
 * 
 */
class AudioContent extends Content{
    /**
     * 
     * @param {String} name 
     */
    constructor(name = ''){
        super(name,Content.Type.Audio);
    }
}
/**
 * 
 */
class ImageContent extends Content{
    /**
     * 
     * @param {String} name 
     */
    constructor(name = ''){
        super(name,Content.Type.Image);
    }
}
/**
 * 
 */
class MapContent extends Content{
    /**
     * 
     * @param {String} name 
     */
    constructor(name = ''){
        super(name,Content.Type.Map);
    }
}



export {ContentManager, Content , AudioContent,ImageContent,MapContent };