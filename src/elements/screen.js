import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Screen = class Screen extends Element {
    constructor(options) {
        super(options, 'screen');
    }

    isHovered() {
        return this.p5ui.cursor.isOnScreen();
    }
}

export default P5UI.Screen;