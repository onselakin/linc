import './App.css';
import '../../assets/fontawesome/css/all.css';
import { MemoryRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { InvokeChannel, SetupRendererProcessListener } from 'ipc';
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import dockerAtom from './atoms/docker';
import LabList from './screens/Labs/LabList';
import TopBar from './components/App/TopBar';
import SideBar from './components/App/SideBar';
import Status from './components/App/Status';
import LabInformation from './screens/Labs/LabInformation';
import ScenarioInformation from './screens/Labs/ScenarioInformation';
import StepRunner from './screens/Labs/StepRunner';

SetupRendererProcessListener();

const Layout = () => {
  const setDockerStatus = useSetRecoilState(dockerAtom);

  useEffect(() => {
    const pingDocker = async () => {
      await InvokeChannel('docker:connect', undefined, ({ success }) => {
        setDockerStatus({ connected: success });
      });
    };

    pingDocker();
  }, []);

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
            <Route path="lab/:labId/scenario/:scenarioId" element={<ScenarioInformation />} />
            <Route path="lab/:labId/scenario/:scenarioId/step/:stepId" element={<StepRunner />} />
          </Route>
        </Routes>
      </Router>
    </RecoilRoot>
  );
};
export default App;
