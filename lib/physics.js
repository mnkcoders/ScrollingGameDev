import { Entity } from "./entities";
import { MapScene, SceneManager } from "./scenes";



/**
 * @class CollisionManager
 */
class CollissionManager{
    /**
     * 
     * @returns {CollissionManager}
     */
    constructor(){
        if( CollissionManager._instance ){
            return CollissionManager._instance;
        }

        CollissionManager._instance = this.initialize();
    }
    /**
     * @returns {CollissionManager}
     */
    initialize(){


        return this;
    }

    /**
     * @returns {Boolean}
     */
    runtime(){
        return SceneManager.current().is( MapScene.name );
    }
    /**
     * @returns {Entity[]}
     */
    elements(){
        return SceneManager.current().contents() || [];
    }
    /**
     * 
     * @param {Entity} A 
     * @param {Entity} B 
     * @returns {CollissionManager.Type|String}
     */
    collide( A = null , B = null ){
        if( A instanceof Entity && B instanceof Entity && A.collidable() && B.collidable()){
            return this.matchCollisionRules(A,B);
        }
        return CollissionManager.Type.None;
    }
    /**
     * 
     * @param {Entity} A 
     * @param {Entity} B 
     * @returns {Boolean}
     */
    matchCollisionRules(A , B){
        return false;
    }
    /**
     * @param {Entity} entity
     * @returns {Entity[]} Collided entities 
     */
    static check( entity = null ){
        const collided = [];
        const manager = CollissionManager.instance();
        if( entity instanceof Entity && manager.runtime()){
            manager.elements().forEach( collided => {
                //apply here the colliderules
                if( entity !== collided ){
                    manager.collide(entity,collided);
                }
            });
        }
        return collided;
    }

    /**
     * @returns {CollissionManager}
     */
    static instance(){
        return CollissionManager._instance || new CollissionManager();
    }
}
/**
 * @type {CollissionManager.Type|Object}
 */
CollissionManager.Type = {
    None: 'none',
    Point: 'point',
    Area: 'area',
    Sprite: 'sprite',
};

export {CollissionManager};