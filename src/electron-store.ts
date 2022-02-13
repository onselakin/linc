import { Settings } from 'types/settings';
import Store from 'electron-store';

interface AppStore {
  settings: Settings;
}

const store = new Store<AppStore>({
  defaults: {
    settings: {
      courseRepos: ['https://github.com/sindresorhus/electron-store'],
    },
  },
});

export default store;
