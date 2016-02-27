//create the levels from the premade tilemaps
// var randomColor = Math.random() * 0xffffff;

var debug = true;

//load all the dungeons. Does not need to be added to a collection. Only one manual connection and exit.
for (var mapKey in dungeonAssets) {
    var map = dungeonAssets[mapKey];
    game.state.add(map.name, new Level(this, map, getRandomHexColor(), debug));
}

//load all the first tilemaps. Adds them to states.firstLevels
for (var mapKey in firstMapAssets) {
    var map = firstMapAssets[mapKey];
    game.state.add(map.name, new Level(this, map, getRandomHexColor(), debug));
    
    if (states.firstLevels == undefined) {
        states.firstLevels = [];
    }
    
    states.firstLevels.push(map.name);
}

//load all the second tilemaps. Adds them to states.secondLevels
for (var mapKey in secondMapAssets) {
    var map = secondMapAssets[mapKey];
    game.state.add(map.name, new Level(this, map, getRandomHexColor(), debug));
    
    if (states.secondLevels == undefined) {
        states.secondLevels = [];
    }
    
    states.secondLevels.push(map.name);
}

//starts the menu
game.state.start("main");