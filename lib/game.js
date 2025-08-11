import { ContentProvider } from "./content";
import { Graphics } from "./graphics";
import { Scene, SceneManager } from "./scenes";

/**
 * @class {Game}
 */
class Game{
    /**
     * 
     */
    constructor(){

        if( Game._instance){
            return Game._instance;
        }

        //setup singleton
        Game._instance = this;        
        
        this.initialize();
        
        this.load();
    }
    /**
     * @returns {Game}
     */
    initialize(){
        
        this._graphics = new Graphics();
        this._loop = new GameLoop();

        return this;
    }
    /**
     * 
     */
    load(){
        this.contents().loadContents( this.run );
    }
    /**
     * 
     */
    run(){
        this.loop().start( this.update );
    }
    /**
     * @returns {ContentProvider}
     */
    contents(){
        return ContentProvider.manager();
    }
    /**
     * @returns {GameLoop}
     */
    loop(){
        this._loop;
    }
    /**
     * @returns {Graphics}
     */
    graphics(){
        return this._graphics;
    }
    /**
     * @returns {GameTime}
     */
    time(){
        return this.loop().time();
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
        return SceneManager.current();
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.scene() !== null;
    }
    /**
     * 
     * @param {GameTime} gameTime 
     */
    update( gameTime ){
        console.log( gameTime );
        if( this.ready()){
            //update logics loop
            this.scene().update(gameTime);
            //update render loop
            this.scene().drawContents(this.graphics());
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
     * @param {Boolean}
     */
    constructor( run = false ) {
        this._time = 0;
        this._elapsed = 0;
        this._lastStamp = 0;
        this._start = run ? this.now() : 0;
        this._running = run || false; 
    }
    /**
     * @returns {Number}
     */
    now(){
        return Date.now();
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this._running;
    }
    /**
     * @returns {GameTime}
     */
    start(){
        this._running = true;
        this._start = this.now();
        return this;
    }
    /**
     * @returns {GameTime}
     */
    stop(){
        this._running = false;
        return this;
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
    delta() {
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
     * @returns {Number}
     */
    started(){
        return this._start;
    }
    /**
     * @returns {GameTime}
     */
    static run(){
        return new GameTime(true);
    }
}

/**
 * @class {GameLoop}
 */
class GameLoop{

    constructor(){
        this._gameTime = new GameTime();
    }
    /**
     * @returns {GameTime}
     */
    time(){
        return this._gameTime;
    }
    /**
     * @param {Function} callback 
     */
    update( callback ){
        if( this.running() ){
            callback( this.time() );
            window.requestAnimationFrame( () => this.update( callback ) );    
        }
    }
    /**
     * @returns {GameLoop}
     */
    start( callback ){
        if( !this.running() && typeof callback === 'function' ){
            this.time().start();
            this.update( callback );    
        }
        return this;
    }
    /**
     * @returns {GameLoop}
     */
    stop(){
        if( this.running() ){
            this.time().stop();
        }
        return this;
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this.time().running();
    }
}


export {Game,GameDev,GameTime};




