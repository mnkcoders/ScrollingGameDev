import { ImageContent } from "./content";
import { Area, Component } from "./core";
import { Entity } from "./entities";

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
class TileSet extends ImageContent{
    /**
     * @param {ImageContent} source
     * @param {Number} size
     */
    constructor( source ){
        super(source);
    }
    /**
     * 
     */
    initialize(){
        this._cols = this.width() / this.size();
        this._rows = this.height() / this.size();
    }
    /**
     * @returns {Number}
     */
    size(){
        return this.frameWidth();
    }
    /**
     * @param {Number} index 
     * @returns {Area}
     */
    tile( index = 0 ){
        return this.extract(index);
    }
    /**
     * @param {ImageContent} source 
     * @returns {TileSet}
     */
    static create( source ){
        return source && source.boxed() && new TileSet(source) || null;
    }
}



export {GameWorld,GameMap,MapLayer,TileSet};
