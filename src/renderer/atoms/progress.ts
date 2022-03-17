import ProgressRecord from 'types/progressRecord';
import { atom } from 'recoil';

const progressAtom = atom<ProgressRecord[]>({
  key: 'progressAtom',
  default: [],
});

export default progressAtom;
