var GAME = new ScenePlayer();

GAME.DB()
        .addMedia('completed_1.wav')
        .addMedia('croak_01.wav')
        .addMedia('croak_02.wav')
        .addMedia('croak_03.wav')
        .addMedia('croak_04.wav')
        .addMedia('croak_05.wav')
        .addMedia('croak_06.wav')
        .addSoundBank('frog', [1, 2, 3, 4, 5, 6])
        //.addImage('gate-1.png')
        .addImage('frog-1.png')
        .addSprite({
            'image': 'frog-1.png',
            'name': 'Mr. Frog',
            'rows': 4, 'cols': 3,
            'width': 144, 'height': 192,
            'frames': [0, 1, 2]
        });

document.addEventListener('DOMContentLoaded', function () {

    //show editor grid
    GAME.Renderer().setGrid(32);

    for (var i = 0; i < parseInt(Math.random() * 40) + 5; i++) {

        GAME.addSprite(0,
                //starting position
                Vector.Random(GAME.Renderer().width(), GAME.Renderer().height()).absolute(),
                //scale
                parseFloat((Math.random() * 2).toFixed(2)) + 1,
                //speed
                Vector.Random(10));
    }
});
