var Skall = function (game, x, y, key, frame) {
    if (x == undefined) { x = game.world.randomX; }
    if (y == undefined) { y = game.world.randomY; }
    if (key == undefined) { key = graphicAssets.skall.name; }
    if (game.state.getCurrentState().player) { this.player = game.state.getCurrentState().player; }

    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);

    this.properties = {
        startX: x,
        startY: y,
        velocityStart: 100,
        velocityCharge: 300 + game.rnd.integerInRange(-50, 25),
        velocityLeap: 600,
        velocity: 100 + game.rnd.integerInRange(-15, 15),
        fov: 400,
        leapFov: 120,
        damage: 1,
        health: 5,
        canDamage: true,
        canDamageTimer: 200,
    };

    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Skall.prototype = Object.create(Phaser.Sprite.prototype);
Skall.prototype.constructor = Skall;

Skall.prototype.update = function () {
    this.updatePhysics();
    
    if (this.player) {
        this.idle();
    }
};

Skall.prototype.updatePhysics = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().layer[1]);
    game.physics.arcade.collide(this, game.state.getCurrentState().enemies);
    
    game.physics.arcade.overlap(this, this.player, this.damage, null, this);
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

Skall.prototype.damage = function (hitter, hitee) {
    if (this.properties.canDamage) {
        this.properties.canDamage = false;
        
        hitee.takeDamage(this.properties.damage);
        
        game.time.events.add(this.properties.canDamageTimer, function () { this.properties.canDamage = true }, this);
    }
};

Skall.prototype.takeDamage = function (damage) {
    this.properties.health -= damage;
    
    if (this.properties.health <= 0) {
        this.kill();
    }
};