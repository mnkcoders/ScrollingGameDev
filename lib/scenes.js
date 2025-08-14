import { GameTime } from "./game";
import { Graphics } from "./graphics";
import { Camera, Entity } from "./entities";
import { GameMap, GameWorld, MapLayer } from "./world";
import * as UI from './ui';

/**
 * 
 */
class SceneManager{
    /**
     * 
     * @returns {SceneManager}
     */
    constructor(){
        if( SceneManager._instance ){
            return SceneManager._instance;
        }

        SceneManager._instance = this.initialize();
    }
    /**
     * @returns {SceneManager}
     */
    initialize(){
        //this._stack = [ new BootScene() ];
        this._boot = new BootScene();
        this.push(new TitleScene());
        return this;
    }
    /**
     * @returns {Scene}
     */
    boot(){
        return this._boot;
    }    
    /**
     * @returns {SceneManager}
     */
    finalize(){
        this.boot().clear();
        return this;
    }
    /**
     * @returns {Scene[]}
     */
    states(){
        return this.boot().stack() || [];
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.states().length;
    }
    /**
     * 
     * @param {Scene} scene 
     * @returns {SceneManager}
     */
    push( scene = null ){
        this.boot().push(scene);
        return this;
    }
    /**
     * 
     * @returns {Scene}
     */
    back( ){
        if(this.count() > 1){
            this.boot().pop();
        }
        return this.scene();
    }
    /**
     * @param {String} status 
     * @returns {Scene}
     */
    backto( status = '' ){
        const index = status && this.states().map( scn => scn.name() ).indexOf( status ) || 0;
        this._stack = this.states().slice(0,index);
        return this.scene();
    }


    /**
     * @returns {Boolean}
     */
    empty(){
        return this.count() === 0;
    }
    /**
     * @returns {Scene}
     */
    scene(){
        return this.boot().last();
    }
    /**
     * @param {String} name 
     * @returns {Boolean}
     */
    is( name = ''){
        return this.scene() && this.scene().is(name) || false;
    }

    /**
     * @returns {Scene}
     */
    static current(){
        return SceneManager.manager().scene();
    }
    /**
     * 
     * @returns {SceneManager}
     */
    static manager(){
        return SceneManager._instance || new SceneManager();
    }
}
/**
 * 
 */
class Scene{
    /**
     * @param {Boolean} pinned 
     */
    constructor( pinned = false ){
        this._stack = [];
        this._pinned = pinned || false;
        this.initialize();
    }
    /**
     * Use override to implement
     */
    initialize(){
        //
    }
    /**
     * @returns {String}
     */
    name(){
        return this.constructor.name;
    }
    /**
     * @returns {Boolean}
     */
    pinned(){
        return this._pinned;
    }
    /**
     * @param {String} name 
     * @returns {Boolean}
     */
    is( name = ''){
        return name && name === this.name();
    }
    /**
     * @returns {Scene[]}
     */
    stack(){
        return this._stack;
    }
    /**
     * @param {Scene} scene 
     * @returns {Scene}
     */
    push( scene = null ){
        if( scene instanceof Scene ){
            this._stack.push(scene);
        }
        return this;
    }
    /**
     * @returns {Scene}
     */
    pop(){
        if( !this.last().pinned()){
            //cannot move static scenes
            this.stack().pop();            
        }
        return this;
    }
    /**
     * @returns {Scene}
     */
    first(){
        return this.stack().length && this.stack()[0] || null;
    }
    /**
     * @returns {Scene}
     */
    last(){
        return this.stack().length && this.stack()[this.stack().length-1] || null;
    }
    /**
     * @param {Graphics} graphics
     * @returns {Scene} 
     */
    draw( graphics ){
        this.stack().forEach( scene => scene.draw( graphics ) );
        return this;
    }
    /**
     * 
     * @param {GameTime} gameTime 
     * @returns {Scene}
     */
    update( gameTime ){
        //console.log(`${this.name()} updated`,gameTime.time());
        return this;
    }
    /**
     * @param {Boolean} nonStaticOnly
     * @returns {Scene}
     */
    clear( nonStaticOnly = false ){
        this._stack = nonStaticOnly ? this.stack().filter( scene => scene.pinned()) : [];
        return this;
    }
}
/**
 * @class BootScene
 * Startup Scene
 */
class BootScene extends Scene{
    /**
     * 
     */
    constructor(){
        super(true);
    }
}
/**
 * 
 */
class TitleScene extends Scene{
    /**
     * 
     */
    constructor(){
        super();
    }
    /**
     * 
     */
    initialize(){

        this._ui = new UI.UIContainer();

        //super.initialize();
    }
}
/**
 * 
 */
class GameOverScene extends Scene{
    /**
     * 
     */
    constructor(){
        super();
    }
    /**
     * 
     */
    initialize(){
        this._screen = new UI.UIContainer();
    }
    /**
     * @returns {UI.UIContainer}
     */
    createGameOver(){
        const gameOver = new UI.UIContainer();
        return gameOver;
    }
}

/**
 * @class {WorldScene}
 */
class WorldScene extends Scene{
    /**
     * 
     */
    constructor( ){
        super();
    }
    /**
     * 
     */
    initialize(){
        this._camera = new Camera();
        this._entities = [];
        this._world = new GameWorld();
        
        this.world().add(this.camera());
    }
    /**
     * @returns {Camera}
     */
    camera(){
        return this._camera;
    }
    /**
     * @returns {GameWorld}
     */
    world(){
        return this._world;
    }
    /**
     * @returns {GameMap}
     */
    map(){
        return this.world().map() || null;
    }
    /**
     * @returns {MapLayer[]}
     */
    layers(){
        return this.map() && this.map().layers() || [];
    }
    /**
     * @returns {Entity[]}
     */
    contents(){
        return this.world().elements();
    }
    /**
     * @returns {Entity[]}
     */
    drawable(){
        return this.world().drawable();
    }
    /**
     * @param {Graphics} graphics
     * @returns {Scene}
     */
    draw( graphics){

        this.drawBackground(graphics);
        this.drawContent(graphics);
        this.drawForeground(graphics);
        //draw overlaying scene layers (hud, inventory, states)
        super.draw( graphics);
        return this;
    }
    /**
     * @param {Graphics} graphics 
     * @returns {WorldScene}
     */
    drawBackground (graphics){
        const camera = this.camera();
        
        this.map().backLayers().forEach( layer => {

        });

        const main = this.map().mainLayer();
        if( main ){
            
        }

        return this;
    }
    /**
     * @param {Graphics} graphics 
     * @returns {WorldScene}
     */
    drawForeground (graphics){
        const camera = this.camera();
        this.map().frontLayers().forEach( layer => {
            
        });

        return this;
    }
    /**
     * @param {Graphics} graphics 
     * @return {WorldScene}
     */
    drawContent( graphics  ){
        //update all contents here referenced by the game camera
        const camera = this.camera();
        this.world().drawable().forEach( element => {
            //render content here
            element.draw(graphics,camera.area());
        });

        return this;
    }
    /**
     * 
     * @param {*} gameTime 
     * @returns {WorldScene}
     */
    update( gameTime ){
        //update entitiess
        this.world().elements().forEach( e => e.update(gameTime ));
        //update and render inherited
        return super.update(gameTime);
    }
}
/**
 * 
 */
class HudScene extends Scene{
    constructor(){
        super();
    }
    /**
     * @param {Graphics}
     * @returns {HudScene}
     */
    draw( graphics ){

        return super.draw( graphics );
    }
    /**
     * @param {GameTime} gameTime
     * @returns {HudScene}
     */
    update( gameTime ){

        return super.update();
    }
}

class MenuScene extends Scene{

}

export {SceneManager,BootScene,WorldScene as MapScene,TitleScene,GameOverScene,MenuScene,Scene};



