import { Bridge } from 'ipc/ipc-handler';
import { Settings } from 'types/settings';
import store from '../store';

const loadSettings: Bridge<never, Settings> = async (_payload, channel) => {
  try {
    channel.reply(store.get('settings'));
  } catch (error) {
    channel.error(error);
  }
};

const saveSettings: Bridge<Settings, void, unknown> = async (payload, channel) => {
  try {
    const currentSettings = store.get('settings');
    const merged = {
      ...currentSettings,
      ...payload,
    };
    store.set('settings', merged);
    channel.reply();
  } catch (error) {
    channel.error(error);
  }
};

export default {
  'load-settings': loadSettings,
  'save-settings': saveSettings,
};
