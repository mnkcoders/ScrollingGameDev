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


export {Entity,Camera};


