/**
 * @param {Integer} x
 * @param {Integer} y
 * @returns {UI}
 */
function UI( x , y ){
    
    this.X = x;
    this.Y = y;
    
    return this;
}
/**
 * @returns {UIDialog}
 */
function UIDialog( ){
    /**
     * @param {Integer} x
     * @param {Integer} y
     * @returns {UIDialog}
     */
    this.constructor = (x , y) =>{
        
        UI.prototype.call( this , x , y );
        
        return this;
    };
    
    return this;
}
UIDialog.prototype = new UI();
UIDialog.prototype.constructor = UI;

/**
 * @returns {UIScore}
 */
function UIScore(){
    /**
     * @param {Integer} x
     * @param {Integer} y
     * @returns {UIScore}
     */
    this.constructor = ( x , y ) =>{
        
        UI.prototype.call( this , x , y );
        
        return this;
    };
    
    return this;
}
UIScore.prototype = new UI();
UIScore.prototype.constructor = UI;
/**
 * @returns {UIBar}
 */
function UIBar(){
    
    /**
     * @param {Integer} x
     * @param {Integer} y
     * @returns {UIBar}
     */
    this.constructor = ( x , y ) =>{
        
        UI.prototype.call( this , x , y );
        
        return this;
    };
    
    return this;
}
UIBar.prototype = new UI();
UIBar.prototype.constructor = UI;




