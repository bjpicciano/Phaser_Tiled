var level3 = function (game) {
    this.enemies = [];
    
    this.player;
    this.spawnX;
    this.spawnY;
    
    this.map;
    this.layer = {};
    this.color = 0x3366FF;
    this.edgeUp;
    this.edgeDown;
    this.edgeLeft;
    this.edgeRight;
    
    this.score;
};

level3.prototype = {
    
    preload: function () {
        //tilemap
        game.load.tilemap(graphicAssets.level3.name, graphicAssets.level3.URL, null, Phaser.Tilemap.TILED_JSON);
    },
    
    init: function (keys, stateData) {
        if (keys != null) {
            this.keys = keys;
        }
        
        if (stateData != null) {
            initEdge(this, stateData);
        }
        
        this.score = 0;
    },
    
    create: function () {
        this.initGraphics();
        this.initPhysics();
        this.initEntities();
        initBackground(this, this.color);
    },
    
    update: function () {
        this.player.update();
        checkBoundaries(this);
        
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].sprite.alive) {
                this.enemies[i].update();
            }
        }
    },
    
    initGraphics: function () {
        //set up tilemap
        this.map = game.add.tilemap(graphicAssets.level3.name);
        
        //#610B0B - dark red
        //#585 - light green
        var saturation = '#333333';
        initLevelGraphics(this, saturation);
    },
    
    initPhysics: function () {
        initLevelPhysics(this);
    },
    
    initEntities: function () {
        initPlayer(this, this.spawnX, this.spawnY);
        
        var enemyCount = 1;
        for (var i = 0; i < enemyCount; i++) {
            var x = game.world.randomX;
            var y = game.world.randomY;
            this.enemies.push(new Skall(game, i, this.player, x, y));
        }
    },
    
    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = this.score;
    },
};

//links the name 'level2' to the gameState
// game.state.add(states.level3, level3);
