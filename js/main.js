/* preload process for main index */
window.onload = function() {

    // field for game object
    var game = new Phaser.Game(800, 500, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });
    var platforms;

    function preload() {
        game.load.image('playerRight', 'assets/image/player/player1right.png');
        game.load.image('ground', 'assets/image/background/ground.png');
    }

    function create() {
      //  We're going to be using physics, so enable the Arcade Physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      platforms = game.add.group();

      platforms.enableBody = true;
      platforms.physicsBodyType = Phaser.Physics.ARCADE;

      var ground = platforms.create(0, game.world.height - 64, 'ground');

      ground.scale.setTo(2, 2);

      ground.body.immovable = true;

      var ledge = platforms.create(300, game.world.height - 192, 'ground');

      ledge.body.immovable = true;

      ledge = platforms.create(-550, game.world.height - 320, 'ground');

      ledge.body.immovable = true;
    }

    function update() {

    }

};
