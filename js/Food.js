var Food = function (game, x, y, key, frame) {
    if (x == undefined) { x = game.world.randomX;; }
    if (y == undefined) { y = game.world.randomX;; }
    if (key == undefined) { key = graphicAssets.dandelion.name; }
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.properties = {
        health: 3,
    };
 
    game.add.existing(this);
    
    game.physics.enable(this, Phaser.Physics.ARCADE);
};

Food.prototype = Object.create(Phaser.Sprite.prototype);
Food.prototype.constructor = Food;

Food.prototype.update = function () {
    this.eat();
};

Food.prototype.eat = function () {
    var player = game.state.getCurrentState().player;
    if (player.properties.health < player.properties.healthMax) {
        game.physics.arcade.overlap(this, player, this.heal, null, this);
    }
}

Food.prototype.heal = function (hitter, hitee) {
    hitee.takeHeal(this.properties.health);
    this.destroy();
};
