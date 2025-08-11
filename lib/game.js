import { ContentManager } from "./content";
import { Scene, SceneManager } from "./scenes";

/**
 * 
 */
class Game{
    /**
     * 
     */
    constructor(){

        if( Game._instance){
            return Game._instance;
        }
        Game._instance = this.initialize();
    }
    /**
     * @returns {Game}
     */
    initialize(){
        this._contents = ContentManager.manager();
        this._scene = SceneManager.manager().boot();
        this._gameTime = new GameTime();
        return this;
    }

    /**
     * @returns {Scene[]}
     */
    scenes(){
        return SceneManager.manager().stack();
    }
    /**
     * @returns {Scene}
     */
    scene(){
        return this._scene;
    }
    /**
     * @returns {GameTime}
     */
    time(){
        return this._gameTime;
    }

    update(){
        if(this.time().tick()){

        }
    }
    /**
     * @returns {Game}
     */
    static instance(){
        return Game._instance || new Game();
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

/**
 * 
 */
/**
 * GameTime
 * Tracks total runtime and per-frame elapsed time using Date.now().
 */
class GameTime {
    /**
     * 
     */
    constructor() {
        this.reset();
    }
    /**
     * @returns {Number}
     */
    now(){
        return Date.now();
    }

    /**
     * Update the game clock.
     * @returns {Number} elapsed time in seconds since last tick
     */
    tick() {
        const now = this.now(); // ms timestamp as number

        if (this._lastStamp) {
            this._elapsed = (now - this._lastStamp) / 1000; // to seconds
            this._time += this._elapsed;
        }
        else{
                        // first tick, no elapsed yet
            this._elapsed = 0;
        }

        this._lastStamp = now;
        return this._elapsed;
    }
    /**
     * 
     * @returns {Number}
     */
    elapsed() {
        return this._elapsed;
    }
    /**
     * 
     * @returns {Number}
     */
    time() {
        return this._time;
    }
    /**
     * 
     * @returns {Number}
     */
    reset() {
        this._time = 0;
        this._elapsed = 0;
        this._lastStamp = 0;
        this._start = this.now(); 
    }
}


export {Game,GameDev,GameTime};




