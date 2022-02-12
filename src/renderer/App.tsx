import './App.css';

import Loader from './Loader';
import { RecoilRoot } from 'recoil';
import { SetupRendererProcessListener } from 'ipc';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    SetupRendererProcessListener(window.electron.ipcRenderer);
  }, []);

  return (
    <RecoilRoot>
      <Loader />
    </RecoilRoot>
  );
};
export default App;
