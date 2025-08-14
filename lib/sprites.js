import { ImageContent as SpriteSheet} from "./content";
import { Area, Vector } from "./core";
import { Entity } from "./entities";
import { GameTime } from "./game";
import { Graphics } from "./graphics";

/**
 * @class {SpriteData}
 * Sprite Template
 */
class SpriteData{
    /**
     * @param {SpriteSheet} source 
     */
    constructor( source = null ){
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
class SpriteSet{
    /**
     * 
     * @param {String} name 
     */
    constructor( name = ''){
        this._name = name || SpriteSet.name;
        this._frameSets = {};
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
    }
    /**
     * @param {FrameSet} frameSet 
     * @returns {SpriteSet}
     */
    add( frameSet = null ){
        if( frameSet instanceof FrameSet && frameSet.isValid()){
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
 * @class {FrameSEt}
 * Frame collection manager
 */
class FrameSet{
    /**
     * @param {String} name 
     * @param {Image} image
     * @param {Number[]} frames
     * @param {Number} fps
     */
    constructor( name = '' , image = null , frames = [] , fps = 20 ){
        this._name = name || FrameSet.name;
        this._image = image instanceof Image && image || null;
        this._frames = frames || [];
        this._fps = fps;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
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
    isValid(){
        return this.name().length && this.frames().length && this.image() !== null;
    }
}

/**
 * @class {SpriteBase}
 */
class SpriteBase extends Entity{

    constructor( spriteData = null,  x =0 , y = 0 , active = false ){
        this._source = spriteData instanceof SpriteData && spriteData || null;
        this._active = active;
        super(x , y );
    }
    /**
     * 
     */
    initialize(){
        this.rename(this.source().name());
    }
    /**
     * @returns {SpriteData}
     */
    source(){
        return this._source;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.source() !== null;
    }
    /**
     * 
     * @returns {Boolean}
     */
    active(){
        return this._active;
    }
    /**
     * @returns {SpriteBase}
     */
    on(){
        this._active = true;
        return this;
    }
    /**
     * @returns {SpriteBase}
     */
    off(){
        this._active = false;
        return this;
    }
    /**
     * @returns {SpriteBase}
     */
    toggle(){
        this._active = !this._active;
        return this;
    }
    /**
     * @returns {Boolean}
     */
    drawable(){
        return super.drawable() && this.active();
    }
    /**
     * @param {Graphics} graphics 
     * @param {Area} view 
     * @returns {SpriteBase}
     */
    draw( graphics , view ){
        if( view.contains(this.area())){
            //capture current state
        }
        return this;
    }
}

/**
 * @class {Sprite}
 */
class Sprite extends SpriteBase{
    /**
     * 
     * @param {SpriteData} spriteData 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} active
     */
    constructor( spriteData = null , x = 0, y = 0 , active = true){
        super( spriteData , x , y, active);
    }
    /**
     * 
     */
    initialize(){
        this._state = this.source() && this.source().first() || null;
    }
    /**
     * @returns {SpriteState}
     */
    state(){
        this._state;
    }
    /**
     * @param {String} state 
     * @returns {Boolean}
     */
    changeState( state = '' , animation = ''){
        if( this.has(state)){
            const template = this.source().state(state);
            if( template ){
                this._state = template.create(animation);
                return true;
            }
        }
        return false;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return super.ready() && this.state() !== null;
    }
    /**
     * 
     * @param {GameTime} gameTime 
     */
    update( gameTime){
        super.update( gameTime );
        if( this.ready()){
            this.state().animate();
            if( this.state().speed().moving()){
                this.move(this.state().speed());
            }
            super.update(gameTime);
        }
        return this;
    }
}
/**
 * @class {SpriteState}
 */
class SpriteState{
    /**
     * @param {SpriteSet} spriteSet 
     */
    constructor( spriteSet = null ){
        this._spriteSet = spriteSet instanceof SpriteSet && spriteSet || null;
        this._frameSet = this.base() && this.base().first() || null;
        this._frame = 0;
        this._speed = Vector.Zero();
    }
    /**
     * 
     * @returns {SpriteSet}
     */
    base(){
        return this._spriteSet;
    }
    /**
     * @returns {FrameSet}
     */
    frameSet(){
        return this._frameSet;
    }
    /**
     * @returns {Boolean}
     */
    isValid(){
        return this.base() !== null && this.frameSet() !== null;
    }
    /**
     * @returns {Image}
     */
    image(){
        return this.isValid() && this.frameSet().image() || null;
    }
    /**
     * @returns {Number}
     */
    fps(){
        return this.isValid() && this.frameSet().fps() || 0;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.isValid() && this.frameSet().count() || 0;
    }
    /**
     * @returns {Vector}
     */
    speed(){
        return this._speed;
    }
    /**
     * @returns {SpriteSet}
     */
    animate(){
        if( this.isValid()){
            this._frame = this.count() ? ++this._frame % this.count() : 0;
        }
        return this;
    }
}




/**
 * @class {ParticleData}
 */
class ParticleData{
    /**
     * @param {SpriteSheet} source 
     */
    constructor( source = null ){
        this._source = source || null;
    }
}

/**
 * @class {Particle}
 */
class Particle extends SpriteBase{
    /**
     * @param {ParticleData} particleData 
     */
    constructor( particleData = null ){
        this._base = particleData;
    }
    /**
     * 
     * @param {Graphics} graphics 
     * @param {Area} display 
     * @returns {Particle}
     */
    draw( graphics , display ){
        return this;
    }
    /**
     * @param {GameTime} gameTime 
     */
    update( gameTime ){

    }
}


export {SpriteBase,Sprite,SpriteSet as SpriteState,Particle};