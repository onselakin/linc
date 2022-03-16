import AppStore from './types/store';
import Store from 'electron-store';

const store: Store<AppStore> = new Store<AppStore>({
  defaults: {
    settings: {
      labRepos: [
        {
          username: 'onselakin',
          password: '***REMOVED***',
          url: 'https://github.com/onselakin/a-guided-tour-of-go.git',
        },
      ],
    },
    progress: [],
  },
});

store.clear();

export default store;
