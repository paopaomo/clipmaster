const { app, Menu, Tray } = require('electron');
const path = require('path');

let tray = null;

const getIcon = () => {
    if(process.platform === 'win32') {
        return 'icon-light@2x.ico';
    }
    return 'icon-dark.png';
};

app.on('ready', () => {
    if(app.dock) {
        app.dock.hide();
    }

    tray = new Tray(path.join(__dirname, 'images', getIcon()));

    const menu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click() {
                app.quit();
            }
        }
    ]);

    if(process.platform === 'win32') {
        tray.on('click', tray.popUpContextMenu);
    }

    tray.setToolTip('Clipmaster');
    tray.setContextMenu(menu);
});
