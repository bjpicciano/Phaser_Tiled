function initKeyboard (self) {
    self.keys.key_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    self.keys.key_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    self.keys.key_up = game.input.keyboard.addKey(Phaser.Keyboard.W);
    self.keys.key_down = game.input.keyboard.addKey(Phaser.Keyboard.S);
    self.keys.key_sprint = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    self.keys.key_attack = game.input.activePointer;
    
    game.input.resetLocked = true;
};

function initLevelGraphics (self, color) {    
    //the first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //the second parameter maps this name to the Phaser.Cache key 'tiles'
    self.map.addTilesetImage(graphicAssets.protoTiles.name, graphicAssets.protoTiles.name);
    
    //creates a layer with the name given in Tiled
    self.layer[0] = self.map.createLayer("background");

    self.layer[1] = self.map.createLayer("collision");
    
    self.layer[0].resizeWorld();
    
    //score text
    self.tf_score = game.add.text(game.width * .985, game.height * .01, self.score, fontAssets.counterFontStyle);
    self.tf_score.align = 'right';
    self.tf_score.anchor.set(1, 0);
    
    if (self.debug) {
        self.layer[1].debug = true;
    }
    
    if (color != null) {
        self.game.stage.backgroundColor = color;
    }
};


function initBackground (self, color) {
    self.backgroundSprite = game.add.sprite(0, 0, graphicAssets.background.name);
    self.backgroundSprite.width = game.world.width;
    self.backgroundSprite.height = game.world.height;

    self.backgroundSprite.tint = color;
    self.backgroundSprite.alpha = 0.4;
};

function initLevelPhysics (self) {
    //tilemap physics
    self.map.setCollisionBetween(1, 100, true, 'collision');
    // self.layer[1].debug = true;
};

function initPlayer (self, x, y) {
    if ((x != null) && (y != null)) {
        self.player = new Player(game, x, y);
    } else {        
        var randX = game.rnd.integerInRange(1, game.world.width - 1);
        var randY = game.rnd.integerInRange(1, game.world.height - 1);
        self.player = new Player(game, randX, randY);
    }
};

function getRemainingLevels () {
    var randomLevelIndex = game.rnd.integerInRange(0, states.levels.length - 1);
    var nextLevel = states.levels[randomLevelIndex];
    states.levels.splice(randomLevelIndex, 1);
    
    return nextLevel;
};

function initEdge (self, stateData) {
    self.spawnX = stateData.spawnX;
    self.spawnY = stateData.spawnY;

    if (stateData.edge == 'x') {
        if (stateData.spawnX < game.world.width / 2) {
            self.edgeLeft = stateData.returnState;
        } else {
            self.edgeRight = stateData.returnState;
        }
    } else if (stateData.edge == 'y') {
        if (stateData.spawnY < game.world.height / 2) {
            self.edgeUp = stateData.returnState;
        } else {
            self.edgeDown = stateData.returnState;
        }
    }
};

function checkBoundaries (self) {
    var sprite = self.player.sprite;
    var stateData;
    if (sprite.x + gameProperties.padding < 0) { //left
        stateData = {
            spawnX: game.world.width + gameProperties.padding,  //x coord to spawn at in new state
            spawnY: sprite.y,   //y coord to spawn at in new state
            edge: 'x', //x or y to determine the new level's edge that will return here
            returnState: game.state.current, //this state to return back to
        }

        if (self.edgeLeft == null) {
            self.edgeLeft = getRemainingLevels();
        }

        if (self.edgeLeft != null) {
            //param2: clear world data , param3: clear cache data, extra custom data
            game.state.start(self.edgeLeft, true, false, self.keys, stateData);
        }
    } else if (sprite.x - gameProperties.padding > game.world.width) { //right
        stateData = {
            spawnX: -gameProperties.padding,
            spawnY: sprite.y,
            edge: 'x', //x or y to determine the new level's edge that will return here
            returnState: game.state.current, //this state to return back to
        }

        if (self.edgeRight == null) {
            self.edgeRight = getRemainingLevels();
        }

        if (self.edgeRight != null) {
            //param2: clear world data , param3: clear cache data, extra custom data
            game.state.start(self.edgeRight, true, false, self.keys, stateData);
        }
    } 

    if (sprite.y + gameProperties.padding < 0) { //up
        stateData = {
            spawnX: sprite.x,
            spawnY: game.world.height + gameProperties.padding,
            edge: 'y', //x or y to determine the new level's edge that will return here
            returnState: game.state.current, //this state to return back to
        }

        if (self.edgeUp == null) {
            self.edgeUp = getRemainingLevels();
        }

        if (self.edgeUp != null) {
            //param2: clear world data , param3: clear cache data, extra custom data
            game.state.start(self.edgeUp, true, false, self.keys, stateData);
        }
    } else if (sprite.y - gameProperties.padding > game.world.height) { //down
        stateData = {
            spawnX: sprite.x,
            spawnY: -gameProperties.padding,
            edge: 'y', //x or y to determine the new level's edge that will return here
            returnState: game.state.current, //this state to return back to
        }

        if (self.edgeDown == null) {
            self.edgeDown = getRemainingLevels();
        }

        if (self.edgeDown != null) {
            //param2: clear world data , param3: clear cache data, extra custom data
            game.state.start(self.edgeDown, true, false, self.keys, stateData);
        }
    }
};

