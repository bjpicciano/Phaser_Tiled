function Skall (game, index, player, x, y) {
    if (x == null && y == null) {
        x = game.world.randomX;
        y = game.world.randomY;
    }
    
    this.game = game;
    
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
    
    this.sprite = game.add.sprite(x, y, graphicAssets.skall.name);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.name = index;
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
}

Skall.prototype = {
    update: function () {
        this.updatePhysics();
        this.idle();
    },
    
    updatePhysics: function () {
        game.physics.arcade.collide(this.sprite, game.state.getCurrentState().layer[1]);
        game.physics.arcade.collide(game.state.getCurrentState().enemies);

        // game.physics.arcade.collide(this.sprite, this.player.sprite);
    },
    
    idle: function () {
        if (this.isWithin(this.properties.leapFov, this.player.sprite)) {
            this.follow(this.player.sprite, this.properties.velocityCharge);
        } else if (this.isWithin(this.properties.fov, this.player.sprite)) {
            this.follow(this.player.sprite, this.properties.velocity);
        } else {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }
    },
    
    follow: function (destinationSprite, speed) {
        game.physics.arcade.moveToObject(this.sprite, destinationSprite, speed);
    },
    
    isWithin: function (distance, destinationSprite) {
        if (game.physics.arcade.distanceBetween(this.sprite, destinationSprite) <= distance) {
            return true;
        }
        
        return false;
    },
}