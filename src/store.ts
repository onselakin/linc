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
          url: 'https://github.com/onselakin/a-guided-tour-of-go/tree/main',
        },
      ],
    },
  },
});

store.clear();

export default store;
