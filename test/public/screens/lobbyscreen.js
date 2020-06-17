function addLobbyScreen() {
    
    
    addScreen('lobbies')
    .addButton({
        position: { x: 175, y: 440 },
        width: 250,
        height: 40,
        text: 'Create lobby',
        textSize: 30,
        onClick: () => setScreen('game')
    })
    .addButton({
        position: { x: 725, y: 440 },
        width: 250,
        height: 40,
        text: 'Join private',
        textSize: 30,
        onClick: () => setScreen('game')
    })
    .addTable({
        position: { x: 50, y: 100 },
        width: 810,
        height: 300,
        rowHeight: 30,
        scrollBarWidth: 10,
        columnWidths: [350, 100, 250, 100],
        columnTitles: ['Name', 'Players', 'Mode', 'Password'],
        columnData: ['name', 'players', 'mode', 'password'],
        onClick: obj => openOverlay('password', obj.name),
        label: 'lobby table'
    });

    let lobbyTable = getElement('lobby table');

    let maxPlayersPoss = [2, 2, 4, 4, 6, 8, 8, 8, 8, 16];

        for (let i = 0; i < 20; i++) {
            let thisMax = maxPlayersPoss[Math.floor(Math.random() * maxPlayersPoss.length)];
            let lobby = {
                name: 'Public '+(i+1),
                maxPlayers: thisMax,
                players: Math.ceil(Math.random() * thisMax),
                experimental: Math.random() > 0.5,
                password: Math.random() > 0.75 ? 'password' : ''
            }

            lobbyTable.addItem({
                name: lobby.name,
                players: `${lobby.players}/${lobby.maxPlayers}`,
                mode: lobby.experimental ? 'Experimental' : 'Classic',
                password: lobby.password.length > 0 ? 'Yes' : 'No'
            });

        }
}