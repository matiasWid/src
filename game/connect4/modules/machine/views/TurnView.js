import { PlayerView } from './PlayerView.js';
import { Message } from './Message.js';
import { Turn } from '../models/Turn.js';
import { console } from '../utils/console.js';

class TurnView {

    #game;

    constructor(game) {
        this.#game = game;
    }

    play() {
        let playerView = new PlayerView(this.#game.getActivePlayer());
        playerView.play();
        if (!this.#game.isFinished()) {
            this.#game.next();
        }
    }

    writeResult() {
        if (this.#game.isWinner()) {
            let playerView = new PlayerView(this.#game.getActivePlayer());
            playerView.writeWinner();
        } else {
            Message.PLAYERS_TIED.writeln();
        }
    }

    setup() {
        let numberRandomPlayers;
        do {
            numberRandomPlayers = console.readNumber(Message.NUMBER_OF_RANDOM_PLAYER);
            if (numberRandomPlayers > Turn.getMaxNumberPlayers()) {
                console.writeln(Message.INVALID_NUMBER_OF_RANDOM_PLAYER);
            }
        } while (numberRandomPlayers > Turn.getMaxNumberPlayers());
        this.#game.setup(numberRandomPlayers);
    }
}
export { TurnView };
