import 'renderer/App.css';
import Markdown from 'renderer/components/Markdown';
import { useCurrentLab } from 'renderer/hooks/useCurrent';
import AuthorBio from './AuthorBio';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useState } from 'react';
import dockerAtom from '../../atoms/docker';
import { Status } from '../../../types/status';
import statusAtom from '../../atoms/status';
import { InvokeChannel } from '../../../ipc';

const LabButton = ({
  needsImagePull,
  dockerConnected,
  pullInProgress,
  onClick,
}: {
  needsImagePull: boolean;
  dockerConnected: boolean;
  pullInProgress: boolean;
  onClick: () => void;
}) => {
  return (
    <>
      {!needsImagePull && dockerConnected && (
        <button
          type="button"
          className="mt-auto rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline text-center w-72 h-10"
          onClick={onClick}
        >
          START LAB
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
  const [needsImagePull, setNeedsImagePull] = useState(false);
  const dockerStatus = useRecoilValue(dockerAtom);
  const updateStatus = useSetRecoilState<Status>(statusAtom);
  const [imagePullInProgress, setImagePullInProgress] = useState(false);

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
      .catch(error => {
        console.warn(error);
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
    navigate(`/lab/${lab.id}/scenario/${lab.scenarios[0].id}`);
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
          />
        </div>
      </div>
      <div className="flex-1 flex overflow-scroll no-scrollbar my-8 ml-64">
        <div className="flex-1 ml-4">
          <Markdown markdown={lab.cover} />
        </div>
        <div className="w-96 shrink-0">
          <AuthorBio author={lab.author} />
        </div>
      </div>
    </div>
  );
};
export default LabInformation;
