import { ContentManager } from "./content";
import { Entity } from "./entities";
import { Graphics } from "./graphics";
import { InputManager } from "./input";
import { Scene, SceneManager } from "./scenes";
import { Sprite } from "./sprites";

/**
 * @class {Game}
 */
class Game{
    /**
     * @param {HTMLElement} container
     */ 
    constructor( container = null ){

        if( Game.__instance){
            return Game.__instance;
        }

        this._graphics = new Graphics(container, 30 , Graphics.Color.AliceBlue);
        this._loop = new GameLoop()
        this._player = new GamePlayer();

        //setup singleton
        Game.__instance = this;

        this.initialize();
    }
    /**
     * @returns {Game}
     */
    initialize( ){
        
        this.load();

        return this;
    }
    /**
     * @returns {Game}
     */
    load(){
        this.content().load( () => this.run );
        console.log('Loading contents ...')
        return this;
    }
    /**
     * @param {Boolean} resume
     * @returns {Game}
     */
    run( resume = false ){
        console.log(this);
        this.loop().start( ( gameTime ) => {
            Game.instance().update(gameTime);
        },resume ||false);
        console.log( resume ? 'Game Resumed' : 'Game Started')
        return this;
    }
    /**
     * 
     * @param {GameTime} gameTime 
     */
    update( gameTime ){
        //console.log( gameTime,this.scene() );
        this.graphics().clear();
        if( this.ready()){
            //update logics loop
            this.scene().update(gameTime);
            //update render loop
            this.scene().draw(this.graphics());
        }
        else{
            this.finalize();
        }
    }
    /**
     * @returns {Game}
     */
    pause(){
        this.loop().pause();
        console.log('Game Paused');
        return this;
    }
    /**
     * @returns {Game}
     */
    resume(){
        if( this.loop().paused()){
            //resume the run loop
            this.run(true);
        }
        return;
    }
    /**
     * Manually  finalize the game loop (remove all scenes) and finalize the application
     * @returns {Game}
     */
    quit(){
        this.manager().finalize();
        return this;
    }
    /**
     * @returns {Game}
     */
    unload(){
       //remove all memory instances and save required settings and progress. 
       console.log('Unloading Game Content');
       return this;
    }
    /**
     * 
     */
    finalize(){
        this.loop().stop();
        console.log('Game Finished');
        return this.unload();
    }
    /**
     * Save contents
     * @param {Number} slot 
     * @returns {Boolean}
     */
    save( slot = 0 ){

        return false;
    }
    /**
     * @returns {ContentManager}
     */
    content(){
        return ContentManager.manager();
    }
    /**
     * @returns {GameLoop}
     */
    loop(){
        return this._loop;
    }
    /**
     * @returns {Graphics}
     */
    graphics(){
        return this._graphics;
    }
    /**
     * @returns {GamePlayer}
     */
    player(){
        return this._player;
    }
    /**
     * @returns {GameTime}
     */
    time(){
        return this.loop().time();
    }
    /**
     * @returns {SceneManager}
     */
    manager(){
        return SceneManager.manager();
    }
    /**
     * @returns {Scene[]}
     */
    scenes(){
        return this.manager().states();
    }
    /**
     * @returns {Scene}
     */
    scene(){
        return this.manager().scene();
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.scene() !== null;
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this.loop().running();
    }
    /**
     * @returns {Game}
     */
    static instance(){
        return Game.__instance || new Game();
    }
    /**
     * @param {HTMLElement} container
     * @returns {Game}
     */
    static play( container ){
        const game = new Game(container);
        console.log(game);
        return game.run();
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
        this._origin = run ? this.now() : 0;
        this._running = run || false; 
    }
    /**
     * @returns {Number}
     */
    now(){
        return Date.now();
    }
    /**
     * @param {Boolean} resume
     * @returns {GameTime}
     */
    start( resume = false ){
        this._running = true;
        if( !resume ){
            this._origin = this.now();
        }
        return this;
    }
    /**
     * @param {Boolean} reset
     * @returns {GameTime}
     */
    stop( reset = false ){
        this._running = false;
        if( reset ){
            this._origin = 0;
        }
        return this;
    }
    /**
     * Update the game clock.
     * @returns {GameTime}
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
        return this;
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
    origin(){
        return this._origin;
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this._running;
    }
    /**
     * @returns {Boolean}
     */
    paused(){
        return this.origin() && !this.running();
    }
    /**
     * @returns {Boolean}
     */
    stopped(){
        return this.origin() === 0 && !this.running();
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
    loop( callback ){
        if( this.running() ){
            callback( this.time().tick() );
            window.requestAnimationFrame( () => this.loop( callback ) );
        }
    }
    /**
     * @param {Function} onUpdate
     * @param {Boolean} resume
     * @returns {GameLoop}
     */
    start( onUpdate ,resume = false ){
        if( !this.running() && typeof onUpdate === 'function'){
            this.time().start( resume);
            this.loop( onUpdate );
        }
        return this;
    }
    /**
     * @returns {GameLoop}
     */
    pause(){
        if( this.running()){
            this.time().stop();
        }
        return this;
    }
    /**
     * @returns {GameLoop}
     */
    stop(){
        if( this.running() ){
            this.time().stop(true);
        }
        return this;
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this.time().running();
    }
    /**
     * @returns {Boolean}
     */
    paused(){
        return this.time().paused();
    }
}

/**
 * @class {GamePlayer}
 */
class GamePlayer{
    /**
     * @param {String} name 
     */
    constructor(name = ''){
        this._name = name || GamePlayer.name;
        this._input = InputManager.instance();
        this._avatar = null;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
    }
    /**
     * @returns {Sprite}
     */
    avatar(){
        return this._avatar;
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.avatar() !== null;
    }
    /**
     * @returns {Sprite}
     */
    createPlayer(){
        const player = Sprite.createAt(
            '', //get the player avatar from somewhere
            0 ,0
        );
        if( player ){
            player.rename(this.name());
            this._avatar = player;
        }
        return this.avatar();
    }
    /**
     * @param {GameTime} gameTime 
     * @returns {GamePlayer}
     */
    update( gameTime ){
        if( this.ready()){


        }
        return this;
    }
}

export {Game,GameDev,GameTime,GamePlayer};




