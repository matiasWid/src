import { Board } from './models/Board.js';
import { Turn } from './models/Turn.js';
import { BoardView } from './views/BoardView.js';
import { Message } from './views/Message.js';
import { TurnView } from './views/TurnView.js';
import { YesNoDialog } from './views/YesNoDialog.js';

class Connect4 {

    #board;
    #boardView;
    #turnView;

    constructor() {
        this.#board = new Board();
        this.#boardView = new BoardView(this.#board);
    }

    playGames() {
        do {
            let turn = new Turn(this.#board);
            this.#turnView = new TurnView(turn);
            this.#turnView.reset();
            this.playGame();
        } while (this.isResumed());
    }

    playGame() {
        Message.TITLE.writeln();

        this.#boardView.writeln();
        do {
            this.#turnView.play();
            this.#boardView.writeln();
        } while (!this.#board.isFinished());
        this.#turnView.writeResult();
    }

    isResumed() {
        let yesNoDialog = new YesNoDialog();
        yesNoDialog.read(Message.RESUME.toString());
        if (yesNoDialog.isAffirmative()) {
            this.#board.reset();
        }
        return yesNoDialog.isAffirmative();
    }
}

new Connect4().playGames();
