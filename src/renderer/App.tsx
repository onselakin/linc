import './App.css';
import { MemoryRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import LabList from './screens/Labs/LabList';
import ScenarioList from './screens/Labs/ScenarioList';
import { RecoilRoot } from 'recoil';
import { SetupRendererProcessListener } from 'ipc';
import TopBar from './components/App/TopBar';
import SideBar from './components/App/SideBar';
import Status from './components/App/Status';

SetupRendererProcessListener();

const Layout = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <TopBar />
      <SideBar />
      <div className="absolute top-14 left-14 bottom-14 right-0 flex flex-col-3 flex-wrap content-start overflow-scroll no-scrollbar gap-5 border-2 border-yellow-500 bg-green-500">
        <Outlet />
      </div>
      <Status />
    </div>
  );
};

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/lab" element={<ScenarioList />} />
            <Route path="/" element={<LabList />} />
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  );
};
export default App;
