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
    level4: "level4",
    level5: "level5",
    level6: "level6",
    level7: "level7",
    level8: "level8",
    level9: "level9",
    
    levels: [],
};

var color = {
    purple: 0x9933FF,
    green: 0x009933,
    blue: 0x3366FF,
}

var graphicAssets = {
    //sprites
    background: {URL:'assets/background.png', name:'background'},
    player: {URL:'assets/player.png', name:'player'},
    sword: {URL:'assets/sword.png', name:'sword'},
    tree: {URL:'assets/tree.png', name:'tree'},
    brick: {URL:'assets/brick.png', name:'brick'},
    skall: {URL:'assets/skall.png', name:'skall'},
    
    //tilemaps
    protoTiles: {URL:'assets/protoTiles.png', name:'protoTiles'},
    level1: {URL:'states/json/1.json', name:'level1'},
    level2: {URL:'states/json/2.json', name:'level2'},
    level3: {URL:'states/json/3.json', name:'level3'},
    level4: {URL:'states/json/4.json', name:'level4'},
};

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

//'gameDiv' is the id in index.html
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv', null, false, false);