/**
 * @returns {ScenePlayer.Input}
 */
function Input() {
    
    var _CONTROLLER = {
        'view':null,
        'events':{
            //setup event binding here
        }
    };
    /**
     * @param {String} event_id
     * @param {Function} callable
     * @returns {Input}
     */
    this.bind = function( event_id , callable ){
        if( !_CONTROLLER.events.hasOwnProperty(event_id) && typeof callable === 'function' ){
            _CONTROLLER.events[ event_id ] = callable;
        }
        return this;
    };
    /**
     * @param {String} event_id
     * @param {Object} event_data
     * @returns {Boolean}
     */
    this.call = function( event_id , event_data ){
        if( _CONTROLLER.events.hasOwnProperty( event_id ) ){
            var call = _CONTROLLER.events[ event_id ];
            return call( event_data );
        }
        return false;
    };
    
    /**
     * @param {MouseEvent} e
     * @returns {Boolean}
     */
    this.onClick = (e) => {

        var button = e.which || e.button;

        console.log('Click: ' + button);

        _MANAGER.instance.clickOver(e);

        return true;
    };
    /**
     * @param {MouseEvent} e
     * @returns {Boolean}
     */
    this.onMouseHover = (e) => {

        //console.log( 'Hover' );

        return true;
    };
    /**
     * @param {MouseEvent} e
     * @returns {Boolean}
     */
    this.onMouseMove = (e) => {

        //console.log( 'Moving!!' );

        return true;
    };
    /**
     * @param {MouseEvent} e
     * @returns {Boolean}
     */
    this.onMouseOut = (e) => {

        //console.log( 'Mouse Out!' );

        return true;
    };
    /**
     * @param {MouseEvent} e
     * @returns {Boolean}
     */
    this.onMouseDown = (e) => {

        //console.log( 'MouseDown' );

        return true;
    };
    /**
     * @param {MouseEvent} e
     * @returns {Boolean}
     */
    this.onMouseUp = (e) => {

        //console.log( 'MouseUp' );

        return true;
    };

    /**
     * @returns {ScenePlayer.Input}
     */
    this.setup = () => {

        if (_MANAGER.Renderer !== null) {

            _MANAGER.Renderer.window().addEventListener('click', this.onClick);
            _MANAGER.Renderer.window().addEventListener('hover', this.onMouseHover);
            _MANAGER.Renderer.window().addEventListener('mousemove', this.onMouseMove);
            _MANAGER.Renderer.window().addEventListener('mouseout', this.onMouseOut);
            _MANAGER.Renderer.window().addEventListener('mouseup', this.onMouseUp);
            _MANAGER.Renderer.window().addEventListener('mousedown', this.onMouseDown);
        }

        return this;
    };

    return this.setup();
}
;
