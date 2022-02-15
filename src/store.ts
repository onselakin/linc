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
          url: 'https://github.com/onselakin/k8s-lab.git',
        },
      ],
    },
  },
});

store.clear();

export default store;
