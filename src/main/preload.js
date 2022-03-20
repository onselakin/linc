const { contextBridge, ipcRenderer } = require('electron');

const getTimeStamp = () => {
  const date = new Date();
  return [
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0'),
    date.getMilliseconds().toString().padStart(2, '0'),
  ].join(':');
};

contextBridge.exposeInMainWorld('electron', {
  ipc: {
    on(channel, handler) {
      ipcRenderer.on(channel, (_event, ...args) => {
        console.log(
          `%c[${getTimeStamp()} <- ${channel} %c(${args[0]})]: ${JSON.stringify(args[1])}`,
          'color:green; font-family: "Ubuntu Mono"; font-size: 14px',
          'color: yellow; font-family: "Ubuntu Mono";'
        );
        handler(args);
      });
    },
    send(channel, ...args) {
      console.log(
        `%c[${getTimeStamp()} -> ${channel} (${args[0]})]: %c${JSON.stringify(args[1])}`,
        'color:red; font-family: "Ubuntu Mono"; font-size: 14px',
        'color: yellow; font-family: "Ubuntu Mono";'
      );
      ipcRenderer.send(channel, args);
    },
  },
});
