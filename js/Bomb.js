var Bomb = function (game, x, y, key, frame) {
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    if (key == undefined) { key = graphicAssets.bomb.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    
    this.properties = {
        //the game.time until the next attack can be made
        attackInterval: 0,
        //the delay between attacks. Added to attackInterval
        attackDelay: 1500,
        //the time of the bomb's fuse
        attackLifespan: 1400,
        //the size of the bomb's explosion
        hitboxSize: 98,
        //the velocity the bomb is thrown at
        velocity: 200,
        damage: 5,
    };
    
    this.disapearTimer = undefined;
    
    this.destinationPoints = undefined;
 
    game.add.existing(this);
};

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().layer[1]);
    
    //blows the bomb at your cursor
    if (this.destinationPoints != undefined) {
        if (game.physics.arcade.distanceToXY(this, this.destinationPoints.x, this.destinationPoints.y) <= 5) {
            game.time.events.remove(this.disapearTimer)
            this.disappear();
        }
    }
};

Bomb.prototype.attack = function () {
    if (game.time.now > this.properties.attackInterval) {
        var player = game.state.getCurrentState().player;
        var angleToPointer = game.physics.arcade.angleToPointer(player);

        this.appear(angleToPointer);

        this.properties.attackInterval = game.time.now + this.properties.attackDelay;
    }
}

Bomb.prototype.appear = function (angleToPointer) {
    var player = game.state.getCurrentState().player;
    
    var x = (Math.cos(angleToPointer) * game.physics.arcade.distanceToPointer(player));
    var y = (Math.sin(angleToPointer) * game.physics.arcade.distanceToPointer(player));
    
    this.destinationPoints = {
        x: x + player.x,
        y: y + player.y,
    };
    
    this.reset(player.x, player.y);

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.properties.hitboxSize, this.properties.hitboxSize, 0);
    
    game.physics.arcade.moveToPointer(this, this.properties.velocity)
    
    this.disapearTimer = game.time.events.add(this.properties.attackLifespan, this.disappear, this);
};

Bomb.prototype.disappear = function () {
    game.physics.arcade.overlap(this, game.state.getCurrentState().destructables, this.damage, null, this);
    game.physics.arcade.overlap(this, game.state.getCurrentState().enemies, this.damage, null, this);
    game.physics.arcade.overlap(this, game.state.getCurrentState().player, this.damage, null, this);
    
    this.destinationPoints = undefined;
    this.kill();
    this.body.destroy();
};

Bomb.prototype.damage = function (hitter, hitee) {
    hitee.takeDamage(this.properties.damage);
};
