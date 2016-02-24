var mainState = function(game){
    this.tf_start;
    
    this.image;
    
    this.keys = {
        key_up: null,
        key_down: null,
        key_left: null,
        key_right: null,
    }
};

mainState.prototype = {
    
    preload: function () {
        //sprite
        game.load.image(graphicAssets.main.name, graphicAssets.main.URL);
        game.load.image(graphicAssets.background.name, graphicAssets.background.URL);
        game.load.image(graphicAssets.player.name, graphicAssets.player.URL);
        game.load.image(graphicAssets.playerAnim.name, graphicAssets.playerAnim.URL);
        game.load.image(graphicAssets.healthbar.name, graphicAssets.healthbar.URL);   
        game.load.image(graphicAssets.tree.name, graphicAssets.tree.URL);
        game.load.image(graphicAssets.sword.name, graphicAssets.sword.URL);
        game.load.image(graphicAssets.skall.name, graphicAssets.skall.URL);
        game.load.image(graphicAssets.fonkey.name, graphicAssets.fonkey.URL);
        game.load.image(graphicAssets.dandelion.name, graphicAssets.dandelion.URL);
        
        //tilemap
        game.load.image(graphicAssets.protoTiles.name, graphicAssets.protoTiles.URL);
    },
    
    init: function () {
        // var restartInstructions = 'click to restart';
        // this.tf_start = game.add.text(game.world.centerX, game.world.centerY, restartInstructions, fontAssets.counterFontStyle);
    },
    
    create: function () {
        this.image = game.add.sprite(0, 0, graphicAssets.main.name);
        // this.image.width = game.world.width;
        // this.image.height = game.world.height;
        
        // var startInstructions = 'W\nA    S    D\n\n\n click to start';
        
        // this.tf_start = game.add.text(game.world.centerX, game.world.centerY, startInstructions, fontAssets.counterFontStyle);
        // this.tf_start.anchor.set(0.5, 0.5);
        
        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        initKeyboard(this);
        
        game.input.onDown.addOnce(this.startGame, this);
        // this.startGame();
    },
    
    startGame: function () {
        if (states.start == undefined) {
            var startState = getRemainingLevels();
            game.state.start(startState, true, false, this.keys);
        } else {
            game.state.start(states.start, true);
        }
    },
};

game.state.add(states.main, mainState);