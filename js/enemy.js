var Skall = function (game, x, y, player) {
    if (x == null && y == null) {
        x = game.world.randomX;
        y = game.world.randomY;
    }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game,  x, y, graphicAssets.skall.name);
    this.anchor.setTo(0.5, 0.5);

    this.player = player;
    
    this.properties = {
        startX: x,
        startY: y,
        velocityStart: 100,
        velocityCharge: 300,
        velocityLeap: 600,
        velocity: 100,
        fov: 400,
        leapFov: 120,
    };

    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Skall.prototype = Object.create(Phaser.Sprite.prototype);
Skall.prototype.constructor = Skall;

Skall.prototype.update = function () {
    this.updatePhysics();
    this.idle();
};

Skall.prototype.updatePhysics = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().layer[1]);
    // game.physics.arcade.collide(game.state.getCurrentState().enemies);
};

Skall.prototype.idle = function () {
    if (this.isWithin(this.properties.leapFov, this.player)) {
        this.follow(this.player, this.properties.velocityCharge);
    } else if (this.isWithin(this.properties.fov, this.player)) {
        this.follow(this.player, this.properties.velocity);
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
};

Skall.prototype.follow = function (destinationSprite, speed) {
    game.physics.arcade.moveToObject(this, destinationSprite, speed);
};

Skall.prototype.isWithin = function (distance, destinationSprite) {
    if (game.physics.arcade.distanceBetween(this, destinationSprite) <= distance) {
        return true;
    }
    
    return false;
};