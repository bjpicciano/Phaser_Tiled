var Player = function (game, x, y) {
    if (x == null && y == null) {
        x = game.world.randomX;
        y = game.world.randomY;
    }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game,  x, y, graphicAssets.player.name);
    this.anchor.setTo(0.5, 0.5);
    
    this.swordSprite = new Sword(game, null, null);
    this.addChild(this.swordSprite);
    
    game.camera.follow(this);
    //does collide with world's bounds
    // game.camera.bounds = false;
    
    this.properties = {
        velocityStart: 300,
        velocitySprint: 350,
        velocity: 300,
        health: 5,
    };

    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    this.updatePhysics();
    this.checkPlayerInput();
};

Player.prototype.updatePhysics = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().layer[1]);
};

Player.prototype.checkPlayerInput = function () {
    if ((game.state.getCurrentState().keys.key_up.isDown) && (this.y >= -gameProperties.padding)) {           //Up  W
        this.body.velocity.y = -this.properties.velocity;
    } else if ((game.state.getCurrentState().keys.key_down.isDown) && (this.y <= game.world.height + gameProperties.padding)) {  //Down  D
        this.body.velocity.y = this.properties.velocity;
    } else {
        this.body.velocity.y = 0;
    }

    if ((game.state.getCurrentState().keys.key_right.isDown) && (this.x <= game.world.width + gameProperties.padding)) {        //Right  D
        this.body.velocity.x = this.properties.velocity;
    } else if ((game.state.getCurrentState().keys.key_left.isDown) && (this.x >= -gameProperties.padding)) {  //Left  A
        this.body.velocity.x = -this.properties.velocity;
    } else {
        this.body.velocity.x = 0;
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
};

Player.prototype.attack = function (destinationSprite, speed) {
    if (game.time.now > this.swordSprite.properties.attackInterval) {
    var angleToPointer = game.physics.arcade.angleToPointer(this);

    this.swordSprite.appear(angleToPointer);

    this.swordSprite.properties.attackInterval = game.time.now + this.swordSprite.properties.attackDelay;
    }
};

function initKeyboard (self) {
    self.keys.key_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    self.keys.key_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    self.keys.key_up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    self.keys.key_down = game.input.keyboard.addKey(Phaser.Keyboard.S);
    self.keys.key_sprint = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    self.keys.key_control = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    self.keys.key_attack = game.input.activePointer;
    
    game.input.resetLocked = true;
};

function initPlayer (self, x, y) {
    if ((x != null) && (y != null)) {
        self.player = new Player(game, x, y);
    } else {        
        self.player = new Player(game, null, null);
    }
};