/*
Options:
    - width (200)
    - height (100)
    - colour ('default')

    - text (''): the text displayed on the button
    - textSize (50): the size of the button text

    - onClick: callback when the button is clicked
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Checkbox = class Checkbox extends Element {
    constructor(options = {}) {
        super(options, 'slider');

    
    }

    update() {
        
    }

    getCursorState() {
        if (this.hovered) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        
    }

    mouseUp(e) {
        if (e.button != 0) return;
        
    }

    isHovered(mousePos = this.mousePos) {
        // return mousePos.x > -this.width * 0.5
        //     && mousePos.y > -this.height * 0.5
        //     && mousePos.x < this.width * 0.5
        //     && mousePos.y < this.height * 0.5;
    }

    show() {
    
    }
}

export default P5UI.Checkbox;