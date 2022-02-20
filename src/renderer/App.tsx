import './App.css';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import List from './screens/Labs/List';
import { RecoilRoot } from 'recoil';
import { SetupRendererProcessListener } from 'ipc';

SetupRendererProcessListener();

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<List />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};
export default App;
