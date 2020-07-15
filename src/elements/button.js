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

P5UI.Button = class Button extends Element {
    constructor(options = {}) {
        super(options, 'button');

        this.width = options.width || 200;
        this.height = options.height || 100;

        this.text = options.text || '';
        this.tSize = options.textSize || 50;

        this.onClick = options.onClick || (() => {});
        this.target = options.target || {};

        // this.colour = options.colour || 'default';

        this.hovered = false;

        this.clickPos = null;
    }

    update() {
        if (this.isHovered()) {
            if (!this.hovered) {
                this.hovered = true;
                this.p5ui.sounds.hover.play();
            }
        } else {
            this.hovered = false;
        }
    }

    getCursorState() {
        if (this.hovered) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        this.clickPos = this.mousePos;
    }

    mouseUp(e) {
        if (e.button != 0) return;
        if (this.hovered && this.isHovered(this.clickPos)) {
            this.click();
            return true;
        }
        return false;
    }

    click() {
        this.onClick(this, this.target);
        this.p5ui.sounds.click.play();
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > -this.width * 0.5
            && mousePos.y > -this.height * 0.5
            && mousePos.x < this.width * 0.5
            && mousePos.y < this.height * 0.5;
    }

    show() {
        let fillColour;
        if (this.hovered) {
            fillColour = this.getColour('fill', 'hover');
        } else {
            fillColour = this.getColour('fill');
        }

        if (fillColour != -1) {
            fill(fillColour)
        } else {
            noFill();
        }

        let strokeColour;
        if (this.hovered) {
            strokeColour = this.getColour('stroke', 'hover');
        } else {
            strokeColour = this.getColour('stroke');
        }

        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(1);
        } else {
            noStroke();
        }

        rect(0, 0, this.width, this.height);

        textAlign(CENTER);
        textSize(this.tSize);

        if (this.hovered) {
            fill(this.getColour('text', 'hover'));
        } else {
            fill(this.getColour('text'));
        }
        noStroke();

        let t = this.text;
        if (t instanceof Function) t = t(this, this.target);
        text(t, 0, this.tSize / 3);
    }
}

export default P5UI.Button;