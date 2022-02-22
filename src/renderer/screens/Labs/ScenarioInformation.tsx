import 'renderer/App.css';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';

const ScenarioInformation = () => {
  const { labId, scenarioId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.find(l => l.id === labId);
  const scenario = lab?.scenarios.find(s => s.id === scenarioId);

  return (
    <div>
      <h1>{scenario?.title}</h1>
      <Link to="run">Start Scenario</Link>
    </div>
  );
};
export default ScenarioInformation;
