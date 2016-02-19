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
    
    game.camera.follow(this.sprite);
    //does collide with world's bounds
    // game.camera.bounds = false;
    
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    
    this.attackInterval = 0;
    this.attackDelay = 200;
    this.attackLifespan = 100;
    
    this.hitboxGroup = game.add.group();
    this.hitboxGroup.enableBody = true;
    this.hitboxGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.hitboxGroup.createMultiple(1, graphicAssets.skall.name); 
    this.hitboxGroup.setAll('anchor.x', 0.5);
    this.hitboxGroup.setAll('anchor.y', 0.5);
    this.hitboxGroup.setAll('lifespan', 100);
    // this.sprite.addChild(this.hitboxGroup);
    
    //size and position of the body
    // this.attacks.thrust.body.setSize(32, 16, 16);
 
    //anchors all hitboxes to 0.5, 0.5 after they've been created

    
    // for (var i = 0; i < this.hitboxGroup.children.length; i++) {
    //     this.hitboxGroup.children[i].body.enable = false;
    // };
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
        
        if ((game.state.getCurrentState().keys.key_attack.isDown)) {      //shift
            this.attack();
        }
    },
    
    attack: function () {
        if (game.time.now > this.attackInterval) {
            
            var attack = this.hitboxGroup.getFirstExists(false);
            
            if (attack) {
                console.log("Create");
                var radius = this.sprite.width * 0.5;
                
                attack.body.setSize(32, 16, 16);
                
                var x = this.sprite.x;
                var y = this.sprite.y;
                
                attack.reset(x, y);
                attack.lifespan = this.attackLifespan;
            }
            
            this.attackInterval = game.time.now + this.attackDelay;
        }
    }
}