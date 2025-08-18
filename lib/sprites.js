import { ContentManager } from "./content";
import { Area, Vector } from "./core";
import { Entity } from "./entities";
import { GameTime } from "./game";
import { Graphics } from "./graphics";


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
    constructor( name = '' , image = ''){
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
     * @returns {SpriteAnimation}
     */
    state( animation = ''){
        return new SpriteAnimation(this,animation);
    }
}
/**
 * @class {SpriteState}
 */
class SpriteAnimation{
    /**
     * @param {FrameSet} framedata 
     */
    constructor( framedata ){
        this._framedata = framedata instanceof FrameSet && framedata || null;
        
        this.initialize();
    }
    /**
     * 
     */
    initialize(){
        this._index = 0;
        this._round = 0;
        this._fps = this.framedata().fps();
    }
    /**
     * @returns {FrameSet}
     */
    framedata(){
        return this._framedata;
    }
    frames(){
        return this.framedata().frames();
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.frames().length;
    }
    /**
     * @returns {Number}
     */
    loops(){
        return this.framedata().loops();
    }
    /**
     * @returns {Number}
     */
    round(){
        return this._round;
    }
    /**
     * @returns {Boolean}
     */
    infinite(){
        return this.loops() === 0;
    }
    /**
     * @returns {Boolean}
     */
    done(){
        !this.infinite() && this.round() >= this.loops();
    }
    /**
     * @returns {Number}
     */
    index(){
        return this._index;
    }
    /**
     * @param {Number} index 
     * @returns {Number}
     */
    frame(){
        return this.frames()[ this.index() % this.count()] || 0;
    }
    /**
     * @returns {Boolean}
     */
    next(){
        this._index = ++this._index % this.count();
        return this.index() === 0;
    }
    /**
     * @returns {SpriteAnimation}
     */
    update(){
        if( this.next()){
            //loop
            if( !this.done()){
                this._round++;
            }
            else{
                //auto-reset
                this._round = 0;
            }
        }        
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
     * @param {Number} loops
     */
    constructor( name = '' , frames = [] , fps = 20 , loops = 0){
        super(name || FrameSet.name);
        this._frames = frames || [];
        this._loops = loops;
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
    loops(){
        return this._loops;
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



export {SpriteBase,Sprite,Particle};