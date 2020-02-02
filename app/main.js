const { app, Menu, Tray, nativeTheme, clipboard } = require('electron');
const path = require('path');

let tray = null;
const clippings = [];

const getIcon = () => {
    if(process.platform === 'win32') {
        return 'icon-light@2x.ico';
    }
    if(nativeTheme.shouldUseDarkColors) {
        return 'icon-light.png';
    }
    return 'icon-dark.png';
};

const addClipping = () => {
  const clipping = clipboard.readText();
  if(clippings.includes(clipping)) {
      return;
  }
  clippings.unshift(clipping);
  updateMenu();
  return clipping;
};

const createClippingMenuItem = (clipping, index) => ({
    label: clipping.length > 20 ? clipping.slice(0, 20) + '...' : clipping,
    accelerator: `CommandOrControl+${index}`,
    click() {
        clipboard.writeText(clipping);
    }
});

const updateMenu = () => {
    const menu = Menu.buildFromTemplate([
        {
            label: 'Clip New Clipping',
            accelerator: 'Shift+CommandOrControl+C',
            click() {
                addClipping();
            }
        },
        {
            type: 'separator'
        },
        ...clippings.slice(0, 10).map(createClippingMenuItem),
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            accelerator: 'CommandOrControl+Q',
            click() {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(menu);
};

app.on('ready', () => {
    if(app.dock) {
        app.dock.hide();
    }

    tray = new Tray(path.join(__dirname, 'images', getIcon()));

    if(process.platform === 'win32') {
        tray.on('click', tray.popUpContextMenu);
    }

    tray.setToolTip('Clipmaster');
    updateMenu();
});
