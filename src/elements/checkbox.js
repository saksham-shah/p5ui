/*
Options:
    - size (20)
    - colour ('default')

    - value (false): starting value of the checkbox

    - onClick: callback when the checkbox is clicked
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Checkbox = class Checkbox extends Element {
    constructor(options = {}) {
        super(options, 'checkbox');

        this.size = options.size || 30;
        
        this.value = options.value == undefined ? false : options.value;

        this.onClick = options.onClick || (() => {});

        this.hovered = false;
    }

    update() {
        if (this.isHovered()) {
            if (!this.hovered) {
                this.hovered = true;
                sounds.buttonhover.play();
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
        if (this.hovered) {
            this.value = !this.value;
            this.onClick(this.value);
            sounds.buttonclick.play();
        }
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > -this.size * 0.5
            && mousePos.y > -this.size * 0.5
            && mousePos.x < this.size * 0.5
            && mousePos.y < this.size * 0.5;
    }

    show() {
        const colour = {
            fill: 255,
            stroke: 20,
            hover: {
                fill: 150,
                stroke: 20
            },
            checked: {
                fill: 20,
                stroke: 255
            },
            hoverchecked: {
                fill: 50,
                stroke: 150
            }
        }

        let self = this;

        function getColour(key) {
            let c = -1;
            if (self.hovered) {
                if (self.value) {
                    c = self.getColour(key, 'hoverchecked', false);
    
                    if (c == -1) {
                        c = self.getColour(key, 'checked', false);
                    }
                }
                if (c == -1) {
                    c = self.getColour(key, 'hover');
                }
            } else if (self.value) {
                c = self.getColour(key, 'checked');
            } else {
                c = self.getColour(key);
            }
            return c;
        }
        
        noFill();
        noStroke();
        let drawRect = false;

        let fillColour = getColour('fill');
        let strokeColour = getColour('stroke');

        if (fillColour != -1) {
            fill(fillColour);
            drawRect = true;
        }

        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(2);
            drawRect = true;
        }

        if (drawRect) {
            rect(0, 0, this.size, this.size);
        }

        if (!this.value) return;

        let tickColour = getColour('tick');
        if (tickColour != -1) {
            stroke(tickColour);
        }

        if ((tickColour != -1 || strokeColour != -1) && tickColour != -2) {
            noFill();
            strokeWeight(this.size / 6);
            beginShape();
            vertex(-this.size * 0.3, 0);
            vertex(-this.size * 0.15, this.size * 0.15);
            vertex(this.size * 0.3, -this.size * 0.3);
            endShape();
        }

        // if (this.hovered) {
        //     if (this.value) {
        //         fillColour = this.getColour('fill', 'hoverchecked', false);
        //         strokeColour = this.getColour('stroke', 'hoverchecked', false);

        //         if (fillColour == -1) {
        //             fillColour = this.getColour('fill', 'checked');
        //         }

        //         if (strokeColour == -1) {
        //             fillCstrokeColourolour = this.getColour('stroke', 'checked');
        //         }
        //     } else {
        //         fillColour = this.getColour('fill', 'hover');
        //         strokeColour = this.getColour('stroke', 'hover');
        //     }
        // } else if (this.value) {
        //     fillColour = this.getColour('fill', 'checked');
        //     strokeColour = this.getColour('stroke', 'checked');
        // } else {
        //     fillColour = this.getColour('fill');
        //     strokeColour = this.getColour('stroke');
        // }

        
    }
}

export default P5UI.Checkbox;