import './App.css';

import Loader from './Loader';
import { RecoilRoot } from 'recoil';

const App = () => {
  return (
    <RecoilRoot>
      <Loader />
    </RecoilRoot>
  );
};
export default App;
