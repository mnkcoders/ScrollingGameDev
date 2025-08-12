import { Audio } from "./content";

/**
 * 
 */
class AudioManager{

    constructor(){
        if( AudioManager._instance){
            return AudioManager._instance;
        }

        AudioManager._instance = this.initialize();
    }
    /**
     * 
     * @returns {AudioManager}
     */
    initialize(){
        this._collection = {};

        return this;
    }
    /**
     * 
     * @param {Boolean} list 
     * @returns {Object|Audio}
     */
    collection( list = false ){
        return list ? Object.values(this._collection) : this._collection;
    }
    /**
     * 
     * @param {String} audio 
     * @returns {Boolean}
     */
    has( audio = ''){
        return audio && this.collection().hasOwnProperty(audio);
    }
    /**
     * 
     * @param {Audio} audio 
     * @returns {AudioManager}
     */
    add( audio ){
        if( audio instanceof Audio && !this.has(audio.name())){
            this._collection[audio.name()] = audio;
        }
        return this;
    }

    instance(){
        return AudioManager._instance || new AudioManager();
    }
}


/**
 * 
 */
class Audio{
    constructor( name = '' ){
        this._name = name || 'Sound';
        this._content = null;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name;
    }
    play(){

    }
}



export {AudioManager,Audio};
