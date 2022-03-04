import { Lab } from 'types/lab';
import { atom, selector } from 'recoil';

interface Labs {
  all: Lab[];
  isInProgress: boolean;
  currentLabId: string;
  currentScenarioId: string;
  currentStepId: string;
}

const labsAtom = atom<Labs>({
  key: 'labsAtom',
  default: {
    all: [],
    isInProgress: false,
    currentLabId: '',
    currentScenarioId: '',
    currentStepId: '',
  },
});

const currentLab = selector({
  key: 'currentLab',
  get: ({ get }) => {
    const labs = get(labsAtom);
    return labs.all.find(l => l.id === labs.currentLabId);
  },
});
export { currentLab };
export default labsAtom;
