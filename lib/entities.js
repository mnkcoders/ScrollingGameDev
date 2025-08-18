import { Area, Component, Point, Vector } from "./core";
import { CollissionManager } from "./physics";



/**
 * @class {Entity}
 */
class Entity extends Component{
    /**
     * @param {String} name
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor( x = 0 , y = 0){
        this._position = new Vector(x,y);
        this._size = new Point();
        this._collision = CollissionManager.Type.None;
        this.rename();
        this.initialize();
    }
    /**
     * to implement in extended classes
     */
    initialize(){

    }
    /**
     * 
     * @returns {String}
     */
    name(){
        return this._name;
    }
    /**
     * @param {String} name 
     * @returns {Entity}
     */
    rename( name = '' ){
        this._name = name || Entity.name;
        return this;
    }
    /**
     * @returns {CollissionManager.Type|String}
     */
    collision(){
        return this._collision;
    }
    /**
     * @returns {Boolean}
     */
    collidable(){
        return this.collision() !== CollissionManager.Type.None;
    }
    /**
     * 
     * @param {Entity} entity 
     * @returns {SpriteState}
     */
    interact( ){
        //call Collision Manager
        if( this.collidable()){
            CollissionManager.check(this);
        }
        return this;
    }
    /**
     * @returns {Entity}
     */
    testCollision(  ){
        if( this.collidable()){
            const collidedWith =  CollissionManager.instance().collide(this);

        }

        return this;
    }
    /**
     * @returns {Boolean}
     */
    drawable(){
        //return false;
        return this.draw === 'function';
    }
    /**
     * @returns {Vector}
     */
    position(){
        return this._position;
    }
    /**
     * @returns {Point}
     */
    size(){
        return this._size;
    }
    /**
     * @param {Vector} offset 
     * @returns {Entity}
     */
    move( offset ){
        if( offset instanceof Vector){
            this.position().add(offset);
        }
        return this;
    }
    /**
     * @param {Vector} position 
     * @returns {Entity}
     */
    moveTo( position ){
        if( position instanceof Vector ){
            this._position = position;
        }
        return this;
    }
    /**
     * @returns {Number}
     */
    x(){
        return this.position().x();
    }
    /**
     * @returns {Number}
     */
    y(){
        return this.position().y();
    }
    /**
     * @returns {Number}
     */
    width(){
        return this.size().x();
    }
    /**
     * @returns {Number}
     */
    height(){
        return this.size().y();
    }
    /**
     * @returns {Area}
     */
    area(){
        return new Area(this.x(),this.y,this.width(),this.height());
    }

    update( gameTime ){

        this.testCollision();
    }
}

/**
 * @class {Camera}
 */
class Camera extends Entity{
    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x = 0,y = 0){
        super(x,y);
        this.rename(Camera.name);
    }
    /**
     * @param {Boolean} offset
     * @returns {Area}
     */
    view( ){
        return this.area();
    }
    /**
     * @param {Number} grid
     * @returns {Area}
     */
    offsetGrid( grid = 32 ){
        if( grid ){
            const offset = this.area().scale(1.2);
            offset._x = this.x() - grid * 2;
            offset._x = this.y() - grid * 2;
            return offset;
        }
        return this.area();
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




export {Entity,Camera,SpriteBase,Sprite,Particle};


