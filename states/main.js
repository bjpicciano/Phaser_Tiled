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
        for (var obj in graphicAssets) {
            var asset = graphicAssets[obj];
            game.load.image(asset.name, asset.URL);
        }
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
        
        // game.input.onDown.addOnce(this.startGame, this);
        this.startGame();
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

game.state.add("main", mainState);