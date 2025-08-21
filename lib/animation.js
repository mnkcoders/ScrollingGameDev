import { ContentManager } from "./content";
import { Content, ImageContent } from "./types";

/**
 * @class {AnimationData}
 * Animation Data
 */
class AnimationData extends Content{
    /**
     * 
     * @param {String} name 
     * @param {String} image
     */
    constructor( name = '' , image = ''){
        super(name || AnimationData.name);
        this._animations = [];
        this._image = image || '';
        this._source = null;
    }
    /**
     * @returns {String}
     */
    image(){
        return this._image;
    }
    /**
     * @returns {ImageContent}
     */
    load(){
        return ContentManager.manager().get(this.image(),ImageContent.name);
    }
    /**
     * @returns {FrameData[]}
     */
    animations(){
        return this._animations;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.animations().length;
    }
    /**
     * @param {FrameData} frameset 
     * @returns {AnimationData}
     */
    add( frameset = null ){
        if( frameset instanceof FrameData ){
            this.animations().push(frameset);
        }
        return this;
    }
    /**
     * @param {String} frameset 
     * @returns {Boolean}
     */
    has( frameset = '' ){
        return frameset && this.animations().filter( anim => anim.name() === frameset ).length > 0;
    }
    /**
     * @param {String} name 
     * @param {Boolean} random
     * @returns {FrameData}
     */
    get( name = '' ,random = false ){
        const list = name && this.framesets().filter( fs => fs.name() === name ) ||  [];
        return list.length ? random && list[Math.floor(Math.random() * list.length)] || list[0] : null;
    }
    /**
     * @returns {FrameData}
     */
    first(){
        return this.animations()[0] || null;
    }
    /**
     * @returns {FrameData}
     */
    last(){
        return this.animations()[this.count()-1] || null;
    }
    /**
     * @param {String} name
     * @param {Boolean} random
     * @returns {AnimationLoop}
     */
    createAnimation( name = '' ,random = false){
        const animation = this.get(name,random);
        return animation && animation.createAnimation(this.load()) || null;
    }
}
/**
 * @class {FrameData}
 * Frame collection manager
 */
class FrameData extends Content{
    /**
     * @param {String} name 
     * @param {Number[]} frames
     * @param {Number} fps
     * @param {Number} loops
     * @param {String} behaviour
     */
    constructor( name = '' , frames = [] , fps = 20 , loops = 0 , behaviour = FrameData.Behaviour.Default){
        super(name || FrameData.name);
        this._frames = frames || [];
        this._loops = loops;
        this._fps = fps;
        this._behaviour = behaviour || FrameData.Behaviour.Forward;
    }
    /**
     * @returns {Number[]}
     */
    frames(){
        return this._frames;
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
    count(){
        return this.frames().length;
    }
    /**
     * @returns {Boolean}
     */
    empty(){
        return this.count() === 0;
    }
    /**
     * @returns {Number}
     */
    fps()
    {
        return this._fps;
    }
    /**
     * @param {ImageContent} source 
     * @returns {AnimationLoop}
     */
    createAnimation( source = null ){
        if( source instanceof ImageContent ){
            switch( this._behaviour ){
                case FrameData.Behaviour.PingPong:
                    return new AnimationPingPong(this,source);
                case FrameData.Behaviour.Backward:
                    return new AnimationBackward(this,source);
                case FrameData.Behaviour.Static:
                    return new AnimationStatic(this,source);
                case FrameData.Behaviour.Backward:
                    return new AnimationBackward(this,source);
                case FrameData.Behaviour.Default:
                default:
                    return new AnimationLoop(this,source);
            }

        }
        return null;
    }    
}
/**
 * @type {FrameData.Behaviour|String}
 */
FrameData.Behaviour = {
    Default : 'default',
    Static : 'static',
    Forward : 'forward',
    Backward : 'backward',
    PingPong : 'pingpong',
};
/**
 * Forward Loop
 * @class {AnimationLoop}
 */
class AnimationLoop{
    /**
     * @param {FrameData} animation 
     * @param {ImageContent} source
     * @param {Boolean} autoPlay
     */
    constructor( animation = null , source = null ,autoPlay = false ){
        this._frameset = animation instanceof FrameData && animation || null;
        this._source = source instanceof ImageContent && source || null;
        this._running = autoPlay;
        
        this.reset();
    }
    /**
     * 
     */
    reset(){
        this._fps = this.frameset().fps();
        this._index = 0;
        this._loop = 0;
    }
    /**
     * @returns {Boolean}
     */
    running(){
        return this._running;
    }
    /**
     * @param {Boolean} play 
     * @returns {AnimationLoop}
     */
    toggle( play = false ){
        this._running = play;
        return this;
    }
    /**
     * @returns {AnimationLoop}
     */
    play(){
        return this.toggle(true);
    }
    /**
     * @returns {AnimationLoop}
     */
    pause(){
        return this.toggle();
    }
    /**
     * @returns {AnimationLoop}
     */
    stop(){
        return this.toggle().reset();
    }
    /**
     * @param {Number} fps 
     * @returns {AnimationLoop}
     */
    setFps( fps = 12 ){
        this._fps = fps;
        return this;
    }
    /**
     * @returns {Number}
     */
    fps(){
        return this._fps;
    }
    /**
     * @returns {FrameData}
     */
    frameset(){
        return this._frameset;
    }
    /**
     * @returns {Number[]}
     */
    frames(){
        return this.frameset().frames();
    }
    /**
     * @returns {Number}
     */
    count(){
        return this.frameset().count();
    }
    /**
     * @returns {Number}
     */
    loops(){
        return this.frameset().loops();
    }
    /**
     * @returns {Boolean}
     */
    infinite(){
        return this.loops() === 0;
    }
    /**
     * @returns {Number}
     */
    loop(){
        return this._loop;
    }
    /**
     * @returns {Boolean}
     */
    done(){
        !this.infinite() && this.loop() >= this.loops();
    }
    /**
     * @returns {Number}
     */
    index(){
        return this._index;
    }
    /**
     * @param {Number} index 
     * @returns {Number}
     */
    frame(){
        return this.frames()[ this.index() % this.count()] || 0;
    }
    /**
     * @returns {Boolean}
     */
    next(){
        this._index = ++this._index % this.count();
        return this.index() === 0;
    }
    /**
     * @returns {AnimationLoop}
     */
    update(){
        if( this.next()){
            //loop
            if( !this.done()){
                this._loop++;
            }
            else{
                //auto-reset
                this._loop = 0;
            }
        }        
        return this;
    }
}
/**
 * Backward loop
 * @class {AnimationStatic}
 */
class AnimationStatic extends AnimationLoop{
    /**
     * @param {FrameData} animation 
     * @param {ImageContent} source
     * @param {Boolean} autoPlay
     */
    constructor( animation = null , source = null ,autoPlay = false ){
        super(animation,source,autoPlay);
    }
    /**
     * @returns {Boolean}
     */
    next(){
        return false;
    }
}
/**
 * Backward loop
 * @class {AnimationBackward}
 */
class AnimationBackward extends AnimationLoop{
    /**
     * @param {FrameData} animation 
     * @param {ImageContent} source
     * @param {Boolean} autoPlay
     */
    constructor( animation = null , source = null ,autoPlay = false ){
        super(animation,source,autoPlay);
    }
    /**
     * @returns {Number}
     */
    last(){
        return this.count() - 1;
    }
    /**
     * @returns {Boolean}
     */
    next(){
        //super.next();
        this._index = this._index > 0 && --this._index || this.last();
        return this.index() === this.count()-1;
    }
    /**
     * 
     */
    reset(){
        super.reset();
        this._index = this.last();
    }
}
/**
 * Backward loop
 * @class {AnimationBackward}
 */
class AnimationPingPong extends AnimationLoop{
    /**
     * @param {FrameData} animation 
     * @param {ImageContent} source
     * @param {Boolean} autoPlay
     */
    constructor( animation = null , source = null ,autoPlay = false ){
        super(animation,source,autoPlay);
        this._backwards = false;
    }
    /**
     * @returns {Boolean}
     */
    backwards(){
        return this._backwards;
    }
    /**
     * @returns {Number}
     */
    last(){
        return this.count() - 1;
    }
    /**
     * @returns {Boolean}
     */
    next(){
        //super.next();
        if( this.backwards() ){
            this._index = Math.max(--this._index,0);
            if( this.index() === 0 ){
                this._backwards = false;
            }
        }
        else if( ++this._index >= this.last()){
            this._backwards = true;
        }
        return this.index() === 0;
    }
    /**
     * 
     */
    reset(){
        super.reset();
        this._backwards = false;
    }
}

/**
 * @class {AnimationBase}
 */
class AnimationBase{
    /**
     * @param {AnimationData} controller 
     */
    constructor( controller = null ,first = ''){
        this._content = controller instanceof AnimationData && controller || null;
        this._animation = null;

        if( this.data() ){
            const fs = first|| this.first().name();
            this._animation = this.data().createAnimation(fs);
        }
    }
    /**
     * @returns {AnimationData}
     */
    data(){
        return this._content;
    }
    /**
     * @returns {AnimationLoop}
     */
    animation(){
        return this._animation;
    }
    /**
     * @returns {FrameData}
     */
    first(){
        return this.data().first();
    }
    /**
     * @returns {FrameData}
     */
    last(){
        return this.data().last();
    }
    /**
     * @param {String} name 
     * @param {Boolean} random 
     * @returns {AnimationBase}
     */
    play( name = '', random = false){
        if( name ){
            const animation = this.data().createAnimation(name,random);
            if( animation ){
                this._animation = animation;
            }
        }
        return this;
    }
}


export {AnimationData,FrameData,AnimationLoop,AnimationBase};





