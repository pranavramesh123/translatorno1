/* preload process for main index */
window.onload = function() {

    // field for game object
    var game = new Phaser.Game(800, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload () {
      game.load.image('playerRight', 'assets/image/player/player1right.png');
    }

    function create () {
         game.add.sprite(0, 0, 'playerRight');
    }

    function update(){

    }

};