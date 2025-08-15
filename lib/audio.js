import { ContentManager } from "./content";
import { AudioContent, Content } from "./types";

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

        return this;
    }
    /**
     * @returns {AudioContext}
     */
    context(){
        return this._context
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
 * @class {Sound}
 */
class SoundBase extends Content{
    /**
     * @param {String} name 
     * @param {String} source 
     * @param {Number} volume
     * @param {Number} balance
     * @param {Number} pitch
     */
    constructor( name = '' , source = ''){
        super(name || SoundBase.name);
        this._audio = source;
        this.initialize();
    }
    /**
     * 
     */
    initialize(){
        this._source = ContentManager.manager().audio(this._audio);
    }
    /**
     * @returns {AudioContent}
     */
    source(){
        return this._source;
    }
    /**
     * @returns {AudioContext}
     */
    context(){
        return AudioManager.instance().context();
    }
    /**
     * @returns {AudioBufferSourceNode}
     */
    attachBuffer(){
        const source = this.context().createBufferSource();
        const buffer = this.content();
        source.buffer = buffer;
        buffer.connect();
        return source;
    }
    /**
     * @param {Number} volume 
     * @param {Number} balance 
     * @param {Number} pitch 
     * @returns {SoundBase}
     */
    play( volume = 100 , balance = 0 , pitch = 0 ){
        const buffer = this.attachBuffer();
        buffer.start();
        return this;
    }
}
/**
 * @class {Sound}
 */
class Sound extends SoundBase {
    /**
     * @param {String} name 
     * @param {String} source 
     * @param {Number} volume
     * @param {Number} balance
     * @param {Number} pitch
     */
    constructor( name = '' , source = '' , volume = 100 , balance = 0 , pitch = 0){
        super(name || SoundBase.name);
        this._audio = source;
        this._volume = volume;
        this._balance = balance;
        this._pitch = pitch;
        this.initialize();
    }
    /**
     * @returns {Number}
     */
    pitch(){
        return this._pitch;
    }
    /**
     * @returns {Number}
     */
    volume(){
        return this._volume;
    }
    /**
     * @returns {Number}
     */
    balance(){
        return this._balance;
    }
    /**
     * @returns {Sound}
     */
    play(){
        return super.play(this.volume(),this.balance() , this.pitch());        
    }
}
/**
 * @class {AudioSet}
 */
class SoundSet extends Content{
    /**
     * @param {String} name 
     * @param {Number} volume
     * @param {Number} balance
     * @param {Number} pitch
     */
    constructor( name = '' , volume = 100 , balance = 0 , pitch = 0 ){
        super(name || SoundSet.name);
        this._sounds = [];
        this._volume = volume;
        this._pitch = pitch;
        this._balance = balance;
    }
    /**
     * @returns {Number}
     */
    volume(){
        return this._volume;
    }
    /**
     * @returns {Number}
     */
    pitch(){
        return this._pitch;
    }
    /**
     * @returns {Number}
     */
    balance(){
        return this._balance;
    }
    /**
     * @param {AudioContent} sound 
     * @returns {SoundSet}
     */
    add(sound ){
        if( sound instanceof SoundBase){
            this.sounds().push(sound);
        }
        return this;
    }
    /**
     * @returns {SoundBase[]}
     */
    sounds(){
        return this._sounds;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.sounds().length;
    }
    /**
     * @returns {Number}
     */
    select(){
        return Math.floor(Math.random() * this.count());
    }
    /**
     * @returns {SoundSet}
     */
    play(){
        const selection = this.select();
        const pitch = this.pitch();
        const vol = this.volume();
        const bal = this.balance();
        this.sounds()[selection].play(vol,bal,pitch);
        return this;
    }
}
/**
 * @class {AmbientMusic}
 */
class AmbientMusic extends Sound{
    /**
     * @param {String} name 
     * @param {String} source
     * @param {Number} vol
     * @param {Number} bal
     * @param {Number} pitch
     * @param {Number} loop
     * @param {Number} loopFrom
     */
    constructor( name = '' , source = '', vol = 100 , bal = 0 , pitch = 0 , loop = 0 , loopFrom = 0){
        super(name,source,vol,bal,pitch);
        this._loops = loop || 0;
        this._loopFrom = loopFrom || 0;
        this._counter = 0;
    }
    /**
     * @returns {Number}
     */
    loops(){
        return this._loops;
    }
    /**
     * @returns {Number}
     */
    loopFrom(){
        return this._loopFrom;
    }
    /**
     * @returns {Number}
     */
    loopCount(){
        return this._counter;
    }
}
/**
 * @class {AmbientSound}
 */
class LoopingAmbientSound extends Sound{
    /**
     * @param {String} name 
     * @param {String} source
     * @param {Number} vol
     * @param {Number} bal
     * @param {Number} pitch
     * @param {Number} variant
     */
    constructor( name = '' , source = '', vol = 100 , bal = 0 , pitch = 0 , variant = 0){
        super(name,source,vol,bal,pitch);
        this._variant = variant;
    }
    /**
     * @returns {Number}
     */
    variant(){
        return this._variant;
    }
}

export {AudioManager,SoundBase,Sound,SoundSet,AmbientMusic,LoopingAmbientSound};
