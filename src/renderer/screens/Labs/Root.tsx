import { Outlet, useParams } from 'react-router-dom';
import 'renderer/App.css';
import ScenarioList from './ScenarioList';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';

const Root = () => {
  const { labId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labId)!;

  return (
    <div className="flex h-full w-full">
      {!labs.isStarted && (
        <div className="w-64 mx-4">
          <ScenarioList lab={lab} />
        </div>
      )}
      <div className="flex-1 mx-4 overflow-scroll no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
