import './App.css';
import { MemoryRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import LabList from './screens/Labs/LabList';
import Root from './screens/Labs/Root';
import { RecoilRoot } from 'recoil';
import { SetupRendererProcessListener } from 'ipc';
import TopBar from './components/App/TopBar';
import SideBar from './components/App/SideBar';
import Status from './components/App/Status';
import LabInformation from './screens/Labs/LabInformation';
import ScenarioInformation from './screens/Labs/ScenarioInformation';
import ScenarioRunner from './screens/Labs/ScenarioRunner';

SetupRendererProcessListener();

const Layout = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <TopBar />
      <SideBar />
      <div className="absolute top-14 left-14 bottom-14 right-0 flex flex-col-3 flex-wrap content-start overflow-scroll no-scrollbar gap-5 bg-gray-400">
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
          <Route path="/" element={<Layout />}>
            <Route path="labs" element={<LabList />} />
            <Route path="lab/:labId" element={<Root />}>
              <Route path="info" element={<LabInformation />} />
              <Route path="scenario/:scenarioId" element={<ScenarioInformation />} />
              <Route path="scenario/:scenarioId/run" element={<ScenarioRunner />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  );
};
export default App;
