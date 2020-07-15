/*
Options:
    - width (p5ui.width)
    - height (p5ui.height)
    - colour ('default')

    - text (''): the text displayed on the button
    - drawBox (true): whether to draw the actual rectangle

    - onDisplay: callback when the overlay is displayed
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Overlay = class Overlay extends Element {
    constructor(options = {}) {
        let w = options.width || options.p5ui.width;
        let h = options.height || options.p5ui.height;
        options.position = { x: (options.p5ui.width - w) * 0.5, y: (options.p5ui.height - h) * 0.5 };
        
        super(options, 'overlay');

        this.width = w;
        this.height = h;
        this.text = options.text || '';
        this.drawBox = options.drawBox == false ? false : true;

        this.header = this.p5ui.overlayHeader;
        this.textSize = this.header - 2 * this.p5ui.overlayPadding;

        // this.colour = options.colour || 'default';

        this.onDisplay = options.onDisplay || (() => {});

        if (this.text.length > 0) {
            this.addChild(new P5UI.CloseButton(this));
        }
    }

    show() {
        if (this.drawBox) {
            // let fillColour = this.getColour('fill');
            // if (fillColour != -1) {
            //     fill(fillColour);
            // } else {
            //     noFill();
            // }

            // let strokeColour = this.getColour('stroke');
            // if (strokeColour != -1) {
            //     stroke(strokeColour);
            //     strokeWeight(1);
            // } else {
            //     noStroke();
            // }

            // rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        if (this.text.length > 0) {
            let fillColour = this.getColour('fill');
            if (fillColour != -1) {
                fill(fillColour);
            } else {
                noFill();
            }

            // let strokeColour = this.getColour('stroke');
            // if (strokeColour != -1) {
            //     stroke(strokeColour);
            //     strokeWeight(1);
            // } else {
                noStroke();
            // }

            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);

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

    postShow() {
        if (this.text.length > 0) {
            noFill();
            let strokeColour = this.getColour('stroke');
            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
            } else {
                noStroke();
            }

            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);

            let headerColour = this.getColour('header');
            if (headerColour != -1) {
            //     fill(headerColour);

                rect(this.width * 0.5, -this.header * 0.5, this.width, this.header);
            }
        }
    }
}

export default P5UI.Overlay;