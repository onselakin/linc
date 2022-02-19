import { Lab } from 'types/lab';
import { atom } from 'recoil';

const labsAtom = atom<Lab[]>({
  key: 'labsAtom',
  default: [],
});

export default labsAtom;
