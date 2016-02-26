var Bow = function (game, x, y, key, frame) {
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    if (key == undefined) { key = graphicAssets.bow.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    this.kill()
    
    this.properties = {
        //the game.time until the next attack can be made
        attackInterval: 0,
        //the delay between attacks. Added to attackInterval
        attackDelay: 300,
        //the time the sword appears for
        attackLifespan: 300,
        arrowLifespan: 800,
        velocity: 600,
        //the distance away from the parent
        distanceFrom: 25,

        damage: 3,
        
    };
    
    this.arrowGroup = game.add.group();
    this.arrowGroup.enableBody = true;
    this.arrowGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.arrowGroup.createMultiple(5, graphicAssets.arrow.name);
    this.arrowGroup.setAll('anchor.x', 0.5);
    this.arrowGroup.setAll('anchor.y', 0.5);
 
    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Bow.prototype = Object.create(Phaser.Sprite.prototype);
Bow.prototype.constructor = Bow;

Bow.prototype.update = function () {
    game.physics.arcade.overlap(this, game.state.getCurrentState().player, this.pickUp, null, this);
    game.physics.arcade.overlap(this.arrowGroup, game.state.getCurrentState().enemies, this.damage, null, this);
    // game.physics.arcade.overlap(this.arrowGroup, game.state.getCurrentState().destructables, this.killArrow, null, this);
    game.physics.arcade.collide(this.arrowGroup, game.state.getCurrentState().layer[1]);
    game.physics.arcade.collide(this.arrowGroup, game.state.getCurrentState().destructables);
};

//the player calls this and makes THIS the player for some reason
Bow.prototype.attack = function () {
    if (game.time.now > this.properties.attackInterval) {
        var player = game.state.getCurrentState().player;
        var angleToPointer = game.physics.arcade.angleToPointer(player);

        this.appear(angleToPointer);
        this.fire(angleToPointer);

        this.properties.attackInterval = game.time.now + this.properties.attackDelay;
    }
}

Bow.prototype.appear = function (angleToPointer) {
    var x = Math.cos(angleToPointer) * this.properties.distanceFrom;
    var y = Math.sin(angleToPointer) * this.properties.distanceFrom;
    
    this.reset(x, y);
    
    this.rotation = angleToPointer;
    
    game.time.events.add(this.properties.attackLifespan, this.disappear, this);
};

Bow.prototype.fire = function (angleToPointer) {  
    var arrow = this.arrowGroup.getFirstExists(false);

    if (arrow) {
        var player = game.state.getCurrentState().player
        var x = this.x + player.x;
        var y = this.y + player.y;
        
        arrow.reset(x, y);
        arrow.rotation = angleToPointer;
        arrow.lifespan = this.properties.arrowLifespan;
        game.physics.arcade.moveToPointer(arrow, this.properties.velocity);
    }
};

Bow.prototype.disappear = function () {
    this.kill();
};

Bow.prototype.damage = function (hitter, hitee) {
    hitter.kill();
    hitee.takeDamage(this.properties.damage);
};

Bow.prototype.pickUp = function (hitter, hitee) {
    var player =  game.state.getCurrentState().player;
    var weaponList = player.weaponList
    var index = weaponList.indexOf(this);
    if (index < 0) {
        weaponList.push(hitter);
        hitter.kill();
        hitter.body.destroy();
    }
    
    player.addChild(this);
};

// Bow.prototype.killArrow = function (hitter, hitee) {
//     hitter.kill();
// }
