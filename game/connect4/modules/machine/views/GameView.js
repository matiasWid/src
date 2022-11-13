import { BoardView } from "./BoardView.js";
import { TurnView } from "./TurnView.js";
import { Message } from './Message.js';
import { YesNoDialog } from './YesNoDialog.js';

class GameView {
    #game;
    #boardView;
    #turnView;

    constructor(game) {
        this.#game = game;
        this.#boardView = new BoardView(game);
        this.#turnView = new TurnView(game);
    }

    playGames() {
        do {
            this.#turnView.setup();
            this.#playGame();
        } while (this.#isResumed());
    }

    #playGame() {
        Message.TITLE.writeln();

        this.#boardView.writeln();
        do {
            this.#turnView.play();
            this.#boardView.writeln();
        } while (!this.#game.isFinished());
        this.#turnView.writeResult();
    }

    #isResumed() {
        let yesNoDialog = new YesNoDialog();
        yesNoDialog.read(Message.RESUME.toString());
        if (yesNoDialog.isAffirmative()) {
            this.#game.reset();
        }
        return yesNoDialog.isAffirmative();
    }
}

export { GameView };