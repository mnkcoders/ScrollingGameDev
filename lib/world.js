import { ContentManager } from "./content";
import { Area, Component } from "./core";
import { Entity } from "./entities";
import { Content, GameAsset, ImageContent } from "./types";

/**
 * @class {GameWorld}
 */
class GameWorld{
    constructor(){
        this._elements = [];
        this._gameMap = null;
    }
    /**
     * @returns {GameMap}
     */
    map(){
        return this._gameMap;
    }
    /**
     * @returns {Entity[]}
     */
    elements(){
        return this._elements;
    }
    /**
     * @returns {Entity[]}
     */
    drawable(){
        return this.elements().filter( element => element.drawable());
    }
    /**
     * @param {Entity} element 
     * @returns {GameWorld}
     */
    add( element = null ){
        if( element instanceof Entity ){
            this.elements().push(element);
        }
        return this;
    }
}

/**
 * @class {GameMap}
 */
class GameMap extends Component{
    /**
     * @param {Number} width
     * @param {Number} height
     */
    constructor( width = 0 , height = 0 ){
        this._layers = [];
        this._width = width;
        this._height = height;
    }
    /**
     * @returns {Number}
     */
    width(){
        return this._width;
    }
    /**
     * @returns {Number}
     */
    height(){
        return this._height;
    }
    /**
     * @param {MapLayer} layer 
     * @returns {GameMap}
     */
    add( layer ){
        if( layer instanceof MapLayer){
            this._layers.push(layer);
        }
        return this;
    }
    /**
     * @returns {MapLayer[]}
     */
    layers(){
        return this._layers;
    }
    /**
     * @returns {MapLayer[]}
     */
    backLayers(){
        return this.layers().filter( layer => layer.type() === MapLayer.Type.Background) ;
    }
    /**
     * @returns {MapLayer}
     */
    mainLayer(){
        return this.layers().filter( layer => layer.type() === MapLayer.Type.Main)[0] || null;
    }
    /**
     * @returns {MapLayer[]}
     */
    frontLayers(){
        return this.layers().filter( layer => layer.type() === MapLayer.Type.Background) ;
    }
}
/**
 * @class {MapLayer}
 */
class MapLayer{
    /**
     * @param {TileSet} tileSet
     * @param {Number} cols
     * @param {Number} rows
     * @param {MapLayer.Type} type
     * @param {Number[]} tileData
     */
    constructor( tileSet = null ,cols = 48 , rows = 32 , type = '', scroll = 0 ,tileData = []){
        this._tileSet = tileSet instanceof TileSet ? tileSet : null;
        this._cols = cols || 48;
        this._rows = rows || 32;
        this._type = type || MapLayer.Type.Background;
        this._scroll = scroll;
        this.fill( this._tileSet && tileData || []);
    }
    /**
     * @returns {MapLayer.Type|String}
     */
    type(){
        return this._type;
    }
    /**
     * @returns {Number}
     */
    scroll(){
        return this._scroll;
    }
    /**
     * @returns {Number}
     */
    cols(){
        return this._cols;
    }
    /**
     * @returns {Number}
     */
    rows(){
        return this._rows;
    }
    /**
     * @param {Number[]} tileData 
     */
    fill( tileData = [] ){
        this._tiles = tileData;
    }
    /**
     * @returns {Number[]}
     */
    tiles(){
        return this._tiles;
    }
    /**
     * @returns {TileSet}
     */
    tileSet(){
        return this._tileSet;
    }
    /**
     * @returns {Number}
     */
    grid(){
        return this.tileSet().size();
    }
    /**
     * @param {Area} display 
     * @returns {MapLayer}
     */
    snapshot( display ){
        const cols = 0;
        const rows = 0;
        const tiles = [];

        return new MapLayer(
            this.tileSet(),
            cols,rows,
            MapLayer.Type.View,
            0,
            tiles
        );
    }
}
/**
 * @type {MapLayer.Type|String}
 */
MapLayer.Type = {
    Background: 'background', //background scrolling layers
    Main: 'main', //main scene
    Foreground: 'foreground', //foreground scrolling layers
    View: 'view', //used to export the current layer view render
};


/**
 * @class {TileSet}
 */
class TileSet extends Content{
    /**
     * @param {String} image
     * @param {Number} size
     */
    constructor( name = '', image = '' ){
        super.name(name);
        this._image = image;
        this._source = null;
        this._tiles = [];
        this._rules = [];
    }
    /**
     * 
     */
    initialize(){
        this.load();
    }
    /**
     * @returns {Boolean}
     */
    ready(){
        return this.source() instanceof ImageContent;
    }
    /**
     * @returns {TileSet}
     */
    load(){
        if( !this.ready()){
            this._source = ContentManager.manager().get(
                this.image(),
                GameAsset.Type.Image);
        }
        return this;
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
    source(){
        return this._source;
    }
    /**
     * @returns {Number}
     */
    count(){
        return this._tiles;
    }
    /**
     * @returns {Number}
     */
    size(){
        return this.source().frameWidth();
    }
    /**
     * @param {Tile} tile 
     * @returns {TileSet}
     */
    add( tile ){
        if( tile instanceof Tile && this.count() < 255){
            this.tiles().push(tile);
        }
        return this;
    }
    /**
     * @param {Number} index 
     * @returns {Tile}
     */
    tile( index = 0 ){
        return this.tiles()[ index % this.count()];
    }
    /**
     * @param {Number} index 
     * @returns {Area}
     */
    frame( index = 0 ){
        return this.source().clip(this.tile(index).id());
    }
}
/**
 * @class {Tile}
 */
class Tile{
    /**
     * @param {Number} id 
     * @param {String} type 
     */
    constructor( id = 0 , type = Tile.Type.None ){
        this._id = id;
        this._type = type || Tile.Type.None;
    }
    /**
     * @returns {Number}
     */
    id(){
        return this._id;
    }
    /**
     * @returns {Tile.Type|String}
     */
    type(){
        return this._type;
    }
}
/**
 * @type {Tile.Type|String}
 */
Tile.Type = {
    None: 'none',
    Solid: 'solid',
};
/**
 * To use in bultin editing and game editor
 * @class {TileRule}
 */
class TileRule{
    constructor(){

    }
}

export {GameWorld,GameMap,MapLayer,TileSet,Tile,TileRule};

