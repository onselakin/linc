import { Lab } from 'types/lab';
import { atom } from 'recoil';

interface Labs {
  all: Lab[];
  isInProgress: boolean;
  currentLabId: string;
  currentScenarioId: string;
  currentStepIdx: number;
}

const labs = atom<Labs>({
  key: 'labs',
  default: {
    all: [],
    isInProgress: false,
    currentLabId: '',
    currentScenarioId: '',
    currentStepIdx: 0,
  },
});

export default labs;
