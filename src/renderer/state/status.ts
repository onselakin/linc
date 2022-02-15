import { Status } from 'types/status';
import { atom } from 'recoil';

const statusState = atom<Status>({
  key: 'statusState',
  default: {
    message: '',
  },
});

export default statusState;
