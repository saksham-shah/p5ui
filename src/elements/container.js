/*
Options:
    - width (300)
    - height (200)
    - colour ('lobbychat')

    - text (''): the text displayed in the header of the container
    - header (25): the height of the header
    - padding (5): the padding of the text in the header
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Container = class Container extends Element {
    constructor(options) {
        super(options, 'container');

        this.width = options.width || 300;
        this.height = options.height || 200;

        this.text = options.text || '';
        this.padding = options.padding || 5;
        this.header = options.header || 25;
        this.textSize = this.header - 2 * this.padding;

        // this.colour = options.colour || 'lobbychat';

        this.clickPos = { x: 0, y: 0 };
        this.mousePressed = false;
    }

    mouseUp(e) {
        this.mousePressed = false;
    }

    isHovered(mousePos = this.mousePos) {
        if (this.text.length == 0) return false;

        return mousePos.x > 0
            && mousePos.y > -this.header
            && mousePos.x < this.width
            && mousePos.y < 0;
    }

    show() {
        if (this.width > 0 && this.height > 0) {
            let fillColour = this.getColour('fill');
            if (fillColour != -1) {
                fill(fillColour);
            } else {
                noFill();
            }

            let strokeColour = this.getColour('stroke');
            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
            } else {
                noStroke();
            }

            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        if (this.header > 0 && this.text.length > 0) {
            let headerColour = this.getColour('header');
            if (headerColour != -1) {
                fill(headerColour);

                rect(this.width * 0.5, -this.header * 0.5, this.width, this.header);
            }

            textAlign(CENTER);
            textSize(this.textSize);
            noStroke();
            fill(this.getColour('text'));

            text(this.text, this.width * 0.5, - this.header * 0.5 + this.textSize / 3);
        }
    }
}

export default P5UI.Container;