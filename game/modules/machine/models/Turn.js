import { RandomPlayer } from "./RandomPlayer.js";
import { UserPlayer } from "./UserPlayer.js";
import { Color } from "./Color.js";

class Turn {

    static #NUMBER_PLAYERS = 2;
    #players;
    #activePlayer;
    #board;

    constructor(board) {
        this.#board = board;
        this.#players = [];
    }

    reset(numberRandomPlayers) {
        for (let i = 0; i < Turn.#NUMBER_PLAYERS; i++) {
            this.#players[i] = i < numberRandomPlayers ?
                new RandomPlayer(Color.get(i), this.#board) :
                new UserPlayer(Color.get(i), this.#board);
        }
        this.#activePlayer = 0;
    }

    nextTurn() {
        this.#activePlayer = (this.#activePlayer + 1) % Turn.#NUMBER_PLAYERS;
    }

    isFinished() {
        return this.#board.isFinished();
    }

    isWinner() {
        return this.#board.isWinner();
    }

    getActivePlayer() {
        return this.#players[this.#activePlayer];
    }

    static getMaxNumberPlayers() {
        return this.#NUMBER_PLAYERS;
    }
}

export { Turn };