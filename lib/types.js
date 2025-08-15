import { ContentManager, ContentProvider} from "./content";
import { AudioManager } from "./audio";
import { Area } from "./core";


/**
 * @class {Content}
 */
class Content{
    /**
     * @param {String} name 
     */
    constructor( name = '' ){
        this._type = this.constructor.name;
        this._name = name || this.type();
    }
    /**
     * @returns {String}
     */
    toString(){
        return this._name;
    }
    /**
     * @returns {String}
     */
    name(){
        return this;
    }
    /**
     * @returns {String|Content.Type}
     */
    type(){
        return this;
    }
}
/**
 * @type {Content.Type|String}
 */
Content.Type = {
    Image: 'image',
    Audio: 'audio',
    SpriteSet: 'spriteset',
    Sprite: 'sprite',
    Frameset: 'frameset',
    Sound: 'sound',
    SoundSet: 'soundset',
    Music: 'music',
    Ambient: 'ambient',
};

/**
 * @class {Content}
 */
class GameAsset extends Content{
    /**
     * @param {*} name 
     * @param {*} type 
     */
    constructor(name = '') {
        super(name)
        this._buffer = null;
        this._status = GameAsset.Status.Loading;
    }
    /**
     * 
     */
    initialize(){
        if( this.content() ){
            this._status = GameAsset.Status.Ready;
        }
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
        return this.status() === GameAsset.Status.Ready;
    }
    /**
     * @returns {*}
     */
    content() {
        return this._buffer;
    }
    /**
     * @param {*} buffer 
     * @returns {GameAsset}
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
     * @returns {GameAsset}
     */
    load() {
        return this;
    }
    /**
     * @param {Object} content 
     * @returns {GameAsset}
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
 * @type {GameAsset.Type}
 */
GameAsset.Type = {
    Audio: 'audio',
    Image: 'image',
};
/**
 * @type {GameAsset.Status|String}
 */
GameAsset.Status = {
    Loading: 'loading',
    Ready: 'ready',
};
/**
 * @class {Audio}
 */
class AudioContent extends GameAsset {
    /**
     * @param {String} name 
     */
    constructor(name = '') {
        super(name || AudioContent.name, GameAsset.Type.Audio);
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
     * @param {String} url
     * @returns {ContentProvider}
     */
    createProvider( url = ''){
        return ContentManager.provider(url,
            ContentProvider.Method.GET,
            ContentProvider.ResponseType.ARRAYBUFFER);
    }
    /**
     * https://dobrian.github.io/cmp/topics/sample-recording-and-playback-with-web-audio-api/1.loading-and-playing-sound-files.html
     * 
     * @returns {AudioContent}
     */
    loadAudioBuffer(){
        const provider = this.createProvider(this.path());
        provider.request( ( response ) => {
            AudioManager.decode( response, this );
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
class ImageContent extends GameAsset {
    /**
     * @param {String} name 
     * @param {Number} frameWidth
     * @param {Number} frameHeight
     */
    constructor(name = '', frameWidth = 0, frameHeight = 0) {
        super(name || ImageContent.name, GameAsset.Type.Image);
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


/**
 * @class {TileSet}
 */
class TileSet extends ImageContent{
    /**
     * @param {ImageContent} source
     * @param {Number} size
     */
    constructor( source ){
        super(source);
    }
    /**
     * 
     */
    initialize(){
        this._cols = this.width() / this.size();
        this._rows = this.height() / this.size();
    }
    /**
     * @returns {Number}
     */
    size(){
        return this.frameWidth();
    }
    /**
     * @param {Number} index 
     * @returns {Area}
     */
    tile( index = 0 ){
        return this.extract(index);
    }
    /**
     * @param {ImageContent} source 
     * @returns {TileSet}
     */
    static create( source ){
        return source && source.boxed() && new TileSet(source) || null;
    }
}


/**
 * @class {SpriteData}
 * Sprite Template
 */
class SpriteData extends Content{
    /**
     * @param {String} name
     * @param {ImageContent} image 
     */
    constructor( name = '' ){
        super(name || SpriteData.name);
        this._states = {};
    }
    /**
     * @param {Boolean} list 
     * @returns {Object|SpriteSet[]}
     */
    states( list = false ){
        return list ? Object.values(this._states) : this._states;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.states().length;
    }
    /**
     * @param {SpriteSet} state 
     * @returns {SpriteData}
     */
    add( state ){
        if( state instanceof SpriteSet ){
            this._states[state.name()] = state;
        }
        return this;
    }
    /**
     * @param {String} stateName 
     * @returns {Boolean}
     */
    has( stateName = '' ){
        return stateName && this.states().hasOwnProperty(stateName);
    }
    /**
     * @param {String} state 
     * @returns {SpriteSet}
     */
    state( state = '' ){
        return this.has(state) && this.states()[state] || null;
    }
    /**
     * @returns {SpriteSet}
     */
    first(){
        return this.count() && this.states(true)[0] || null;
    }
}

/**
 * @class {SpriteSet}
 * Sprite States Template
 */
class SpriteSet extends Content{
    /**
     * 
     * @param {String} name 
     * @param {String} image
     */
    constructor( name = '' ,image = ''){
        super(name || SpriteSet.name);
        this._frameSets = {};
        this._image = image || '';
    }
    /**
     * @param {FrameSet} frameSet 
     * @returns {SpriteSet}
     */
    add( frameSet = null ){
        if( frameSet instanceof FrameSet && frameSet.ready()){
            this._frameSets[frameSet.name()] = frameSet;
        }
        return this;
    }
    /**
     * @param {String} frameSet 
     * @returns {Boolean}
     */
    has( frameSet = '' ){
        return frameSet && this.framesets().hasOwnProperty(frameSet);
    }
    /**
     * @returns {FrameSet[]|Object}
     */
    framesets( list = false ){
        return list && Object.values(this._frameSets) || this._frameSets;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.framesets( true ).length;
    }
    /**
     * 
     * @param {String} name 
     * @returns {FrameSet}
     */
    frameSet( name = '' ){
        return this.has(name) && this.framesets()[name] || null;
    }
    /**
     * @returns {FrameSet}
     */
    first(){
        return this.count() && this.framesets(true)[0] || null;
    }
    /**
     * 
     * @returns {SpriteState}
     */
    state( animation = ''){
        return new SpriteState(this,animation);
    }
}
/**
 * @class {SpriteState}
 */
class SpriteState extends SpriteSet{
    /**
     * @param {SpriteSet} template 
     * @param {String} animation
     */
    constructor( template = null, animation = ''){
        super(template.name(),template._image);
        this._frameSets = template.framesets();
        this._frame = 0;
        this._animation = this.frameSet(animation) || this.first();
        
        this.initialize();
    }
    /**
     * 
     */
    initialize(){
        this._content = ContentManager.manager().image(this._image);
    }
    /**
     * @returns {ImageContent}
     */
    content(){
        return this._content;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        this.content() instanceof ImageContent;
    }

    /**
     * @returns {FrameSet}
     */
    animation(){
        return this._animation;
    }
    /**
     * @returns {Number}
     */
    frame(){
        return this._frame;
    }
    /**
     * @returns {SpriteState}
     */
    animate( ){
        this._frame = ++this.frame() % this.animation().count();
        if( this.frame() === 0){
            this.update();
        }

        return this;
    }
    /**
     * @returns {SpriteState}
     */
    update(){
        //handle here animation behaviours while running the loop        
        
        return this;
    }
}

/**
 * @class {FrameSet}
 * Frame collection manager
 */
class FrameSet extends Content{
    /**
     * @param {String} name 
     * @param {Number[]} frames
     * @param {Number} fps
     */
    constructor( name = '' , frames = [] , fps = 20 ){
        super(name || FrameSet.name);
        this._frames = frames || [];
        this._fps = fps;
    }
    /**
     * @returns {Number[]}
     */
    frames(){
        return this._frames;
    }
    /**
     * @returns {Boolean}
     */
    empty(){
        return this.frames().length === 0;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.frames().length;
    }
    /**
     * @param {Number} index 
     * @returns {Number}
     */
    frame( index = 0){
        return this.count() && this.frames()[ index % this.count()] || 0;
    }
    /**
     * @returns {Number}
     */
    fps()
    {
        return this._fps;
    }
}

/**
 * @class {ParticleData}
 */
class ParticleData extends Content{
    /**
     * @param {ImageContent} source 
     */
    constructor( name = '', source = null ){
        super(name || ParticleData.name );
        this._source = source || null;
        this._frames
    }
}



export {SpriteData,SpriteSet,FrameSet,ParticleData,Content,AudioContent,ImageContent,TileSet};