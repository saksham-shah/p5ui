/*
Options:
    - width (400)
    - height (25)
    - padding (5): text padding
    - colour ('default')

    - value (''): the starting value of the textbox
    - default (''): the text displayed when the textbox is unfocused and empty
    - maxLength (0): the maximum character limit of the textbox (0 means no limit)

    - onSubmit: callback when the Enter key is pressed
    - onFocus: callback when the textbox is focused
    - onBlur: callback when the textbox loses focus

    - clickToFocus (true): whether the textbox can be clicked to focus it
    - allowEmptySubmit (false): whether an empty value can be submitted
    - clearOnSubmit (true): whether the value should be cleared when the Enter key is pressed
    - blurOnSubmit (true): whether the textbox should lose focus when the Enter key is pressed
*/

import P5UI from '../core/main.js';
import Element from '../core/element.js';

P5UI.Textbox = class Textbox extends Element {
    constructor(options = {}) {
        super(options, 'textbox');

        this.padding = options.padding || 5;

        this.width = options.width || 400;
        this.textW = this.width - 2 * this.padding;

        this.height = options.height || 25;
        this.textSize = this.height - 2 * this.padding;

        this.onSubmit = options.onSubmit || (() => {});
        this.onFocus = options.onFocus || (() => {});
        this.onBlur = options.onBlur || (() => {});

        this.clickToFocus = options.clickToFocus == undefined ? true : options.clickToFocus;
        this.allowEmptySubmit = options.allowEmptySubmit == undefined ? false : options.allowEmptySubmit;        
        this.clearOnSubmit = options.clearOnSubmit == undefined ? true : options.clearOnSubmit;        
        this.blurOnSubmit = options.blurOnSubmit == undefined ? true : options.blurOnSubmit;        

        // this.colour = options.colour || 'default';

        this.default = options.default || '';
        this.value = options.value || '';
        this.maxLength = options.maxLength || 0;

        this.focused = false;
        this.timeSinceMoved = 0;
        this.cursorPos = this.value.length;

        this.visibleText = [0, this.value.length];
        this.visibleTextString = this.value;
        this.visibleTextWidth = 0;
        this.fixedLeft = true;

        this.selection = false;
        this.selectedText = [0, 0];
        this.selectionAnchor = 0;
        this.selectionStart = this.cursorPos;

        this.mousePressed = false;
        this.shiftPressed = false;

        this.keyQueue = [];
        this.pasting = false;
    }

    update() {
        if (!this.focused) return;
        this.timeSinceMoved ++;

        if (!this.pasting) {
            for (let e of this.keyQueue) {
                this.typeKey(e);
            }

            this.keyQueue = [];

            if (this.mousePressed) {
                let currentPos = this.clickPos(this.mousePos);
    
                if (!this.selection) {
                    if (currentPos != this.selectionAnchor) {
                        this.selection = true;
                        this.selectedText[0] = this.selectionAnchor;
                        this.selectedText[1] = currentPos;
                    }
                }
    
                this.moveCursor(currentPos - this.cursorPos, this.shiftPressed || this.selection);
            }
        }
    }

    getCursorState() {
        if (this.isHovered(this.mousePos) && (this.focused || this.clickToFocus)) return 'text';
    }

    mouseDown(e) {
        if (this.isHovered()) {
            if (this.clickToFocus && !this.focused) {
                this.focus();
                this.cursorPos = this.clickPos(this.mousePos);
                this.clipText();
                this.selection = false;
                this.selectionStart = this.cursorPos;
            }
        } else {
            if (this.focused) this.blur();
        }

        if (!this.focused) return;
        this.mousePressed = true;
        if (!this.shiftPressed) {
            this.selection = false;
            this.selectionAnchor = this.clickPos(this.mousePos);
            this.selectionStart = this.clickPos(this.mousePos);
        }
    }

    mouseUp(e) {
        this.mousePressed = false;
    }

    keyType(e) {
        if (!this.focused) return;
        this.keyQueue.push(e);
    }

    keyDown(e) {
        if (e.key == 'Shift') {
            this.shiftPressed = true;
        }
        this.mousePressed = false;
    }

    keyUp(e) {
        if (e.key == 'Shift') this.shiftPressed = false;
    }

    typeKey(e) {
        if (e.key == 'ArrowLeft') {
            if (e.ctrlKey) {
                let i = this.cursorPos;
                let wordStarted = false;
                let wordEnded = false;
                while (!wordEnded) {
                    if (i == 0) {
                        wordEnded = true;
                    } else if (!wordStarted) {
                        if (this.isLetter(i - 1)) wordStarted = true;
                    } else {
                        if (!this.isLetter(i - 1)) wordEnded = true;
                    }
                    i--;
                }
                this.moveCursor(i + 1 - this.cursorPos, e.shiftKey);
            } else {
                this.moveCursor(-1, e.shiftKey);
            }

        } else if (e.key == 'ArrowRight') {
            if (e.ctrlKey) {
                let i = this.cursorPos;
                let wordStarted = false;
                let wordEnded = false;
                let newWordStarted = false;
                while (!newWordStarted) {
                    if (i == this.value.length) {
                        newWordStarted = true;
                    } else if (!wordStarted) {
                        if (this.isLetter(i)) wordStarted = true;
                    } else if (!wordEnded) {
                        if (!this.isLetter(i)) wordEnded = true;
                    } else {
                        if (this.isLetter(i)) newWordStarted = true;
                    }
                    i++;
                }
                this.moveCursor(i - 1 - this.cursorPos, e.shiftKey);
            } else {
                this.moveCursor(1, e.shiftKey);
            }

        } else if (e.key == 'Backspace' && this.value.length > 0) {
            if (this.selectionStart != this.cursorPos) {
                this.removeSelected(false);
            } else if (this.cursorPos > 0) {
                this.value = this.value.substring(0, this.cursorPos - 1) + this.value.substring(this.cursorPos, this.value.length);
                this.cursorPos--;
                this.selectionStart = this.cursorPos;
                this.clipText(false);
            }

        } else if (e.key == 'Delete' && this.value.length > 0) {
            if (this.selectionStart != this.cursorPos) {
                this.removeSelected(true);
            } else if (this.cursorPos < this.value.length) {
                this.value = this.value.substring(0, this.cursorPos) + this.value.substring(this.cursorPos + 1, this.value.length);
                this.clipText(true);
            }

        } else if (e.key == 'Home') {
            this.moveCursor(-this.cursorPos, e.shiftKey);

        } else if (e.key == 'End') {
            this.moveCursor(this.value.length - this.cursorPos, e.shiftKey);

        } else if (e.key == 'Enter') {
            if (this.allowEmptySubmit || this.value.length > 0) this.onSubmit(this.value);

            if (this.clearOnSubmit) this.clear();
            if (this.blurOnSubmit) this.blur();

        } else if (e.key.length == 1) {
            if (!e.ctrlKey) {
                if (this.selectionStart != this.cursorPos) this.removeSelected();
                if (this.maxLength == 0 || this.value.length < this.maxLength) {
                    this.value = this.value.substring(0, this.cursorPos) + e.key + this.value.substring(this.cursorPos, this.value.length);
                    this.cursorPos++;
                    this.selectionStart = this.cursorPos;
                    this.clipText(true);
                }
            } else {
                if (e.key.toLowerCase() == 'a') {
                    this.selection = true;
                    this.cursorPos = this.value.length;
                    this.selectedText = [0, this.value.length];
                    this.selectionStart = 0;

                } else if (e.key.toLowerCase() == 'c') {
                    let textToCopy = this.value;
                    if (this.selectionStart != this.cursorPos) {
                        textToCopy = this.value.substring(this.selectionStart, this.cursorPos);
                    }
                    navigator.clipboard.writeText(textToCopy);

                } else if (e.key.toLowerCase() == 'v') {
                    if (this.selectionStart != this.cursorPos) this.removeSelected();
                    this.pasting = true;
                    navigator.clipboard.readText().then(copiedText => {
                        let textToPaste = '';
                        let maxPasteLength = this.maxLength - this.value.length;
                        for (let char of copiedText) {
                            if (this.maxLength > 0 && textToPaste.length >= maxPasteLength) continue;
                            if (char == '\n') {
                                textToPaste += ' ';
                            } else {
                                textToPaste += char;
                            }
                        }
                        this.value = this.value.substring(0, this.cursorPos) + textToPaste + this.value.substring(this.cursorPos, this.value.length);
                        this.cursorPos += textToPaste.length;
                        this.selectionStart = this.cursorPos;
                        this.clipText(true);
                        this.pasting = false;
                    });

                } else if (e.key.toLowerCase() == 'x') {
                    let textToCopy = this.value;
                    if (this.selectionStart != this.cursorPos) {
                        textToCopy = this.value.substring(this.selectionStart, this.cursorPos);
                        this.removeSelected(true);
                    } else {
                        this.value = '';
                        this.cursorPos = 0;
                        this.selectionStart = this.cursorPos;
                        this.clipText(true);
                    }
                    navigator.clipboard.writeText(textToCopy);
                }
            }
        }
    }

    moveCursor(offset, select) {
        this.cursorPos += offset;
        
        if (this.cursorPos < 0) {
            offset -= this.cursorPos;
            this.cursorPos = 0;
        } else if (this.cursorPos > this.value.length) {
            offset += this.value.length - this.cursorPos;
            this.cursorPos = this.value.length;
        }

        if (offset != 0) {
            this.timeSinceMoved = 0;
        }

        this.clipText();

        if (!this.mousePressed && !this.shiftPressed) {
            this.selectionStart = this.cursorPos;
        }

        if (select) {
            if (offset != 0) {
                if (this.selection) {
                    this.selectedText[1] = this.cursorPos;
                    if (this.selectedText[0] == this.selectedText[1]) {
                        this.selection = false;
                    }
                } else {
                    this.selection = true;
                    this.selectedText[0] = this.cursorPos - offset;
                    this.selectedText[1] = this.cursorPos;
                }
            }
        } else {
            this.selection = false;
        }
    }

    removeSelected(fixLeft) {
        this.selection = false;

        if (this.selectionStart < this.cursorPos) {
            this.value = this.value.substring(0, this.selectionStart) + this.value.substring(this.cursorPos, this.value.length);
            this.cursorPos -= this.cursorPos - this.selectionStart;
            this.clipText(fixLeft);
        } else {
            this.value = this.value.substring(0, this.cursorPos) + this.value.substring(this.selectionStart, this.value.length);
            this.clipText(fixLeft);
        }
        this.selectionStart = this.cursorPos;
    }

    tryClip(fixLeft) {
        let i, partialText = '', partialWidth = 0;
        this.fixedLeft = fixLeft;

        if (fixLeft) {
            i = this.visibleText[0];
            
            while (partialWidth <= this.textW && i < this.value.length) {
                partialText += this.value[i];
                partialWidth = textWidth(partialText);
                if (partialWidth <= this.textW) i++;
            }

            this.visibleText[1] = i;

            if (this.cursorPos > this.visibleText[1]) {
                this.visibleText[1] = this.cursorPos;
                this.tryClip(false);
            } else if (this.visibleText[0] != 0 && this.visibleText[1] == this.value.length) {
                this.tryClip(false);
            }

        } else {
            i = this.visibleText[1] - 1;

            while (partialWidth <= this.textW && i >= 0) {
                partialText = this.value[i] + partialText;
                partialWidth = textWidth(partialText);
                if (partialWidth <= this.textW) i--;
            }

            this.visibleText[0] = i + 1;

            if (this.cursorPos < this.visibleText[0]) {
                this.visibleText[0] = this.cursorPos;
                this.tryClip(true);

            } else if (this.visibleText[0] == 0) {
                this.tryClip(true);
            }
        }
    }

    clipText(fixLeft) {
        if (fixLeft != undefined) this.timeSinceMoved = 0;
        push();
        textSize(this.textSize);

        if (this.visibleText[1] > this.value.length) {
            this.visibleText[1] = this.value.length;
        }

        if (this.cursorPos > this.visibleText[1]) {
            this.visibleText[1] = this.cursorPos;
            this.tryClip(false);

        } else if (this.cursorPos < this.visibleText[0]) {
            this.visibleText[0] = this.cursorPos;
            this.tryClip(true);

        } else if (fixLeft != undefined) {
            this.tryClip(fixLeft);
        } else {
            this.tryClip(this.fixedLeft);
        }

        this.visibleTextString = this.value.substring(this.visibleText[0], this.visibleText[1]);
        this.visibleTextWidth = textWidth(this.visibleTextString);
        pop();
    }

    clickPos(mousePos) {
        let offsetX = mousePos.x - this.padding;
        if (!this.fixedLeft) offsetX += this.visibleTextWidth - this.textW;

        if (offsetX < 0) {
            if (this.visibleText[0] > 0 && frameCount % 5 == 0) return this.visibleText[0] - 1;
            return this.visibleText[0];

        } else if (offsetX < this.visibleTextWidth) {
            let i = this.visibleText[0];
            let partialText = '';
            let partialWidth = 0;

            push()
            textSize(this.textSize);

            while (partialWidth <= offsetX && i < this.visibleText[1]) {
                partialText += this.value[i];
                partialWidth = textWidth(partialText);
                if (partialWidth <= offsetX) i++;
            }

            pop();

            return i;

        } else {
            if (this.visibleText[1] < this.value.length && frameCount % 5 == 0) return this.visibleText[1] + 1;
            return this.visibleText[1];
        }
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > 0
            && mousePos.y > -this.height
            && mousePos.x < this.width
            && mousePos.y < 0
    }

    clear() {
        this.value = '';
        this.timeSinceMoved = 0;
        this.cursorPos = 0;
        this.selection = false;
        this.selectionStart = this.cursorPos;
        
        this.clipText();
    }

    focus() {
        this.focused = true;
        this.timeSinceMoved = 0;
        this.onFocus();
    }

    blur() {
        this.focused = false;
        this.shiftPressed = false;
        this.mousePressed = false;
        this.onBlur();
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.blur();
        }
    }

    show() {
        // Rectangle
        let fillColour = this.getColour('fill');
        if (fillColour != -1) {
            fill(fillColour);
        } else {
            noFill();
        }

        let strokeColour = this.getColour('stroke');
        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(1);
        } else {
            noStroke();
        }

        rect(this.width * 0.5, -this.height * 0.5, this.width, this.height);

        // Selection
        textSize(this.textSize);

        let selectionColour = this.getColour('selection');
        if (selectionColour != -1) {
            let leftEnd = this.selectionStart;
            let rightEnd = this.cursorPos;
            if (leftEnd > rightEnd) {
                let temp = leftEnd;
                leftEnd = rightEnd;
                rightEnd = temp;
            }
            if (this.selectionStart != this.cursorPos && (leftEnd < this.visibleText[1] && rightEnd > this.visibleText[0])) {
                let selectionStart = Math.max(leftEnd, this.visibleText[0]);
                let selectionEnd = Math.min(rightEnd, this.visibleText[1]);

                let wStart = this.padding;
                if (!this.fixedLeft) wStart += this.textW - this.visibleTextWidth;

                let wLeft = textWidth(this.value.substring(this.visibleText[0], selectionStart));
                let wRight = textWidth(this.value.substring(this.visibleText[0], selectionEnd));

                noStroke();
                fill(selectionColour);
                rect(wStart + (wLeft + wRight) * 0.5, -this.height * 0.5, wRight - wLeft, this.textSize)
            }
        }

        // Text
        textAlign(LEFT);
        noStroke();

        if (this.value.length > 0) {
            fill(this.getColour('text'));
            if (this.fixedLeft) {
                text(this.visibleTextString, this.padding, - 0.5 * this.height + this.textSize / 3);
            } else {
                text(this.visibleTextString, this.padding + this.textW - this.visibleTextWidth, - 0.5 * this.height + this.textSize / 3);
            }
        } else if (!this.focused) {
            let defaultColour = this.getColour('default');
            if (defaultColour != -1) {
                fill(defaultColour);
            } else {
                fill(this.getColour('text'));
            }
            text(this.default, this.padding, - 0.5 * this.height + this.textSize / 3);
        }

        // Cursor
        if (this.focused && this.cursorPos >= this.visibleText[0] && this.cursorPos <= this.visibleText[1] && this.timeSinceMoved % 60 < 30) {
            let w = this.padding + textWidth(this.value.substring(this.visibleText[0], this.cursorPos));
            if (!this.fixedLeft) w += this.textW - this.visibleTextWidth;

            stroke(this.getColour('text'));
            strokeWeight(2);
            line(w, -this.padding, w, -this.padding - this.textSize);
        }
    }

    isLetter(index) {
        let charCode = this.value[index].toLowerCase().charCodeAt()
        return charCode >= 97 && charCode <= 122;
    }
}

export default P5UI.Textbox;