'use strict';
import GameController from './GameController.js';

const gameControl = new GameController(
    document.getElementById('game-container'), // div waarin het spel laadt
);

gameControl.init();