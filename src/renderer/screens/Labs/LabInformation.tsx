import 'renderer/App.css';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';
import Markdown from 'renderer/components/Markdown';

const LabInformation = () => {
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labs.currentLabId)!;

  return (
    <div className="prose max-w-none">
      <h1>{lab.title}</h1>
      <Markdown markdown={lab.cover} />
    </div>
  );
};
export default LabInformation;
