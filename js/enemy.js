function EnemyManager() {
    var list = [];

    function pushEnemy(enemy) {
        enemy.spawnEnemy();
        list.push(enemy);
    }

    function removeEnemy(enemy) {
        list.remove(enemy);
        enemy.enemy.kill();
    }

    function update() {}

    return {
        pushEnemy: pushEnemy,
        removeEnemy: removeEnemy,
        update: update
    };
}

function Enemy() {
    var health = 50;
    this.enemy = null;
    this.spawnEnemy = function() {
        this.enemy = enemyGroup.create(genRandom(Context.width), genRandom(Context.height), 'enemy');
        this.enemy.scale.setTo(2, 2);
        this.enemy.animations.add('idle');
        this.enemy.animations.play('idle', 10, true);
    };
}

function genRandom(length) {
    return Math.floor(Math.random() * (length - 32)) + 32;
}

function hitEnemy(player, enemy) {
    enemy.kill();
    currentPlayer.reduceHP(30);
    enemyManager.pushEnemy(new Enemy());
}

function killEnemy(fireBall, enemies) {
    enemies.kill();
    fireBall.kill();
    enemyManager.pushEnemy(new Enemy());
}