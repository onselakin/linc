import Lab from 'types/lab';
import { atom } from 'recoil';

interface Labs {
  all: Lab[];
  isInProgress: boolean;
  containerId: string;
}

const labs = atom<Labs>({
  key: 'labs',
  default: {
    all: [],
    isInProgress: false,
    containerId: '',
  },
});

export default labs;
