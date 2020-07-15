/*
Options:
    - width (800): The width of the table, including the scroll bar
    - columnWidths ([]): Array of widths of each column (empty array means each column has equal width)
    NOTE: If columnWidths is provided, the width property will be overridden by the total width of the columns

    - height (300): the height of the table, excluding the header row
    - rowHeight (30): the height of each row
    - padding (5): text padding
    - colour ('lobbies')

    - scrollbarWidth (0): The width of the scroll bar (0 means no scrolling)

    - onClick: callback when an item in the table is clicked

    - columnTitles: array of the titles of each column
    - columnFunctions: functions to get the data of each item in the table
    (may be replaced with columnData)
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Table = class Table extends Element {
    constructor(options = {}) {
        super(options, 'table');

        this.padding = options.padding || 5;

        this.width = options.width || 800;

        this.rowHeight = options.rowHeight || 30;
        this.textSize = this.rowHeight - 2 * this.padding;

        this.height = options.height || 300;
        this.maxRows = Math.floor(this.height / this.rowHeight);

        // this.colour = options.colour || 'lobbies';

        this.scrollbar = null;
        this.scrollbarWidth = options.scrollbarWidth || 0;
        if (this.scrollbarWidth > 0) {
            let options = {
                position: { x: this.width - this.scrollbarWidth, y: 0 },
                p5ui: this.p5ui,
                barWidth: this.scrollbarWidth
            };

            this.scrollbar = new P5UI.Scrollbar(this.height, this.maxRows, 'rows', 'displayStart', options);
            this.addChild(this.scrollbar);
        }

        this.columnWidths = options.columnWidths || [];
        this.columnTitles = options.columnTitles || [];
        this.columnData = options.columnData || [];

        if (this.columnData.length == 0) throw new Error('Table must have at least one column');

        if (this.columnWidths.length == 0) {
            let columnWidth = (this.width - this.scrollbarWidth) / this.columnData.length;
            for (let i = 0; i < this.columnData.length; i++) {
                this.columnWidths.push(columnWidth);
            }
        }

        this.width = this.scrollbarWidth;
        for (let i = 0; i < this.columnWidths.length; i++) {
            this.width += this.columnWidths[i];
        }

        this.onClick = options.onClick || (() => {});
        this.hasClick = true;
        if (options.onClick == undefined) {
            this.hasClick = false;
        }
        
        this.rows = [];

        this.displayStart = 0;
        this.hoveredRow = -1;
    }

    update() {
        if (this.hasClick) {
            let newHoveredRow = this.getHoveredRow();

            if (newHoveredRow != -1) {
                if (this.hoveredRow != newHoveredRow) {
                    this.p5ui.sounds.hover.play();
                }
            }

            this.hoveredRow = newHoveredRow;
        }
    }

    getCursorState() {
        if (this.hoveredRow != -1) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        this.clickedRow = this.hoveredRow;
    }

    mouseUp(e) {
        if (e.button != 0) return;
        if (this.hoveredRow == -1) return;
        if (this.hoveredRow == this.clickedRow) {
            this.onClick(this.rows[this.hoveredRow]);
            this.p5ui.sounds.click.play();
            return true;
        }
        return false;
    }

    addItem(item) {
        this.rows.push(item);
        if (this.scrollbar) this.scrollbar.calculateScrollbar();
    }

    clear() {
        this.rows = [];
        this.displayStart = 0;
        if (this.scrollbar) this.scrollbar.calculateScrollbar();
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > 0
            && mousePos.y > 0
            && mousePos.x < this.width
            && mousePos.y < this.height;
    }

    getHoveredRow(mousePos = this.mousePos) {
        if (mousePos.x < 0 || mousePos.x > this.width - this.scrollbarWidth || mousePos.y < 0 || mousePos.y > this.height) return -1;

        let rowsToDisplay = Math.min(this.rows.length, this.maxRows);
        let start = this.displayStart;
        if (start + rowsToDisplay > this.rows.length) start = 0;

        let hoveredRow = Math.floor(mousePos.y / this.rowHeight) + this.displayStart;
        if (hoveredRow >= this.rows.length) hoveredRow = -1;

        return hoveredRow;
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.hoveredRow = -1;
        }
    }

    show() {
        noStroke();
        textSize(this.textSize);

        // Header
        let headerColour = this.getColour('fill', 'header');
        if (headerColour != -1) {
            fill(headerColour);
            rect(this.width * 0.5, -this.rowHeight * 0.5, this.width, this.rowHeight);
        }

        textAlign(CENTER);
        fill(this.getColour('text', 'header'));

        let x = 0;
        for (let i = 0; i < this.columnData.length && i < this.columnTitles.length; i++) {
            let tx = x;
            if (i == 0) {
                textAlign(LEFT);
                tx += this.padding;
            } else {
                if (i == 1) textAlign(CENTER);
                tx += this.columnWidths[i] * 0.5
            }

            let t = this.columnTitles[i];
            if (textWidth(t) > this.columnWidths[i] - 2 * this.padding) {
                // TODO: Change this to work with non-monochromatic fonts
                let numChars = Math.floor((this.columnWidths[i] - 2 * this.padding) / textWidth(' ')) - 3;
                t = t.substring(0, numChars) + '...';
            }

            text(t, tx, -this.rowHeight * 0.5 + this.textSize / 3);

            x += this.columnWidths[i];
        }

        // Main
        let rowsToDisplay = Math.min(this.rows.length, this.maxRows);
        let start = this.displayStart;
        if (start + rowsToDisplay > this.rows.length) start = 0;

        let fillColour = this.getColour('fill');
        if (fillColour != -1) {
            fill(fillColour);
            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        let w = this.width - this.scrollbarWidth;
        let alternateColour = this.getColour('fill', 'alternate');
        if (alternateColour != -1 && alternateColour != fillColour) {
            fill(alternateColour);
            for (let i = 1 - this.displayStart % 2; i < this.maxRows; i += 2) {
                let y = i * this.rowHeight;
                rect(w * 0.5, y + this.rowHeight * 0.5, w, this.rowHeight);
            }
        }

        if (this.hoveredRow >= start && this.hoveredRow < start + rowsToDisplay) {
            let hoverColour = this.getColour('fill', 'hover');
            if (hoverColour != -1) {
                fill(hoverColour);
                rect(w * 0.5, this.rowHeight * (this.hoveredRow - this.displayStart) + this.rowHeight * 0.5, w, this.rowHeight);
            }
        }

        // Text
        let textColours = {
            default: this.getColour('text'),
            alternate: this.getColour('text', 'alternate'),
            hover: this.getColour('text', 'hover'),
        }
        let y = 0;
        for (let i = this.displayStart; i < this.displayStart + rowsToDisplay; i++) {
            if (i == this.hoveredRow && textColours.hover != -1) {
                fill(textColours.hover);
            } else if (i % 2 == 1 && textColours.alternate != -1) {
                fill(textColours.alternate);
            } else {
                fill(textColours.default);
            }

            let x = 0;
            for (let j = 0; j < this.columnData.length; j++) {
                let tx = x;
                if (j == 0) {
                    textAlign(LEFT);
                    tx += this.padding;
                } else {
                    if (j == 1) textAlign(CENTER);
                    tx += this.columnWidths[j] * 0.5
                }

                let t = this.rows[i][this.columnData[j]];
                if (t instanceof Function) t = t(this.rows[i]);
                if (textWidth(t) > this.columnWidths[j] - 2 * this.padding) {
                    let numChars = Math.floor((this.columnWidths[j] - 2 * this.padding) / textWidth(' ')) - 3;
                    t = t.substring(0, numChars) + '...';
                }

                text(t, tx, y + this.rowHeight * 0.5 + this.textSize / 3);

                x += this.columnWidths[j];
            }
            y += this.rowHeight;
        }
    }

    postShow() {
        let strokeColour = this.getColour('stroke');
        // Edges
        if (strokeColour != -1) {
            stroke(strokeColour);
            noFill();
            strokeWeight(1);

            let h = this.height + this.rowHeight;

            rect(this.width * 0.5, -this.rowHeight + h * 0.5, this.width, h)

            // for (let i = 0; i < this.maxRows; i++) {
            //     let y = i * this.rowHeight;
            //     line(0, y, this.totalWidth - 1, y);
            // }
        }
    }
}

export default P5UI.Table;