const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    settings(value) {
      const result = ipcRenderer.sendSync('store:settings', value);
      return result;
    },
  },
});
