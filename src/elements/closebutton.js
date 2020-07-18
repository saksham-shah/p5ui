import P5UI from '../core/main.js';
import Button from './button.js';

P5UI.CloseButton = class CloseButton extends Button {
    constructor(popup) {
        let y = -popup.header * 0.5;
        let x = popup.width + y;

        let options = {
            position: { x, y },
            p5ui: popup.p5ui,
            width: popup.textSize,
            height: popup.textSize,
            onClick: () => popup.p5ui.closePopup()
        }

        super(options);

        this.type = 'closebutton'
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
            strokeWeight(2);
        } else {
            noStroke();
        }

        rect(0, 0, this.width, this.height);

        strokeWeight(2);
        if (this.hovered) {
            stroke(this.getColour('cross', 'hover'));
        } else {
            stroke(this.getColour('cross'));
        }

        let lineDiagonal = this.width * 0.3;

        line(-lineDiagonal, lineDiagonal, lineDiagonal, -lineDiagonal);
        line(lineDiagonal, lineDiagonal, -lineDiagonal, -lineDiagonal);
    }
}

export default P5UI.CloseButton;