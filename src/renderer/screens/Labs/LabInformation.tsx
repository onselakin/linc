import 'renderer/App.css';
import { useRecoilValue } from 'recoil';
import labsAtom from '../../atoms/labsAtom';
import Markdown from 'renderer/components/Markdown';

const LabInformation = () => {
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labs.currentLabId)!;
  const showImageInformation = false;

  return (
    <div className="prose max-w-none">
      <h1>{lab.title}</h1>
      <Markdown markdown={lab.cover} />
      {showImageInformation && (
        <>
          <hr />
          <div className="flex flex-row gap-2">
            <div className="w-1/2 flex flex-col">
              <div className="rounded bg-container p-2">Image Information</div>
              <div className="flex flex-row m-1">
                <div className="font-bold w-36">Name</div>
                <div>grid-drone-builder:latest</div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="rounded bg-container p-2">Image Inspection</div>
              <div className="flex flex-row m-1">
                <div className="w-12">0</div>
                <div className="flex-1">0</div>
                <div className="w12">47 MB</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default LabInformation;
