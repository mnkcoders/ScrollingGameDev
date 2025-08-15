import { ContentManager } from "./content";
import { Area, Vector } from "./core";
import { Entity } from "./entities";
import { GameTime } from "./game";
import { Graphics } from "./graphics";


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
    /**
     * @param {String} name 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} active 
     * @returns 
     */
    static createAt( name = '',x = 0 , y = 0, active = true ){
        const template = ContentManager.manager().spriteData(name);
        
        return template ? new Sprite(template,x,y, active ) : null;
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


export {SpriteBase,Sprite,Particle};