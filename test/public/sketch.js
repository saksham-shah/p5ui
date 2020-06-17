const baseWidth = 900, baseHeight = 600, buffer = 0.9;

let p5input;

function setup() {
    createCanvas(windowWidth, windowHeight);

    createUI(baseWidth, baseHeight, buffer);

    addLoadScreen();
    addMenuScreen();
    addLobbyScreen();
    addPasswordOverlay();

    addStyles();

    setupUI();

    setScreen('loading');

    let p5text = text;
    let randomChars = 'qwertyuiop[]asdfghjkl;\'#zxcvbnm,./QWERTYUIOP{}ASDFGHJKL:@~ZXCVBNM<>?`1234567890-=¬!"£$%^&*()_+\\|';

    text = (t, x, y, noWild = false) => {
        
        if (!noWild) {
            let newT = '';
            for (let char of t) {
                if (char == '¦') {
                    newT += randomChars[Math.floor(Math.random() * randomChars.length)];
                } else {
                    newT += char;
                }
            }
            t = newT;
        }

        p5text(t, x, y);
    }
}

function draw() {
    updateUI();
    drawUI();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    resizeUI();
}