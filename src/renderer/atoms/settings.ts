import { Settings } from 'types/settings';
import { atom } from 'recoil';

const settingsAtom = atom<Settings>({
  key: 'settingsState',
  default: {
    labs: [],
  },
});

export default settingsAtom;
