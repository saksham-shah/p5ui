import P5UI from './core/main.js';

// Core
import './core/element.js';
import './core/cursor.js';

// Elements
import './elements/button.js';
import './elements/chatbox.js';
import './elements/checkbox.js';
import './elements/closebutton.js';
import './elements/container.js';
import './elements/overlay.js';
import './elements/screen.js';
import './elements/scrollbar.js';
import './elements/slider.js';
import './elements/table.js';
import './elements/textbox.js';

import createUI from './core/init.js';

window.P5UI = P5UI;
window.createUI = createUI;