import { Lab } from 'types/lab';
import { atom, selector } from 'recoil';

interface Labs {
  all: Lab[];
  isInProgress: boolean;
  currentLabId: string;
  currentScenarioId: string;
  currentStepIdx: number;
}

const labsAtom = atom<Labs>({
  key: 'labsAtom',
  default: {
    all: [],
    isInProgress: false,
    currentLabId: '',
    currentScenarioId: '',
    currentStepIdx: 0,
  },
});

const currentLab = selector({
  key: 'currentLab',
  get: ({ get }) => {
    const labs = get(labsAtom);
    return labs.all.find(l => l.id === labs.currentLabId)!;
  },
});

const currentScenario = selector({
  key: 'currentScenario',
  get: ({ get }) => {
    const labs = get(labsAtom);
    const lab = get(currentLab);
    return lab.scenarios.find(s => s.id === labs.currentScenarioId)!;
  },
});

export { currentLab, currentScenario };
export default labsAtom;
