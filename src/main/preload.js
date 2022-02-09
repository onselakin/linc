const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    settings(value) {
      console.log('settings called.');
      const result = ipcRenderer.sendSync('store:settings', value);
      console.log(result);
      return result;
    },
  },
});
