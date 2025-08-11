import { Component } from "./core";
import { Entity } from "./entities";
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
    elements(){
        return [];
    }
    /**
     * 
     * @param {*} gameTime 
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
        this._entities = [];
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
    /**
     * @returns {Entity[]}
     */
    elements(){
        return this._entities;
    }
    /**
     * 
     * @param {*} gameTime 
     * @returns {MapScene}
     */
    update( gameTime ){

        this.elements().forEach( e => e.update(gameTime ));
        
        super.update(gameTime);

        return this;
    }
}

class MenuScene extends Scene{

}

export {SceneManager,BootScene,MapScene,TitleScene,GameOverScene,MenuScene};



