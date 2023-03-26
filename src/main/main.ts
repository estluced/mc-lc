import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import { resolveHtmlPath } from './util';
import xmcl from './xmcl';

const store = new Store();

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 1000,
    minHeight: 600,
    maxWidth: 1000,
    maxHeight: 600,
    titleBarStyle: 'hidden',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
};

xmcl();

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    const win = await createWindow();
    ipcMain.on('app', (event, data) => {
      switch (data[0]) {
        case 'minimize':
          win?.minimize();
          break;
        case 'quit':
          app.quit();
          break;
        case 'openDevTools':
          win.webContents.openDevTools();
          break;
        case 'checkUpdate': {
          autoUpdater.checkForUpdates();
          autoUpdater.autoDownload = false;
          autoUpdater.on('update-available', () => {
            event.reply('app', ['updateAvailable']);
            autoUpdater
              .downloadUpdate()
              .then(() => {
                autoUpdater.quitAndInstall();
              })
              .catch(() =>
                event.reply('app', ['updateError', 'Download failed'])
              );
            autoUpdater.on('download-progress', (progressObj) => {
              event.reply('app', ['updateProgress', progressObj]);
            });
            autoUpdater.on('error', (err) => {
              event.reply('app', ['updateError', err]);
            });
          });
          autoUpdater.on('update-not-available', () => {
            event.reply('app', ['updateNotAvailable']);
          });
          autoUpdater.on('error', (err) => {
            event.reply('app', ['updateError', err]);
          });
          break;
        }
        default:
          break;
      }
    });
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
