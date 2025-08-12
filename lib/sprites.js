import { Content,Image } from "./content";
import { Vector } from "./core";
import { Entity } from "./entities";

/**
 * @class SpriteData
 * Sprite Template
 */
class SpriteData extends Content{
    /**
     * @param {String} name 
     */
    constructor( name = '' ){
        super( name , Content.Type.Sprite);
        this._spriteSets = {};
    }
    /**
     * @param {Boolean} list 
     * @returns {Object|SpriteSet[]}
     */
    states( list = false ){
        return list ? Object.values(this._spriteSets) : this._spriteSets;
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
            this._spriteSets[state.name()] = state;
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
     * @param {String} stateName 
     * @returns {SpriteState}
     */
    state( stateName = '' ){
        return this.has(stateName) && this.states()[stateName].state() || null;
    }
    /**
     * @returns {SpriteState}
     */
    first(){
        return this.count() && this.states(true)[0] || null;
    }
}

/**
 * @class SpriteSet
 * Sprite States Template
 */
class SpriteSet{
    /**
     * 
     * @param {String} name 
     */
    constructor( name = 'spriteset'){
        this._name = name;
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
     * @returns {SpriteState}
     */
    state(){
        return new SpriteState(this);
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
        this._name = name;
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
 * @class {Sprite}
 */
class Sprite extends Entity{
    /**
     * 
     * @param {SpriteData} spriteData 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} active
     */
    constructor( spriteData = null , x = 0, y = 0 , active = true){

        this._base = spriteData instanceof SpriteData && spriteData || null;
        this._state = this.base() && this.base().first();
        this._active = active;

        super( this.base() && this.base().name() || '' , x , y);
    }
    /**
     * @returns {SpriteData}
     */
    base(){
        return this._base;
    }
    /**
     * @returns {SpriteState}
     */
    state(){
        this._state;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.base() !== null && this.state() !== null;
    }
    /**
     * @returns {Boolean}
     */
    active(){
        return this._active;
    }
    /**
     * @return {Boolean}
     */
    on(){
        this._active = true;
    }
    /**
     * @return {Boolean}
     */
    off(){
        this._active = false;
    }
    /**
     * 
     * @param {*} gameTime 
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
     * @returns {SpriteState}
     */
    animate(){
        if( this.isValid()){
            this._frame = this.count() ? ++this._frame % this.count() : 0;
        }
        return this;
    }
}

/**
 * @class {Particle}
 */
class Particle extends Entity{

}



export {Sprite,SpriteState,Particle};