import { IpcRenderer } from 'electron';
import { Settings } from 'types/settings';

declare global {
  interface Window {
    electron: {
      ipcRenderer: IpcRenderer;
      store: {
        settings: (value?: Settings) => Settings;
      };
    };
  }
}
