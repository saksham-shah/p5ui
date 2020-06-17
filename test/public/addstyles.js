function addStyles() {
    addTheme('default', {
        button: {
            default: {
                fill: 75,
                stroke: 45,
                text: 255,
                hover: {
                    fill: 100
                }
            }
        },
        chatbox: {
            chatbox: {
                // fill: -1,
                // stroke: -1,
                text: 175,
                bold: {
                    text: 255
                }
            }
        },
        closebutton: {
            default: {
                fill: 75,
                cross: 200,
                stroke: 45,
                hover: {
                    fill: 200,
                    cross: 75
                }
            }
        },
        container: {
            default: {
                fill: [0, 25],
                stroke: [0, 50],
                header: [0, 75],
                text: 255
            }
        },
        overlay: {
            default: {
                fill: 150,
                stroke: 200,
                header: 50,
                text: 255,
                background: [0, 150]
            }
        },
        screen: {
            default: {
                background: 50,
                outer: 60,
                stroke: 200,
                tooltip: {
                    fill: 200,
                    stroke: 50,
                    text: 20
                }
            }
        },
        scrollbar: {
            default: {
                fill: 100,
                // stroke: -1,
                hover: {
                    fill: 80
                }
            },
            chatbox: {
                fill: [0, 30],
                // stroke: -1,
                hover: {
                    fill: [0, 50]
                }
            }
        },
        table: {
            default: {
                fill: 200,
                stroke: 20,
                text: 20,
                header: {
                    fill: 100,
                    text: 255
                },
                hover: {
                    fill: 150,
                    text: 255
                },
                alternate: {
                    fill: 180
                }
            }
        },
        textbox: {
            default: {
                fill: 220,
                // stroke: -1,
                text: 0,
                selection: 150,
                default: 100
            },
            game: {
                fill: [0, 50],
                text: 255,
                // stroke: -1,
                selection: [200, 50],
                default: 100
            }
        }
    }, true);
}