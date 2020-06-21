import P5UI from './main.js';

const globalFunctions = ['setupUI', 'addScreen', 'getScreen', 'setScreen', 'addOverlay', 'openOverlay', 'closeOverlay', 'getActiveScreen', 'addElement', 'getElement', 'updateUI', 'drawUI', 'setFont', 'setSounds', 'resizeUI', 'addTheme', 'setTheme'];

function createUI(options) {
    window.p5ui = new P5UI(options);

    addGlobalFunctions(window.p5ui);
}

function addGlobalFunctions(ui) {
    for (let func of globalFunctions) {
        window[func] = (...args) => ui[func](...args);
    }
}

export default createUI;