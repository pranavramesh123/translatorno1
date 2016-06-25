var Context = {
    game: null,
    keyLeft: null,
    keyRight: null,
    keyUp: null
}
var player = null;

// preload process for main index 
window.onload = function() {
    // field for game object
    Context.game = new Phaser.Game(800, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};

/* a function that preload all necessary graphic */
function preload() {
    Context.game.load.image('ground', 'assets/image/background/ground.png');
    player = new Player("player1");
}

function create() {
      //  We're going to be using physics, so enable the Arcade Physics system
      Context.game.physics.startSystem(Phaser.Physics.ARCADE);

      var platforms = Context.game.add.group();

      platforms.enableBody = true;
      platforms.physicsBodyType = Phaser.Physics.ARCADE;

      var ground = platforms.create(0, Context.game.world.height - 64, 'ground');

      ground.scale.setTo(2, 2);

      ground.body.immovable = true;

      var ledge = platforms.create(300, Context.game.world.height - 192, 'ground');

      ledge.body.immovable = true;

      ledge = platforms.create(-550, Context.game.world.height - 320, 'ground');

      ledge.body.immovable = true;
}

function update(){

}

/*
 * A class that make a new player to the game
 */
var Player = function(name) {
    // initialize player's name and add it to the game object
    var name = name;
    Context.game.load.image(name, 'assets/image/player/player1right.png');

    // field for keep track player's position
    this.x = 0;
    this.y = 0;

    this.getName = function() {
        return name;
    }
}

/*
 * A static class that define key event functions
 */
var KeyEvent = {
    left: function() {
        Context.game.load.image(name, 'assets/image/player/player1left.png');
        if (player.x >= 5) { player.x -= 5 }
        Context.game.add.sprite(player.x, player.y, player.getName());
    },
    right: function() {
        Context.game.load.image(name, 'assets/image/player/player1left.png');
        if (player.x <= 795) { player.x += 5 }
        Context.game.add.sprite(player.x, player.y, player.getName());
    },
    up: function() {
        Context.game.load.image(name, 'assets/image/player/player1left.png');
        if (player.y >= 5) { player.y -= 5 }
        Context.game.add.sprite(player.x, player.y, player.getName());
    }
}
