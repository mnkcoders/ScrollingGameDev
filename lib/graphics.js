import { Image } from "./content";
import { Area } from "./core";
import { GameTime } from "./game";


/**
 * 
 */
class Graphics{

    /**
     * @param {HTMLElement} container 
     * @param {Number} fps 30 by default
     */
    constructor( container = null , fps = 30 ) {

        this._renderer = Renderer.create( container );
        this._fps = fps || 30;
        this._grid = 0;
    }
    /**
     * @returns {Number}
     */
    grid(){
        return this._grid;
    }
    /**
     * @param {Number} fps
     * @returns {Number}
     */
    fps(){
        return this._fps;
    };
    /**
     * @param {Number} fps
     */
    setFps(fps = 30){
        this._fps = fps || 30;
    }
    /**
     * @returns {Renderer}
     */
    renderer(){
        return this._renderer;
    }
    /**
     * 
     * @returns {CanvasRenderingContext2D}
     */
    display(){
        return this.renderer() && this.renderer().display() || null;
    }
    /**
     * @returns {Number}
     */
    frameRate(){
        return parseInt(1000 / this.fps());
    };
    /**
     * @param {CanvasImageSource} image 
     * @param {Area} source 
     * @param {Area} destination 
     * @param {Number} opacity 
     * @param {String} mode 
     * @returns {Graphics}
     */
    draw(image, source, destination, opacity = 1, mode = '', color = '#ffffff'){

        //effects here?
        const renderer = this.renderer();
        renderer.setAlpha(opacity).setMode(mode).setColor(color).begin();
        renderer.draw(
                //bitmap de origen
                image,
                //SX,SY - get image source from position (x,y)
                source.left(), source.top(),
                //SW,SH - get image source rectangle (width,height)
                source.width(), source.height(),
                //DX,DY - set image clip destination position (x,y)
                destination.left() * this.scale(), destination.top() * this.scale(),
                //DW,DH - set image clip destination size (width, height)
                destination.width() * this.scale(), destination.height() * this.scale()
        );
        renderer.end();

        return this;
    };
    /**
     * @param {CanvasImageSource} image 
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Graphics}
     */
    showImage( image ,x = 0, y= 0){
        this.renderer().drawImage( image , x , y);
        return this;
    }
    /**
     * @returns {Graphics}
     */
    showGrid(){
        this.renderer().drawGrid(this.grid());
        return this;
    }
   /**
     * @returns {Renderer}
     */
    refresh(){
        this.renderer().setSize(this.width(),this.height());
        return  this;
    }
}

/**
 * @type {Graphics.BlendMode|GlobalCompositeOperation}
 * "color" | "color-burn" | "color-dodge" | "copy" | "darken" |
 * "destination-atop" | "destination-in" | "destination-out" | "destination-over" |
 * "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "lighter" | "luminosity" |
 * "multiply" | "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | "source-in" |
 * "source-out" | "source-over" | "xor";
 */
Graphics.BlendMode = {
    NORMAL: 'normal',
    COLOR: 'color',
    BURN: 'color-burn',
    DODGE: 'color-dodge',
    COPY: 'copy',
    DARKEN: 'darken',
    DESTATOP: 'destination-atop',
    DESTIN: 'destination-in',
    DESTOUT: 'destination-out',
    DESTOVER: 'destination-over',
    DIF: 'difference',
    EXCLUSION: 'exclusion',
    HARD: 'hard-lignt',
    HUE: 'hue',
    LIGHTEN: 'lighten',
    LIGHTER: 'lighter',
    LUM: 'luminosity',
    MULTIPLY: 'multiply',
    OVERLAY: 'overlay',
    SATURATE: 'saturation',
    SCREEN: 'screen',
    SOFT: 'soft-light',
    SRCATOP: 'source-atop',
    SRCOVER: 'source-over',
    XOR: 'xor',
};

/**
 * @class {Renderer}
 */
class Renderer{
    /**
     * 
     */
    constructor( ){

        this.initialize();
    }
    /**
     * 
     */
    initialize(){
        this._scale = 1;
        this._color = '#ffffff';
        this._viewport = document.createElement('canvas');
        this._viewport.className = 'sgdk-view';
        this._display = this.viewport().getContext('2d');
        this.viewport().oncontextmenu = () => false;
    }
    /**
     * @returns {CanvasRenderingContext2D}
     */
    display(){
        return this._display;
    }
    /**
     * @returns {HTMLElement}
     */
    viewport(){
        return this._viewport;
    }
    /**
     * @returns {Number}
     */
    width(){
        return this.viewport().width;
    }
    /**
     * @returns {Number}
     */
    height(){
        return this.viewport().height;
    }
    /**
     * @returns {Area}
     */
    area(){
        return new Area(0, 0, this.width(), this.height());
    }
    /**
     * @returns {ScenePlayer.Renderer} 
     */
    resize(width = 0, height = 0){
        this.viewport().width = width;
        this.viewport().height = height;
        console.log( `Viewport set to ${this.width()},${this.height()}` );
        return this;
    };
    /**
     * 
     * @param {CanvasImageSource} content 
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Renderer}
     */
    drawImage( content , x = 0 , y = 0){
        this.display().drawImage( content, x , y);
        return this;
    }
    /**
     * 
     * @param {CanvasImageSource} content 
     * @param {Area} source 
     * @param {Area} destination 
     * @returns {Renderer}
     */
    draw( content , source , destination ){
        this.display().drawImage(
                //bitmap source
                content,
                //SX,SY - get image source from position (x,y)
                source.left(), source.top(),
                //SW,SH - get image source rectangle (width,height)
                source.width(), source.height(),
                //DX,DY - set image clip destination position (x,y)
                destination.left() * this.scale(), destination.top() * this.scale(),
                //DW,DH - set image clip destination size (width, height)
                destination.width() * this.scale(), destination.height() * this.scale()
            );        
        return this;
    }
    /**
     * 
     * @param {CanvasImageSource} image
     * @param {Area} area
     * @param {String} color
     * @returns {CanvasImageSource}
     */
    blendImage(image, area, color = '#ffffff'){

        const renderer = this.renderer();
        renderer.setBlendMode(Graphics.BlendMode.DESTIN);
        renderer.drawImage(image);
        renderer.setBlendMode(Graphics.BlendMode.SRCOVER);


        renderer.fillContent(color);
        renderer.setBlendMode(Graphics.BlendMode.COLOR);
        renderer.fillArea(area);
        renderer.setBlendMode(Graphics.BlendMode.SRCOVER);

        return image;
    };

    /**
     * @returns {Graphics}
     */
    drawGrid( grid = 32 ){

        if ( grid > 0) {
            const display = this.display();

            var cols = this.width() / grid;
            var rows = this.height() / grid;
            var count = cols > rows && cols || rows;

            display.save();
            this.setMode(Graphics.BlendMode.LUM);
            //this.setStroke('#ffffff')
            this.setStroke(this.color());

            for (var i = 0; i < count; i++) {
                display.beginPath();
                //Horizontal
                display.moveTo(i * grid, 0);
                display.lineTo(i * grid, this.height());
                //Vertical
                display.moveTo(0, i * grid);
                display.lineTo(this.width(), i * grid);

                display.lineWidth = 0.05;
                display.stroke();
            }

            display.restore();
        }

        return this;
    }
    /**
     * @param {String|Color} color 
     * @returns {Renderer} 
     */
    clear(color = ''){
        //window.requestAnimationFrame( this.render );
        // Clear the canvas
        if (this.display()) {
            const display = this.display();
            display.clearRect(0, 0, this.width(), this.height());
            display.beginPath();
            display.rect(0, 0, this.width(), this.height());
            //display.fillStyle = 'rgba(120,200,255,1)';
            display.fillStyle = color || this.color();
            //console.log(display.fillStyle);
            display.fill();
        }

        return this;
    };    
    /**
     * @param {String} mode 
     * @returns {Renderer}
     */
    setMode( mode = '' ){
        this.display().globalCompositeOperation = mode || Graphics.BlendMode.NORMAL;
        return this;
    }
    /**
     * @returns {String}
     */
    blendMode(){
        return this.display().globalCompositeOperation;
    }
    /**
     * @param {String} color
     * @returns {Renderer}
     */
    setColor( color = '#ffffff' ){
        this._color = color;
        return this;
    }
    /**
     * @returns {String}
     */
    color(){
        return this._color;
    }
    /**
     * @returns {String}
     */
    stroke(){
        return this.display().strokeStyle;
    }
    /**
     * 
     * @param {String} style 
     * @returns {Renderer}
     */
    setStroke( style = '#ffffff'){
        this.display().strokeStyle = style;
        return this;
    }
    /**
     * @param {Number} alpha 
     * @returns {Renderer}
     */
    setAlpha( alpha = 1.0 ){
        this.display().globalAlpha = alpha;
        return this;
    }
    /**
     * @returns {Number}
     */
    alpha(){
        return this.display().globalAlpha;
    }
    /**
     * @returns {Number}
     */
    scale(){
        return this._scale;
    }
    /**
     * @param {Number} scale 
     * @returns {Renderer}
     */
    setScale( scale = 1 ){
        this._scale = scale || 1;
        return this;
    }
    /**
     * @param {String} color 
     * @returns {Renderer}
     */
    fillContent( color = '' ){
        this.display().fillStyle = color || '#ffffff';
        return this;
    }
    /**
     * @param {Area} area 
     * @param {Number} scale 
     * @returns {Renderer}
     */
    fillArea( area ){
        this.display().fillRect(
                area.x() * this.scale(),
                area.y() * this.scale(),
                area.width() * this.scale(),
                area.height() * this.scale()); 
        return this;       
    }    
    /**
     * @param {String} blendMode
     * @returns {Renderer}
     */
    begin( blendMode = '' ,alpha = 1){

        this.display().save();

        //this.setMode( blendMode );
        //this.display().globalAlpha = 0.5;
        //this.display().globalAlpha = 1;
        //this.setAlpha(alpha);

        return this;
    }
    /**
     * 
     * @returns {Renderer}
     */
    end(){

        this.display().restore();
        return this;        
    }


    /**
     * @param {HTMLElement} container 
     * @returns {Renderer}
     */
    static create( container = null ){
        //const container = name && document.querySelector( name ) || document.body;
        const content = container || document.body;
        const display = new Renderer();
        content.appendChild(display.viewport());
        display.resize(content.offsetWidth, content.offsetHeight);
        return display;
    }
}

export {Graphics,Renderer};