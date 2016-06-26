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

    function update() {
      for(var i=0; i<list.length;i++){
        list[i].updatePosition();
      }
    }

    return {
        pushEnemy: pushEnemy,
        removeEnemy: removeEnemy,
        update: update
    };
}

function Enemy() {
    var health = 50,
    speed = 2,
    directionX,
    directionY;

    this.enemy = null;
    this.spawnEnemy = function() {
        var posX,posY;
        directionX = genDirection();
        directionY = genDirection();
        if(directionX===-1){
          posX = Context.width+genRandom(Context.width*1/4);
        }
        else if(directionX ===1){
          posX = -genRandom(Context.width*1/4);
        }

        this.enemy = enemyGroup.create(posX, genRandom(Context.height), 'enemy');
        this.enemy.scale.setTo(3, 3);
        this.enemy.animations.add('idle');
        this.enemy.animations.play('idle', 10, true);
    };
    this.updatePosition = function(){
        this.enemy.x += speed*directionX;
        this.enemy.y += speed*directionY;
        if(this.enemy.x<=0){
          directionX = 1;
        }
        else if(this.enemy.x>=Context.width){
          directionX = -1;
        }
        if(this.enemy.y<=0){
         directionY = 1;
        }
        else if(this.enemy.y>=Context.height){
          directionY =-1;
        }
    };
}

function genDirection(){
  var direction =  Math.round(Math.random());
  if(direction === 0){
    return -1;
  }
  else{
    return 1;
  }
}

function genRandom(length) {
    return Math.floor(Math.random() * (length));
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
