import P5UI from './main.js';

P5UI.Cursor = class Cursor {
    constructor(p5ui) {
        this.p5ui = p5ui;

        this.onScreen = false;
        this.mode = 'default';
        this.img = 'default';

        this.mousePos = { x: 0, y: 0 };
        this.timeSinceMovement = 0;
        this.showTooltip = false;
    }

    update() {
        let newPos = this.getScreenPos();

        if (!mouseIsPressed && newPos.x == this.mousePos.x && newPos.y == this.mousePos.y) {
            if (this.showTooltip) {
                this.timeSinceMovement++;
            } else {
                this.timeSinceMovement = 0;
            }
        } else {
            this.timeSinceMovement = 0;
            this.showTooltip = true;
        }

        this.mousePos = newPos;

        if (this.isOnScreen()) {
            if (!this.onScreen) {
                this.onScreen = true;
                cursor(this.img);
            }
        } else {
            if (this.onScreen) {
                this.onScreen = false;
                cursor('default')
            }
        }
    }

    setMode(mode = 'default') {
        if (mode == this.mode) return;
        this.mode = mode;
        this.img = this.p5ui.cursors[mode];
        if (this.img == undefined) this.img = mode;
        if (this.onScreen) cursor(this.img);
    }

    isOnScreen() {
        return mouseX > this.p5ui.screenPosition.x
            && mouseY > this.p5ui.screenPosition.y
            && mouseX < width - this.p5ui.screenPosition.x
            && mouseY < height - this.p5ui.screenPosition.y;
    }

    getScreenPos() {
        return {
            x: (mouseX - this.p5ui.screenPosition.x) / this.p5ui.screenPosition.z,
            y: (mouseY - this.p5ui.screenPosition.y) / this.p5ui.screenPosition.z
        }
    }
}

export default P5UI.Cursor;