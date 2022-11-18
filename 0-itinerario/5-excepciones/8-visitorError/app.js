Error.prototype.accept = function(visitor){
    visitor.visitError(this);
}

RangeError.prototype.accept = function(visitor){
    visitor.visitRangeError(this);
}

class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomError';
    }

    accept(visitor) {
        visitor.visitCustomError(this);
    }
}

class RandomException {
    run() {
        console.log(`Sentencia previa`);
        try {
            if (Math.random() < 0.5) {
                throw new RangeError("descripcion");
            }
            if (Math.random() < 0.5) {
                throw new CustomError("descripcion");
            }
            if (Math.random() < 0.5) {
                throw new Error("descuidado");
            }
            console.log("Sentencia ejecutada?");
        } catch (exception) {
            exception.accept(this);
        }
        console.log(`Sentencia posterior`);
    }

    visitError(exception) {
        console.log("Acciones catch Error: " + exception.name + ": " + exception.message);
    }

    visitCustomError(exception) {
        console.log("Acciones catch Custom Error: " + exception.name + ": " + exception.message);
    }

    visitRangeError(exception) {
        console.log("Acciones catch Range Error: " + exception.name + ": " + exception.message);
    }
}

const randomException = new RandomException();
randomException.run();