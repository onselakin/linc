import { Lab } from 'types/lab';
import { atom, selector } from 'recoil';

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

const currentLab = selector({
  key: 'currentLab',
  get: ({ get }) => {
    const labsAtom = get(labs);
    return labsAtom.all.find(l => l.id === labsAtom.currentLabId)!;
  },
});

const currentScenario = selector({
  key: 'currentScenario',
  get: ({ get }) => {
    const labsAtom = get(labs);
    const lab = get(currentLab);
    return lab.scenarios.find(s => s.id === labsAtom.currentScenarioId)!;
  },
});

export { currentLab, currentScenario };
export default labs;
