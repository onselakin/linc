import 'renderer/App.css';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';

const ScenarioList = () => {
  const { labId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.find(l => l.id === labId);

  return (
    <div className="w-96 h-full border-r-2 border-gray-500">
      <h2>Scenarios in the lab:</h2>
      <ul>
        {lab?.scenarios.map(scenario => (
          <Link to={`/lab/${labId}/scenario/${scenario.id}`}>{scenario.title}</Link>
        ))}
      </ul>
    </div>
  );
};
export default ScenarioList;
