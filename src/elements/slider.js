/*
Options:
    - width (300): the width of the slider on screen
    - height (10): the thickness of the slider line
    - radius (30): the radius of the slider circle
    - colour ('default')

    - textSize (0): the size of the text displaying the value (0 means no text)

    - min (0): the minimum value (inclusive)
    - max (1): the maximum value (inclusive)
    - value (0.5 * (min + max)): the starting value
    - increment (1): the increment that the slider goes up in

    - onMove: callback when the slider is moved
    - onRelease: callback when the user lets go of the slider
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Slider = class Slider extends Element {
    constructor(options = {}) {
        super(options, 'slider');

        this.width = options.width || 300;
        this.height = options.height || 10;
        this.radius = options.radius || 20;

        this.textSize = options.textSize || 0;

        this.min = options.min || 0;
        this.max = options.max || 1;

        if (this.max < this.min) {
            console.error(`Slider: max value (${this.max}) is less than min value (${this.min}).`);
        }

        this.value = options.value || (this.max + this.min) / 2;
        if (this.value < this.min) this.value = this.min;
        if (this.value > this.max) this.value = this.max;

        this.calculateXPosition();
        // this.xPosition = this.valueToCoordinate(this.value);

        this.increment = options.increment || 1;

        this.onMove = options.onMove || (() => {});
        this.onRelease = options.onRelease || (() => {});

        this.hovered = false;
        this.mouseIsPressed = false;
        this.clickStart = 0;
    }

    update() {
        if (this.isHovered() || this.mouseIsPressed) {
            if (!this.hovered) {
                this.hovered = true;
                this.p5ui.sounds.hover.play();
            }
        } else {
            this.hovered = false;
        }

        if (this.mouseIsPressed) {
            let percent = this.mousePos.x / this.width + 0.5;

            let value = percent * (this.max - this.min) + this.min;
            value = Math.round(value / this.increment) * this.increment;

            if (value < this.min) value = this.min;
            if (value > this.max) value = this.max;

            if (this.value != value) {
                this.value = value;
                this.calculateXPosition();
                this.onMove(this.value);
            }
        }
    }

    getCursorState() {
        if (this.hovered) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        if (this.isHovered()) {
            this.mouseIsPressed = true;
            this.clickStart = this.mousePos.x;
        }
    }

    mouseUp(e) {
        if (e.button != 0) return;
        if (this.mouseIsPressed) {
            this.mouseIsPressed = false;
            this.onRelease(this.value);
        }
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > -this.width * 0.5 - this.radius
            && mousePos.y > -this.radius
            && mousePos.x < this.width * 0.5 + this.radius
            && mousePos.y < this.radius
    }

    calculateXPosition() {
        let percent = (this.value - this.min) / (this.max - this.min);
        this.xPosition = this.width * (percent - 0.5);
    }

    show() {
        let lineColour, circleColour, textColour;

        // Line
        if (this.hovered) {
            lineColour = this.getColour('line', 'hover');
        } else {
            lineColour = this.getColour('line');
        }

        if (lineColour != -1) {
            stroke(lineColour);
            noFill();
            strokeWeight(this.height);
            line(-this.width * 0.5, 0, this.width * 0.5, 0);
        }

        // Circle
        if (this.hovered) {
            circleColour = this.getColour('circle', 'hover');
        } else {
            circleColour = this.getColour('circle');
        }

        if (circleColour != -1) {
            fill(circleColour);
            noStroke();
            ellipse(this.xPosition, 0, this.radius * 2);
        }

        // Text
        if (this.textSize == 0) return;

        if (this.hovered) {
            textColour = this.getColour('text', 'hover');
        } else {
            textColour = this.getColour('text');
        }

        fill(textColour);
        noStroke();
        textSize(this.textSize);
        textAlign(CENTER);

        text(this.value, this.xPosition, this.textSize / 3);
    }
}

export default P5UI.Slider;