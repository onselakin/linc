const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipc: {
    on(channel, handler) {
      ipcRenderer.on(channel, (_event, ...args) => {
        console.log(`[<- ${channel} (${args[0]})]: ${JSON.stringify(args[1])}`);
        handler(args);
      });
    },
    send(channel, ...args) {
      console.log(`[-> ${channel} (${args[0]})]: ${JSON.stringify(args[1])}`);
      ipcRenderer.send(channel, args);
    },
  },
});
