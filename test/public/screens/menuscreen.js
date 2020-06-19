function addMenuScreen() {
    const SERVER = '_server';

    function chatMessage(message, sender) {
        let chatTxt = message;
        let bold = true;
        if (sender != SERVER) {
            chatTxt = sender + ': ' + chatTxt;
            bold = false;
        }
        getElement('lobby chat output').addText(chatTxt, bold);
    }

    addScreen('menu', {
        changeScreen: (leavingScreen, oldScr, newScr) => {
            if (leavingScreen) {
                console.log('leaving screen');
            } else {
                console.log('entering screen');
            }
        },
        tooltip: '¦¦¦¦¦'
    })
    .on('keyDown', e => {
        if (e.key == 'Enter') {
            getElement('lobby chat input').focus();
        }
    })
    .addContainer({
        position: { x: 20, y: 335 },
        width: 300,
        height: 245,
        text: 'Chat',
        header: 25,
        label: 'lobby chat container',
        tooltip: 'Talk to the other players in this lobby!'
    })
    .addButton({
        position: { x: 450, y: 300 },
        text: 'PLAY',
        onClick: b => {
            b.hide();

            setTimeout(() => b.hide(), 1000);
        }
    })
    .addButton({
        position: { x: 700, y: 500 },
        text: 'LOBBIES',
        onClick: () => setScreen('lobbies')
    })
    .addTextbox({
        position: { x: 600, y: 100 },
        width: 200,
        height: 30,
        value: 'Good UI',
        maxLength: 0,
        label: 'other textbox'
    })
    .addSlider({
        position: { x: 600, y: 150 },
        max: 2,
        value: 1,
        increment: 0.02,
        // onMove: console.log,
        onRelease: v => {
            for (let soundName in sounds) {
                if (soundName != 'music') {
                    sounds[soundName].setVolume(v * volumes[soundName]);
                }
            }
            sounds.buttonclick.play();
        }
    })
    .addSlider({
        position: { x: 200, y: 150 },
        max: 2,
        value: 1,
        increment: 0.02,
        onMove: v => sounds.music.setVolume(v * volumes.music)
    });

    getElement('lobby chat container')
    .addTextbox({
        position: { x: 0, y: 245 },
        width: 300,
        height: 25,
        default: 'Press enter to send a message',
        onSubmit: txt => {
            console.log(txt);
            chatMessage(txt, 'The Creator');
        },
        clickToFocus: false,
        maxLength: 100,
        style: 'game',
        label: 'lobby chat input',
        tooltip: () => {
            if (!getElement('lobby chat input').focused) return 'Press enter to start typing';
            return null;
        }
    })
    .addChatbox({
        position: { x: 0, y: 220 },
        width: 300,
        height: 220,
        lineHeight: 22,
        style: 'chatbox',
        scrollBarWidth: 10,
        label: 'lobby chat output'
    });
}