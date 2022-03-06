import { Status } from 'types/status';
import { atom } from 'recoil';

const statusAtom = atom<Status>({
  key: 'statusAtom',
  default: {
    icon: '',
    message: '',
    currentProgress: 0,
    totalProgress: 0,
  },
});

export default statusAtom;
