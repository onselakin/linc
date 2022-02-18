import { Settings } from 'types/settings';
import Store from 'electron-store';

interface AppStore {
  settings: Settings;
}

const store: Store<AppStore> = new Store<AppStore>({
  defaults: {
    settings: {
      labs: [
        {
          username: 'onselakin',
          password: '***REMOVED***',
          url: 'https://github.com/onselakin/rebase-test.git',
        },
        {
          username: 'onselakin',
          password: '***REMOVED***',
          url: 'https://github.com/onselakin/cypress-test.git',
        },
      ],
    },
  },
});

store.clear();

export default store;
