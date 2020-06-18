/*
Options:
    - width (900)
    - height (600)
    - buffer (0.9): the maximum proportion of the width and height of the screen that can be taken up by the UI
    NOTE: the width and height are NOT pixel values.
    They are just reference values to allow you to size all of the elements appropriately.
    It is recommended to use values with many factors so you can easily divide the screen as needed.

    - overlayHeader(30): the height of the header bar in overlays
    - overlayPadding (5): the padding of the header bar in overlays

    - tooltipHeight (25): the height of tooltips
    - tooltipPadding (5): the padding of tooltip text
*/

class P5UI {
    constructor(options) {
        this.screenPosition = {
            x: 0,
            y: 0,
            z: 1
        }

        this.width = options.width || 900;
        this.height = options.height || 600;
        this.buffer = options.buffer || 0.9;

        this.overlayHeader = options.overlayHeader || 30;
        this.overlayPadding = options.overlayPadding || 5;

        this.tooltipHeight = options.tooltipHeight || 25;
        this.tooltipPadding = options.tooltipPadding || 5;
        this.tooltipTextSize = this.tooltipHeight - 2 * this.tooltipPadding;

        this.screen = null;
        this.overlays = [];

        this.screens = new Map();

        this.labelledElements = new Map();

        this.textboxes = [];

        this.themes = new Map();
        this.theme = 'default';
    }

    setupUI() {
        rectMode(CENTER);

        this.resizeUI();

        this.setTheme('default');

        this.cursor = new P5UI.Cursor(this);
        this.cursors = {};

        let self = this;

        document.addEventListener('keydown', e => {
            if (e.key == 'Tab' || e.key == 'Alt') e.preventDefault();
            self.getActiveScreen().emit('keyType', e);
            self.cursor.showTooltip = false;
        });
    
        canvas.addEventListener('wheel', e => {
            self.getActiveScreen().emit('mouseWheel', e);
            self.cursor.showTooltip = false;
        });

        window.mousePressed = e => {
            self.getActiveScreen().emit('mouseDown', e);
            self.cursor.showTooltip = false;
            return false;
        }
        
        window.mouseReleased = e => {
            self.getActiveScreen().emit('mouseUp', e);
            return false;
        }
        
        window.keyPressed = e => {
            self.getActiveScreen().emit('keyDown', e);
            self.cursor.showTooltip = false;
        }
        
        window.keyReleased = e => {
            self.getActiveScreen().emit('keyUp', e);
        }
    }

    addScreen(screenName, options = {}) {
        options.p5ui = this;
        let scr = new P5UI.Screen(options);
        this.screens.set(screenName, scr);
        return scr;
    }

    addOverlay(overlayName, options = {}) {
        options.p5ui = this;
        let overlay = new P5UI.Overlay(options);
        this.screens.set(overlayName, overlay);
        return overlay;
    }

    getScreen(screenName) {
        return this.screens.get(screenName);
    }

    setScreen(screenName) {
        let oldScr = this.screen;
        let newScr = this.getScreen(screenName);
        if (newScr == undefined) {
            console.warn(` Failed to change screen - '${screenName}' does not exist.`)
            return;
        }

        this.screen = newScr;

        if (oldScr != null) {
            oldScr._changeScreen(true, oldScr, newScr);
        }

        newScr._changeScreen(false, oldScr, newScr);
        return newScr;
    }

    openOverlay(overlayName, ...args) {
        let o = this.getScreen(overlayName);
        if (o == undefined) {
            console.warn(` Failed to open overlay - '${overlayName}' does not exist.`)
            return;
        }

        this.overlays.push(o);
        o.onDisplay(...args);
        this.screen._changeScreen(true, this.screen, o);
        o._changeScreen(false, this.screen, o);
    }

    closeOverlay() {
        if (this.overlays.length > 0) {
            let o = this.overlays.pop();
            let newScr = this.getActiveScreen();
    
            o._changeScreen(true, o, newScr);
            newScr._changeScreen(false, o, newScr);
        }
    }

    getActiveScreen() {
        if (this.overlays.length == 0) return this.screen;
        return this.overlays[this.overlays.length - 1];
    }

    addElement(element, label) {
        this.labelledElements.set(label, element);
    }

    getElement(label) {
        return this.labelledElements.get(label);
    }

    setFont(font) {
        textFont(font);

        for (let t of this.textboxes) {
            t.clipText();
        }
    }

    // questionable, need to check to see if this needs to change
    updateUI() {
        this.cursor.update();
        let activeScreen = this.getActiveScreen();
        activeScreen._update(this.cursor.mousePos);
        this.cursor.setMode(activeScreen._getCursorState());
    }

    drawUI() {
        let backgroundColour = this.screen.getColour('background');
        if (backgroundColour != -1) {
            background(backgroundColour);
        } else {
            clear();
        }
        push();
        translate(this.screenPosition.x, this.screenPosition.y);
        scale(this.screenPosition.z);

        // Draw all the stuff
        this.screen._show();

        if (this.overlays.length > 0) {
            noStroke();
            let overlay = this.overlays[this.overlays.length - 1];

            let backgroundColour = overlay.getColour('background')
            if (backgroundColour != -1) {
                fill(backgroundColour);
                rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
            }

            overlay._show();
        }

        let strokeColour = this.screen.getColour('stroke');
        if (strokeColour != -1) {
            noFill();
            stroke(strokeColour);
            strokeWeight(4);
            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        pop();

        let outerColour = this.screen.getColour('outer');
        if (outerColour != -1) {
            fill(outerColour);
            noStroke();
            rect(width * 0.5, this.screenPosition.y * 0.5, width, this.screenPosition.y);
            rect(width * 0.5, height - this.screenPosition.y * 0.5, width, this.screenPosition.y);
            rect(this.screenPosition.x * 0.5, height * 0.5, this.screenPosition.x, height);
            rect(width - this.screenPosition.x * 0.5, height * 0.5, this.screenPosition.x, height);
        }

        if (this.cursor.timeSinceMovement > 30) {
            let tooltip = this.getActiveScreen().getTooltip();
            if (tooltip.length > 0) {
                this.drawTooltip(tooltip);
            }
        }
    }

    drawTooltip(t) {
        push();

        translate(mouseX + 10, mouseY + 10);
        scale(this.screenPosition.z);

        // Rectangle
        let drawingRect = false;
        noFill();
        let fillColour = this.screen.getColour('fill', 'tooltip', false);
        if (fillColour != -1) {
            fill(fillColour);
            drawingRect = true;
        }

        noStroke();
        let strokeColour = this.screen.getColour('stroke', 'tooltip', false);
        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(1);
            drawingRect = true;
        }

        textSize(this.tooltipTextSize);
        if (drawingRect) {
            let rectWidth = textWidth(t) + 2 * this.tooltipPadding;
            let rectHeight = this.tooltipTextSize + 2 * this.tooltipPadding
            rect(rectWidth * 0.5, rectHeight * 0.5, rectWidth, rectHeight);
        }

        textAlign(LEFT);
        noStroke();
        fill(this.screen.getColour('text', 'tooltip', false));

        text(t, this.tooltipPadding, this.tooltipPadding + this.tooltipTextSize * 5 / 6);

        pop();
    }

    resizeUI() {
        let screenRatio = width / height;
        let desiredRatio = this.width / this.height;

        // The screen is wider than required
        if (screenRatio > desiredRatio) {
            this.screenPosition.z = height / this.height * this.buffer;
        } else {
            this.screenPosition.z = width / this.width * buffer;
        }

        this.screenPosition.x = 0.5 * (width - this.width * this.screenPosition.z);
        this.screenPosition.y = 0.5 * (height - this.height * this.screenPosition.z);
    }

    setCursors(cursors) {
        this.cursors = cursors;
    }

    addTheme(name, styles, setTheme = false) {
        this.themes.set(name, styles);
        if (setTheme) this.setTheme(name);
    }

    setTheme(name) {
        this.theme = name;
        this.resetStyles();
    }

    resetStyles() {
        for (let scr of this.screens.values()) {
            scr._setStyle();
        }
    }

    getStyle(style, type) {
        let styles = this.themes.get(this.theme);
        if (styles == undefined) return;
        if (styles[type] != undefined) {
            if (styles[type][style] != undefined) return styles[type][style];
            console.warn(`Failed to get style - style '${style}' does not exist for ${type} element.`);
        }
    }
}

export default P5UI;