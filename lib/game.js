import { ContentManager } from "./content";
import { SceneManager } from "./scenes";

/**
 * 
 */
class Game{
    constructor(){
        this._contents = ContentManager.manager();
        this._scenes = SceneManager.manager();
    }
}



/**
 * 
 */
class GameDev extends Game{


    constructor(){
        super();

    }

}



export {Game,GameDev};




