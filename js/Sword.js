var Sword = function (game, x, y, key, frame) {
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    if (key == undefined) { key = graphicAssets.sword.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    this.kill()
    
    this.properties = {
        //the game.time until the next attack can be made
        attackInterval: 0,
        //the delay between attacks. Added to attackInterval
        attackDelay: 200,
        //the time the sword appears for
        attackLifespan: 200,
        //the distance away from the parent
        distanceFrom: 35,
        //the size of the sword's hitbox
        hitboxSize: 24,
        damage: 3,
        //boolean to determine if it can damage another sprite
        canDamage: true,
        //time until it can deal damage again
        canDamageTimer: 200,
    };
 
    game.add.existing(this);
};

Sword.prototype = Object.create(Phaser.Sprite.prototype);
Sword.prototype.constructor = Sword;

Sword.prototype.update = function () {
    game.physics.arcade.overlap(this, game.state.getCurrentState().enemies, this.damage, null, this);
};

//the player calls this and makes THIS the player for some reason
Sword.prototype.attack = function () {
    if (game.time.now > this.swordSprite.properties.attackInterval) {
        var player = game.state.getCurrentState().player;
        var angleToPointer = game.physics.arcade.angleToPointer(player);

        this.swordSprite.appear(angleToPointer);

        this.swordSprite.properties.attackInterval = game.time.now + this.swordSprite.properties.attackDelay;
    }
}

Sword.prototype.appear = function (angleToPointer) {
    var x = Math.cos(angleToPointer) * this.properties.distanceFrom;
    var y = Math.sin(angleToPointer) * this.properties.distanceFrom;
    
    this.reset(x, y);

    this.rotation = angleToPointer;
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
    
    this.body.setSize(this.properties.hitboxSize, this.properties.hitboxSize, 0);
    
    game.time.events.add(this.properties.attackLifespan, this.disappear, this);
};

Sword.prototype.disappear = function () {
    this.kill();
    this.body.destroy();
};

Sword.prototype.damage = function (hitter, hitee) {
    if (this.properties.canDamage) {
        this.properties.canDamage = false;
        
        hitee.takeDamage(this.properties.damage);
        
        game.time.events.add(this.properties.canDamageTimer, function () { this.properties.canDamage = true }, this);
    }
};
