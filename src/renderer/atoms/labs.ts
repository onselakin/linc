import Lab from 'types/lab';
import { atom } from 'recoil';

interface Labs {
  all: Lab[];
}

const labs = atom<Labs>({
  key: 'labs',
  default: {
    all: [],
  },
});

export default labs;
