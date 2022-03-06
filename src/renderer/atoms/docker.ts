import { atom } from 'recoil';

const docker = atom<{ connected: boolean }>({
  key: 'dockerAtom',
  default: {
    connected: false,
  },
});

export default docker;
