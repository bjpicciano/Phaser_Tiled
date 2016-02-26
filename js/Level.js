function Level (game, tilemap, color, debug) {
    if (debug) { this.debug = true; }
    if (color != undefined) { this.color = color; }
    
    this.enemies;
    this.items;
    this.destructables;
    
    this.player;
    this.playerProperties;
    this.spawnX;
    this.spawnY;
    
    this.map;
    this.tilemap = tilemap;
    this.layer = {};
    this.zones;
    
    this.edgeUp;
    this.edgeDown;
    this.edgeLeft;
    this.edgeRight;
};

Level.prototype = {
    
    preload: function () {
        //tilemap
        game.load.tilemap(this.tilemap.name, this.tilemap.URL, null, Phaser.Tilemap.TILED_JSON);
    },
    
    init: function (keys, stateData, playerProperties) {
        if (keys != undefined) { this.keys = keys; }
        
        if (stateData != undefined) { this.initEdges(stateData); }
        if (playerProperties != undefined) { this.playerProperties = playerProperties; }
    },
    
    render: function () {
        if (this.debug) {
            game.debug.body(this.player);
            game.debug.body(this.player.weapon);
            game.debug.body(this.player.bombSprite);
            
            this.enemies.forEachAlive(function (member) {
                game.debug.body(member);
                }, this);
                
            this.items.forEachAlive(function (member) {
                game.debug.body(member);
                }, this);
                
            this.destructables.forEachAlive(function (member) {
                game.debug.body(member);
                }, this);
        }
    },
    
    create: function () {
        this.initGraphics();
        this.initPhysics();
        this.initEntities();
        this.initBackground();
        // game.time.advancedTiming = true;
    },
    
    update: function () {
        this.checkBoundaries();
        
        for (var obj in this.zones) {
            var zone = this.zones[obj];
            if (zone.area.contains(this.player.x, this.player.y)) {
                this.chooseZoneAction(zone);
            }
        }
    },
    
    collision: function (hitter, hitee) {
        hitee.kill();
    },
    
    initGraphics: function () {
        //set up tilemap
        this.map = game.add.tilemap(this.tilemap.name);
        
        //the first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //the second parameter maps this name to the Phaser.Cache key 'tiles'
        this.map.addTilesetImage(graphicAssets.protoTiles.name, graphicAssets.protoTiles.name);

        //creates a layer with the name given in Tiled
        this.layer[0] = this.map.createLayer("background");

        this.layer[1] = this.map.createLayer("collision");

        this.layer[0].resizeWorld();

        if (this.debug) {
            this.layer[1].debug = true;
        }
    },
    
    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map.setCollisionBetween(1, 100, true, 'collision');
    },
    
    initEntities: function () {
        this.destructables = game.add.group();
        this.map.createFromObjects('destructable', 12, graphicAssets.brick.name, 0, true, false, this.destructables, Destructable);
        
        this.items = game.add.group();
        this.map.createFromObjects('item', 21, graphicAssets.dandelion.name, 0, true, false, this.items, Food);
        this.map.createFromObjects('item', 26, graphicAssets.arrow.name, 0, true, false, this.items, ArrowPickup);
        this.map.createFromObjects('item', 25, graphicAssets.bomb.name, 0, true, false, this.items, BombPickup);
        
        initPlayer(this, this.spawnX, this.spawnY, this.playerProperties);
        
        this.enemies = game.add.group();
        this.map.createFromObjects('sprite', 5, graphicAssets.skall.name, 0, true, false, this.enemies, Skall);
        this.map.createFromObjects('sprite', 15, graphicAssets.fonkey.name, 0, true, false, this.enemies, Skall);
    },

    initBackground: function () {
        this.layer[2] = this.map.createLayer("above");
        
        if (this.zones == undefined) {
            this.zones = [];
            for (var obj in this.map.objects["zone"]) {
                var zone = this.map.objects["zone"][obj]
                zone.area = new Phaser.Rectangle(zone.x, zone.y, zone.width, zone.height);
                this.zones.push(zone);
            }
        }
        
        this.backgroundSprite = game.add.sprite(0, 0, graphicAssets.background.name);
        this.backgroundSprite.width = game.world.width;
        this.backgroundSprite.height = game.world.height;
        
        this.backgroundSprite.tint = this.color;
        this.backgroundSprite.alpha = 0.4;
    },
    
    initEdges: function (stateData) {
        this.spawnX = stateData.spawnX;
        this.spawnY = stateData.spawnY;

        if (stateData.edge == 'x') {
            if (stateData.spawnX < game.world.width / 2) {
                this.edgeLeft = stateData.returnState;
            } else {
                this.edgeRight = stateData.returnState;
            }
        } else if (stateData.edge == 'y') {
            if (stateData.spawnY < game.world.height / 2) {
                this.edgeUp = stateData.returnState;
            } else {
                this.edgeDown = stateData.returnState;
            }
        }
    },
    
    chooseZoneAction: function (zone) {
      if (zone.properties.nextState != undefined) {
        var nextState = zone.properties.nextState;
        
        resetNextStateSpawns(nextState);
        
        var stateList = getLevelsList(nextState);
        
        var index = stateList.indexOf(nextState)
        if (index >= 0) {
            stateList.splice(index, 1)
        }
        
        game.state.start(nextState, true, false, this.keys, undefined, this.player.properties);
      }
    },
    
    checkBoundaries: function () {
        var sprite = this.player;
        var stateData;
        //move off the left edge
        if (sprite.x + gameProperties.padding < 0) {
            stateData = {
                spawnX: game.world.width + gameProperties.padding, //x coord to spawn at in new state
                spawnY: sprite.y, //y coord to spawn at in new state
                edge: 'x', //x or y to determine the new level's edge that will return here
                returnState: game.state.current, //this state to return back to
            }

            //if an edge isn't already initalized, get a random level.
            if (this.edgeLeft == null) {
                this.edgeLeft = getRemainingLevels();
            }

            //check in case we don't have any more levels
            if (this.edgeLeft != null) {
                //param2: clear world data , param3: clear cache data, extra custom data
                game.state.start(this.edgeLeft, true, false, this.keys, stateData, this.player.properties);
            }
        //move off the right edge
        } else if (sprite.x - gameProperties.padding > game.world.width) {
            stateData = {
                spawnX: -gameProperties.padding,
                spawnY: sprite.y,
                edge: 'x',
                returnState: game.state.current,
            }

            if (this.edgeRight == null) {
                this.edgeRight = getRemainingLevels();
            }

            if (this.edgeRight != null) {
                game.state.start(this.edgeRight, true, false, this.keys, stateData, this.player.properties);
            }
        } 
        //move off the up edge
        if (sprite.y + gameProperties.padding < 0) {
            stateData = {
                spawnX: sprite.x,
                spawnY: game.world.height + gameProperties.padding,
                edge: 'y',
                returnState: game.state.current,
            }

            if (this.edgeUp == null) {
                this.edgeUp = getRemainingLevels();
            }

            if (this.edgeUp != null) {
                game.state.start(this.edgeUp, true, false, this.keys, stateData, this.player.properties);
            }
        //move off the down edge
        } else if (sprite.y - gameProperties.padding > game.world.height) {
            stateData = {
                spawnX: sprite.x,
                spawnY: -gameProperties.padding,
                edge: 'y',
                returnState: game.state.current,
            }

            if (this.edgeDown == null) {
                this.edgeDown = getRemainingLevels();
            }

            if (this.edgeDown != null) {
                game.state.start(this.edgeDown, true, false, this.keys, stateData, this.player.properties);
            }
        }
    },
};

function getRemainingLevels () {
    var stateList = getLevelsList();
    
    var randomLevelIndex = game.rnd.integerInRange(0, stateList.length - 1);
    var nextLevel = stateList[randomLevelIndex];
    stateList.splice(randomLevelIndex, 1);
   
    if (states.start == undefined) {
        states.start = nextLevel
    }
       
    return nextLevel;
};

function getLevelsList (state) {
    if (state == undefined) { state = game.state.getCurrentState().key; }

    var stateList = [];
    
    if (firstMapAssets[state] != undefined || state == 'main') {
        stateList = states.firstLevels;
    } else if (secondMapAssets[state] != undefined) {
        stateList = states.secondLevels;
    }
    
    return stateList;
}

function resetNextStateSpawns (nextStateName) {
    var nextState = game.state.states[nextStateName];
    
    nextState.spawnX = undefined;
    nextState.spawnY = undefined;
    nextState.playerProperties = undefined;
};