import { ImageContent as SpriteSheet} from "./content";

/**
 * @class {ContentType}
 */
class ContentType{
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
     * @returns {String|ContentType.Type}
     */
    type(){
        return this;
    }
}


/**
 * @type {ContentType.Type|String}
 */
ContentType.Type = {
    SpriteSet: 'spriteset',
    Sprite: 'sprite',
};

/**
 * @class {SpriteData}
 * Sprite Template
 */
class SpriteData extends ContentType{
    /**
     * @param {String} name
     * @param {SpriteSheet} source 
     */
    constructor( name = '', source = null ){
        super(name || SpriteData.name);
        this._source = source || null;
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
class SpriteSet extends ContentType{
    /**
     * 
     * @param {String} name 
     */
    constructor( name = '' ){
        super(name || SpriteSet.name);
        this._frameSets = {};
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
    create( animation = ''){
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
        super(template.name());
        this._frameSets = template.framesets();
        this._frame = 0;
        this._animation = this.frameSet(animation) || this.first();
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
class FrameSet extends ContentType{
    /**
     * @param {String} name 
     * @param {Image} image
     * @param {Number[]} frames
     * @param {Number} fps
     */
    constructor( name = '' , image = null , frames = [] , fps = 20 ){
        super(name || FrameSet.name);
        this._image = image instanceof Image && image || null;
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
     * @returns {Image}
     */
    image(){
        return this._image;
    }
    /**
     * @returns {Number}
     */
    fps()
    {
        return this._fps;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.count() && this.image() !== null;
    }
}





/**
 * @class {ParticleData}
 */
class ParticleData extends ContentType{
    /**
     * @param {SpriteSheet} source 
     */
    constructor( name = '', source = null ){
        super(name || ParticleData.name );
        this._source = source || null;
    }
}



export {ContentType,SpriteData,SpriteSet,FrameSet};