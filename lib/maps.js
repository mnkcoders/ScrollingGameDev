import { Component } from "./core";


/**
 * @class {GameMap}
 */
class GameMap extends Component{
    /**
     * 
     */
    constructor(){
        super();

        this._layers = [];
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
}
/**
 * @class {MapLayer}
 */
class MapLayer{
    /**
     * @param {TileSet} tileSet
     * @param {Number[]} tileData
     */
    constructor( tileSet = null ,tileData = []){
        this._tileSet = tileSet instanceof TileSet ? tileSet : null;
        this.fill( this._tileSet && tileData || []);
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
