import AppStore from './types/store';
import Store from 'electron-store';

const store: Store<AppStore> = new Store<AppStore>({
  defaults: {
    settings: {
      labRepos: [
        {
          url: 'https://github.com/onselakin/linc-guide.git',
        },
        {
          url: 'https://github.com/onselakin/a-guided-tour-of-go.git',
        },
        {
          url: 'https://github.com/onselakin/basic-k8s.git',
        },
      ],
      labKubeConfigs: {},
    },
    progressRecords: [],
  },
});

store.clear();

export default store;
