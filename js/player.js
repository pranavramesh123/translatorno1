/*
 * A class that manage all players in the game
 */
var PlayerManager = function() {
    var list = [];

    function pushPlayer(player) {
        list.push(player);
    }

    function removePlayer(player) {
        list.remove(player);
        player.player.kill();
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
    var health = 200;

    this.player = null;
    Context.game.load.image(name, 'assets/image/player/player1left.png');

    this.getName = function() {
        return playerName;
    };

    this.reduceHP = function(damage) {
        health -= damage;
        if (health <= 0) {
            this.player.kill();
        }
    };

    this.addPlayerToWorld = function() {
        this.player = Context.game.add.sprite(0, 0, playerName);
        this.player.anchor.set(0.5);
        Context.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.allowRotation = false;
        this.player.body.collideWorldBounds = true;
    };

};
