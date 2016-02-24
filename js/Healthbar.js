var Healthbar = function (game, x, y, key, frame) {
    if (x == undefined) { x = 0; }
    if (y == undefined) { y = -27; }
    if (key == undefined) { key = graphicAssets.healthbar.name; }
    if (game.state.getCurrentState().player) { this.player = game.state.getCurrentState().player; }
    
    this.parent;
    
    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(0.5, 0.5);
    this.visible = false;
    
    this.properties = {
        x: this.x,
        y: this.y,
        originalWidth: this.width,
        //the game.time until the appearance can be made
        interval: 0,
        //the time the healthbar appears for
        lifespan: 1250,
    };

    game.add.existing(this);
};

Healthbar.prototype = Object.create(Phaser.Sprite.prototype);
Healthbar.prototype.constructor = Healthbar;

Healthbar.prototype.update = function () {
    if (this.parent != undefined) {
        this.updateHealth();
    }
}

Healthbar.prototype.updateHealth = function () {
    var newWidth = (this.parent.properties.health / this.parent.properties.healthMax) * this.properties.originalWidth;
    
    if (this.width != newWidth) {
        this.appear();
        this.width = newWidth;
    }
};

//lets the healthbar know who to keep track of.
Healthbar.prototype.attachParent = function (sprite) {
    this.parent = sprite;
};

Healthbar.prototype.appear = function () {
    this.visible = true;

    game.time.events.add(this.properties.lifespan, this.disappear, this);
};

Healthbar.prototype.disappear = function () {
    this.visible = false;
};

function attachHealthbar (self, x, y) {
    var healthbar = new Healthbar(game, x, y, undefined, undefined);
    healthbar.attachParent(self);
    self.addChild(healthbar);
    
    return healthbar;
}