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
      <hr />
      <div className="rounded bg-container p-2">Image Information</div>
    </div>
  );
};
export default LabInformation;
