import { console } from '../utils/console.js';

class ColorView {

    #color;

    constructor(color) {
        this.#color = color;
    }

    write() {
        console.write(` ${this.#color.toString()[0]} `);
    }
}

export { ColorView };