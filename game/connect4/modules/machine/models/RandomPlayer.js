import { Coordinate } from "../types/Coordinate.js";
import { Player } from "./Player.js";

class RandomPlayer extends Player {

    getColumn() {
        let column;
        do {
            column = Math.floor(Math.random() * Coordinate.NUMBER_COLUMNS);
        } while (this.isComplete(column));
        return column;
    }

    accept(visitor) {
        visitor.visitRandomPlayer(this);
    }

}

export { RandomPlayer };