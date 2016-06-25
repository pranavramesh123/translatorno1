var Context = {
    game: null,
};
var player, platforms,cursors;
// preload process for main index
window.onload = function() {
    // field for game object
    Context.game = new Phaser.Game(800, 500, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });
};

/* a function that preload all necessary graphic */
function preload() {
    Context.game.load.image('ground', 'assets/image/background/ground.png');
    player = new Player("player1");
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    Context.game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = Context.game.add.group();

    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.ARCADE;

    var ground = platforms.create(0, Context.game.world.height - 64, 'ground');

    ground.scale.setTo(2, 2);

    ground.body.immovable = true;

    var ledge = platforms.create(300, Context.game.world.height - 192, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-550, Context.game.world.height - 320, 'ground');

    ledge.body.immovable = true;

    player.addPlayerToWorld();

    cursors = Context.game.input.keyboard.createCursorKeys();
}

function update() {
    Context.game.physics.arcade.collide(player, platforms);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
    }
    else
    {}

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}

/*
 * A class that make a new player to the game
 */
var Player = function(name) {
    // initialize player's name and add it to the game object
    var playerName = name;
    Context.game.load.image(name, 'assets/image/player/player1right.png');

    // field for keep track player's position
    this.x = 0;
    this.y = 0;


    this.getName = function() {
        return playerName;
    };

    this.addPlayerToWorld = function() {
        player = Context.game.add.sprite(0, 0, name);
        Context.game.physics.arcade.enable(player);

        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
    };
};
