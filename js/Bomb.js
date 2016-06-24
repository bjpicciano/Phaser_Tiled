var Bomb = function (game, x, y, key, frame) {
    this.game = game;
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    if (key == undefined) { key = graphicAssets.bomb.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, this.game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    
    this.properties = {
        name: "bomb",
        //the game.time until the next attack can be made
        attackInterval: 0,
        //the delay between attacks. Added to attackInterval
        attackDelay: 1500,
        //the time of the bomb's fuse
        attackLifespan: 1500,
        //the size of the bomb's explosion
        hitboxSize: 156,
        //the velocity the bomb is thrown at
        velocity: 200,
        damage: 5,
    };
    
    this.hitbox = new Hitbox(this.game, 0, 0, undefined, undefined);
    this.hitbox.body.setSize(this.properties.hitboxSize, this.properties.hitboxSize, 0);
    this.addChild(this.hitbox);
    
    this.disapearTimer = undefined;
    
    this.destinationPoints = undefined;

    this.game.add.existing(this);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(16, 16, 0);
};

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function () {
    var currentState = this.game.state.getCurrentState();
    this.game.physics.arcade.collide(this, currentState.layer[1]);
    this.game.physics.arcade.collide(this, currentState.destructibles);
    
    //blows the bomb at your cursor
    if (this.destinationPoints != undefined) {
        if (this.game.physics.arcade.distanceToXY(this, this.destinationPoints.x, this.destinationPoints.y) <= 5) {
            this.game.time.events.remove(this.disapearTimer);
            this.disappear();
        }
    }
};

Bomb.prototype.attack = function () {
    if (this.game.time.now > this.properties.attackInterval) {
        var player = this.game.state.getCurrentState().player;
        
        if (player.properties.bombCount > 0) {
            player.properties.bombCount -= 1;
            
            var angleToPointer = this.game.physics.arcade.angleToPointer(player);

            this.appear(angleToPointer);

            this.properties.attackInterval = this.game.time.now + this.properties.attackDelay;
        }
    }
}

Bomb.prototype.appear = function (angleToPointer) {
    var player = this.game.state.getCurrentState().player;

    var distanceToPointer = this.game.physics.arcade.distanceToPointer(player);
    var x = (Math.cos(angleToPointer) * this.game.physics.arcade.distanceToPointer(player));
    var y = (Math.sin(angleToPointer) * this.game.physics.arcade.distanceToPointer(player));
    
    this.destinationPoints = {
        x: x + player.x,
        y: y + player.y,
    };
    
    this.reset(player.x, player.y);

    this.game.physics.arcade.moveToPointer(this, this.properties.velocity);
    
    this.disapearTimer = this.game.time.events.add(this.properties.attackLifespan, this.disappear, this);
};

Bomb.prototype.disappear = function () {
    var currentState = this.game.state.getCurrentState();
    this.game.physics.arcade.overlap(this.hitbox, currentState.destructibles, this.damage, null, this);
    this.game.physics.arcade.overlap(this.hitbox, currentState.enemies, this.damage, null, this);
    this.game.physics.arcade.overlap(this.hitbox, currentState.player, this.damage, null, this);
    
    this.destinationPoints = undefined;
    this.kill();
};

Bomb.prototype.damage = function (hitter, hitee) {
    hitee.takeDamage(this.properties.damage);
};

var Hitbox = function (game, x, y, key, frame) {
    this.game = game;
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    key = undefined;
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, this.game, x, y, key);
    this.anchor.setTo(0.5, 0.5);

    this.game.add.existing(this);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
};

Hitbox.prototype = Object.create(Phaser.Sprite.prototype);
Hitbox.prototype.constructor = Hitbox;

var BombPickup = function (game, x, y, key, frame) {
    this.game = game;
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    if (key == undefined) { key = graphicAssets.bomb.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, this.game, x, y, key);

    this.game.add.existing(this);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
};

BombPickup.prototype = Object.create(Phaser.Sprite.prototype);
BombPickup.prototype.constructor = BombPickup;

BombPickup.prototype.update = function () {
    this.pickUp();
};

BombPickup.prototype.pickUp = function () {
    var player = this.game.state.getCurrentState().player;
    this.game.physics.arcade.overlap(this, player, this.addBomb, null, this);
};

BombPickup.prototype.addBomb = function (hitter, hitee) {
    hitee.properties.bombCount += 1;
    this.destroy();
};