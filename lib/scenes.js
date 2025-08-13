import { Area, Component } from "./core";
import { Camera, Entity } from "./entities";
import { Game, GameTime } from "./game";
import { Graphics, Renderer } from "./graphics";
import { GameMap, MapLayer } from "./map";
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
        this._stack = [ new BootScene() ];
        return this;
    }
    /**
     * @returns {SceneManager}
     */
    clear(){
        this._stack = [];
        return this;
    }
    /**
     * @returns {Scene[]}
     */
    stack(){
        return this._stack; 
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.stack().length;
    }
    /**
     * 
     * @param {Scene} scene 
     * @returns {SceneManager}
     */
    push( scene = null ){
        if( scene instanceof Scene ){
            this._stack.push(scene);
        }
        return this;
    }
    /**
     * 
     * @returns {Scene}
     */
    back( ){
        if(this.count() > 1){
            this.stack().pop();
        }
        return this.scene();
    }
    /**
     * @param {String} status 
     * @returns {Scene}
     */
    backto( status = '' ){
        const index = status && this.stack().map( scn => scn.name() ).indexOf( status ) || 0;

        this._stack = this.stack().slice(0,index);

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
        return !this.empty() && this.stack()[ this.stack().length - 1 ] || null;
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
    boot(){
        return !this.empty() && this.stack()[0] || null;
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
class Scene extends Component{
    /**
     * 
     */
    constructor(){
        super();
        this.initialize();
        this._ui = this.createUi();
        this._contents = [];
    }
    /**
     * Use override to implement
     */
    initialize(){

    }
    /**
     * Use override to implement the UI controls
     * @returns {UI.UIContainer}
     */
    createUi(){
        return null;
    }
    /**
     * @returns {String}
     */
    name(){
        return this.constructor.name;
        //return this._name;
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
    ui(){
        return this._ui;
    }
    /**
     * @returns {Boolean}
     */
    hasUi(){
        return this.ui() !== null;
    }
    /**
     * @returns {Array}
     */
    contents( ){
        return this._contents;
    }
    /**
     * @param {Graphics} graphics
     * @returns {Scene} 
     */
    draw( graphics  ){
        this.contents().forEach( element => {
            this.drawContent( graphics, element );
        });
        return this;
    }
    /**
     * @param {Graphics} graphics 
     * @param {Entity} element
     */
    drawContent( graphics , element ){
        //to implement in game scnenes
    }
    /**
     * 
     * @param {GameTime} gameTime 
     * @returns {Scene}
     */
    update( gameTime ){

        return this;
    }
}
/**
 * @class BootScene
 * Startup Scene
 */
class BootScene extends Scene{
    constructor(){
        super();
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
 * 
 */
class MapScene extends Scene{
    constructor( ){
        super(MapScene.name);
    }
    initialize(){
        this._map = new GameMap();
        this._camera = new Camera();
    }
    /**
     * @returns {UI.UIContainer}
     */
    createUi(){
        const hud = new UI.UIContainer();
        return hud;
    }
    /**
     * @returns {GameMap}
     */
    map(){
        return this._map;
    }
    layers(){
        return this.map().layers();
    }
    /**
     * @returns {Camera}
     */
    camera(){
        return this._camera;
    }
    /**
     * @param {Graphics} graphics 
     */
    draw( graphics ){
        this.drawBackground(graphics);
        super.draw(graphics);
        this.drawForeground(graphics);
        this.drawUI(graphics);
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
     * @param {MapLayer} layer 
     * @returns {MapScene}
     */
    drawLayer(  layer ){
        const graphics = this.graphics();
        const grid = layer.grid();
        const renderer = graphics.renderer();
        const viewArea = this.camera().offsetGrid(grid);
        const tileset = layer.tileSet();
        //const tiles = layer.captureTiles(viewArea);

        //renderer.renderContent()
        return this;
    }
    /**
     * @returns {MapScene}     
     */
    drawBackground(  ){
        const graphics = this.graphics();
        const type = [MapLayer.Type.Background,MapLayer.Type.Scene];
        //dive in here through the map layers respective to the game camera
        this.map().layers()
            .filter( layer => type.includes(layer.type()))
            .forEach( layer => this.drawLayer(graphics,layer) );

        return this;
    }
    /**
     * @returns {MapScene}     
     */
    drawForeground(){
        const graphics = this.graphics();
        this.map().layers()
            .filter( layer => layer.type() === MapLayer.Type.Foreground )
            .forEach( layer => this.drawLayer(graphics,layer) );
        return this;
    }
    /**
     * @returns {MapScene}     
     */
    drawUI(){
        const graphics = this.graphics();

    }
    /**
     * 
     * @param {*} gameTime 
     * @returns {MapScene}
     */
    update( gameTime ){
        //update entitiess
        this.contents().forEach( e => e.update(gameTime ));
        //update and render inherited
        super.update(gameTime);

        return this;
    }
}

class MenuScene extends Scene{

}

export {SceneManager,BootScene,MapScene,TitleScene,GameOverScene,MenuScene,Scene};



