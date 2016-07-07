// main field for game object
var Context = {
    game: new Phaser.Game($(window).width() - 50, $(window).height() - 50, Phaser.CANVAS, 'game', {
        preload: preload,
        create: create,
        update: update
    }),
    width: $(window).width() - 50,
    height: $(window).height() - 50
};

// TODO: eliminate the use of global varibles
// fields for players
var playerManager, currentPlayer, enemyManager, enemyGroup, cursors, audio;

/* preload function that initializes graphics */
function preload() {
    Context.game.load.spritesheet('enemy', 'assets/image/enemy/enemy.png', 32, 32, 10);
    Context.game.load.image('bullet', 'assets/image/player/fireball.png');
    Context.game.load.audio('audio', 'assets/audio/fx_mixdown.ogg');

    // initialize players
    playerManager = new PlayerManager();
    currentPlayer = new Player('me', false);
    for (var i = 1; i < 4; i++) {
        var player = new Player(i, true);
        playerManager.pushPlayer(player);
    }
}

/* create function that register more things for objects */
function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    Context.game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = Context.game.input.keyboard.createCursorKeys();
    Context.game.stage.backgroundColor = '#313131';

    // enemies attributes
    enemyManager = new EnemyManager();
    enemyGroup = Context.game.add.group();
    enemyGroup.enableBody = true;

    // enemies creation
    for (var i = 0; i < 17; i++) {
        enemyManager.pushEnemy(new Enemy());
    }
    currentPlayer.ready();

    currentPlayer.addPlayerToWorld();
    playerManager.addPlayersToWorld();

    // audio creation
    audio = Context.game.add.audio('audio');
    audio.allowMultiple = true;
    audio.addMarker('boss hit', 3, 0.5);
    audio.addMarker('ping', 10, 1.0);
    audio.addMarker('death', 12, 4.2);

    // make full screen
    Context.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    Context.game.input.onDown.add(gofull, this);
}

/* udpate function that refresh latest progress */
var special_key_pair;
function update() {
	// retrieve current status
    if(!login) {
        updatePlayerStatus(roomName, playerName, currentPlayer.player.x, currentPlayer.player.y, currentPlayer.lifes);
        var i = -1;
        for (var key in special_key_pair) {
            i++;
            if (key == playerName) continue;
            var player = playerManager.getItem(i);
            player.x = special_key_pair[key]['positionX'];
            player.y = special_key_pair[key]['positionY'];
            if (special_key_pair[key]['health'] <= 0) {
                player.kill();
            }
        }
    }

    // register physical attributes
    currentPlayer.update();

    //  Reset the players velocity (movement)
    currentPlayer.player.body.velocity.x = 0;
    currentPlayer.player.body.velocity.y = 0;

    // other necessary updates
    currentPlayer.player.rotation = Context.game.physics.arcade.angleToPointer(currentPlayer.player);
    enemyManager.update();

    // player position
    if (cursors.left.isDown) {
        //  Move to the left
        currentPlayer.player.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
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

/* go full function to make full screen */
function gofull() {
    if (game.scale.isFullScreen)
        game.scale.stopFullScreen();
    else
        game.scale.startFullScreen(false);
}
