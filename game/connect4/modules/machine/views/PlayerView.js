import { Coordinate } from "../models/Coordinate.js";
import { Message } from "./Message.js";
import { console } from '../utils/console.js';

class PlayerView {

    #player;

    constructor(player) {
        this.#player = player;
    }

    play() {
        this.#player.accept(this);
    }

    writeWinner() {
        let message = Message.PLAYER_WIN.toString();
        message = message.replace(`#color`, this.#player.getColor().toString());
        console.writeln(message);
    }

    visitRandomPlayer(randomPlayer) {
        let column = randomPlayer.getColumn();
        Message.TURN.write();
        console.writeln(this.#player.getColor().toString());
        console.writeln(`${Message.RANDOM_COLUMN} ${column + 1}`);
        randomPlayer.dropToken(column);
    }

    visitUserPlayer(userPlayer) {
        let valid;
        let column;
        do {
            Message.TURN.write();
            console.writeln(this.#player.getColor().toString());
            column = console.readNumber(Message.ENTER_COLUMN_TO_DROP.toString()) - 1;
            valid = Coordinate.isColumnValid(column);
            if (!valid) {
                Message.INVALID_COLUMN.writeln();
            } else {
                valid = !this.#player.isComplete(column);
                if (!valid) {
                    Message.COMPLETED_COLUMN.writeln();
                }
            }
        } while (!valid);
        userPlayer.dropToken(column);
    }
}

export { PlayerView };