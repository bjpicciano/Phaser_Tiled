var Destructable = function (game, x, y, key, frame) {
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = 0; }
    if (key == undefined) { key = graphicAssets.brick.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    
    this.properties = {
        //the game.time until the next attack can be made
        health: 10,
    };
 
    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
};

Destructable.prototype = Object.create(Phaser.Sprite.prototype);
Destructable.prototype.constructor = Destructable;

Destructable.prototype.update = function () {
    game.physics.arcade.collide(this, game.state.getCurrentState().player);
    game.physics.arcade.collide(this, game.state.getCurrentState().enemies);
};

Destructable.prototype.takeDamage = function (damage) {
    this.properties.health -= damage;
    
    if (this.properties.health <= 0) {
        this.destroy();
    }
};