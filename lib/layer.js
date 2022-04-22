/**
 * @param {TileSet} TileSet 
 * @returns {Layer}
 */
function Layer( TileSet ){
    
    var _layer = {
        'cols': 100,
        'rows': 100,
        /**
         * @type TileSet
         */
        'tileSet': TileSet || null,
        /**
         * @type Array
         */
        'tileMap':[
            //Tile Layout for map rendering
        ]
    };
    /**
     * @returns {TileSet}
     */
    this.tileSet = () => _layer.tileSet;
    /**
     * @returns {Number[]}
     */
    this.tileMap = () => _layer.tileMap;
    /**
     * @returns {Number}
     */
    this.cols = () => _layer.cols;
    /**
     * @returns {Number}
     */
    this.rows = () => _layer.rows;
    /**
     * @returns {Number}
     */
    this.width = function(){
        return this.cols() * this.tileSet().width();
    };
    /**
     * @returns {Number}
     */
    this.height = function(){
        return this.rows() * this.tileSet().height();
    };
    /**
     * @param {Array} tiles
     * @returns {Layer}
     */
    this.importTiles = ( tiles ) => {
        if( Array.isArray( tiles ) ){
            tiles.forEach( function( tile_id ){
                _layer.tileMap.push( parseInt( tile_id ) );
            });
        }
        return this;
    };
    /**
     * Get tileID X position (col
     * @param {Number} tileId
     * @returns {Number}
     */
    this.getTileX = ( tileId ) => ( tileId % this.cols() ) * this.tileSet().width();
    /**
     * Get tileID Y position
     * @param {Number} tileId
     * @returns {Number}
     */
    this.getTileY = ( tileId ) => ( tileId / this.cols() ) * this.tileSet().height();
    /**
     * Get TileID by X,Y position on the map
     * @param {Number} X
     * @param {Number} Y
     * @returns {Number}
     */
    this.getTileId = ( X , Y ) => {
        
        var col = parseInt( X / this.tileSet().width() );
        
        var row = parseInt( Y / this.tileSet().height() );
        
        return col + ( row * this.cols() );
    };
    /**
     * @param {Int} X
     * @param {Int} Y
     * @returns {Tile}
     */
    this.getTile = ( X , Y ) => {
        
        var ID = this.getTileId( X , Y );
        
        return this.tileSet().get( ID );
    };
    /**
     * @param {Int} X
     * @param {Int} Y
     * @returns {String}
     */
    this.getTileType = ( X , Y ) => this.getTile( X , Y ).type();
    
    /**
     * @param {Int} tileID
     * @returns {Layer}
     */
    this.placeTile = ( tileID ) => {
        

        
        //var tile = _layer.tileSet.get( tileID );
        
        //var X = this.getTileX( tileID );
        
        //var Y = this.getTileY( tileID );
        
        
        
        
        return this;
    };
    
    return _layer.tileSet instanceof TileSet ? this : null;
}


