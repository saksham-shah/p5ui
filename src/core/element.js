/*
Options:
    - label: if provided, the element can later be referenced using this label
    - hidden (false): whether the element starts off as hidden
    - tooltip: if provided, this tooltip will be displayed when the element is hovered over
        - String: the static string will be used as the tooltip
        - Function: the function will be called and if a value is returned, it will be used as the tooltip

    - text (''): the text displayed on the button
    - drawBox (true): Whether to draw the actual rectangle

    - onDisplay: callback when the overlay is displayed

    - callbacks
        - update(screen): Called every frame before the screen is drawn
        - draw(screen): Called before the UI elements are drawn
        - postDraw(screen): Called after the UI elements are drawn
        - changeScreen(leavingScreen, oldScreen, newScreen): Called when the screen changes
        - getCursorState(screen, state): Determines what the cursor should look like (called every frame)
*/

import P5UI from './main.js';

P5UI.Element = class Element {
    constructor(options = {}, type) {
        this.pos = options.position || { x: 0, y: 0 };
        this.p5ui = options.p5ui;
        this.type = type;

        this.hidden = options.hidden == undefined ? false : options.hidden;

        this.parent = null;
        this.children = [];

        this.styleName = options.style;

        this.mousePos = { x: 0, y: 0 };

        this.tooltip = options.tooltip == undefined ? null : options.tooltip;

        this.events = new Map();

        this.userDefinedEvents = {
            update: options.update,
            draw: options.draw,
            postDraw: options.postDraw,
            getCursorState: options.getCursorState,
            changeScreen: options.changeScreen
        }

        this.label = options.label;
    }

    emit(eventName, e) {
        if (this.hidden) return;

        for (let element of this.children) {
            element.emit(eventName, e);
        }

        if (this[eventName] != undefined) {
            this[eventName](e);
        }

        if (this.events.has(eventName)) {
            this.events.get(eventName)(e, this);
        }
    }

    on(eventName, callback) {
        this.events.set(eventName, callback);
        return this;
    }

    hide(hidden) {
        if (hidden != undefined) {
            this.hidden = hidden;
        } else {
            this.hidden = !this.hidden;
        }

        return this;
    }

    addChild(element) {
        this.children.push(element);
        element.parent = this;

        if (element.label != undefined) {
            this.p5ui.addElement(element, element.label)
        }
    }

    getElements() {
        return this.children;
    }

    getParent() {
        if (this.parent) return this.parent;
        return undefined;
    }

    // update
    _update(mousePos) {
        if (this.hidden) return;

        if (this.pos.x != 0 || this.pos.y != 0) {
            this.mousePos = {
                x: mousePos.x - this.pos.x,
                y: mousePos.y - this.pos.y
            }
        } else {
            this.mousePos = mousePos;
        }

        for (let element of this.children) {
            element._update(this.mousePos);
        }

        this.update(this.mousePos);

        if (this.userDefinedEvents.update != undefined) {
            this.userDefinedEvents.update();
        }
    }

    update() {}

    isHovered() { return false; }

    // cursor state
    _getCursorState() {
        if (this.hidden) return;
        let state;

        for (let element of this.children) {
            if (state == undefined) {
                state = element._getCursorState();
            }
        }

        if (this.userDefinedEvents.getCursorState != undefined) {
            let overriddenState = this.userDefinedEvents.getCursorState(state);
            if (overriddenState != undefined) return overriddenState;
        }

        let overriddenState = this.getCursorState(state);
        if (overriddenState != undefined) return overriddenState;
        return state;
    }

    getCursorState() {}

    _changeScreen(leavingScreen, oldScr, newScr) {
        for (let element of this.children) {
            element._changeScreen(leavingScreen, oldScr, newScr);
        }

        this.changeScreen(leavingScreen, oldScr, newScr);

        if (this.userDefinedEvents.changeScreen != undefined) {
            this.userDefinedEvents.changeScreen(leavingScreen, oldScr, newScr);
        }
    }

    changeScreen() {}

    // show
    _show() {
        if (this.hidden) return;
        push();
        if (this.pos.x != 0 || this.pos.y != 0) {
            translate(this.pos.x, this.pos.y);
        }

        this.show();

        if (this.userDefinedEvents.draw != undefined) {
            this.userDefinedEvents.draw();
        }

        for (let element of this.children) {
            element._show();
        }

        this.postShow();

        if (this.userDefinedEvents.postDraw != undefined) {
            this.userDefinedEvents.postDraw();
        }

        pop();
    }

    show() {}

    postShow() {}

    _setStyle(parentColour = 'default') {
        let styleName = this.styleName || parentColour;

        this.style = this.p5ui.getStyle(styleName, this.type);

        for (let element of this.children) {
            element._setStyle(styleName);
        }
    }

    getColour(key, modifier, allowDefault = true) {
        if (this.style == undefined) return -1;

        if (modifier != undefined) {
            if (this.style[modifier] != undefined && this.style[modifier][key] != undefined) {
                return this.style[modifier][key];
            }

            if (!allowDefault) return -1;
        }

        if (this.style[key] != undefined) return this.style[key];

        return -1;
    }

    getTooltip() {
        if (this.hidden) return '';

        for (let element of this.children) {
            let tt = element.getTooltip();
            if (tt.length > 0) return tt;
        }

        if (this.tooltip && this.showTooltip()) {
            let t = this.tooltip;
            if (t instanceof Function) t = t();

            if (t) return t;
        }

        return '';
    }

    showTooltip() { return this.isHovered(this.mousePos) }

    /**
     * @typedef {object} UIPosition
     * @property {number} x
     * @property {number} y
     */

    /**
     * Called when the button is clicked
     * @typedef {function(Button, *)} onClick
     * @callback onClick
     * @param {Button} clickedButton
     * @param {*} target The target passed via the options object
     */

    /**
     * Adds a button to the element
     * @param {UIPosition} pos The position of the centre of the button
     * @param {Object} [options] Options object
     * @param {number} [options.width=200] The width of the button
     * @param {number} [options.height=100] The height of the button
     * @param {string} [options.style=default] The style of the button
     * @param {string} [options.text] The text displayed on the button
     * @param {number} [options.textSize=50] The size of the button text
     * @param {onClick} [options.onClick] Called when the button is clicked
     */

    addButton(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.Button(options);
        this.addChild(element);
        return this;
    }

    addContainer(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.Container(options);
        this.addChild(element);
        return this;
    }

    addTextbox(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.TextBox(options);
        this.addChild(element);
        this.p5ui.textboxes.push(element);
        return this;
    }

    addChatbox(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.ChatBox(options);
        this.addChild(element);
        return this;
    }

    addTable(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.Table(options);
        this.addChild(element);
        return this;
    }

    addCheckbox(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.Checkbox(options);
        this.addChild(element);
        return this;
    }

    addSlider(options) {
        options.p5ui = this.p5ui;
        let element = new P5UI.Slider(options);
        this.addChild(element);
        return this;
    }
}

export default P5UI.Element;