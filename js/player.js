function Player (game, x, y) {
    this.game = game;
    
    this.properties = {
        velocityStart: 300,
        velocitySprint: 350,
        velocity: 300,
        health: 5,
        attackDelay: 0.2 * Phaser.Timer.SECOND,
    };
    
    this.sprite = game.add.sprite(x, y, graphicAssets.player.name);
    this.sprite.anchor.set(0.5, 0.5); 
    
    this.swordSprite = game.add.sprite(0, 0, graphicAssets.sword.name);
    this.swordSprite.anchor.set(0.5, 0.5); 
    this.swordSprite.kill();
    this.sprite.addChild(this.swordSprite);
    
    game.camera.follow(this.sprite);
    //does collide with world's bounds
    // game.camera.bounds = false;
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.attackInterval = 0;
    this.attackDelay = 300;
    this.attackLifespan = 200;
    this.attackDistance = 35;
}

Player.prototype = {
    update: function () {
        this.checkPlayerInput();
        
        this.updatePhysics();
    },
    
    updatePhysics: function () {
        // game.world.wrap(this.sprite, gameProperties.padding);
        game.physics.arcade.collide(this.sprite, game.state.getCurrentState().layer[1]);
        game.physics.arcade.collide(this.hitboxGroup, game.state.getCurrentState().layer[1]);
    },
    
    checkPlayerInput: function () {
        if ((game.state.getCurrentState().keys.key_up.isDown) && (this.sprite.y >= -gameProperties.padding)) {           //Up  W
            this.sprite.body.velocity.y = -this.properties.velocity;
        } else if ((game.state.getCurrentState().keys.key_down.isDown) && (this.sprite.y <= game.world.height + gameProperties.padding)) {  //Down  D
            this.sprite.body.velocity.y = this.properties.velocity;
        } else {
            this.sprite.body.velocity.y = 0;
        }
        
        if ((game.state.getCurrentState().keys.key_right.isDown) && (this.sprite.x <= game.world.width + gameProperties.padding)) {        //Right  D
            this.sprite.body.velocity.x = this.properties.velocity;
        } else if ((game.state.getCurrentState().keys.key_left.isDown) && (this.sprite.x >= -gameProperties.padding)) {  //Left  A
            this.sprite.body.velocity.x = -this.properties.velocity;
        } else {
            this.sprite.body.velocity.x = 0;
        }
        
        if (game.state.getCurrentState().keys.key_sprint.isDown) {      //shift
            this.properties.velocity = this.properties.velocitySprint;
        } else {
            this.properties.velocity = this.properties.velocityStart;
        }
        
        if (game.state.getCurrentState().keys.key_attack.isDown) {      //shift
            this.attack();
        } if (game.state.getCurrentState().keys.key_control.isDown) {
            this.attack();
        }
    },
    
    attack: function () {
        if (game.time.now > this.attackInterval) {
            var angleToPointer = game.physics.arcade.angleToPointer(this.sprite);
            var x = Math.cos(angleToPointer) * this.attackDistance;
            var y = Math.sin(angleToPointer) * this.attackDistance;
            
            this.unkillSprite(this.swordSprite, x, y);
            this.swordSprite.rotation = game.physics.arcade.angleToPointer(this.sprite);
            
            game.time.events.add(this.attackLifespan, this.killSprite, this, this.swordSprite);
            this.attackInterval = game.time.now + this.attackDelay;
        }
    },
    
    killSprite: function (sprite) {
        sprite.kill();
        sprite.body.destroy();
    },
    
    unkillSprite: function (sprite, x, y) {
        
        if (x != null && y != null) {
            sprite.reset(x, y);
        }
        
        sprite.alive = true;
        sprite.exists = true;
        sprite.visible = true;
        
        game.physics.enable(this.swordSprite, Phaser.Physics.ARCADE);
        var hitboxSize = 26;
        this.swordSprite.body.setSize(hitboxSize, hitboxSize, 0);
        this.swordSprite.body.allowRotation = false;
    },
}