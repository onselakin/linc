import { ActionRequest, ActionResponse } from 'ipc';

import { Settings } from 'types/settings';
import store from '../store';

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
    res: ActionResponse
  ) => {
    try {
      const currentSettings = store.get('settings');
      const merged = {
        ...currentSettings,
        ...req.payload.settings,
      };
      store.set('settings', merged);
      res.send();
    } catch (error) {
      res.error(error);
    }
  },
};

export default storeActions;
