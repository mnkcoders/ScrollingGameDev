/**
 * @param {String} bitmap_id 
 * @param {Int} tileWidth
 * @param {Int} tileHeight
 * @returns {TileSet}
 */
function TileSet( bitmap_id , tileWidth , tileHeight ){
    
    var _tileSet = {
        'bitmapId': typeof bitmap_id !== 'undefined' ? bitmap_id : 0,
        'width': typeof tileWidth === 'number' ? tileWidth : 32,
        'height': typeof tileHeight === 'number' ? tileHeight : 32,
        'blueprint': {
            0:[/*empty*/],
            1:[/*up*/],
            2:[/*up-right*/],
            3:[/*right*/],
            4:[/*down-right*/],
            5:[/*down*/],
            6:[/*down-left*/],
            7:[/*left*/],
            8:[/*up-left*/],
            9:[/*solid*/]
        },
        'tiles': [
            Tile.Empty
            //add all tile definitions here
        ]
    };
    /**
     * @returns {Tile}
     */
    this.empty = () => _tileSet.tiles[0];
    /**
     * Place a tile (constriction mode) by random position within the selected type
     * @param {Int|String} type
     * @returns {Tile}
     */
    this.generate = ( type ) => {

        if( _tileSet.blueprint.hasOwnProperty( type ) ){
            
            var R = parseInt( Math.random() * _tileSet.blueprint[ type ].length );
            
            return _tileSet.tiles[ R ];
        }
        
        return this.empty();
    };
    /**
     * @param {Tile} tile
     * @returns {TileSet}
     */
    this.addTile = ( tile ) => {

        if( tile instanceof Tile && !tile.empty() ){
            //add to tile collection (obtains a position or ID in the list)
            _tileSet.tiles.push( tile );
            //add to tile template rules, refered by the recent position ID in the list)
            _tileSet.blueprint[ tile.type() ].push( _tileSet.tiles.length - 1 );
        }

        return this;
    };
    /**
     * @param {Number} tileID
     * @returns {Tile}
     */
    this.get = function( tileID ){
        return tileID > -1 && tileID < _tileSet.tiles.length ?
            _tileSet.tiles[ tileID ] :
                this.empty();
    };
    /**
     * @returns {Number}
     */
    this.width = () => _tileSet.width;
    /**
     * @returns {Number}
     */
    this.height = () => _tileSet.height;
    
    return this;
}




