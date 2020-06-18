/*
Options:
    - width (400): the width of the chatbox, including the scroll bar
    - height (250): the height of the whole chatbox
    - lineHeight (25): the height of each line of text
    - padding (5): text padding
    - colour ('lobby')

    - scrollBarWidth (0): The width of the scroll bar (0 means no scrolling)
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.ChatBox = class ChatBox extends Element {
    constructor(options = {}) {
        super(options, 'chatbox');

        this.padding = options.padding || 5;

        this.width = options.width || 400;

        this.lineHeight = options.lineHeight || 25;
        this.textSize = this.lineHeight - 2 * this.padding;

        this.height = options.height || 250;
        this.maxLines = Math.floor(this.height / this.lineHeight);
        
        // this.colour = options.colour || 'lobby';

        this.scrollBar = null;
        this.scrollBarWidth = options.scrollBarWidth || 0;
        if (this.scrollBarWidth > 0) {
            let options = {
                position: { x: this.width - this.scrollBarWidth, y: 0 },
                p5ui: this.p5ui,
                barWidth: this.scrollBarWidth,
                reverseScroll: true
            };

            this.scrollBar = new P5UI.ScrollBar(this.height, this.maxLines, 'lines', 'displayStart', options);
            this.addChild(this.scrollBar);
        }
        
        this.width -= this.scrollBarWidth;
        this.textW = this.width - 2 * this.padding;

        this.lines = [];

        this.displayStart = 0;
    }

    addText(txt, bold) {
        let textLines = wrapText(txt, this.textSize, this.textW);
        for (let line of textLines) {
            this.lines.unshift({ text: line, bold: bold });
        }
        if (this.scrollBar) this.scrollBar.scroll(-this.displayStart);
    }

    toggleScrollBar(bool) {
        if (!this.scrollBar) return;
        this.displayStart = 0;
        this.scrollBar.toggleScrollBar(bool);
        this.scrollBar.calculateScrollBar();
    }

    clear() {
        this.lines = [];
        this.displayStart = 0;
        if (this.scrollBar) this.scrollBar.calculateScrollBar();
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > 0
            && mousePos.y > -this.height
            && mousePos.x < this.width + (this.scrollBar ? this.scrollBar.barWidth : 0)
            && mousePos.y < 0;
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.hide(true);
        } else {
            this.hide(false);
        }
    }

    show() {
        let linesToDisplay = Math.min(this.lines.length, this.maxLines);
        let start = this.displayStart;
        if (start + linesToDisplay > this.lines.length) start = 0;

        let colour = {
            fill: {
                default: this.getColour('fill'),
                bold: this.getColour('fill', 'bold')
            },
            stroke: {
                default: this.getColour('stroke'),
                bold: this.getColour('stroke', 'bold')
            },
            text: {
                default: this.getColour('text'),
                bold: this.getColour('text', 'bold')
            }
        }

        textAlign(LEFT);
        textSize(this.textSize);

        for (let i = this.displayStart; i < this.displayStart + linesToDisplay; i++) {
            let line = this.lines[i];
            if (line.text == '') continue;
            push();
            translate(0, -this.lineHeight * (i - this.displayStart));

            // Rectangle
            let drawingRect = false;
            let fillColour, strokeColour;

            noFill();
            if (line.bold) {
                fillColour = colour.fill.bold;
            } else {
                fillColour = colour.fill.default;
            }

            if (fillColour != -1) {
                fill(fillColour);
                drawingRect = true;
            }

            noStroke();
            if (line.bold) {
                strokeColour = colour.stroke.bold;
            } else {
                strokeColour = colour.stroke.default;
            }

            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
                drawingRect = true;
            }

            if (drawingRect) {
                let thisLineWidth = textWidth(line.text) + 2 * this.padding;
                rect(thisLineWidth * 0.5, -this.lineHeight * 0.5, thisLineWidth, this.lineHeight);
            }

            // Text
            noStroke();

            if (line.bold) {
                fill(colour.text.bold);
            } else {
                fill(colour.text.default);
            }

            text(line.text, this.padding, - 0.5 * this.lineHeight + this.textSize / 3);

            pop();
        }
    }
}

function wrapText(txt, tSize, lineWidth) {
    push();
    textSize(tSize);
    let words = txt.split(' ');
    let line = '', lines = [], testLine = '', testWidth;
    while (words.length > 0) {
        let word = words.splice(0, 1)[0];
        testLine = line + word;
        if (words.length > 0) testLine += ' ';
        testWidth = textWidth(testLine);
        if (testWidth > lineWidth) {
            if (line == '') {
                let [wordToAdd, remainingWord] = resizeWord(word, lineWidth);
                lines.push(wordToAdd);
                if (remainingWord.length > 0) {
                    words.unshift(remainingWord);
                }
            } else {
                lines.push(line);
                line = '';
                words.unshift(word);
            }
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    pop();
    return lines;
}

function resizeWord(word, lineWidth) {
    if (textWidth(word) <= lineWidth) return [word, ''];

    let i = 0, partialWord = '';
    while (i < word.length && textWidth(partialWord + word[i]) <= lineWidth) {
        partialWord += word[i];
        i++;
    }

    return [partialWord, word.substring(i)];
}

export default P5UI.ChatBox;