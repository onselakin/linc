import 'renderer/App.css';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from 'renderer/atoms/labsAtom';
import { useEffect } from 'react';

const LabInformation = () => {
  const { labId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.find(l => l.id === labId);

  useEffect(() => {});

  return (
    <div>
      <h1>Scenarios</h1>
      <ul>
        {lab?.scenarios.map(scenario => (
          <Link to={`/lab/scenario/${scenario.id}`}>{scenario.title}</Link>
        ))}
      </ul>
    </div>
  );
};

export default LabInformation;
