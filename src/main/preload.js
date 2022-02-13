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
  store: {
    settings(value) {
      const result = ipcRenderer.sendSync('store:settings', value);
      return result;
    },
  },
});
