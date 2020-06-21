import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Scrollbar = class Scrollbar extends Element {
    constructor(height, maxRows, rowContents, scrollProperty, options = {}) {
        super(options, 'scrollbar');

        this.height = height;
        this.maxRows = maxRows;

        this.rowContents = rowContents;
        this.scrollProperty = scrollProperty;

        this.rowWidth = options.rowWidth || 0;
        this.barWidth = options.barWidth || 10;

        // this.colour = options.colour || 'default';

        this.scrollDirection = options.reverseScroll ? -1 : 1;
        this.scrollPosition = 0;
        this.scrollHeight = 1;
        this.scrollY = 0;

        this.hovered = false;
        this.mousePressed = false;
        this.clickStart = 0;
        this.positionAtClick = 0;
    }

    update(e) {
        this.hovered = this.isHovered() || this.mousePressed;

        if (this.mousePressed) {
            let numRows = this.parent[this.rowContents].length;
            let rowsToDisplay = Math.min(numRows, this.maxRows);

            let offset = (this.mousePos.y - this.clickStart) * this.scrollDirection;
            let up = offset > 0;
            let flooredOffset = Math.floor(Math.abs(offset) * numRows / this.height);
            if (!up) flooredOffset *= -1;

            let newPos = this.positionAtClick + flooredOffset;
            if (newPos < 0) newPos = 0;
            if (newPos > numRows - rowsToDisplay) newPos = numRows - rowsToDisplay;

            this.parent[this.scrollProperty] = newPos;

            this.calculateScrollbar();
        }
    }

    mouseDown(e) {
        if (this.scrollHeight == 1) return;
        if (this.isHovered()) {
            this.mousePressed = true;
            this.clickStart = this.mousePos.y;
            this.positionAtClick = this.parent[this.scrollProperty];
        }
    }

    mouseWheel(e) {
        if (this.mousePressed) return;
        if (this.parent.isHovered()) this.scroll(e.deltaY / 100 * this.scrollDirection);
    }

    mouseUp(e) {
        this.mousePressed = false;
    }

    scroll(offset) {
        if (this.hidden) return;
        let numRows = this.parent[this.rowContents].length;

        this.parent[this.scrollProperty] += offset;
        let rowsToDisplay = Math.min(numRows, this.maxRows);

        if (this.parent[this.scrollProperty] < 0) {
            offset -= this.parent[this.scrollProperty];
            this.parent[this.scrollProperty] = 0;

        } else if (this.parent[this.scrollProperty] > numRows - rowsToDisplay) {
            offset += numRows - rowsToDisplay - this.parent[this.scrollProperty];
            this.parent[this.scrollProperty] = numRows - rowsToDisplay;
        }

        this.calculateScrollbar();
    }

    calculateScrollbar() {
        if (this.hidden) return;
        let numRows = this.parent[this.rowContents].length;
        if (numRows == 0) {
            this.scrollHeight = 1;
            this.scrollY = 0;
            this.mousePressed = false;
            return;
        }

        this.scrollHeight = Math.min(this.maxRows / numRows, 1);
        if (this.scrollHeight == 1) this.mousePressed = false;
        this.scrollY = this.parent[this.scrollProperty] / numRows * this.scrollDirection;
    }

    toggleScrollbar(bool) {
        this.hide(bool);
        if (this.hidden) this.mousePressed = false;
        this.calculateScrollbar();
    }

    isHovered(mousePos = this.mousePos) {
        let y = mousePos.y * this.scrollDirection;

        return mousePos.x > 0
            && y > this.scrollY * this.height * this.scrollDirection
            && mousePos.x < this.barWidth
            && y < this.scrollY * this.height * this.scrollDirection + this.scrollHeight * this.height;
    }

    reset() {
        this.parent[this.scrollProperty] = 0;
        this.calculateScrollbar();
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.mousePressed = false;
        }
    }

    show() {
        push();
        if (this.scrollHeight < 1) {
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

            let x = 0
            let y = this.scrollY * this.height
            let w = this.barWidth;
            let h = this.scrollHeight * this.height

            rect(x + w * 0.5, y + h * 0.5 * this.scrollDirection, w, h);
        }

        pop();
    }
}

export default P5UI.Scrollbar;