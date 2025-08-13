import { TileSet } from "./content";
import { Area, Component } from "./core";
import { Camera, Entity } from "./entities";
import { Game, GameTime } from "./game";
import { Graphics } from "./graphics";
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
     * @returns {Graphics}
     */
    graphics(){
        return Game.instance().graphics();
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
     * @returns {Scene} 
     */
    draw(  ){
        this.stack().forEach( scene => scene.draw() );
        return this;
    }
    /**
     * 
     * @param {GameTime} gameTime 
     * @returns {Scene}
     */
    update( gameTime ){

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
        
        super.initialize();
    }
    /**
     * @returns {UI.UIContainer}
     */
    createUi(){
        const title = new UI.UIContainer();
        return title;
    }
}
/**
 * 
 */
class GameOverScene extends Scene{
    constructor(){
        super();
    }
    initialize(){
        
    }
    /**
     * 
     * @returns {UI.UIContainer}
     */
    createUi(){
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
        //this._map = new GameMap();
        //this._camera = new Camera();
        this._elements = [];
        
        this.add(this.camera());
    }
    /**
     * @param {Entity} element 
     * @returns {LayerScene}
     */
    add( element = null ){
        if( element instanceof Entity ){
            this._elements.push(element);
        }
        return this;
    }
    /**
     * @returns {Camera}
     */
    camera(){
        return this._camera;
    }
    /**
     * @returns {LayerScene[]}
     */
    layers(){
        return this.stack().filter( scene => scene.is(LayerScene.name));
    }
    /**
     * @returns {Entity[]}
     */
    elements(){
        return this._elements;
    }
    /**
     */
    draw( ){
        super.draw();
    }
    /**
     * @param {Graphics} graphics 
     * @param {Entity} element
     */
    drawContent( graphics , element ){
        //update all contents here referenced by the game camera
        const camera = this.camera();
    }
    /**
     * 
     * @param {*} gameTime 
     * @returns {WorldScene}
     */
    update( gameTime ){
        //update entitiess
        this.contents().forEach( e => e.update(gameTime ));
        //update and render inherited
        super.update(gameTime);

        return this;
    }
}
/**
 * @class {LayerScene}
 */
class LayerScene extends Scene{
    constructor( tileSet = null ,cols = 48 , rows = 32 , type = '', scroll = 0 ,tileData = [] ){
        //keep this scene static, shouldnt be removed until forced
        super(true);
        this._tileSet = tileSet instanceof TileSet ? tileSet : null;
        this._cols = cols || 48;
        this._rows = rows || 32;
        this._type = type || LayerScene.Type.Background;
        this._scroll = scroll;
        this.fill( this._tileSet && tileData || []);
    }
    /**
     * @returns {LayerScene.Type|String}
     */
    type(){
        return this._type;
    }
    /**
     * @returns {Number}
     */
    scroll(){
        return this._scroll;
    }
    /**
     * @returns {Number}
     */
    cols(){
        return this._cols;
    }
    /**
     * @returns {Number}
     */
    rows(){
        return this._rows;
    }
    /**
     * @param {Number[]} tileData 
     */
    fill( tileData = [] ){
        this._tiles = tileData;
    }
    /**
     * @returns {Number[]}
     */
    tiles(){
        return this._tiles;
    }
    /**
     * @returns {TileSet}
     */
    tileSet(){
        return this._tileSet;
    }
    /**
     * @returns {Number}
     */
    grid(){
        return this.tileSet().size();
    }

    
    /**
     * @returns {LayerSceneMain}
     */
    draw(){
        return super.draw()
    }
    /**
     * @returns {LayerSceneMain}
     */
    update( gameTime){
        return super.update(gameTime);
    }
    /**
     * @returns {LayerSceneMain}
     */
    clear(){
        this._elements =[];
        return super.clear();
    }
}

/**
 * @type {LayerScene.Type|String}
 */
LayerScene.Type = {
    Background: 'background', //background scrolling layers
    Scene: 'scene', //main scene
    Foreground: 'foreground', //foreground scrolling layers
    View: 'view', //used to export the current layer view render
};

/**
 * 
 */
class HudScene extends Scene{
    constructor(){
        super();
    }
    /**
     * 
     * @returns {HudScene}
     */
    draw(){

        return super.draw();
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



