import { Board } from './Board.js';
import { Turn } from './Turn.js';

class Game {
    #board;
    #turn;

    constructor() {
        this.#board = new Board();
        this.#turn = new Turn(this.#board);
    }

    isFinished() {
        return this.#board.isFinished();
    }

    getColor(coordinate){
        return this.#board.getColor(coordinate);
    }

    reset() {
        return this.#board.reset();
    }

    getActivePlayer() {
        return this.#turn.getActivePlayer();
    }

    isFinished(){
        return this.#turn.isFinished();
    }

    next(){
        return this.#turn.next();
    }

    isWinner(){
        return this.#turn.isWinner();
    }

    setup(numberRandomPlayers) {
        this.#turn.setup(numberRandomPlayers);
    }
}

export { Game };