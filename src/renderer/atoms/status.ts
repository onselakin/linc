import { Status } from 'types/status';
import { atom } from 'recoil';

const statusAtom = atom<Status>({
  key: 'statusAtom',
  default: {
    message: '',
  },
});

export default statusAtom;
