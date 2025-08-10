/***************************************************************************
 * ScenePlayer Renderer
 * 
 * @param {Element} container 
 * @returns {ScenePlayer.Renderer}
 **************************************************************************/
class Renderer{

    /**
     * @param {Element|Canvas} container 
     */
    constructor( container = null ) {

        this._renderer = null;
        this._viewport = null;
        this._display = null;
        this._color = '#ffffff';
        this._scale = 1.0;
        this._fps = 30;
        this._loop = 0;

        this.setup( container && container instanceof Element ? container : document );
    }
    /**
     * @param {Number} fps
     * @returns {Number}
     */
    FPS(){
        return this._fps;
    };
    /**
     * @param {Number} fps
     */
    setFPS(fps = 30){
        this._fps = fps || 30;
    }
    /**
     * @returns {Element}
     */
    window(){
        return this._viewport;
    }
    /**
     * @returns {Area}
     */
    boundingBox(){
        return new Area(0, 0, this.width(), this.height());
    }
    /**
     * @returns {ScenePlayer.Renderer} 
     */
    resize(width, height){
        this._viewport.width = width;
        this._viewport.height = height;
        //console.log( 'Viewport set to ' + this._viewPort.width + 'x' + this._viewPort.height );
        return this;
    };
    /**
     * @param {Float} scale
     * @returns {ScenePlayer.Renderer}
     */
    setScale (scale = 1) {

        this.scale = scale;

        return this;
    };
    /**
     * @returns {Number}
     */
    frameRate(){
        return parseInt(1000 / this._FPS);
    };
    /**
     * @param {Function} closure
     * @returns {ScenePlayer.Renderer}
     */
    renderStart(closure){

        if (typeof closure === 'function') {

            this._renderLoop = window.setInterval(closure, this.frameRate());
            console.log('Render started at ' + this.frameRate() + ' FPS');
        }

        return this;
    };
    /**
     * @returns {ScenePlayer.Renderer}
     */
    renderStop(){
        if (this._renderLoop) {
            window.clearInterval(this._renderLoop);
            this._renderLoop = 0;
        }
        return this;
    };
    /**
     * @param {Number} value 
     */
    opacity(value = 255){
        value % 256;
    }
    /**
     * @param {Image} image 
     * @param {Area} source 
     * @param {Area} destination 
     * @param {Number} opacity 
     * @param {String} blendMode 
     * @returns {ScenePlayer.Renderer}
     */
    draw(image, source, destination, opacity, blendMode, color = '#ffffff'){

        //effects here?
        this._viewPort.display.save();

        this._viewPort.display.globalCompositeOperation = blendMode || Sprite.BlendMode.Normal;
        //this._viewPort.display.globalAlpha = 0.5;
        this._viewPort.globalAlpha = opacity || 1;

        this._viewPort.display.drawImage(
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

        //end effects here?
        this._viewPort.display.restore();

        return this;
        //return this.drawGrid();
    };
    /**
     * 
     * @param {Image} image
     * @param {Area} box
     * @param {String} color
     * @returns {Image}
     */
    blendImage(image, box, color = '#ffffff'){

        this._viewPort.display.globalCompositeOperation = "destination-in";
        this._viewPort.display.drawImage(image, 0, 0);
        this._viewPort.display.globalCompositeOperation = "source-over";


        this._viewPort.display.fillStyle = '#ffffaa';
        //this._viewPort.display.fillStyle = color || '#ffffff';

        this._viewPort.display.globalCompositeOperation = 'color';

        this._viewPort.display.fillRect(
                box.X * this._scale,
                box.Y * this._scale,
                box.width * this._scale,
                box.height * this._scale);

        this._viewPort.display.globalCompositeOperation = 'source-over';

        return image;
    };
    /**
     * @returns {ScenePlayer}
     */
    /*this.drawGrid = ( ) => {

        if (this._grid > 0) {

            var cols = this.width() / this._grid;
            var rows = this.height() / this._grid;
            var max = cols > rows ? cols : rows;

            this._viewPort.display.save();
            this._viewPort.display.globalCompositeOperation = Sprite.BlendMode.Luminosity;
            this._viewPort.display.strokeStyle = '#ffffff';

            for (var i = 0; i < max; i++) {
                this._viewPort.display.beginPath();
                //Horizontal
                this._viewPort.display.moveTo(i * this._grid, 0);
                this._viewPort.display.lineTo(i * this._grid, this.height());
                //Vertical
                this._viewPort.display.moveTo(0, i * this._grid);
                this._viewPort.display.lineTo(this.width(), i * this._grid);

                this._viewPort.display.lineWidth = 0.05;
                this._viewPort.display.stroke();
            }

            this._viewPort.display.restore();
        }

        return this;
    };*/
    /**
     * @param {String|Color} color 
     * @returns {ScenePlayer.Renderer} 
     */
    clear(color = '#ffffff'){
        //window.requestAnimationFrame( this.render );
        // Clear the canvas
        if (this._viewPort.display !== null) {
            this._viewPort.display.clearRect(0, 0, this.width(), this.height());
            this._viewPort.display.beginPath();
            this._viewPort.display.rect(0, 0, this.width(), this.height());
            //this._viewPort.display.fillStyle = 'rgba(120,200,255,1)';
            this._viewPort.display.fillStyle = color || this._color;
            //console.log(this._display.fillStyle);
            this._viewPort.display.fill();
        }

        return this;
    };
    /**
     * @returns {Number} 
     */
    width(){
        return tghis._viewPort.width;
    }
    /**
     * @returns {Number} 
     */
    height(){
        return this._viewPort.height
    } ;
    /**
     * @returns {ScenePlayer.Renderer} 
     */
    setup(container){

        if (this._viewPort === null) {

            this._viewPort = document.createElement('canvas');

            this._viewPort.display = this._viewPort.getContext('2d');
            //disable popup menu
            this._viewPort.oncontextmenu = () => false;

            container.appendChild(this._viewPort);

            return this.resize(container.offsetWidth, container.offsetHeight);
        }

        return this;
    };
}

class Renderer{
    constructor( container ){
        this._canvas = document.createElement('canvas');
        this._display = this._canvas.getContext('2d');
        this._display.oncontextmenu = () => false;

        if( container instanceof Element ){
            
        }
    }

}
/**
 * 
 */
/**
 * GameTime
 * Tracks total runtime and per-frame elapsed time using Date.now().
 */
class GameTime {
    /**
     * 
     */
    constructor() {
        this.reset();
    }
    /**
     * @returns {Number}
     */
    now(){
        return Date.now();
    }

    /**
     * Update the game clock.
     * @returns {Number} elapsed time in seconds since last tick
     */
    tick() {
        const now = this.now(); // ms timestamp as number

        if (this._lastStamp) {
            this._elapsed = (now - this._lastStamp) / 1000; // to seconds
            this._time += this._elapsed;
        }
        else{
                        // first tick, no elapsed yet
            this._elapsed = 0;
        }

        this._lastStamp = now;
        return this._elapsed;
    }
    /**
     * 
     * @returns {Number}
     */
    elapsed() {
        return this._elapsed;
    }
    /**
     * 
     * @returns {Number}
     */
    time() {
        return this._time;
    }
    /**
     * 
     * @returns {Number}
     */
    reset() {
        this._time = 0;
        this._elapsed = 0;
        this._lastStamp = 0;
        this._start = this.now(); 
    }
}
