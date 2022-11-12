import { PlayerView } from './PlayerView.js';
import { Message } from './Message.js';
import { Turn } from '../models/Turn.js';
import { console } from '../utils/console.js';

class TurnView {

    #turn;

    constructor(turn) {
        this.#turn = turn;
    }

    play() {
        let playerView = new PlayerView(this.#turn.getActivePlayer());
        playerView.play();
        if (!this.#turn.isFinished()) {
            this.#turn.nextTurn();
        }
    }

    writeResult() {
        if (this.#turn.isWinner()) {
            let playerView = new PlayerView(this.#turn.getActivePlayer());
            playerView.writeWinner();
        } else {
            Message.PLAYERS_TIED.writeln();
        }
    }

    reset() {
        let numberRandomPlayers;
        do {
            numberRandomPlayers = console.readNumber(Message.NUMBER_OF_RANDOM_PLAYER);
            if (numberRandomPlayers > Turn.getMaxNumberPlayers()) {
                console.writeln(Message.INVALID_NUMBER_OF_RANDOM_PLAYER);
            }
        } while (numberRandomPlayers > Turn.getMaxNumberPlayers());
        this.#turn.reset(numberRandomPlayers);
    }
}
export { TurnView };
