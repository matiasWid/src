const { Console } = require("./console");

const console = new Console();
let error;
let = min;
let = max;
do {
  min = console.readNumber(`Introduzca el mínimo: `);
  max = console.readNumber(`Introduzca el máximo: `);
  error = min > max;
  if (error) {
    console.writeln(`El mínimo debe ser menor o igual al máximo`);
  }
} while (error);
let symmetrical;
console.writeln(`El intervalo [${-max}, ${-min}] es ${symmetrical ? `SI` : `NO`}`);