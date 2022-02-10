import { Settings } from 'types/settings';
import { atom } from 'recoil';

const settingsState = atom<Settings>({
  key: 'settingsState',
  default: {
    courseRepos: [],
  },
});

export default settingsState;
