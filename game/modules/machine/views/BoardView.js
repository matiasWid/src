import { ColorView } from './ColorView.js';
import { Coordinate } from '../models/Coordinate.js';
import { Message } from './Message.js';
import { console } from '../utils/console.js';

class BoardView {

    #board;

    constructor(board) {
        this.#board = board;
    }

    writeln() {
        this.writeHorizontal();
        for (let i = Coordinate.NUMBER_ROWS - 1; i >= 0; i--) {
            Message.VERTICAL_LINE.write();
            for (let j = 0; j < Coordinate.NUMBER_COLUMNS; j++) {
                let colorView = new ColorView(this.#board.getColor(new Coordinate(i, j)));
                colorView.write();
                Message.VERTICAL_LINE.write();
            }
            console.writeln();
        }
        this.writeHorizontal();
    }

    writeHorizontal() {
        for (let i = 0; i < 4 * Coordinate.NUMBER_COLUMNS; i++) {
            Message.HORIZONTAL_LINE.write();
        }
        Message.HORIZONTAL_LINE.writeln();
    }
}

export { BoardView };