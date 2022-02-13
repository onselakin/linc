const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(channel, handler) {
      console.log('Registering handler for channel: ', channel);
      ipcRenderer.on(channel, (_event, ...args) => {
        handler(args);
      });
    },
    send(channel, ...args) {
      console.log(`Sending ${args} over channel ${channel}`);
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
