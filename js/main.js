// main field for game object
var Context = {
    game: new Phaser.Game(screen.width - 50, screen.height - 200, Phaser.CANVAS, 'game', {
        preload: preload,
        create: create,
        update: update
    }),
    width: screen.width-50,
    height: screen.height-200
};
// information of fireball attack
var Attack = {
    fireBall: null,
    fireRate: 500,
    nextFire: 0
};
// fields for players
var playerManager, currentPlayer, enemyManager, enemyGroup, cursors, audio;

/* preload function that initializes graphics */
function preload() {
    Context.game.load.spritesheet('enemy', 'assets/image/enemy/enemy.png', 32, 32, 10);
    Context.game.load.image('bullet', 'assets/image/player/fireball.png');
    Context.game.load.audio('audio', 'assets/audio/fx_mixdown.ogg');

    // initialize players
    currentPlayer = new Player('me', 0);
}

/* create function that register more things for objects */
function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    Context.game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = Context.game.input.keyboard.createCursorKeys();
    Context.game.stage.backgroundColor = '#313131';

    if (currentPlayer.getType() == 0) {
        // fireball attributes
        Attack.fireBall = Context.game.add.group();
        Attack.fireBall.enableBody = true;
        Attack.fireBall.physicsBodyType = Phaser.Physics.ARCADE;
        Attack.fireBall.createMultiple(50, 'bullet');
        Attack.fireBall.setAll('checkWorldBounds', true);
        Attack.fireBall.setAll('outOfBoundsKill', true);
    }

    // enemies attributes
    enemyManager = new EnemyManager();
    enemyGroup = Context.game.add.group();
    enemyGroup.enableBody = true;

    for (var i = 0; i < 10; i++) {
        enemyManager.pushEnemy(new Enemy());
    }
    playerManager = new PlayerManager();
    playerManager.pushPlayer(currentPlayer);
    playerManager.addPlayersToWorld();

    audio = Context.game.add.audio('audio');
    audio.allowMultiple = true;
    audio.addMarker('boss hit', 3, 0.5);
    audio.addMarker('ping', 10, 1.0);
    audio.addMarker('death', 12, 4.2);
}


/* udpate function that refresh latest progress */
function update() {
    if(!login) {
        updatePlayerStatus(roomName, playerName, currentPlayer.player.x, currentPlayer.player.y, currentPlayer.lifes);
        playerManager.killAllPlayer();
        var listing = getRoomStatus(roomName);
        if(listing != undefined){
            for (item in listing) {
                if (item == playerName) continue;
                var player = new Player(item, 0);
                player.lifes = item.health; 
                PlayerManager.pushPlayer(player);
                if (player.getHealth() <= 0) {
                    player.player.kill();
                }
            }
        }
    }  

    Context.game.physics.arcade.overlap(currentPlayer.player, enemyGroup, hitEnemy, null, this);
    Context.game.physics.arcade.overlap(Attack.fireBall, enemyGroup, killEnemyBall, null, this);
    if (currentPlayer.getType() == 1) {
        Context.game.physics.arcade.collide(currentPlayer.weapon, enemyGroup, killEnemyKnife, null, this);
    }

    //  Reset the players velocity (movement)
    currentPlayer.player.body.velocity.x = 0;
    currentPlayer.player.body.velocity.y = 0;
    if (currentPlayer.getType() != 0) {
        currentPlayer.weapon.body.velocity.x = 0;
        currentPlayer.weapon.body.velocity.y = 0;
    }

    if (currentPlayer.getType() == 0) {
        currentPlayer.player.rotation = Context.game.physics.arcade.angleToPointer(currentPlayer.player);
    } else {
        currentPlayer.weapon.rotation = Context.game.physics.arcade.angleToPointer(currentPlayer.weapon);
    }

    // fire ball activation
    if (currentPlayer.getType() == 0 && Context.game.input.activePointer.isDown) {
        fire();
    }

    enemyManager.update();

    // player position
    if (cursors.left.isDown) {
        //  Move to the left
        currentPlayer.player.body.velocity.x = -150;
        if (currentPlayer.getType() != 0) {
            currentPlayer.weapon.body.velocity.x = -150;
        }
    } else if (cursors.right.isDown) {
        //  Move to the right
        currentPlayer.player.body.velocity.x = 150;
        if (currentPlayer.getType() != 0) {
            currentPlayer.weapon.body.velocity.x = 150;
        }
    }
    if (cursors.up.isDown) {
        // Move up
        currentPlayer.player.body.velocity.y = -150;
        if (currentPlayer.getType() != 0) {
            currentPlayer.weapon.body.velocity.y = -150;
        }
    } else if (cursors.down.isDown) {
        // Move down
        currentPlayer.player.body.velocity.y = 150;
        if (currentPlayer.getType() != 0) {
            currentPlayer.weapon.body.velocity.y = 150;
        }
    }
}

/* fire function for shooting */
function fire() {
    if (Context.game.time.now > Attack.nextFire && Attack.fireBall.countDead() > 0 && currentPlayer.alive) {
        Attack.nextFire = Context.game.time.now + Attack.fireRate;
        var bullet = Attack.fireBall.getFirstDead();
        bullet.reset(currentPlayer.player.x - 8, currentPlayer.player.y - 8);
        Context.game.physics.arcade.moveToPointer(bullet, 300);
    }
}
