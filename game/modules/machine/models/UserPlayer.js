import { Player } from "./Player.js";

class UserPlayer extends Player {
    accept(visitor) {
        visitor.visitUserPlayer(this);
    }
}

export { UserPlayer };