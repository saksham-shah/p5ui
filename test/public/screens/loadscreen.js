let sounds = {};
let filter;
const soundsToLoad = [
    {
        name: 'buttonhover',
        file: 'buttonhover.mp3'
    }, {
        name: 'buttonclick',
        file: 'buttonclick.wav'
    }, {
        name: 'music',
        file: 'jumpandshoot.mp3'
    }
];

const fontToLoad = '/assets/fonts/ShareTechMono-Regular.ttf';
let font = null;

const volumes = {
    buttonhover: 1,
    buttonclick: 0.3,
    music: 0.4
}

let soundsLoaded = 0;

function addLoadScreen() {
    let loading = false;

    function loadAssets() {
        loading = true;
        for (let soundToLoad of soundsToLoad) {
            loadSound('/assets/sounds/' + soundToLoad.file, soundLoaded);

            function soundLoaded(sound) {
                sound.setVolume(volumes[soundToLoad.name]);
                sounds[soundToLoad.name] = sound;
                soundsLoaded++;
            }
        }

        loadFont(fontToLoad, fontLoaded);

        function fontLoaded(loadedFont) {
            setFont(loadedFont);
            font = loadedFont;
        }
    }

    addScreen('loading', {
        update: () => {
            if (!loading) {
                if (!font) {
                    loadAssets();
                }
            } else {
                if ((soundsLoaded == soundsToLoad.length) && font) {
                    loading = false;
                    getElement('loading button start').hide(false);

                    setSounds({
                        click: sounds.buttonclick,
                        hover: sounds.buttonhover
                    });
                }
            }
        },
        getCursorState: state => {
            if (loading) return 'wait';
        },
        draw: () => {
            if (loading) {
                noStroke();
                fill(255);
        
                let numCircles = 2, r = 15, gap = 50;
                for (let i = -numCircles; i <= numCircles; i++) {
                    let size = 0.5 * (Math.sin(frameCount / 20 + i * Math.PI / (numCircles * 2 + 1)) + 1)
                    ellipse(450 - i * gap, 300, 2 * r * size);
                }
            }
        }
    })
    .addButton({
        position: { x: 450, y: 300 },
        text: 'START',
        width: 200,
        height: 100,
        textSize: 50,
        onClick: () => {
            setScreen('menu');
            filter = new p5.LowPass();
            filter.freq(400);
            sounds.music.disconnect();
            sounds.music.connect(filter);
            sounds.music.loop();
            // filter.toggle(false);
        },
        label: 'loading button start',
        tooltip: 'Click me to begin!',
        hidden: true
    });
}