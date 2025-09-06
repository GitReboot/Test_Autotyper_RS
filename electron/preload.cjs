const { contextBridge, ipcRenderer, webFrame } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('window-minimize'),
    close: () => ipcRenderer.send('window-close'),
    hide: () => ipcRenderer.send('window-hide'),
    autotype: (text) => ipcRenderer.send('autotype', text),
    autotypeTogglePause: () => ipcRenderer.send('autotype-pause-toggle'),
    autotypePause: () => ipcRenderer.send('autotype-pause'),
    autotypeResume: () => ipcRenderer.send('autotype-resume'),

    getOpenApplications: () => ipcRenderer.invoke('get-open-applications'),
    getActiveWindow: () => ipcRenderer.invoke('get-active-window'),

    saveMessages: (title, messages) => ipcRenderer.invoke('save-messages', title, messages),
    deleteMessageList: (listTitle) => ipcRenderer.invoke('delete-message-list', listTitle),
    getMessageLists: () => ipcRenderer.invoke('get-message-lists'),
    getMinDelay: () => ipcRenderer.invoke('get-min-delay'),
    setMinDelay: (delay) => ipcRenderer.invoke('set-min-delay', delay),
    getMaxDelay: () => ipcRenderer.invoke('get-max-delay'),
    setMaxDelay: (delay) => ipcRenderer.invoke('set-max-delay', delay),
    disableZoom: () => {
        webFrame.setZoomLevel(0);
        webFrame.setVisualZoomLevelLimits(1, 1);
        webFrame.setLayoutZoomLevelLimits(0, 0);
    }
});

console.log('[preload] Preload script loaded!');