import { Status } from 'types/status';
import { atom } from 'recoil';

const statusAtom = atom<Status>({
  key: 'settingsAtom',
  default: {
    message: '',
  },
});

export default statusAtom;
