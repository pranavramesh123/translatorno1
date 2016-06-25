var Context = {
    game: null,
};
var playerManager, currentPlayer, cursors;
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
    playerManager = new PlayerManager();
    currentPlayer = new Player('player1');
    playerManager.pushPlayer(currentPlayer);
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    Context.game.physics.startSystem(Phaser.Physics.ARCADE);
    playerManager.addPlayersToWorld();
    cursors = Context.game.input.keyboard.createCursorKeys();
}

function update() {
    Context.game.physics.arcade.collide(currentPlayer.player);
    //  Reset the players velocity (movement)
    currentPlayer.player.body.velocity.x = 0;
    currentPlayer.player.body.velocity.y = 0;

    currentPlayer.player.rotation = Context.game.physics.arcade.angleToPointer(currentPlayer.player);
    currentPlayer.player.anchor.set(0.5);
    if (cursors.left.isDown){
        //  Move to the left
        currentPlayer.player.body.velocity.x = -150;
    } else if (cursors.right.isDown){
        //  Move to the right
       currentPlayer.player.body.velocity.x = 150;
    } 

    if (cursors.up.isDown) {
        // Move up
        currentPlayer.player.body.velocity.y = -150;
    } else if (cursors.down.isDown) {
        // Move down
        currentPlayer.player.body.velocity.y = 150;
    }
}


var PlayerManager = function() {
    var list = [];

    function pushPlayer(player) {
        list.push(player);
    }

    function removePlayer() {
        list.remove(player);
    }

    function update() {
        for (var player in list) {
            //player.update();
        }
    }

    function addPlayersToWorld() {
        for (var i = 0; i < list.length; i++) {
            list[i].addPlayerToWorld();
        }
    }

    return {
        pushPlayer: pushPlayer,
        removePlayer: removePlayer,
        addPlayersToWorld: addPlayersToWorld,
        update: update
    };
};

/*
 * A class that make a new player to the game
 */
var Player = function(name) {
    // initialize player's name and add it to the game object
    var playerName = name;
    this.player = null;
    Context.game.load.image(name, 'assets/image/player/player1left.png');

    this.getName = function() {
        return playerName;
    };

    this.addPlayerToWorld = function() {
        this.player = Context.game.add.sprite(0, 0, name);
        Context.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
    };

};
