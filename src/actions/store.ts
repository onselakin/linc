import { ActionRequest, ActionResponse } from 'ipc';

import { Settings } from 'types/settings';
import store from '../electron-store';

const storeActions = {
  'load-settings': async (
    _req: ActionRequest,
    res: ActionResponse<Settings>
  ) => {
    try {
      res.send(store.get('settings'));
    } catch (error) {
      res.error(error);
    }
  },
  'save-settings': async (
    req: ActionRequest<{ settings: Settings }>,
    res: ActionResponse<{ settings: Settings }>
  ) => {
    try {
      const currentSettings = store.get('settings');
      const merged = store.set('settings', {
        ...currentSettings,
        ...req.payload.settings,
      });
      res.send({ settings: merged });
    } catch (error) {
      res.error(error);
    }
  },
};

export default storeActions;
