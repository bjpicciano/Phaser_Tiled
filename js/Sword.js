var Sword = function (game, x, y) {
    if (x == null && y == null) {
        x = 0;
        y = 0;
    }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, graphicAssets.sword.name);
    this.anchor.setTo(0.5, 0.5);
    this.kill()
    
    this.properties = {
        //the game.time until the next attack can be made
        attackInterval : 0,
        //the delay between attacks. Added to attackInterval
        attackDelay : 300,
        //the time the sword appears for
        attackLifespan : 200,
        //the distance away from the parent
        attackDistance : 35,
        //the size of the sword's hitbox
        hitboxSize : 26,
    };

    game.add.existing(this);
};

Sword.prototype = Object.create(Phaser.Sprite.prototype);
Sword.prototype.constructor = Sword;

Sword.prototype.update = function () {
    
};

Sword.prototype.appear = function (angleToPointer) {
    var x = Math.cos(angleToPointer) * this.properties.attackDistance;
    var y = Math.sin(angleToPointer) * this.properties.attackDistance;
    
    this.reset(x, y);
    
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.rotation = angleToPointer;
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(this.properties.hitboxSize, this.properties.hitboxSize, 0);
    
    game.time.events.add(this.properties.attackLifespan, this.disappear, this);
};

Sword.prototype.disappear = function () {
    this.kill();
    this.body.destroy();
};
