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
        return SceneManager.current().elements() || [];
    }
    /**
     * 
     * @param {Entity} A 
     * @param {Entity} B 
     */
    collide( A = null , B = null ){

    }
    /**
     * @param {Entity} entity 
     */
    static check( entity = null ){
        const manager = CollissionManager.instance();
        if( entity instanceof Entity && manager.runtime()){
            manager.elements().forEach( collided => {
                //apply here the colliderules
                if( entity !== collided ){
                    manager.collide(entity,collided);
                }
            });
        }
    }

    /**
     * @returns {CollissionManager}
     */
    static instance(){
        return CollissionManager._instance || new CollissionManager();
    }
}

export {CollissionManager};