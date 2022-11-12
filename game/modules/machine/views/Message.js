import { Turn } from "../models/Turn.js";
import { console } from '../utils/console.js';

class Message {
    static TITLE = new Message(`--- CONNECT 4 ---`);
    static HORIZONTAL_LINE = new Message(`-`);
    static VERTICAL_LINE = new Message(`|`);
    static TURN = new Message(`Turn: `);
    static ENTER_COLUMN_TO_DROP = new Message(`Enter a column to drop a token: `);
    static INVALID_COLUMN = new Message(`Invalid columnn!!! Values [1-7]`);
    static COMPLETED_COLUMN = new Message(`Invalid column!!! It's completed`);
    static PLAYER_WIN = new Message(`#colorS WIN!!! : -)`);
    static PLAYERS_TIED = new Message(`TIED!!!`);
    static RESUME = new Message(`Do you want to continue`);
    static NUMBER_OF_RANDOM_PLAYER = new Message(`Enter a number of random player`);
    static INVALID_NUMBER_OF_RANDOM_PLAYER = new Message(`Invalid number of random player!!! Values [0-2]`);
    static INVALID_NUMBER_OF_RANDOM_PLAYER = new Message(`Invalid number of random player!!! Values [${Turn.getMaxNumberPlayers()}]`);
    static RANDOM_COLUMN = new Message(`Randomly on column:`);
    #string;

    constructor(string) {
        this.#string = string;
    }

    write() {
        console.write(this.#string);
    }

    writeln() {
        console.writeln(this.#string);
    }

    toString() {
        return this.#string;
    }
}

export { Message };