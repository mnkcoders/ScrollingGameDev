/**
 * @returns {EventPage}
 */
function EventPage(){
    
    var _PAGE = {
        /**
         * @type Condition[]
         */
        'conditions': [],
        /**
         * @type Event[]
         */
        'events': []
    };
    /**
     * @param {Event} e
     * @returns {EventPage}
     */
    this.addEvent = ( e ) => { _PAGE.events.push( e ); return this; };
    /**
     * @param {Condition} e
     * @returns {EventPage}
     */
    this.addCondition = ( c ) => { _PAGE.conditions.push( c ); return this; };
    
    
    return this;
}

/**
 * @returns {Condition}
 */
function Condition(){
    
    
    
    return this;
}

/**
 * @returns {Event}
 */
function Event(){

    
    
    return this;
}


function BeginSceneEvent(){}
function EndSceneEvent(){}
function SpriteLoopEndEvent(){}
function TimerEvent(){}







