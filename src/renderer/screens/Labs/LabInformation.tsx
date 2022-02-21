import 'renderer/App.css';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';

const LabInformation = () => {
  const { labId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.find(l => l.id === labId);

  return (
    <div>
      <h1>Lab: {lab?.title}</h1>
    </div>
  );
};
export default LabInformation;
