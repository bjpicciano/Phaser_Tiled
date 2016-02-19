//the last .js file to be called. This makes sure everything is loaded in
//before a state is started

//sets my states.levels to the array of every loaded level.
//used to link edges of one level to other levels.
for (var state in game.state.states) {
    states.levels.push(state);
}

//removes level1
states.levels.splice(0, 1);  

//starts level1
game.state.start(states.main);