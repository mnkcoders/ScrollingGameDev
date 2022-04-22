/***************************************************************************
 * ScenePlayer Renderer
 * 
 * @param {Element} container 
 * @returns {ScenePlayer.Renderer}
 **************************************************************************/
function Renderer(container) {

    var _renderer = {
        /**
         * @type Canvas
         */
        'viewPort': null,
        /**
         * @type CanvasRenderingContext2D
         */
        //'display': null,
        /**
         * @type String|Color
         */
        //'color': '#ffffff'
        'color': '#78c8ff',
        /**
         * @type float
         */
        'scale': 1.0,
        /**
         * @type Number
         */
        'grid': 0,
        /**
         * @type Number Frames per second
         */
        'FPS': 5,
        /**
         * @type Number Render loop timeout
         */
        'renderLoop': 0
    };
    /**
     * @param {Number} fps
     * @returns {Number}
     */
    this.FPS = (fps) => {

        if (typeof fps === 'number') {

            _renderer.FPS = fps;

        }

        return _renderer.FPS;
    };
    /**
     * @returns {Element}
     */
    this.window = () => _renderer.viewPort;
    /**
     * @returns {Area}
     */
    this.boundingBox = () => new Area(0, 0, this.width(), this.height());
    /**
     * @returns {ScenePlayer.Renderer} 
     */
    this.resize = (w, h) => {
        _renderer.viewPort.width = w;
        _renderer.viewPort.height = h;
        //console.log( 'Viewport set to ' + _renderer.viewPort.width + 'x' + _renderer.viewPort.height );
        return this;
    };
    /**
     * @param {Float} scale
     * @returns {ScenePlayer.Renderer}
     */
    this.setScale = (scale) => {

        _renderer.scale = scale;

        return this;
    };
    /**
     * @param {Number} grid
     * @returns {ScenePlayer}
     */
    this.setGrid = (grid) => {

        _renderer.grid = grid;

        return this;
    };
    /**
     * @returns {Number}
     */
    this.frameRate = () => parseInt(1000 / _renderer.FPS);
    /**
     * @param {Function} closure
     * @returns {ScenePlayer.Renderer}
     */
    this.renderStart = (closure) => {

        if (typeof closure === 'function') {

            _renderer.renderLoop = window.setInterval(closure, this.frameRate());
            console.log('Render started at ' + this.frameRate() + ' FPS');
        }

        return this;
    };
    /**
     * @returns {ScenePlayer.Renderer}
     */
    this.renderStop = () => {
        if (_renderer.renderLoop) {
            window.clearInterval(_renderer.renderLoop);
            _renderer.renderLoop = 0;
        }
        return this;
    };
    this.opacity = (value) => value / 255;
    /**
     * @param {Image} image 
     * @param {Area} source 
     * @param {Area} destination 
     * @param {Number} opacity 
     * @param {String} blendMode 
     * @returns {ScenePlayer.Renderer}
     */
    this.draw = (image, source, destination, opacity, blendMode, color) => {

        //effects here?
        _renderer.viewPort.display.save();

        _renderer.viewPort.display.globalCompositeOperation = blendMode || Sprite.BlendMode.Normal;
        //_renderer.viewPort.display.globalAlpha = 0.5;
        _renderer.viewPort.globalAlpha = opacity || 1;

        _renderer.viewPort.display.drawImage(
                //bitmap de origen
                image,
                //SX,SY - get image source from position (x,y)
                source.left(), source.top(),
                //SW,SH - get image source rectangle (width,height)
                source.width, source.height,
                //DX,DY - set image clip destination position (x,y)
                destination.left() * _renderer.scale, destination.top() * _renderer.scale,
                //DW,DH - set image clip destination size (width, height)
                destination.width * _renderer.scale, destination.height * _renderer.scale);

        //end effects here?
        _renderer.viewPort.display.restore();

        return this.drawGrid();
    };
    /**
     * 
     * @param {Image} image
     * @param {Area} box
     * @param {String} color
     * @returns {Image}
     */
    this.blendImage = (image, box, color) => {

        _renderer.viewPort.display.globalCompositeOperation = "destination-in";
        _renderer.viewPort.display.drawImage(image, 0, 0);
        _renderer.viewPort.display.globalCompositeOperation = "source-over";


        _renderer.viewPort.display.fillStyle = '#ffffaa';
        //_renderer.viewPort.display.fillStyle = color || '#ffffff';

        _renderer.viewPort.display.globalCompositeOperation = 'color';

        _renderer.viewPort.display.fillRect(
                box.X * _renderer.scale,
                box.Y * _renderer.scale,
                box.width * _renderer.scale,
                box.height * _renderer.scale);

        _renderer.viewPort.display.globalCompositeOperation = 'source-over';

        return image;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.drawGrid = ( ) => {

        if (_renderer.grid > 0) {

            var cols = this.width() / _renderer.grid;
            var rows = this.height() / _renderer.grid;
            var max = cols > rows ? cols : rows;

            _renderer.viewPort.display.save();
            _renderer.viewPort.display.globalCompositeOperation = Sprite.BlendMode.Luminosity;
            _renderer.viewPort.display.strokeStyle = '#ffffff';

            for (var i = 0; i < max; i++) {
                _renderer.viewPort.display.beginPath();
                //Horizontal
                _renderer.viewPort.display.moveTo(i * _renderer.grid, 0);
                _renderer.viewPort.display.lineTo(i * _renderer.grid, this.height());
                //Vertical
                _renderer.viewPort.display.moveTo(0, i * _renderer.grid);
                _renderer.viewPort.display.lineTo(this.width(), i * _renderer.grid);

                _renderer.viewPort.display.lineWidth = 0.05;
                _renderer.viewPort.display.stroke();
            }

            _renderer.viewPort.display.restore();
        }

        return this;
    };
    /**
     * @param {String|Color} color 
     * @returns {ScenePlayer.Renderer} 
     */
    this.clear = (color) => {
        //window.requestAnimationFrame( this.render );
        // Clear the canvas
        if (_renderer.viewPort.display !== null) {
            _renderer.viewPort.display.clearRect(0, 0, this.width(), this.height());
            _renderer.viewPort.display.beginPath();
            _renderer.viewPort.display.rect(0, 0, this.width(), this.height());
            //_renderer.viewPort.display.fillStyle = 'rgba(120,200,255,1)';
            _renderer.viewPort.display.fillStyle = color || _renderer.color;
            //console.log(_renderer.display.fillStyle);
            _renderer.viewPort.display.fill();
        }

        return this;
    };
    /**
     * @returns {Number} 
     */
    this.width = () => _renderer.viewPort.width;
    /**
     * @returns {Number} 
     */
    this.height = () => _renderer.viewPort.height;
    /**
     * @returns {ScenePlayer.Renderer} 
     */
    this.setup = (container) => {

        if (_renderer.viewPort === null) {

            _renderer.viewPort = document.createElement('canvas');

            _renderer.viewPort.display = _renderer.viewPort.getContext('2d');
            //disable popup menu
            _renderer.viewPort.oncontextmenu = () => false;

            container.appendChild(_renderer.viewPort);

            return this.resize(container.offsetWidth, container.offsetHeight);
        }

        return this;
    };

    return container instanceof Element ? this.setup(container) : null;
}
;
