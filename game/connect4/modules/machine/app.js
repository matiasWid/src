import { Game } from './models/Game.js';
import { GameView } from './views/GameView.js';

class Connect4 {
    #gameView;

    constructor() {
        let game = new Game();
        this.#gameView = new GameView(game);
    }

    playGames() {
        this.#gameView.playGames();
    }
}

new Connect4().playGames();
