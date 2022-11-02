const { Console } = require(`./console`);

const console = new Console();

class ClosedInterval {

    #min;
    #max;

    constructor(min, max) {
        this.#min = min;
        this.#max = max;
    }

    isIncluded(value) {
        return this.#min <= value && value <= this.#max;
    }

}

class Color {

    static RED = new Color(`Red`);
    static YELLOW = new Color(`Yellow`);
    static NULL = new Color(` `);
    #string;

    constructor(string) {
        this.#string = string;
    }

    static get(ordinal) {
        return Color.#values()[ordinal];
    }

    static #values() {
        return [Color.RED, Color.YELLOW, Color.NULL];
    }

    toString() {
        return this.#string;
    }

}

class ColorView {

    #color;

    constructor(color) {
        this.#color = color;
    }

    write() {
        console.write(` ${this.#color.toString()[0]} `);
    }
}

class Coordinate {

    static ORIGIN = new Coordinate(0, 0);
    static NUMBER_ROWS = 6;
    static #ROWS = new ClosedInterval(0, Coordinate.NUMBER_ROWS - 1);
    static NUMBER_COLUMNS = 7;
    static #COLUMNS = new ClosedInterval(0, Coordinate.NUMBER_COLUMNS - 1);

    #row;
    #column;

    constructor(row, column) {
        this.#row = row;
        this.#column = column;
    }

    shifted(coordinate) {
        return new Coordinate(this.#row + coordinate.#row,
            this.#column + coordinate.#column);
    }

    isValid() {
        return Coordinate.#isRowValid(this.getRow())
            && Coordinate.isColumnValid(this.getColumn());
    }

    static isColumnValid(column) {
        return Coordinate.#COLUMNS.isIncluded(column);
    }

    static #isRowValid(row) {
        return Coordinate.#ROWS.isIncluded(row);
    }

    getRow() {
        return this.#row;
    }

    getColumn() {
        return this.#column;
    }

    equals(coordinate) {
        if (this == coordinate)
            return true;
        if (coordinate == null)
            return false;
        return this.#column === coordinate.#column && this.#row === coordinate.#row;
    }

    toString() {
        return `Coordinate [row= ${this.#row} column= ${this.#column}]`;
    }

}

class Direction {
    static NORTH = new Direction(1, 0);
    static NORTH_EAST = new Direction(1, 1);
    static EAST = new Direction(0, 1);
    static SOUTH_EAST = new Direction(-1, 1);
    static SOUTH = new Direction(-1, 0);
    static SOUTH_WEST = new Direction(-1, -1);
    static WEST = new Direction(0, -1);
    static NORTH_WEST = new Direction(1, -1);

    #coordinate;

    constructor(row, column) {
        this.#coordinate = new Coordinate(row, column);
    }

    getOpposite() {
        for (let direction of Direction.values()) {
            if (direction.#coordinate.shifted(this.#coordinate).equals(Coordinate.ORIGIN)) {
                return direction;
            }
        }
        return null;
    }

    static values() {
        return [Direction.NORTH, Direction.NORTH_EAST, Direction.EAST, Direction.SOUTH_EAST,
        Direction.SOUTH, Direction.SOUTH_WEST, Direction.WEST, Direction.NORTH_WEST];
    }

    getCoordinate() {
        return this.#coordinate;
    }

    static halfValues() {
        return Direction.values().splice(0, Direction.values.length / 2)
    }

}

class Line {

    static LENGTH = 4;
    #origin;
    #coordinates;
    #oppositeDirection;

    constructor(coordinate) {
        this.#origin = coordinate;
    }

    set(direction) {
        this.#coordinates = [this.#origin];
        for (let i = 1; i < Line.LENGTH; i++) {
            this.#coordinates[i] = this.#coordinates[i - 1].shifted(direction.getCoordinate());
        }
        this.#oppositeDirection = direction.getOpposite();
    }

    shift() {
        for (let i = 0; i < Line.LENGTH; i++) {
            this.#coordinates[i] = this.#coordinates[i].shifted(this.#oppositeDirection.getCoordinate());
        }
    }

    getCoordinates() {
        return this.#coordinates;
    }
}

class Board {

    #colors;
    #lastDrop;

    constructor() {
        this.#colors = [];
        for (let i = 0; i < Coordinate.NUMBER_ROWS; i++) {
            this.#colors[i] = [];
        }
        this.reset();
    }

    reset() {
        for (let i = 0; i < Coordinate.NUMBER_ROWS; i++) {
            for (let j = 0; j < Coordinate.NUMBER_COLUMNS; j++) {
                this.#colors[i][j] = Color.NULL;
            }
        }
    }

    dropToken(column, color) {
        this.#lastDrop = new Coordinate(0, column);
        while (!this.isEmpty(this.#lastDrop)) {
            this.#lastDrop = this.#lastDrop.shifted(Direction.NORTH.getCoordinate());
        }
        this.#colors[this.#lastDrop.getRow()][this.#lastDrop.getColumn()] = color;
    }

    isComplete(column) {
        if (column !== undefined) {
            return !this.isEmpty(new Coordinate(Coordinate.NUMBER_ROWS - 1, column));
        }
        for (let i = 0; i < Coordinate.NUMBER_COLUMNS; i++) {
            if (!this.isComplete(i)) {
                return false;
            }
        }
        return true;
    }

    isFinished() {
        return this.isComplete() || this.isWinner();
    }

    isWinner() {
        if (this.#lastDrop === undefined) {
            return false;
        }
        let line = new Line(this.#lastDrop);
        for (let direction of Direction.halfValues()) {
            line.set(direction);
            for (let i = 0; i < Line.LENGTH; i++) {
                if (this.isConnect4(line)) {
                    return true;
                }
                line.shift();
            }
        }
        return false;
    }

    isConnect4(line) {
        let coordinates = line.getCoordinates();
        for (let i = 0; i < Line.LENGTH; i++) {
            if (!coordinates[i].isValid()) {
                return false;
            }
            if (i > 0 && this.getColor(coordinates[i - 1]) != this.getColor(coordinates[i])) {
                return false;
            }
        }
        return true;
    }

    isOccupied(coordinate, color) {
        return this.getColor(coordinate) == color;
    }

    isEmpty(coordinate) {
        return this.isOccupied(coordinate, Color.NULL);
    }

    getColor(coordinate) {
        return this.#colors[coordinate.getRow()][coordinate.getColumn()];
    }

}

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

class Player {

    #color;
    #board;

    constructor(color, board) {
        this.#color = color;
        this.#board = board;
    }

    play() {
        Message.TURN.write();
        console.writeln(this.#color.toString());
        let column = this.getColumn();
        this.#board.dropToken(column, this.#color);
    }

    getColor(){
        return this.#color;
    }

    writeWinner() {
        let message = Message.PLAYER_WIN.toString();
        message = message.replace(`#color`, this.#color.toString());
        console.writeln(message);
    }

    dropToken(column) {
        this.#board.dropToken(column, this.#color);
    }

    isComplete(column) {
        return this.#board.isComplete(column);
    }

    getColumn() {}

    accept(playerView){}

}

class UserPlayer extends Player {

    getColumn() {
        let column;
        let valid;
        do {
            column = console.readNumber(Message.ENTER_COLUMN_TO_DROP.toString()) - 1;
            valid = Coordinate.isColumnValid(column);
            if (!valid) {
                Message.INVALID_COLUMN.writeln();
            } else {
                valid = !this.isComplete(column);
                if (!valid) {
                    Message.COMPLETED_COLUMN.writeln();
                }
            }
        } while (!valid);
        return column;
    }

    accept(playerView){
        playerView.visitUserPlayer(this);
    }

}

class RandomPlayer extends Player {

    getColumn() {
        let column;
        do {
            column = Math.floor(Math.random() * Coordinate.NUMBER_COLUMNS);
        } while (this.isComplete(column));
        return column;
    }

    accept(playerView){
        playerView.visitRandomPlayer(this);
    }

}

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

    visitRandomPlayer(randomPlayer){
        let column = randomPlayer.getColumn();
        console.writeln(`Aleatoriamente en la columna: ${column}`);
        randomPlayer.dropToken(column);
    }

    visitUserPlayer(userPlayer){
        let valid;
        let column;
        do {
            Message.TURN.write();
            console.writeln(this.#player.getColor().toString());
            //this.#player.accept(this);
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

class Turn {

    static #NUMBER_PLAYERS = 2;
    #players;
    #activePlayer;
    #board;
    #numberRandomPlayers;

    constructor(board, numberRandomPlayers) {
        this.#board = board;
        this.#players = [];
        this.#numberRandomPlayers = numberRandomPlayers;
        this.reset();
    }

    reset() {
        for (let i = 0; i < Turn.#NUMBER_PLAYERS; i++) {
            if (i < this.#numberRandomPlayers) {
                console.writeln("Usuario aleatorio");
                this.#players[i] = new RandomPlayer(Color.get(i), this.#board);
            }
            else {
                console.writeln("Usuario humano");
                this.#players[i] = new UserPlayer(Color.get(i), this.#board);
            }
        }
        console.readNumber();
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

    static getMaxNumberPlayers()
    {
        return this.#NUMBER_PLAYERS;
    }
}

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
}

class YesNoDialog {

    static #AFFIRMATIVE = `y`;
    static #NEGATIVE = `n`;
    static #SUFFIX = `? (` +
        YesNoDialog.#AFFIRMATIVE + `/` +
        YesNoDialog.#NEGATIVE + `): `;
    static #MESSAGE = `The value must be ${YesNoDialog.#AFFIRMATIVE} or ${YesNoDialog.#NEGATIVE}`;
    #answer;

    read(message) {
        let ok;
        do {
            console.write(message);
            this.#answer = console.readString(YesNoDialog.#SUFFIX);
            ok = this.isAffirmative() || this.isNegative();
            if (!ok) {
                console.writeln(YesNoDialog.#MESSAGE);
            }
        } while (!ok);
    }

    isAffirmative() {
        return this.getAnswer() === YesNoDialog.#AFFIRMATIVE;
    }

    isNegative() {
        return this.getAnswer() === YesNoDialog.#NEGATIVE;
    }

    getAnswer() {
        return this.#answer.toLowerCase()[0];
    }
}

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

class Connect4 {

    #board;
    #turn;
    #boardView;
    #turnView;

    constructor() {
        this.#board = new Board();
        this.#boardView = new BoardView(this.#board);

    }

    playGames() {
        do {
            let numberRandomPlayers = getNumberRandomPlayers();
            this.#turn = new Turn(this.#board, numberRandomPlayers);
            this.#turnView = new TurnView(this.#turn);

            this.playGame();
        } while (this.isResumed());

        function getNumberRandomPlayers() {
            let numberRandomPlayers;
            do {
                numberRandomPlayers = console.readNumber(Message.NUMBER_OF_RANDOM_PLAYER);
                if (numberRandomPlayers > Turn.getMaxNumberPlayers()) {
                    console.writeln(Message.INVALID_NUMBER_OF_RANDOM_PLAYER);
                }
            } while (numberRandomPlayers > Turn.getMaxNumberPlayers());
            return numberRandomPlayers;
        }
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
            this.#turn.reset();
        }
        return yesNoDialog.isAffirmative();
    }

}

new Connect4().playGames();
