import { useRecoilValue } from 'recoil';
import { useCurrentLab } from 'renderer/hooks/useCurrent';
import progressAtom from 'renderer/atoms/progress';
import Markdown from 'renderer/components/Markdown';
import ScenarioList from './ScenarioList';
import { Link } from 'react-router-dom';

const LabComplete = () => {
  const lab = useCurrentLab();
  const labProgress = useRecoilValue(progressAtom);

  return (
    <div className="flex my-4">
      <div className="w-80">
        <ScenarioList lab={lab} progressRecords={labProgress} />
      </div>
      <div className="flex-1 mx-4">
        <div className="prose max-w-none">
          <Markdown markdown={lab.backMatter} assetRoot={lab.localPath} />
        </div>
        <div className="flex w-full mt-8">
          <Link to="/lab" className="w-1/2 h-16 text-left">
            <div className="rounded bg-container flex flex-row h-16 items-center pl-3 pr-4 border-2 border-orange text-orange">
              <div className="justify-self-end w-4">
                <i className="fa-solid fa-arrow-left" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-md">Return to Labs</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LabComplete;
