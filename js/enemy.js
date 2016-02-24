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
        velocityWalk: 60,
        velocityCharge: 310 + game.rnd.integerInRange(-50, 25),
        velocity: 100 + game.rnd.integerInRange(-15, 15),
        fov: 250 + game.rnd.integerInRange(-50, 25),
        leapFov: 75 + game.rnd.integerInRange(-40, 25),
        damage: 1,
        healthMax: 5,
        health: 5,
        canDamage: true,
        canDamageTimer: 200,
        roamer: game.rnd.integerInRange(0, 4), // 1/4 chance of being a roamer
    };
    
    this.healthbar = attachHealthbar(this);

    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Skall.prototype = Object.create(Phaser.Sprite.prototype);
Skall.prototype.constructor = Skall;

Skall.prototype.update = function () {
    this.updatePhysics();
    
    if (this.player != undefined) {
        if (this.properties.roamer == 0) {
            this.roam();
        } else {
            this.idle();
        }
    };
};

Skall.prototype.updatePhysics = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().layer[1]);
    game.physics.arcade.collide(this, game.state.getCurrentState().enemies);
    
    game.physics.arcade.overlap(this, this.player, this.damage, null, this);
};

Skall.prototype.idle = function () {
    if (this.isWithin(this.properties.fov, this.player)) {
        this.pursue();
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
};

Skall.prototype.roam = function () {
    if (this.isWithin(this.properties.fov, this.player)) {
        this.pursue();
    } else {
        if (this.xp == undefined && this.yp == undefined) {
            var x = this.x + game.rnd.integerInRange(-500, 500);
            var y = this.y + game.rnd.integerInRange(-500, 500);
            
            if ((x >= 0 && y >= 0) && (x <= game.world.width && y <= game.world.height)) {
                this.xp = x;
                this.yp = y;
            };
        }

        if (this.xp && this.yp) {
            game.physics.arcade.moveToXY(this, this.xp, this.yp, this.properties.velocityWalk);
        }
        
        if (game.physics.arcade.distanceToXY(this, this.xp, this.yp) <= 10) {
            this.xp = undefined;
            this.yp = undefined;
        }
    }
};

Skall.prototype.pursue = function () {
    if (this.isWithin(this.properties.leapFov, this.player)) {
        game.physics.arcade.moveToObject(this, this.player, this.properties.velocityCharge);
    } else if (this.isWithin(this.properties.fov, this.player)) {
        game.physics.arcade.moveToObject(this, this.player, this.properties.velocity);
    };
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
        // this.healthbar.kill();
        this.destroy();
    }
};