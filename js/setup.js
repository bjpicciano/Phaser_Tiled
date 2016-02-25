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
    tree: {URL:'assets/tree.png', name:'tree'},
    brick: {URL:'assets/brick.png', name:'brick'},
    skall: {URL:'assets/skall.png', name:'skall'},
    fonkey: {URL:'assets/fonkey.png', name:'fonkey'},
    dandelion: {URL:'assets/dandelion.png', name:'dandelion'},
    protoTiles: {URL:'assets/protoTiles.png', name:'protoTiles'},
};

var firstMapAssets = {
    // forest1: {URL:'states/json/protoLevel.json', name:'forest1'},
    // house: {URL:'states/json/protoLevel2.json', name:'house'},
    arena: {URL:'states/json/protoLevel3.json', name:'arena'},
    gateTransition: {URL:'states/json/gateTransition.json', name:'gateTransition'},
};

var secondMapAssets = {
    medium1: {URL:'states/json/medium1.json', name:'medium1'},
}

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

//'gameDiv' is the id in index.html
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv', null, false, false);