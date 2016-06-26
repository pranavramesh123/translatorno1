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
        list.splice(list.indexOf(player), 1);
    }

    function getItem(index) {
        return list[index].player;
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
        getItem: getItem
    };
}

/*
 * A class that make a new player to the game
 */
var Player = function(name, bot) {
    // initialize player's name and add it to the game object
    var gamerName = name;
    var healthbar = [];

    var style = {
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    };

    var styleScore = {
        font: "40px Arial",
        fill: "#ff0044",
        align: "center"
    };

    this.scoreboard = 0;
    this.alive = true;
    this.lifes = 4;
    this.player = null;

    var tagScoreboard;
    if (!bot) {
        tagScoreboard = Context.game.add.text(Context.width - 250, 0, 'Score: ' + this.scoreboard, styleScore);
    }

    Context.game.load.image('heart', 'assets/image/player/heart.png');
    Context.game.load.image(gamerName, 'assets/image/player/gunPlayer.png');

    this.updateScore = function() {
        tagScoreboard.setText('Score: ' + this.scoreboard);
    }

    this.getName = function() {
        return gamerName;
    };

    this.reduceHP = function(damage) {
        if (healthbar.length > 0) {
            healthbar.pop().kill();
            this.lifes--;
        }
        if (this.lifes <= 0) {
            playerManager.removePlayer(currentPlayer);
            this.alive = false;
            this.player.kill();
            var text = "You died.";
            var t = Context.game.add.text(Context.game.world.centerX - 150, 0, text, style);
            deletePlayer(roomName, playerName);
        }
    };
    this.addPlayerToWorld = function() {
        if(gamerName==='me'){
          this.player = Context.game.add.sprite(Context.game.world.centerX,genRandom(Context.height), gamerName);
        }
        else {
          this.player = Context.game.add.sprite(-400, -400, gamerName);
        }
        this.player.anchor.set(0.5);
        Context.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;

        if (bot) return;
        for (var i = 0; i < 4; i++) {
            healthbar.push(Context.game.add.image(i * 40, 0, 'heart'));
        }
    };

};
