import { Area } from "./core";

/**
 * @class {ContentProvider}
 */
class ContentProvider {
    /**
     * 
     * @returns {ContentProvider}
     */
    constructor() {
        if (ContentProvider._instance) {
            return ContentProvider._instance;
        }

        this._contents = {};

        ContentProvider._instance = this.initialize();
    }
    /**
     * @returns {ContentProvider}
     */
    initialize() {

        this._ready = false;

        return this;
    }
    /**
     * @returns {Object}
     */
    contents() {
        return this._contents;
    }
    /**
     * @returns {Content[]}
     */
    list() {
        const contents = [];
        Object.values(this.contents()).forEach(collection => {
            collection.forEach(content => contents.push(content));
        });
        return contents;
    }
    /**
     * 
     * @param {Content} content 
     * @returns {ContentProvider}
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
     * @param {String} type 
     * @returns {Boolean}
     */
    hasType(type = '') {
        return type && this.contents().hasOwnProperty(type) || false;
    }
    /**
     * 
     * @param {Function} onReady 
     * @returns {ContentProvider}
     */
    loadContents(onReady) {
        if (typeof onReady === 'function') {
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
    static manager() {

        return ContentProvider._instance || new ContentProvider();
    }
}
/**
 * @class {ContentLoader}
 */
class ContentLoader{
    /**
     * @param {String} url 
     */
    constructor( url = ''){
        this._url = url || '';
        this._status = ContentLoader.Status.Loading;
    }
    /**
     * @returns {String}
     */
    url(){
        return this._url;
    }
    /**
     * @param {Function} callback 
     * @returns {ContentLoader}
     */
    request( callback ){
        const request = new XMLHttpRequest();
        request.open("GET", this.url() );
        request.responseType = "arraybuffer";
        request.onload = () => {
            callback( request.response );
            this._status = ContentLoader.Status.Ready;
        };
        request.onerror = () => {
            this._status = ContentLoader.Status.Error;
        };
        request.send();
        return this;
    }
}
/**
 * @type {ContentLoader.Status}
 */
ContentLoader.Status = {
    Loading : 'loading',
    Error : 'error',
    Ready : 'ready',
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
        this._status = ContentLoader.Status.Loading;
    }
    /**
     * 
     */
    initialize(){
        if( this.content() ){
            this._status = ContentLoader.Status.Ready;
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
        return this.status() === ContentLoader.Status.Ready;
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
    Drawable: 'drawable',
    Image: 'image',
    Map: 'map',
    TileSet: 'tileset',
    SpriteSet: 'spriteset',
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
        const audio = new AudioContext();
        let buffer = null;        
        const loader = new ContentLoader(this.path());
        loader.request( ( response ) => {
            audio.decodeAudioData(undecodedAudio, (data) => buffer = data);
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
}



export { ContentProvider, Content, AudioContent, ImageContent };