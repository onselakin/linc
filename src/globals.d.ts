import { Settings } from 'types/settings';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on: (channel: string, handler: ([actionId, res]: [actionId: string, res: unknown]) => void) => void;
        send: (channel: string, ...args: unknown[]) => void;
      };
      store: {
        settings: (value?: Settings) => Settings;
      };
    };
  }
}
