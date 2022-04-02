import { Settings } from 'types/settings';
import { atom } from 'recoil';

const settingsAtom = atom<Settings>({
  key: 'settingsAtom',
  default: {
    labRepos: [],
    labKubeConfigs: [],
  },
});

export default settingsAtom;
