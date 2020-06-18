import P5UI from '../core/main.js';
import Button from './button.js';

P5UI.CloseButton = class CloseButton extends Button {
    constructor(overlay) {
        let y = -overlay.header * 0.5;
        let x = overlay.width + y;

        let options = {
            position: { x, y },
            p5ui: overlay.p5ui,
            width: overlay.textSize,
            height: overlay.textSize,
            onClick: () => overlay.p5ui.closeOverlay()
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