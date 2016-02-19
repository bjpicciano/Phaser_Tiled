//create the levels from the premade tilemaps
game.state.add(states.level1, new Level(this, graphicAssets.level1, color.purple, false));
game.state.add(states.level2, new Level(this, graphicAssets.level1, color.blue, false));
game.state.add(states.level3, new Level(this, graphicAssets.level1, color.green, true));

game.state.add(states.level4, new Level(this, graphicAssets.level2, color.purple, false));
game.state.add(states.level5, new Level(this, graphicAssets.level2, color.blue, false));
game.state.add(states.level6, new Level(this, graphicAssets.level2, color.green, true));

game.state.add(states.level7, new Level(this, graphicAssets.level4, color.purple, false));
game.state.add(states.level8, new Level(this, graphicAssets.level4, color.blue, false));
game.state.add(states.level9, new Level(this, graphicAssets.level4, color.green, true));

//sets my states.levels to the array of every loaded level.
//used to link edges of one level to other levels.
for (var state in game.state.states) {
    states.levels.push(state);
}

//removes the first level so it won't be called from a new edge
states.levels.splice(0, 1);  

//starts the menu
game.state.start(states.main);