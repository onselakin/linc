import { Outlet } from 'react-router-dom';
import 'renderer/App.css';
import ScenarioList from './ScenarioList';

const Root = () => {
  return (
    <div className="flex h-full w-full">
      <ScenarioList />
      <div className="w-full mx-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
