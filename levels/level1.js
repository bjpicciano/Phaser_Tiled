var level1 = function (game) {
    this.game = game;
    this.debug = false;
    
    this.enemies = [];
    
    this.player;
    this.spawnX;
    this.spawnY;
    
    this.map;
    this.layer = {};
    this.color = 0x9933FF;
    this.edgeUp;
    this.edgeDown;
    this.edgeLeft;
    this.edgeRight;
    
    this.score;
};

level1.prototype = {
    
    preload: function () {
        //tilemap
        game.load.tilemap(graphicAssets.level1.name, graphicAssets.level1.URL, null, Phaser.Tilemap.TILED_JSON);
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
    
    render: function () {
        if (this.debug) {
            game.debug.spriteInfo(this.player.swordSprite, 32, 32);
            game.debug.body(this.player.sprite);
            game.debug.body(this.player.swordSprite);

            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i].sprite.alive) {
                    game.debug.body(this.enemies[i].sprite);
                }
            }
        }
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
                game.physics.arcade.overlap(this.player.swordSprite, this.enemies[i].sprite, this.collision, null, this);
            }
        }
    },
    
    collision: function (hitter, hitee) {
        hitee.kill();
    },
    
    initGraphics: function () {
        //set up tilemap
        this.map = game.add.tilemap(graphicAssets.level1.name);
        
        //#610B0B - dark red
        //#585 - light green
        var saturation = '#333333';
        initLevelGraphics(this, saturation);
        
        //scale options
        // self.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    
    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // game.physics.startSystem(Phaser.Physics.P2JS);

        initLevelPhysics(this);
    },
    
    initEntities: function () {
        initPlayer(this, this.spawnX, this.spawnY);
        
        var enemyCount = 1;
        for (var i = 0; i < enemyCount; i++) {
            var x;
            var y;
            this.enemies.push(new Skall(game, i, this.player, x, y));
        }
    },
    
    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = this.score;
    },
};

//links the name 'game' to the gameState
game.state.add(states.level1, level1);
