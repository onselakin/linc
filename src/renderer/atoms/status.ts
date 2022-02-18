import { Status } from 'types/status';
import { atom } from 'recoil';

const statusAtom = atom<Status>({
  key: 'statusState',
  default: {
    message: '',
  },
});

export default statusAtom;
