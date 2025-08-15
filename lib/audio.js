import { Audio, AudioContent, ContentManager } from "./content";

/**
 * 
 */
class AudioManager{

    constructor(){
        if( AudioManager.__instance){
            return AudioManager.__instance;
        }

        AudioManager.__instance = this.initialize();
    }
    /**
     * 
     * @returns {AudioManager}
     */
    initialize(){
        
        this._context = new AudioContext();

        this._cache = {};

        return this;
    }
    /**
     * @returns {AudioContext}
     */
    context(){
        return this._context
    }
    /**
     * 
     * @param {Boolean} list 
     * @returns {Object|Audio}
     */
    cache( list = false ){
        return list ? Object.values(this._cache) : this._cache;
    }
    /**
     * 
     * @param {String} audio 
     * @returns {Boolean}
     */
    has( audio = ''){
        return audio && this.cache().hasOwnProperty(audio);
    }
    /**
     * @param {String} name 
     */
    add( name ){
        const buffer = ContentManager.manager().audio( name );
        if( buffer ){
            const source = this.context().createBufferSource();
            source.buffer = buffer;
            //source.connect(this.context().destination);
            this._cache[name] = source;
        }
        this;
    }
    play( audioName = ''){
        if( this.has(audioName)){
            const buffer = this.cache()[audioName];
            const source = this.context().createBufferSource();
            source.buffer = buffer;

        }
    }
    /**
     * @returns {AudioManager}
     */
    static instance(){
        return AudioManager.__instance || new AudioManager();
    }
    /**
     * @param {ArrayBuffer} input 
     * @param {AudioContent} audio
     * @returns {AudioBuffer}
     */
    static decode( input = null , audio ){
        if( input && audio instanceof AudioContent){
            const context = AudioManager.instance().context();
            context.decodeAudioData(input,(buffer) => audio.setBuffer(buffer));
            console.log(`Decoding audio input for ${audio.name()} ...`)
        }
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
