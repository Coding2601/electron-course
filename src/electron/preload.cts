const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
    getStaticData: () => ipcInvoke('getStaticData'),
    subscribeStatics: (callback) => {
        ipcOn('statistics', (stats)=>{
            callback(stats);
        })
    }
} satisfies Window['electron']);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]>{
    return electron.ipcRenderer.invoke(key);
};

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
){
    electron.ipcRenderer.on(key, (_, payload: EventPayloadMapping[Key]) => callback(payload));
};