import { Component } from "./core";


/**
 * @class {GameMap}
 */
class GameMap extends Component{
    /**
     * @param {Number} width
     * @param {Number} height
     */
    constructor( width = 0 , height = 0 ){
        super();

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
}
/**
 * @class {MapLayer}
 */
class MapLayer{
    /**
     * @param {TileSet} tileSet
     * @param {Number} width
     * @param {Number} height
     * @param {Number[]} tileData
     */
    constructor( tileSet = null ,width = 0 , height = 0 , tileData = []){
        this._tileSet = tileSet instanceof TileSet ? tileSet : null;
        this._width = width;
        this._height = height;
        this.fill( this._tileSet && tileData || []);
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
     * @param {Number[]} tileData 
     */
    fill( tileData = [] ){
        this._tiles = tileData;
    }
    /**
     * @returns {TileSet}
     */
    tileSet(){
        return this._tileSet;
    }
}





export {GameMap,MapLayer};
