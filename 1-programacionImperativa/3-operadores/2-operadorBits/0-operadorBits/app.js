const { Console } = require("./console");

const console = new Console();
console.writeln(5 & 3); // ... 0000 0101 & ... 0000 0011 -> ... 0000 0001 : 1
console.writeln(5 | 3); // ... 0000 0101 | ... 0000 0011 -> ... 0000 0111 : 7
console.writeln(5 ^ 3); // ... 0000 0101 ^ ... 0000 0011 -> ... 0000 0110 : 6
console.writeln(~ 5); // ~ ... 0000 0101 -> 1111 1111 1111 1111 1111 1111 1111 1010 : -6
console.writeln(5 << 1); // ... 0000 0101 << 1 -> ... 0000 1010 : 10
console.writeln(5 >> 1); // ... 0000 0101 >> 1 -> ... 0000 0010 : 2
console.writeln(5 >>> 1); // ... 0000 0101 >>> 1 -> ... 0000 0010 : 2
console.writeln(-5 << 1); // 1111 1111 1111 1111 1111 1111 1111 1011 << 1 -> 1111 1111 1111 1111 1111 1111 1111 0110 : -10
console.writeln(-5 >> 1); // 1111 1111 1111 1111 1111 1111 1111 1011 >> 1 -> 1111 1111 1111 1111 1111 1111 1111 1101 : -3
console.writeln(-5 >>> 3); // 1111 1111 1111 1111 1111 1111 1111 1011 >>> 1 -> 0111 1111 1111 1111 1111 1111 1111 1101 : 2147483645
