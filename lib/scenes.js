import { Component } from "./core";

/**
 * 
 */
class Scene extends Component{
    /**
     * 
     */
    constructor( name = 'Scene'){
        super();
        this._name = name;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
    }
    /**
     * @param {String} name 
     * @returns {Boolean}
     */
    is( name = ''){
        return name && name === this.name();
    }
}


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

        this._stack = [];
        SceneManager._instance = this;
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
     * 
     * @returns {SceneManager}
     */
    static manager(){
        return SceneManager._instance || new SceneManager();
    }
}


export {Scene,SceneManager};



