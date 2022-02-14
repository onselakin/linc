import './App.css';

import Home from './Home';
import { RecoilRoot } from 'recoil';
import { SetupRendererProcessListener } from 'ipc';

SetupRendererProcessListener();

const App = () => {
  return (
    <RecoilRoot>
      <Home />
    </RecoilRoot>
  );
};
export default App;
