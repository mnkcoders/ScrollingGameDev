/**
 * @param {Number} ID
 * @param {Number} bitmap_id
 * @param {Integer} type
 * @param {String} material
 * @param {Boolean} solid
 * @returns {Tile}
 */
function Tile( ID , bitmap_id , type , category, material , solid ){
    
    var _tile = {
        'ID': ID || -1,
        'bitmapId': typeof bitmap_id === 'number' ? bitmap_id : 0,
        'type': typeof type === 'number' ? type : Tile.Type.None,
        'category': typeof category === 'string' ? category : Tile.Category.None,
        'material': typeof material === 'string' ? material : Tile.Material.None,
        'solid': typeof solid === 'boolean' ? solid : false
    };
    /**
     * @returns {Boolean}
     */
    this.empty = () => _tile.ID < 0;
    /**
     * @returns {Boolean}
     */
    this.solid = () => _tile.solid;
    /**
     * @returns {String}
     */
    this.material = () => _tile.material;
    /**
     * @returns {String}
     */
    this.type = () => _tile.type;
    /**
     * @returns {Number}
     */
    this.image = () => _tile.bitmapId;
    
    this.ID = () => _tile.ID;
    
    return this;
}
Tile.Empty = new Tile( );
/**
 * 
 * @type Tile.Material
 */
Tile.Material = {
    'None':'none',
    'Sand':'sand',
    'Earth':'earth',
    'Rock':'rock',
    'Metal':'metal'
};
/**
 * @type Tile.Type
 */
Tile.Type = {
    'None':0,
    'Up': 1 ,
    'UpRight': 2 ,
    'Right': 3 ,
    'DownRight': 4 ,
    'Down': 5 ,
    'DownLeft': 6 ,
    'Left': 7 ,
    'UpLeft': 8,
    'Solid':9
};
/**
 * @type Tile.Category
 */
Tile.Category = {
    'None':'none',
};



