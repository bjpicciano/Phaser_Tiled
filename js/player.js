var Player = function (game, x, y, key, frame) {
    if (x == undefined) { x = game.world.randomX; }
    if (y == undefined) { y = game.world.randomY; }
    if (key == undefined) { key = graphicAssets.playerAnim.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    
    this.weapon = new Sword(game, 0, 0, undefined, undefined);
    this.addChild(this.weapon);
    
    this.bombSprite = new Bomb(game, 0, 0, undefined, undefined);
    
    game.camera.follow(this);
    
    this.properties = {
        weaponList: [],
        velocityStart: 235,
        velocitySprint: 350,
        velocity: undefined,
        invincibleTime: 200,
        deathTime: 1350,
        healthMax: 10,
        health: undefined,
        canTakeDamage: true,
    };
    this.properties.health = this.properties.healthMax;
    this.properties.weaponList.push(this.weapon);

    this.healthbar = new Healthbar(game, 0, -27, undefined, undefined);
    this.healthbar.attachParent(this);
    this.addChild(this.healthbar);

    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    game.input.onDown.add(this.weapon.attack, this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    this.updatePhysics();
    this.checkPlayerInput();
    this.weapon.update();
};

Player.prototype.updatePhysics = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().layer[1]);
};

Player.prototype.checkPlayerInput = function () {
    //up
    if ((game.state.getCurrentState().keys.key_up.isDown) && (this.y >= -gameProperties.padding)) {
        this.body.velocity.y = -this.properties.velocity;
    //down
    } else if ((game.state.getCurrentState().keys.key_down.isDown) && (this.y <= game.world.height + gameProperties.padding)) {
        this.body.velocity.y = this.properties.velocity;
    } else {
        this.body.velocity.y = 0;
    }
    //right
    if ((game.state.getCurrentState().keys.key_right.isDown) && (this.x <= game.world.width + gameProperties.padding)) {
        this.body.velocity.x = this.properties.velocity;
        this.loadTexture(graphicAssets.player.name);
    //left
    } else if ((game.state.getCurrentState().keys.key_left.isDown) && (this.x >= -gameProperties.padding)) {
        this.body.velocity.x = -this.properties.velocity;
        this.loadTexture(graphicAssets.playerAnim.name);
    } else {
        this.body.velocity.x = 0;
    }
    //shift
    if (game.state.getCurrentState().keys.key_sprint.isDown) {
        this.properties.velocity = this.properties.velocitySprint;
    } else {
        this.properties.velocity = this.properties.velocityStart;
    }
    //E
    if (game.state.getCurrentState().keys.key_use.isDown) {
    }
    //X
    if (game.state.getCurrentState().keys.key_x.isDown) {
        this.bombSprite.attack();
    }
    //Q
    if (game.state.getCurrentState().keys.key_q.isDown) {
        this.switchWeapons();
    }
};

Player.prototype.takeDamage = function (damage) {
    this.properties.health -= damage;
        
    if (this.properties.health <= 0) {
        resetNextStateSpawns(states.start)
        
        this.kill();
        game.time.events.add(this.properties.deathTime, function () { game.state.start(states.start, true); }, this);
    }
};

Player.prototype.takeHeal = function (health) {
    this.properties.health += health;
    
    if (this.properties.health > this.properties.healthMax) {
        this.properties.health = this.properties.healthMax;
    }
}

Player.prototype.switchWeapons = function () {
    var index = this.properties.weaponList.indexOf(this.weapon)
    if (index >= this.properties.weaponList.length - 1) {
        index = 0;
    } else {
        index++;
    }

    this.weapon = this.properties.weaponList[index];
    console.log(this.weapon);
}

function initKeyboard (self) {
    self.keys.key_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    self.keys.key_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    self.keys.key_up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    self.keys.key_down = game.input.keyboard.addKey(Phaser.Keyboard.S);
    self.keys.key_sprint = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    self.keys.key_control = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    self.keys.key_x = game.input.keyboard.addKey(Phaser.Keyboard.X);
    self.keys.key_use = game.input.keyboard.addKey(Phaser.Keyboard.E);
    self.keys.key_q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    self.keys.key_attack = game.input.activePointer;
    
    
    game.input.resetLocked = true;
};

function initPlayer (self, x, y, playerProperties) {
    if ((x != undefined) && (y != undefined)) {
        self.player = new Player(game, x, y, undefined, undefined);
    } else {
        var playerGroup = game.add.group()
        self.map.createFromObjects('sprite', 2, graphicAssets.player.name, 0, true, false, playerGroup, Player);
        
        self.player = playerGroup.getFirstExists();
    }
    
    if (playerProperties != undefined) {
        self.player.properties = playerProperties;
    }
};