import { Area, Point, Vector } from "./core";
import { CollissionManager } from "./physics";



/**
 * 
 */
class Entity{
    /**
     * @param {String} name
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor( name = 'entity', x = 0 , y = 0){
        this._name = name;
        this._position = new Vector(x,y);
        this._size = new Point();
        this._collision = CollissionManager.Type.None;
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
     * 
     * @returns {Boolean}
     */
    renderable(){
        return false;
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
    constructor(){
        super();
    }
}


export {Entity,Camera};


