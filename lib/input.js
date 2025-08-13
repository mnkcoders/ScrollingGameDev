
/**
 * @class {InputManager}
 */
class InputManager{

    constructor(){
        if( InputManager._instance ){
            return InputManager._instance;
        }

        InputManager._instance = this.initialize();
    }
    /**
     * 
     * @returns {InputManager}
     */
    initialize(){

        return this;
    }

    /**
     * 
     * @returns {InputManager}
     */
    static instance(){
        return InputManager._instance || new InputManager();
    }
}



export {InputManager};
