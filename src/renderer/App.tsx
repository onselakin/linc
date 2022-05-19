import './App.css';
import '../../assets/fontawesome/css/all.css';
import '../../assets/highlight.css';
import '../../assets/xterm.css';
import { MemoryRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { InvokeChannel, SetupRendererProcessListener } from 'ipc';
import { useEffect } from 'react';
import { RecoilRoot, useRecoilState } from 'recoil';
import dockerAtom from './atoms/docker';
import LabList from './screens/Labs/LabList';
import TopBar from './components/App/TopBar';
import SideBar from './components/App/SideBar';
import Status from './components/App/Status';
import LabInformation from './screens/Labs/LabInformation';
import ScenarioInformation from './screens/Labs/ScenarioInformation';
import LabComplete from './screens/Labs/Complete';
import StepRunnerRouter from './screens/Labs/StepRunnerRouter';
import HelpIndex from './screens/Help/HelpIndex';

SetupRendererProcessListener();

const Layout = () => {
  const [dockerStatus, setDockerStatus] = useRecoilState(dockerAtom);

  useEffect(() => {
    const pingDocker = async () => {
      await InvokeChannel('docker:connect', undefined, ({ success }) => {
        setDockerStatus({ ...dockerStatus, connected: success });
      });
    };
    pingDocker();
  }, [setDockerStatus]);

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <TopBar />
      <SideBar />
      <div className="absolute top-12 left-14 bottom-10 right-0 overflow-hidden bg-component">
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
            <Route path="lab" element={<LabList />} />
            <Route path="lab/:labId" element={<LabInformation />} />
            <Route path="lab/:labId/complete" element={<LabComplete />} />
            <Route path="lab/:labId/scenario/:scenarioId" element={<ScenarioInformation />} />
            <Route path="lab/:labId/scenario/:scenarioId/step/:stepId" element={<StepRunnerRouter />} />
            <Route path="help" element={<HelpIndex />}>
              <Route path="item1" element={<div>Slug</div>} />
              <Route path="item2" element={<div>Slug 2</div>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  );
};
export default App;
