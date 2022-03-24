import Markdown from 'renderer/components/Markdown';
import AuthorBio from './AuthorBio';
import Syllabus from './Syllabus';
import { useCurrentLab } from 'renderer/hooks/useCurrent';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { Status } from 'types/status';
import { InvokeChannel } from 'ipc';
import dockerAtom from 'renderer/atoms/docker';
import statusAtom from 'renderer/atoms/status';
import ImageInfo, { ImageHistory } from './ImageInfo';
import progressAtom from '../../atoms/progress';

const sectionButton = ({ title, active, onClick }: { title: string; active: boolean; onClick: () => void }) => (
  <button type="button" className={`text-orange ${active && 'underline'} mr-4`} onClick={onClick}>
    {title}
  </button>
);

const LabButton = ({
  needsImagePull,
  dockerConnected,
  pullInProgress,
  onClick,
  alreadyStarted,
}: {
  needsImagePull: boolean;
  dockerConnected: boolean;
  pullInProgress: boolean;
  onClick: () => void;
  alreadyStarted: boolean;
}) => {
  return (
    <>
      {!needsImagePull && dockerConnected && (
        <button
          type="button"
          className="mt-auto rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline text-center w-72 h-10"
          onClick={onClick}
        >
          {alreadyStarted ? 'CONTINUE LAB' : 'START LAB'}
        </button>
      )}
      {needsImagePull && dockerConnected && (
        <button
          type="button"
          disabled={pullInProgress}
          className="mt-auto rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline text-center w-72 h-10"
          onClick={onClick}
        >
          {pullInProgress ? 'PULLING IMAGE' : 'PULL LAB IMAGE'}
        </button>
      )}
      {!dockerConnected && (
        <div className="mt-auto rounded border-2 border-red-400 text-red-400 text-sm py-1 px-2 w-72 h-10 flex flex-row items-center justify-center">
          DOCKER ENGINE UNAVAILABLE
        </div>
      )}
    </>
  );
};

const LabInformation = () => {
  const lab = useCurrentLab();
  const navigate = useNavigate();
  const dockerStatus = useRecoilValue(dockerAtom);
  const updateStatus = useSetRecoilState<Status>(statusAtom);
  const [imagePullInProgress, setImagePullInProgress] = useState(false);
  const [needsImagePull, setNeedsImagePull] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [history, setHistory] = useState<ImageHistory[]>([]);
  const [labProgress, updateLabProgress] = useRecoilState(progressAtom);

  useEffect(() => {
    const init = async () => {
      const imageNames = [...new Set(lab.scenarios.flatMap(s => s.steps.map(step => step.container.image)))];
      const promises = imageNames.map(async imageName => {
        const items = await InvokeChannel('docker:history', { imageName });
        return {
          imageName,
          history: items,
        };
      });

      const hist = await Promise.all(promises);
      setHistory(hist);

      const progressRecords = await InvokeChannel('progress:load', { labId: lab.id });
      if (progressRecords.length > 0) {
        setSectionIdx(1);
      }
      updateLabProgress([]);
    };
    init();
  }, [lab]);

  const pullImage = () => {
    setImagePullInProgress(true);
    const [image, tag] = lab.container.image.split(':');
    InvokeChannel('docker:pull', { imageName: image, tag }, ({ status, currentProgress, totalProgress }) => {
      updateStatus({
        icon: 'download',
        message: status,
        currentProgress,
        totalProgress,
      });
    })
      .then(() => {
        setNeedsImagePull(false);
        setImagePullInProgress(false);
        updateStatus({ icon: 'check', message: '', currentProgress: 0, totalProgress: 0 });
      })
      .catch(() => {
        setImagePullInProgress(false);
        setNeedsImagePull(true);
        updateStatus({ icon: 'triangle-exclamation', message: '', currentProgress: 0, totalProgress: 0 });
      });
  };

  const labButtonClick = async () => {
    if (needsImagePull) {
      pullImage();
      return;
    }

    lab.scenarios.some(scenario => {
      if (!labProgress.some(p => p.scenarioId === scenario.id)) {
        navigate(`/lab/${lab.id}/scenario/${scenario.id}`);
        return true;
      }

      const found = scenario.steps.some(step => {
        if (!labProgress.some(p => p.scenarioId === scenario.id && p.stepId === step.id)) {
          navigate(`/lab/${lab.id}/scenario/${scenario.id}/step/${step.id}`);
          return true;
        }
        return false;
      });

      return found;
    });
  };

  return (
    <div className="flex flex-col h-full m-4">
      <div className="h-48 shrink-0 flex">
        <img className="object-cover w-64 h-48 rounded" src={lab.coverImage} alt="" />
        <div className="ml-4 flex-1 prose max-w-none flex flex-col">
          <h1 className="mb-2">{lab.title}</h1>
          <div className="text-s">
            <span className="text-gray-400">by </span>
            <span>{lab.author.name}</span>
          </div>
          <p className="my-2">{lab.description}</p>
          <LabButton
            needsImagePull={needsImagePull}
            dockerConnected={dockerStatus.connected}
            pullInProgress={imagePullInProgress}
            onClick={labButtonClick}
            alreadyStarted={labProgress.length > 0}
          />
        </div>
      </div>
      <div className="flex-1 flex overflow-scroll no-scrollbar my-8 mt-4 ml-64">
        <div className="flex-1 ml-4">
          <div className="flex my-4">
            {sectionButton({ title: `What you'll learn`, active: sectionIdx === 0, onClick: () => setSectionIdx(0) })}
            {sectionButton({ title: `Syllabus`, active: sectionIdx === 1, onClick: () => setSectionIdx(1) })}
            {sectionButton({ title: `Image Information`, active: sectionIdx === 2, onClick: () => setSectionIdx(2) })}
          </div>
          {sectionIdx === 0 && <Markdown markdown={lab.frontMatter} />}
          {sectionIdx === 1 && <Syllabus progressRecords={labProgress} lab={lab} />}
          {sectionIdx === 2 && <ImageInfo history={history} />}
        </div>
        <div className="w-96 shrink-0">
          <AuthorBio author={lab.author} />
        </div>
      </div>
    </div>
  );
};
export default LabInformation;
