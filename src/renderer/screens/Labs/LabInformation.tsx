import 'renderer/App.css';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';
import Markdown from 'renderer/components/Scenario/Markdown';

const LabInformation = () => {
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labs.currentLabId)!;

  return (
    <div className="mt-4 prose max-w-none">
      <h1>{lab.title}</h1>
      <Markdown markdown={lab.cover} />
    </div>
  );
};
export default LabInformation;
