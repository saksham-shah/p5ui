class Screen extends Element {
    constructor(options) {
        super(options, 'screen');
    }

    isHovered() {
        return this.p5ui.cursor.isOnScreen();
    }
}