var gameProperties = {
    screenWidth: 800,
    screenHeight: 600,
    
    padding: 0,
    
    delayToStartLevel: 3,
};

var states = {
    start: undefined,
    
    firstLevels: undefined,
    secondLevels: undefined,
};

var color = {
    purple: 0x9933FF,
    green: 0x009933,
    blue: 0x3366FF,
}

var graphicAssets = {
    //sprites
    main: {URL:'assets/main.png', name:'main'},
    background: {URL:'assets/background.png', name:'background'},
    player: {URL:'assets/player.png', name:'player'},
    playerAnim: {URL:'assets/playerAnim.png', name:'playerAnim'},
    healthbar: {URL:'assets/healthbar.png', name:'healthbar'},
    sword: {URL:'assets/sword.png', name:'sword'},
    bow: {URL:'assets/bow.png', name:'bow'},
    arrow: {URL:'assets/arrow.png', name:'arrow'},
    bomb: {URL:'assets/bomb.png', name:'bomb'},
    tree: {URL:'assets/tree.png', name:'tree'},
    brick: {URL:'assets/brick.png', name:'brick'},
    destructableBrick: {URL:'assets/destructableBrick.png', name:'destructableBrick'},
    skall: {URL:'assets/skall.png', name:'skall'},
    fonkey: {URL:'assets/fonkey.png', name:'fonkey'},
    dandelion: {URL:'assets/dandelion.png', name:'dandelion'},
    protoTiles: {URL:'assets/protoTiles.png', name:'protoTiles'},
};

var dungeonAssets = {
    easyForestPathDungeon: {URL:'states/json/easyForestPathDungeon.json', name:'easyForestPathDungeon'},
}

var firstMapAssets = {
    // forest1: {URL:'states/json/prototypes/protoLevel.json', name:'forest1'},
    // house: {URL:'states/json/prototypes/protoLevel2.json', name:'house'},
    // arena: {URL:'states/json/prototypes/protoLevel3.json', name:'arena'},
    // gateTransition: {URL:'states/json/prototypes/gateTransition.json', name:'gateTransition'},
    easyForestVillage: {URL:'states/json/easyForestVillage.json', name:'easyForestVillage'},
    easyForestPath: {URL:'states/json/easyForestPath.json', name:'easyForestPath'},
};

var secondMapAssets = {
    medium1: {URL:'states/json/medium1.json', name:'medium1'},
    medium2: {URL:'states/json/medium2.json', name:'medium2'},
}

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

//'gameDiv' is the id in index.html
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv', null, false, false);