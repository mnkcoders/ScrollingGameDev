
/**
 * @class {UIComponent}
 */
class UIContainer{

    constructor( name = '' ){
        this._name = name;
    }
    /**
     * @returns {String}
     */
    name(){
        return this._name && this.constructor.name;
    }
    /**
     * 
     * @returns {UIContainer[]}
     */
    components(){
        return this._components;
    }
    /**
     * @param {UIContainer} component 
     * @returns {UIContainer}
     */
    add(component){
        if(component instanceof UIContainer){
            this._components.push(component);
        }
        return this;
    }
    /**
     * 
     */
    update(){
        //refresh container
        this.refresh();
        //update and refresh children
        this.components().forEach( component => component.update() );
        return this;
    }
    /**
     * 
     */
    refresh(){

        return this;
    }
}

/**
 * @class {UIText}
 */
class UIText extends UIContainer{
    constructor(name = ''){
        super(name);
    }
}

/**
 * @class {UIGauge}
 */
class UIGauge extends UIContainer{
    constructor(name = ''){
        super(name);
    }
}

/**
 * @class {UICounter}
 */
class UICounter extends UIContainer{
    constructor(name = ''){
        super(name);
    }
}

/**
 * @class {UIWindow}
 */
class UIWindow extends UIContainer{
    constructor(name = ''){
        super(name);
    }
}
/**
 * @class {UIDialog}
 */
class UIDialog extends UIWindow{
    constructor(name = ''){
        super(name);
    }
}
/**
 * @class {UIMenu}
 */
class UIMenu extends UIWindow{
    constructor(name = ''){
        super(name);
    }
}



export {UIContainer,UICounter,UIDialog,UIGauge,UIMenu,UIText,UIWindow};






