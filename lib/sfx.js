/**
 * @param {Object} params
 * @returns {SoundBank}
 */
function SoundBank( params ){
    
    var _bank = {
        'name': typeof params.name === 'string' ? params.name : 'New SoundBank',
        'sounds': Array.isArray(params.sounds) ? params.sounds : [/*empty*/],
        'mode': typeof params.mode === 'number' ? params.mode : SoundBank.Modes.RANDOM,
        'repeat': typeof params.repeat === 'number' ? params.repeat : 1, //0 = loop infinite
        'timeout': typeof params.timeout === 'number' ? params.timeout : 500,
        
        'playCount': 0,
        'current': 0,
        'status': SoundBank.Status.Waiting
    };
    /**
     * @returns {Number}
     */
    this.next = function(){
       if( _bank.sounds.length ){
            switch( _bank.mode){
                case SoundBank.Modes.RANDOM:
                    _bank.current = parseInt( Math.random() * _bank.sounds.length );
                    break;
                case SoundBank.Modes.SEQUENTIAL:
                    if( _bank.current < _bank.sounds.length - 1 ){
                        _bank.current++;
                    }
                    else{
                        _bank.current = 0;
                    }
                    break;
                case SoundBank.Modes.REVERSE:
                    if( _bank.current > 0 ){
                        _bank.current--;
                    }
                    else{
                        _bank.current = _bank.sounds.length - 1;
                    }
                    break;
            }
        }
        //console.log('Current soundbank: ' + _bank.sounds[ _bank.current ]);
        return _bank.sounds[ _bank.current ];
    };
    
    
    return this;
}
SoundBank.Modes = {
    SEQUENTIAL: 0,
    RANDOM: 1,
    REVERSE: 2
};
SoundBank.Status = {
    Waiting: 0,
    Playing: 1
};

