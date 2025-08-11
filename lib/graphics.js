import { GameTime } from "./game";


/**
 * 
 */
class Graphics{

    /**
     * @param {String} container 
     */
    constructor( container = '' , fps = 30 ) {

        this._renderer = Renderer.createDisplay(container );
        this._color = '#ffffff';
        this._scale = 1.0;
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
     * @param {Float} scale
     * @returns {Renderer}
     */
    setScale (scale = 1) {

        this._scale = scale || 1;

        return this;
    };
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
     * @param {Image} image 
     * @param {Area} source 
     * @param {Area} destination 
     * @param {Number} opacity 
     * @param {String} blendMode 
     * @returns {Graphics}
     */
    draw(image, source, destination, opacity, blendMode, color = '#ffffff'){

        //effects here?
        this.renderer().begin();

        this.display().drawImage(
                //bitmap de origen
                image,
                //SX,SY - get image source from position (x,y)
                source.left(), source.top(),
                //SW,SH - get image source rectangle (width,height)
                source.width, source.height,
                //DX,DY - set image clip destination position (x,y)
                destination.left() * this._scale, destination.top() * this._scale,
                //DW,DH - set image clip destination size (width, height)
                destination.width * this._scale, destination.height * this._scale);

        this.renderer().end();

        if(this.grid()){
            this.drawGrid();
        }

        return this;
    };
    /**
     * 
     * @param {Image} image
     * @param {Area} area
     * @param {String} color
     * @returns {Image}
     */
    blendImage(image, area, color = '#ffffff'){

        this.display().globalCompositeOperation = GlobalCompositeOperation.destination-in;
        this.display().drawImage(image, 0, 0);
        this.display().globalCompositeOperation = GlobalCompositeOperation.source-over;


        //this.display().fillStyle = '#ffffaa';
        this.display().fillStyle = color || '#ffffff';
        this.display().globalCompositeOperation = GlobalCompositeOperation.color;
        this.display().fillRect(
                area.X * this._scale,
                area.Y * this._scale,
                area.width * this._scale,
                area.height * this._scale);

        this.display().globalCompositeOperation = GlobalCompositeOperation.source-over;

        return image;
    };
    /**
     * @returns {Graphics}
     */
    drawGrid( ){

        if (this.grid() > 0) {
            const renderer = this.renderer();
            const display = this.display();
            const grid = this.grid();

            var cols = renderer.width() / grid;
            var rows = renderer.height() / grid;
            var count = cols > rows && cols || rows;

            display.save();
            display.globalCompositeOperation = 'luminosity';
            display.strokeStyle = '#ffffff';

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
     * @returns {ScenePlayer.Renderer} 
     */
    clear(color = '#ffffff'){
        //window.requestAnimationFrame( this.render );
        // Clear the canvas
        if (this.display()) {
            const display = this.display();
            display.clearRect(0, 0, this.width(), this.height());
            display.beginPath();
            display.rect(0, 0, this.width(), this.height());
            display.fillStyle = 'rgba(120,200,255,1)';
            display.fillStyle = color || this._color;
            //console.log(display.fillStyle);
            display.fill();
        }

        return this;
    };
   /**
     * @returns {Renderer}
     */
    refresh(){
        this.renderer().setSize(this.width(),this.height());
        return  this;
    }
}
/**
 * 
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
        this._viewport = document.createElement('canvas');
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
     * @returns {Renderer}
     */
    begin(){

        this.viewport().display.save();

        this.display().globalCompositeOperation = blendMode || Sprite.BlendMode.Normal;
        //this.display().globalAlpha = 0.5;
        this.display().globalAlpha = 1;

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
     * 
     * @param {String} name 
     */
    static createDisplay( name = '' ){
        const container = name && document.querySelector( name ) || document.body;
        const display = new Renderer();
        container.appendChild(display);
        display.resize(container.offsetWidth, container.offsetHeight);
        return display;
    }
}

export {Graphics,Renderer};