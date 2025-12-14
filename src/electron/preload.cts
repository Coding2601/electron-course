const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
    getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
    subscribeStatics: (callback: (statistics: any) => void) => {
        callback({});
        electron.ipcRenderer.on('statistics', (_: Event, stats: any)=>{
            callback(stats);
        })
    }
});