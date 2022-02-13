import './App.css';

import Loader from './Loader';
import { RecoilRoot } from 'recoil';
import { SetupRendererProcessListener } from 'ipc';

SetupRendererProcessListener();

const App = () => {
  return (
    <RecoilRoot>
      <Loader />
    </RecoilRoot>
  );
};
export default App;
