function Level (game, tilemap, color, debug) {
    this.game = game;
    
    if (debug) {
        this.debug = true;
    }
    
    if (color != null) {
        this.color = color;
    }
    
    if (tilemap != null) {
        //graphicAssets object containing .URL and .NAME
        this.tilemap = tilemap;
    } else {
        this.tilemap = graphicAssets.level1;
    }
    
    this.enemies = [];
    
    this.player;
    this.spawnX;
    this.spawnY;
    
    this.map;
    this.layer = {};

    this.edgeUp;
    this.edgeDown;
    this.edgeLeft;
    this.edgeRight;
    
    this.score;
};

Level.prototype = {
    
    preload: function () {
        //tilemap
        game.load.tilemap(this.tilemap.name, this.tilemap.URL, null, Phaser.Tilemap.TILED_JSON);
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
        this.map = game.add.tilemap(this.tilemap.name);
        
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
        
        var enemyCount = 5;
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