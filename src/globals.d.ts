import { Settings } from 'types/settings';

declare global {
  interface Window {
    electron: {
      store: {
        settings: (value?: Settings) => Settings;
      };
    };
  }
}
