import { atom } from 'recoil';

const terminalSize = atom<{ targetWidth: number }>({
  key: 'terminalSize',
  default: {
    targetWidth: 500,
  },
});

export default terminalSize;
