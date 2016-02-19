var gameProperties = {
    screenWidth: 800,
    screenHeight: 608,
    
    padding: 0,
    
    delayToStartLevel: 3,
};

var states = {
    main: "main",
    level1: "level1",
    level2: "level2",
    level3: "level3",
    
    levels: [],
};

var graphicAssets = {
    //sprites
    background: {URL:'assets/background.png', name:'background'},
    player: {URL:'assets/player.png', name:'player'},
    tree: {URL:'assets/tree.png', name:'tree'},
    brick: {URL:'assets/brick.png', name:'brick'},
    skall: {URL:'assets/skall.png', name:'skall'},
    
    //tilemaps
    protoTiles: {URL:'assets/protoTiles.png', name:'protoTiles'},
    level1: {URL:'levels/json/1.json', name:'level1'},
    level2: {URL:'levels/json/2.json', name:'level1'},
    level3: {URL:'levels/json/4.json', name:'level3'},
};

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

//'gameDiv' is the id in index.html
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv', null, false, false);