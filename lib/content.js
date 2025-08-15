import { AudioManager } from "./audio";
import { Area } from "./core";
import * as TYPES from "./types";

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
        
        this._contents = {};

        this._data = new ContentData();

        return this;
    }
    /**
     * @returns {Object}
     */
    contents() {
        return this._contents;
    }
    /**
     * @returns {ContentData}
     */
    data(){
        return this._data;
    }
    /**
     * 
     * @param {Content} content 
     * @returns {ContentManager}
     */
    add(content) {
        if (content instanceof Content) {
            if (!this.hasType(content.type())) {
                this.contents()[content.type()] = {};
            }
            this.contents()[content.type()][content.name()] = content;
        }
        return this;
    }
    /**
     * 
     * @param {Function} onLoad 
     * @returns {ContentManager}
     */
    load(onLoad) {
        this.data().load( () => {
            this.populate( onLoad );
        } );
        return this;
    }
    /**
     * @param {Function} onLoad
     * @returns {ContentManager}
     */
    populate( onLoad ){
        const gd = this.data();
        if( gd.ready() ){
            gd.db().types().forEach( type => {
                gd.list(type).forEach( content => {
                    //content,type
                    switch( type){
                        case ContentData.Type.Audio:
                            this.add(AudioContent.create(content));
                            break;
                        case ContentData.Type.Image:
                            this.add(ImageContent.create(content));
                            break;
                        case ContentData.Type.Sprite:
                            //this.data().readSprite(content);
                            break;
                    }
                });
            });
            if( typeof onLoad === 'function'){
                onLoad();
            }            
        }
        return this;
    }
    /**
     * 
     * @param {String} name 
     * @param {Content.Type|String} type 
     * @returns {Content}
     */
    get( name = '', type = '' ){
        return this.hasType(type) && this.contents()[type][name] || null;
    }
    /**
     * @param {String} name 
     * @returns {AudioContent}
     */
    audio( name = '' ){
        return this.get(name,Content.Type.Audio);
    }
    /**
     * 
     * @param {String} name 
     * @returns {ImageContent}
     */
    image( name = ''){
        return this.get(name,Content.Type.Image);
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
        this._db = {};
        this._source = gameData;
        this._ready =false;
    }
    /**
     * @param {Boolean} list
     * @returns {Object|String[]}
     */
    db( list = false ){
        return list ? Object.keys(this._db) : this._db;
    }
    /**
     * @param {String} type 
     * @returns {Boolean}
     */
    has(type = ''){
        return type && this.db().hasOwnProperty(type);
    }
    /**
     * @param {String} type 
     * @returns {Object[]}
     */
    list(type = ''){
        return this.has(type) ? this.db()[type] : [];
    }
    /**
     * @returns {String[]}
     */
    types(){
        return Object.keys(this.db());
    }
    /**
     * 
     * @param {ContentType} content 
     * @param {String} type 
     * @returns 
     */
    add( content = null ){
        if( content instanceof ContentType && this.has(content.type())){
            this.db()[type][content.name()] = content;
        }
        return this;
    }
    readSprite( data ){
        //const sprite = new TYPES.SpriteData(data.name)
    }
    readSpriteSet( data ){

    }
    readParticle( data ){

    }
    readEmitter( data ){

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
     * @param {Function} onLoad 
     * @returns {ContentManager}
     */
    load( onLoad ){
        const loader = new ContentProvider(this.path(),ContentProvider.ResponseType.JSON);
        loader.request( response => {
            this._db = response;
            this._ready = true;
            if( typeof onLoad === 'function' ){
                onLoad();
            }
        } );
        return this;
    }
}
/**
 * @type {ContentData.Type|String}
 */
ContentData.Type = {
    Image : 'image',
    Audio : 'audio',
    Sprite : 'sprite',
};

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
                callback( request.response );
                this._status = ContentProvider.Status.READY;
            };
            request.onerror = () => {
                this._status = ContentProvider.Status.ERROR;
            };
            this._status = ContentProvider.Status.LOADING;
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




/**
 * @class {Content}
 */
class Content {
    /**
     * @param {*} name 
     * @param {*} type 
     */
    constructor(name = '', type = '') {
        this._name = name || Content.name;
        this._type = type || ''
        this._buffer = null;
        this._status = ContentProvider.Status.Loading;
    }
    /**
     * 
     */
    initialize(){
        if( this.content() ){
            this._status = ContentProvider.Status.Ready;
        }
    }
    /**
     * @returns {String}
     */
    name() {
        return this._name;
    }
    /**
     * @returns {String}
     */
    status(){
        return this._status;
    }
    /**
     * @returns {Boolean}
     */
    valid(){
        return this.status() === ContentProvider.Status.Ready;
    }
    /**
     * @returns {String}
     */
    type() {
        return this._type;
    }
    /**
     * @returns {*}
     */
    content() {
        return this._buffer;
    }
    /**
     * @param {*} buffer 
     * @returns {Content}
     */
    setBuffer( buffer = null ){
        if( buffer && this.content() === null ){
            this._buffer = buffer;
        }
        return this;
    }
    /**
     * @returns {String}
     */
    path() {
        return `assets/${this.type()}/${this.name()}`;
    }
    /**
     * @returns {Boolean}
     */
    ready() {
        return this.content() !== null;
    }
    /**
     * @returns {Content}
     */
    load() {
        return this;
    }
    /**
     * @param {Object} content 
     * @returns {Content}
     */
    onLoad(content = null) {
        if (content) {
            this._buffer = content;
            this.initialize();
        }
        return this;
    }
}
/**
 * @type {Content.Type}
 */
Content.Type = {
    Audio: 'audio',
    Image: 'image',
};
/**
 * @class {Audio}
 */
class AudioContent extends Content {
    /**
     * @param {String} name 
     */
    constructor(name = '') {
        super(name || AudioContent.name, Content.Type.Audio);
    }
    /**
     * 
     */
    initialize(){
        super.initialize();
    }
    /**
     * @returns {AudioContent}
     */
    load(){
        return this.loadAudio();
    }
    /**
     * https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/1.loading-and-playing-sound-files.html
     * 
     * @returns {AudioContent}
     */
    loadAudioBuffer(){
        const loader = new ContentProvider(
            this.path(),
            ContentProvider.Method.GET,
            ContentProvider.ResponseType.ARRAYBUFFER
        );
        loader.request( ( response ) => {
            AudioManager.decode( response, this );
            //const audio = AudioManager.instance().context();
            //audio.decodeAudioData( response, (input) => this._buffer = input);
        });
        return this;
    }
    /**
     * @returns {AudioContent}
     */
    loadAudio() {
        const audio = new Audio(this.path());
        audio.addEventListener('load', () => {
            this.onLoad(audio);
        });
        audio.addEventListener( 'error', () => {
            console.log(`Error loading [${this.path()}]`);
        });
        return this;
    }
    /**
     * @param {Sound} content 
     * @returns {AudioContent}
     */
    onLoad( content = null ){
        if( content instanceof Sound){
            super.onLoad(content);
        }
        return this;
    }
}
/**
 * @class {Image}
 */
class ImageContent extends Content {
    /**
     * @param {String} name 
     * @param {Number} frameWidth
     * @param {Number} frameHeight
     */
    constructor(name = '', frameWidth = 0, frameHeight = 0) {
        super(name || ImageContent.name, Content.Type.Image);
        this._frameWidth = frameWidth || 1;
        this._frameHeight = frameHeight || this._frameWidth;
        this._width = 0;
        this._height = 0;
    }
    /**
     * 
     */
    initialize() {
        if( this.content()){
            this._width = this.content().width();
            this._height = this.content().height();
            super.initialize();
        }
    }
    /**
     * @returns {ImageContent}
     */
    load() {
        const img = new Image( /* no params */);

        img.addEventListener( 'load', () => {
            this.onLoad(img);
        });

        img.addEventListener('error', () => {
            console.log(`Error loading [${this.path()}]`);
        });

        img.src = this.path();

        return this;
    }
    /**
     * 
     * @param {Image} content 
     * @returns 
     */
    onLoad(content = null) {
        if (content && content instanceof Image) {
            super.onLoad(content);
        }
        return this;
    }
    /**
     * @returns {CanvasImageSource}
     */
    image() {
        return this.content();
    }
    /**
     * @returns {Number}
     */
    width() {
        return this._width;
    }
    /**
     * @returns {Number}
     */
    height() {
        return this._height;
    }
    /**
     * @returns {Number}
     */
    cols() {
        return this.width() / this.frameWidth();
    }
    /**
     * @returns {Number}
     */
    rows() {
        return this.height() / this.frameHeight();
    }
    /**
     * @returns {Number}
     */
    frameWidth() {
        return this._frameWidth;
    }
    /**
     * @returns {Number}
     */
    frameHeight() {
        return this._frameHeight;
    }
    /**
     * @returns {Boolean}
     */
    boxed() {
        return this.frameWidth() === this.frameHeight();
    }
    /**
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Number}
     */
    get(x = 0, y = 0) {
        return (y % this.rows()) * this.cols() + (x % this.cols());
    }
    /**
     * @param {Number} index 
     * @returns {Area}
     */
    extract(index = 0) {
        const width = this.frameWidth();
        const height = this.frameHeight();
        const x = index % this.cols();
        const y = index / this.rows();
        return new Area(x * width, y * height, width, height);
    }
    /**
     * @param {Object} image 
     * @returns {ImageContent}
     */
    static create( image ){
        return new ImageContent(
                image.name,
                image.frameWidth || 1,
                image.frameHeight || 1
        );
    }
}


export { ContentManager , Content,ContentType, AudioContent, ImageContent };