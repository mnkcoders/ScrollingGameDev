/**
 * @param {type} id
 * @returns {ScenePlayer}
 */
function ScenePlayer( id ){
    /**
     * @type type
     */
    var _MANAGER = {

        'instance': this,
        /**
         * @type String
         */
        'id': typeof id === 'string' ? id : 'sceneplayer',
        /**
         * @type ScenePlayer.Renderer
         */
        'Renderer': null,
        /**
         * @type ScenePlayer.Input
         */
        'Input': null,
        /**
         * @type Sprite[]
         */
        'sprites': [],
        /**
         * @type Number
         */
        'status': ScenePlayer.Status.Loading,
        /**
         * @type Number
         */
        'gameLoop':0,
        /**
         * @type SceneDataBase
         */
        'DB': new SceneDataBase(),
        
        
        /**
         * Scene
         * - Rendering
         * --- background Color
         * --- layers
         * --- sprites
         * - Logics
         * --- eventPages
         * --- update
         * 
         * @type Scene
         */
        'scene': null,
        /**
         * UI
         */
        'GUI': []
    };
   
    /***************************************************************************
     * ScenePlayer Renderer
     * 
     * @param {Element} container 
     * @returns {ScenePlayer.Renderer}
     **************************************************************************/
    function Renderer( container ){
        
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
        this.FPS = ( fps ) => {
            
            if( typeof fps === 'number' ){

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
        this.boundingBox = () => new Area( 0 , 0 , this.width() , this.height() );
        /**
         * @returns {ScenePlayer.Renderer} 
         */
        this.resize = ( w , h ) =>{
            _renderer.viewPort.width = w;
            _renderer.viewPort.height = h;
            //console.log( 'Viewport set to ' + _renderer.viewPort.width + 'x' + _renderer.viewPort.height );
            return this;
        };
        /**
         * @param {Float} scale
         * @returns {ScenePlayer.Renderer}
         */
        this.setScale = ( scale ) => {
            
            _renderer.scale = scale;

            return this;
        };
        /**
         * @param {Number} grid
         * @returns {ScenePlayer}
         */
        this.setGrid = ( grid ) => {
            
            _renderer.grid = grid;
            
            return this;
        };
        /**
         * @returns {Number}
         */
        this.frameRate = () => parseInt( 1000 / _renderer.FPS );
        /**
         * @param {Function} closure
         * @returns {ScenePlayer.Renderer}
         */
        this.renderStart = ( closure ) => {
            
            if( typeof closure === 'function' ){

                _renderer.renderLoop = window.setInterval( closure ,this.frameRate());
                console.log('Render started at ' + this.frameRate() + ' FPS');
            }

            return this;
        };
        /**
         * @returns {ScenePlayer.Renderer}
         */
        this.renderStop = () => {
            if( _renderer.renderLoop ){
                window.clearInterval( _renderer.renderLoop );
                _renderer.renderLoop = 0;
            }
            return this;
        };
        this.opacity = ( value ) => value / 255 ;
        /**
         * @param {Image} image 
         * @param {Area} source 
         * @param {Area} destination 
         * @param {Number} opacity 
         * @param {String} blendMode 
         * @returns {ScenePlayer.Renderer}
         */
        this.draw = ( image, source , destination , opacity, blendMode , color ) => {

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
                    destination.left() * _renderer.scale ,destination.top() * _renderer.scale,
                    //DW,DH - set image clip destination size (width, height)
                    destination.width * _renderer.scale , destination.height * _renderer.scale );

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
        this.blendImage = ( image , box , color ) => {
            
            _renderer.viewPort.display.globalCompositeOperation = "destination-in";
            _renderer.viewPort.display.drawImage(image,0,0);
            _renderer.viewPort.display.globalCompositeOperation = "source-over";
            
            
            _renderer.viewPort.display.fillStyle =  '#ffffaa';
            //_renderer.viewPort.display.fillStyle = color || '#ffffff';

            _renderer.viewPort.display.globalCompositeOperation = 'color';
            
            _renderer.viewPort.display.fillRect(
                    box.X * _renderer.scale,
                    box.Y * _renderer.scale,
                    box.width * _renderer.scale,
                    box.height * _renderer.scale );
            
            _renderer.viewPort.display.globalCompositeOperation = 'source-over';
            
            return image;
        };
        /**
         * @returns {ScenePlayer}
         */
        this.drawGrid = ( ) =>{
            
            if( _renderer.grid > 0 ){
                
                var cols = this.width() / _renderer.grid;
                var rows = this.height() / _renderer.grid;
                var max = cols > rows ? cols : rows;
                
                _renderer.viewPort.display.save();
                _renderer.viewPort.display.globalCompositeOperation = Sprite.BlendMode.Luminosity;
                _renderer.viewPort.display.strokeStyle = '#ffffff';

                for( var i = 0 ; i < max ; i++ ){
                    _renderer.viewPort.display.beginPath();
                    //Horizontal
                    _renderer.viewPort.display.moveTo( i * _renderer.grid , 0  );
                    _renderer.viewPort.display.lineTo( i * _renderer.grid , this.height() );
                    //Vertical
                    _renderer.viewPort.display.moveTo( 0 , i * _renderer.grid  );
                    _renderer.viewPort.display.lineTo( this.width() , i * _renderer.grid );

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
        this.clear = ( color ) =>{
            //window.requestAnimationFrame( this.render );
            // Clear the canvas
            if( _renderer.viewPort.display !== null ){
                _renderer.viewPort.display.clearRect(0,0,this.width(),this.height());
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
        this.setup = ( container ) =>{
            
            if( _renderer.viewPort === null ){

                _renderer.viewPort = document.createElement('canvas');
                
                _renderer.viewPort.display = _renderer.viewPort.getContext('2d');
                //disable popup menu
                _renderer.viewPort.oncontextmenu = () => false;
                
                container.appendChild(_renderer.viewPort);
                
                return this.resize( container.offsetWidth,container.offsetHeight);
            }
            
            return this;
        };
        
        return container instanceof Element ? this.setup( container ) : null;
    };
    /**
     * @returns {ScenePlayer.Input}
     */
    function Input(){
        /**
         * @param {MouseEvent} e
         * @returns {Boolean}
         */
        this.onClick = ( e ) => {
            
            var button = e.which || e.button;
            
            console.log( 'Click: ' + button );
            
            _MANAGER.instance.clickOver( e );
            
            return true;
        }; 
        /**
         * @param {MouseEvent} e
         * @returns {Boolean}
         */
        this.onMouseHover = ( e ) => {
            
            //console.log( 'Hover' );
            
            return true;
        };
        /**
         * @param {MouseEvent} e
         * @returns {Boolean}
         */
        this.onMouseMove = ( e ) => {
            
            //console.log( 'Moving!!' );
            
            return true;
        };
        /**
         * @param {MouseEvent} e
         * @returns {Boolean}
         */
        this.onMouseOut = ( e ) => {
            
            //console.log( 'Mouse Out!' );
            
            return true;
        };
        /**
         * @param {MouseEvent} e
         * @returns {Boolean}
         */
        this.onMouseDown = ( e ) => {
            
            //console.log( 'MouseDown' );
            
            return true;
        };
        /**
         * @param {MouseEvent} e
         * @returns {Boolean}
         */
        this.onMouseUp = ( e ) => {
            
            //console.log( 'MouseUp' );
            
            return true;
        };
        
        /**
         * @returns {ScenePlayer.Input}
         */
        this.bind = () =>{
            
            if( _MANAGER.Renderer !== null ){

                _MANAGER.Renderer.window().addEventListener( 'click' , this.onClick );
                _MANAGER.Renderer.window().addEventListener( 'hover' , this.onMouseHover );
                _MANAGER.Renderer.window().addEventListener( 'mousemove' , this.onMouseMove );
                _MANAGER.Renderer.window().addEventListener( 'mouseout' , this.onMouseOut );
                _MANAGER.Renderer.window().addEventListener( 'mouseup' , this.onMouseUp );
                _MANAGER.Renderer.window().addEventListener( 'mousedown' , this.onMouseDown );
            }
            
            return this;
        };
        
        return this.bind();
    };
    
    /***************************************************************************
     * 
     * ScenePlayer Methods
     * 
     **************************************************************************/
    /**
     * @returns {SceneDataBase}
     */
    this.DB = () => _MANAGER.DB;
    /**
     * @returns {ScenePlayer.Input}
     */
    this.Input = () => _MANAGER.Input;
    /**
     * @param {Number|String} sprite_id
     * @param {Vector|Function} position
     * @param {Number} scale
     * @param {Number|Vector} speed
     * @param {Number} alpha
     * @param {String} blendMode
     * @returns {ScenePlayer}
     */
    this.addSprite = function( sprite_id , position , scale , speed , alpha , blendMode ){
        
       var sprite = _MANAGER.DB.sprite( sprite_id );
       
       if( sprite !== null ){
           _MANAGER.sprites.push( _MANAGER.DB.sprite( sprite_id ).instance(scale,position,speed,alpha,blendMode) );
       }
       else{
           console.log( 'Invalid sprite ' + sprite_id );
       }
       return this; 
    };
    /**
     * @param {Number|String} media_id
     * @returns {ScenePlayer}
     */
    this.playSound = ( media_id ) => {

        if( media_id === 'random' ){
            media_id = Math.floor( Math.random() * _MANAGER.media.length );
        }

        if( typeof media_id === 'number' ){
            
            var sound = _MANAGER.DB.media( media_id );
            
            if( sound !== null ){

               var player = sound.play();

                //console.log(player);

                if( typeof player !== 'undefined' ){
                    player.then( function(){
                        //started
                    }).catch ( error => { console.log( error ); });
                }
            }
        }
        return this;
    };
    /**
     * @param {String|Number} id
     * @returns {ScenePlayer}
     */
    this.playSoundBank = ( id ) => {

        var sb = _MANAGER.DB.soundBank(id);

        if (sb !== null) {
        
            this.playSound(sb.next());
        }
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.update = function (elapsed) {

        if (_MANAGER.sprites.length) {
            for (var s = _MANAGER.sprites.length - 1; s >= 0; s--) {

                var sprite = _MANAGER.sprites[ s ];

                if (sprite.status() !== Sprite.Status.Removed) {
                    switch( true ){
                        case(sprite.area().left() < _MANAGER.instance.displayArea().left() && sprite.speed().X < 0 ):
                        case(sprite.area().right()> _MANAGER.instance.displayArea().right() && sprite.speed().X > 0 ):
                        sprite.speed().invertX();
                        case(sprite.area().top() < _MANAGER.instance.displayArea().top() && sprite.speed().Y < 0):
                        case(sprite.area().bottom() > _MANAGER.instance.displayArea().bottom() && sprite.speed().Y > 0):
                            sprite.speed().invertY();
                        }
                    //logics here
                    sprite.update(elapsed);
                } else {
                    //remove sprite instance here
                    _MANAGER.sprites.splice(s, 1);
                }
            }
        } else {
            _MANAGER.status = ScenePlayer.Status.Completed;
            _MANAGER.instance.playSound(0);
            window.alert('GAME COMPLETED!!!');
        }
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.render = function(){

        _MANAGER.Renderer.clear();

        _MANAGER.sprites.forEach( function(sprite){

            if( _MANAGER.DB.hasImage( sprite.image() ) ){
                //display
                _MANAGER.Renderer.draw(
                    //source image
                    _MANAGER.DB.image( sprite.image() ),
                    //source image
                    sprite.currentFrame.drawable(),
                    //destination area
                    sprite.area(),
                    sprite.opacity(),
                    sprite.blendMode(),
                    sprite.color( ) );
            }
        });
        
        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.load = function(){

        //TAg as playing
        //_MANAGER.status = ScenePlayer.Status.Playing;
        _MANAGER.status++;
        
        //_MANAGER.Renderer.renderStart( _MANAGER.instance.render );
        
        _MANAGER.gameLoop = window.setInterval( function(){

            switch( true ){
                case _MANAGER.status > ScenePlayer.Status.Playing:
                    //other statuses
                    window.clearInterval( _MANAGER.gameLoop );
                    _MANAGER.gameLoop = 0;
                    _MANAGER.Renderer.renderStop();
                    _MANAGER.Renderer.clear('#ffffff');
                    break;
                case _MANAGER.status === ScenePlayer.Status.Playing:
                    //Main game loop
                    _MANAGER.instance.update().render();
                    break;
            }

        }, _MANAGER.Renderer.frameRate() );

        return this;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.unload = () =>{

        if( _MANAGER.gameLoop ){
        
            window.clearInterval( _MANAGER.gameLoop );
            
            _MANAGER.gameLoop = 0;
        }
        
        _MANAGER.DB.unload();
        
        return this;
    };
    /**
     * @returns {Element}
     */
    this.getContainer = function(){ return document.getElementById(_MANAGER.id); };
    /**
     * @param {Vector|Area} element
     * @returns {Boolean}
     */
    this.inDisplay = function( element ){
        
        return _MANAGER.display.window().intersect( element );
        
        //return this.displayArea().intersect( element );
        
        return false;
    };
    /**
     * @returns {Area}
     */
    this.displayArea = () => _MANAGER.Renderer.boundingBox();
    /**
     * @returns {ScenePlayer.Renderer}
     */
    this.Renderer = () => _MANAGER.Renderer;
    /**
     * @param {Event} e
     * @returns {Boolean}
     */
    this.clickOver = function( e ){
        
        for( var s = _MANAGER.sprites.length - 1 ; s > -1 ; s-- ){
            
            var sprite = _MANAGER.sprites[ s ];
            
            if( sprite.click( e.offsetX , e.offsetY ) ){
                
                _MANAGER.instance.playSoundBank( 0 );
                
                //console.log(sprite.name() + ' clicked!');
                
                sprite.status( Sprite.Status.Removed );
                
                //console.log( sprite.status());  
                
                //quit from click loop
                break;
            }
        }
        
        return true;
    };
    /**
     * @returns {ScenePlayer}
     */
    this.init = function(){
        
        document.addEventListener('DOMContentLoaded',function(e){
            
            _MANAGER.Renderer = new Renderer( _MANAGER.instance.getContainer() );
            
            _MANAGER.Input = new Input( /**/ );
                

            
            window.addEventListener( 'resize', function(e){
                
                var container = _MANAGER.instance.getContainer();

                _MANAGER.Renderer.resize( container.offsetWidth , container.offsetHeight );
            });

            _MANAGER.instance.load();

        });
        
        return this;
    };
    
    return this.init();
}

/**
 * 
 * @param {Number} from
 * @param {Number} to
 * @returns {Number}
 */
ScenePlayer.Random = ( min , max ) => {
   
    switch( true ){
        case typeof max === 'number' && typeof min === 'number':
            return Math.floor(Math.random() * (max - min + 1)) + min;
        case typeof min === 'number':
            return Math.floor(Math.random() * min );
    }
    
    return Math.floor(Math.random() * 100);
}; 
/**
 * @type type ScenePlayer.Status
 */
ScenePlayer.Status = {
    'Loading': 0,
    'Playing': 1,
    'GameOver': 2,
    'Completed': 3
};

