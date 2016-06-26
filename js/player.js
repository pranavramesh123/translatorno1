/*
 * A class that manage all players in the game
 */
var PlayerManager = function() {
    var list = [];

    function pushPlayer(player) {
        list.push(player);
    }

    function getPlayerByPhysicsInstance(player) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].player === player) {
                return list[i];
            }
        }
    }

    function removePlayer(player) {
        list.splice(list.indexOf(player),1);
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
        getPlayerByPhysicsInstance: getPlayerByPhysicsInstance,
        removePlayer: removePlayer,
        addPlayersToWorld: addPlayersToWorld,
        update: update
    };
}

/*
 * A class that make a new player to the game
 */
var Player = function(name, type) {
    // initialize player's name and add it to the game object
    var playerName = name;
    var health = 200;
    var playerType = type;
    this.alive = true;

    this.player = null;
    this.weapon = null;
    if (type == 0) {
        Context.game.load.image(name, 'assets/image/player/gunPlayer.png');
    } else {
        Context.game.load.image(name, 'assets/image/player/knifePlayer.png');
        Context.game.load.image(name + '1', 'assets/image/player/knife.png');
    }

    this.getName = function() {
        return playerName;
    };

    this.getType = function() {
        return playerType;
    };

    this.reduceHP = function(damage) {
        health -= damage;
        if (health <= 0) {
            playerManager.removePlayer(currentPlayer);
            this.alive = false;
            this.player.kill();
            if (this.weapon != null) {
                this.weapon.kill();
            }
        }
    };
    this.addPlayerToWorld = function() {
        this.player = Context.game.add.sprite(0, 0, playerName);
        if (playerType != 0 ) { 
            this.weapon = Context.game.add.sprite(18, 18, playerName + '1'); 
            this.weapon.anchor.set(1.32);
            Context.game.physics.enable(this.weapon, Phaser.Physics.ARCADE);
            this.weapon.body.allowRotation = false;
            this.weapon.body.collideWorldBounds = true;
            this.weapon.body.setSize(50, 300, 300, 300)
        }
        this.player.anchor.set(0.5);
        Context.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
    };

};
