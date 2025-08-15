import { Content,ImageContent,AudioContent,FrameSet, SpriteData, SpriteSet } from "./types";

/**
 * @class {ContentManager}
 */
class ContentManager {
    /**
     * 
     * @returns {ContentManager}
     */
    constructor() {
        if (ContentManager._instance) {
            return ContentManager._instance;
        }

        ContentManager._instance = this.initialize();

        this.initialize();
    }
    /**
     * @returns {ContentManager}
     */
    initialize() {
        this._data = new ContentData();
        return this;
    }
    /**
     * @returns {ContentData}
     */
    data(){
        return this._data;
    }    
    /**
     * @returns {Object}
     */
    contents() {
        this.data().db();
    }
    /**
     * 
     * @param {Function} onLoad 
     * @returns {ContentManager}
     */
    load(onLoad) {
        this.data().load( () => {
            onLoad();
        } );
        return this;
    }
    /**
     * 
     * @param {String} name 
     * @param {GameAsset.Type|String} type 
     * @returns {GameAsset}
     */
    get( name = '', type = '' ){
        return this.data().seek(name,type) || null;
    }
    /**
     * @param {String} name 
     * @returns {AudioContent}
     */
    audio( name = '' ){
        return this.get(name,GameAsset.Type.Audio);
    }
    /**
     * 
     * @param {String} name 
     * @returns {ImageContent}
     */
    image( name = ''){
        return this.get(name,GameAsset.Type.Image);
    }
    /**
     * @param {String} name 
     * @returns {SpriteData}
     */
    spriteData( name = ''){
        return this.get(name,GameAsset.Type.SpriteData);
    }
    /**
     * @param {String} name 
     * @returns {SpriteSet}
     */
    spriteSet( name = ''){
        return this.get(name,GameAsset.Type.SpriteSet);
    }
    /**
     * @param {String} name 
     * @returns {FrameSet}
     */
    frameSet( name = ''){
        return this.get(name,GameAsset.Type.FrameSet);
    }
    /**
     * @returns {String}
     */
    path(){
        return `contents/gamedata/${this._source}.json`;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.data().ready();
    }
    /**
     * @param {String} url 
     * @param {String} method 
     * @param {String} response 
     * @returns {ContentProvider}
     */
    static provider( url , method = ContentProvider.Method.GET , response = ContentProvider.ResponseType.TEXT){
        return new ContentProvider(url,method,response);
    }
    /**
     * 
     * @returns {ContentManager}
     */
    static manager() {

        return ContentManager._instance || new ContentManager();
    }
}

/**
 * @class {ContentData}
 */
class ContentData{
    /**
     * @param {String} gameData 
     */
    constructor( gameData = 'gamedata' ){
        //game types
        this._db = [];
        this._source = gameData;
        this._ready =false;
    }
    /**
     * @returns {Content[]}
     */
    db(  ){
        return this._db;
    }
    /**
     * @param {String} name 
     * @returns {Boolean}
     */
    has(name = ''){
        return name && this.db().filter( content => content.name() === name ).length > 0 || false;
    }
    /**
     * @param {String} name 
     * @param {String} type 
     * @returns {Content}
     */
    seek( name = '' , type = ''){
        return name && type && this.db().filter( content => content.name() === name && content.type() === type) || [];
    }
    /**
     * @param {String} type 
     * @returns {Object[]}
     */
    list(type = ''){
        return type && this.db().filter( content => content.type() === type ) || [];
    }
    /**
     * @returns {Boolean}
     */
    empty(){
        return this.db().length === 0;
    }
    /**
     * @param {Content} content 
     * @param {String} type 
     * @returns {ContentData}
     */
    add( content = null ){
        if( content instanceof Content){
            this.db().push(content);
        }
        return this;
    }
    /**
     * @returns {String}
     */
    path(){
        return `contents/gamedata/${this._source}.json`;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this._ready;
    }
    /**
     * @returns {ContentProvider}
     */
    provider(){
        return new ContentProvider(
            this.path(),
            ContentProvider.Method.GET,
            ContentProvider.ResponseType.JSON
        );
    }
    /**
     * @param {Function} onLoad 
     * @returns {ContentManager}
     */
    load( onLoad ){
        if( this.empty()){
            const client = this.provider();
            client.request( response => {
                this.populate(response);
                if( this.ready() && typeof onLoad === 'function' ){
                    onLoad();
                }
            } );
        }
        return this;
    }
    /**
     * @param {Object} data 
     * @returns {ContentData}
     */
    populate( data = null){
        const db = data || {};
        Object.keys(db).forEach( type => {
            db[type].forEach( data => {
                const setup = Object.values(data);
                switch( type ){
                    case Content.Type.Image:
                        this.add(new ImageContent( ...setup ));
                        break;
                    case Content.Type.Audio:
                        this.add(new AudioContent(...setup));
                        break;
                    case Content.Type.Frameset:
                        this.add(new FrameSet(...setup));
                        break;
                    case Content.Type.SpriteSet:
                        this.add(new SpriteSet(...setup));
                        break;
                    case Content.Type.Sprite:
                        this.add(new SpriteData(...setup));
                        break;
                }
            });
        });
        this._ready = !this.empty();
        return this;
    }
}

/**
 * @class {ContentProvider}
 */
class ContentProvider{
    /**
     * @param {String} url 
     * @param {String} method
     * @param {String} responseType
     */
    constructor( url = '',method = '',responseType = ''){
        this._url = url || '';
        this._method = method || ContentProvider.Method.GET;
        this._responseType = responseType || ContentProvider.ResponseType.TEXT;
        this._status = ContentProvider.Status.INIT;
    }
    /**
     * @returns {String}
     */
    url(){
        return this._url;
    }
    /**
     * @returns {ContentProvider.ResponseType|String}
     */
    responseType(){
        return this._responseType;
    }
    /**
     * @returns {ResponseType.Method|String}
     */
    method(){
        return this._method;
    }
    /**
     * @param {Function} callback 
     * @returns {ContentProvider}
     */
    request( callback ){
        if( typeof callback === 'function' ){
            const request = new XMLHttpRequest();
            request.open(this.method(), this.url() );
            request.responseType = this.responseType();
            request.onload = () => {
                console.log(request);
                console.log(`Loading Complete!! ${this.url()}`);
                callback( request.response );
                this._status = ContentProvider.Status.READY;
            };
            request.onerror = () => {
                this._status = ContentProvider.Status.ERROR;
                console.log(`Error while loading ${this.url()}`);
            };
            this._status = ContentProvider.Status.LOADING;
            console.log(`Loading ${this.url()}(${request.responseType}) ...`);
            request.send();
        }
        else{
            this._status = ContentProvider.Status.ERROR;
            console.log('Invalid Callback method');
        }
        return this;
    }
    /**
     * @returns {ContentProvider.Status|String}
     */
    status(){
        return this._status;
    }
}
/**
 * @type {ContentProvider.ResponseType}
 */
ContentProvider.ResponseType = {
    ARRAYBUFFER:'arraybuffer',
    BLOB:'blob',
    DOCUMENT:'document',
    JSON:'json',
    TEXT:'text',
};
/**
 * @type {ContentProvider.Status}
 */
ContentProvider.Status = {
    INIT : 'init',
    LOADING : 'loading',
    ERROR : 'error',
    READY : 'ready',
};
/**
 * @type {ContentProvider.Method}
 */
ContentProvider.Method = {
    GET: 'GET',
    POST: 'POST',
};


export { ContentManager , ContentProvider};