import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import { getStaticData, pollResources } from './resourceManager.js';

app.on('ready', ()=>{
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPreloadPath()
        }
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }
    pollResources(mainWindow);
    ipcMain.handle('getStaticData', ()=>{
        return getStaticData();
    });
});