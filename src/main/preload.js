const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel, handler) {
      ipcRenderer.on(channel, (_event, ...args) => {
        handler(args);
      });
    },
    send(channel, ...args) {
      ipcRenderer.send(channel, args);
    },
  },
});
