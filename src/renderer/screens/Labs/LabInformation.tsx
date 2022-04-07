import { useCurrentLab } from 'renderer/hooks/useCurrent';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Status } from 'types/status';
import { InvokeChannel } from 'ipc';
import ImageInfo, { ImageHistory } from './ImageInfo';
import Markdown from 'renderer/components/Markdown';
import AuthorBio from './AuthorBio';
import Syllabus from './Syllabus';
import dockerAtom from 'renderer/atoms/docker';
import statusAtom from 'renderer/atoms/status';
import progressAtom from 'renderer/atoms/progress';
import settingsAtom from 'renderer/atoms/settings';
import Context from 'types/context';

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
          className="mt-auto rounded border-2 border-green text-green text-sm py-1 px-4 no-underline text-center w-full h-10"
          onClick={onClick}
        >
          {alreadyStarted ? 'CONTINUE LAB' : 'START LAB'}
        </button>
      )}
      {needsImagePull && dockerConnected && (
        <button
          type="button"
          disabled={pullInProgress}
          className="mt-auto rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline w-full text-center h-10"
          onClick={onClick}
        >
          {pullInProgress ? 'PULLING IMAGE' : 'PULL LAB IMAGES'}
        </button>
      )}
      {!dockerConnected && (
        <div className="mt-auto rounded border-2 border-red-400 text-red-400 text-sm py-1 px-2 h-10 flex flex-row items-center justify-center">
          DOCKER UNAVAILABLE
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
  const [labProgress, updateLabProgress] = useRecoilState(progressAtom);
  const [settings, updateSettings] = useRecoilState(settingsAtom);
  const [imagePullInProgress, setImagePullInProgress] = useState(false);
  const [needsImagePull, setNeedsImagePull] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [history, setHistory] = useState<ImageHistory[]>([]);
  const [missingImages, setMissingImages] = useState<string[]>([]);
  const [requiresClusterSetup, setRequiresClusterSetup] = useState(true);
  const [contextSelectionVisible, setContextSelectionVisible] = useState(false);
  const [contexts, setContexts] = useState<Context[]>();

  const loadHistory = async () => {
    const imageNames = [
      ...new Set(
        lab.scenarios.flatMap(s =>
          s.steps.filter(step => step.container !== undefined).map(step => step.container.image)
        )
      ),
    ];

    const allHistory = await Promise.all(
      imageNames.map(async imageName => {
        const items = await InvokeChannel('docker:history', { imageName });
        return {
          imageName,
          history: items,
        };
      })
    );
    setHistory(allHistory);
  };

  useEffect(() => {
    const init = async () => {
      if (lab.requiresCluster) {
        if (lab.id in settings.labKubeConfigs) {
          setRequiresClusterSetup(false);
        } else {
          const result = await InvokeChannel('k8s:contexts');
          setContexts(result);
        }
      } else {
        setRequiresClusterSetup(false);
      }

      const imageNames = [
        ...new Set(
          lab.scenarios.flatMap(s =>
            s.steps.filter(step => step.container !== undefined).map(step => step.container.image)
          )
        ),
      ];

      const missing = (
        await Promise.all(
          imageNames.map(async imageName => {
            const { exists } = await InvokeChannel('docker:exists', { imageName });
            return { imageName, exists };
          })
        )
      )
        .filter(m => !m.exists)
        .map(m => m.imageName);

      if (missing.length > 0) {
        setNeedsImagePull(true);
        setMissingImages(missing);
      } else {
        await loadHistory();
      }

      updateLabProgress([]); // TODO: Remove this after testing
    };
    init();
  }, [lab]);

  const pullImages = async () => {
    setImagePullInProgress(true);

    const failedImagePulls: string[] = [];

    await missingImages.reduce(async (acc, imageName) => {
      await acc;
      const [image, tag] = imageName.split(':');

      try {
        await InvokeChannel('docker:pull', { imageName: image, tag }, ({ status, currentProgress, totalProgress }) => {
          updateStatus({
            icon: 'download',
            message: status,
            currentProgress,
            totalProgress,
          });
        });
      } catch (e) {
        failedImagePulls.push(imageName);
      }
    }, Promise.resolve());

    updateStatus({ icon: 'triangle-exclamation', message: '', currentProgress: 0, totalProgress: 0 });

    if (failedImagePulls.length > 0) {
      setImagePullInProgress(false);
      setNeedsImagePull(true);
      updateStatus({
        icon: 'triangle-exclamation',
        message: 'Some of the images failed to download',
        currentProgress: 0,
        totalProgress: 0,
      });
    } else {
      setNeedsImagePull(false);
      setImagePullInProgress(false);
      updateStatus({ icon: 'check', message: '', currentProgress: 0, totalProgress: 0 });
    }
  };

  const labButtonClick = async () => {
    if (needsImagePull) {
      await pullImages();
      return;
    }

    if (lab.singleScenario) {
      navigate(`/lab/${lab.id}/scenario/default-scenario/step/${lab.scenarios[0].steps[0].id}`);
      return;
    }

    lab.scenarios.some(scenario => {
      if (!labProgress.some(p => p.scenarioId === scenario.id)) {
        navigate(`/lab/${lab.id}/scenario/${scenario.id}`);
        return true;
      }

      return scenario.steps.some(step => {
        if (!labProgress.some(p => p.scenarioId === scenario.id && p.stepId === step.id)) {
          navigate(`/lab/${lab.id}/scenario/${scenario.id}/step/${step.id}`);
          return true;
        }
        return false;
      });
    });
  };

  const setContext = async (context: string) => {
    const configStr = await InvokeChannel('k8s:getConfig', { context });
    const configs = { ...settings.labKubeConfigs };
    configs[lab.id] = configStr;
    const newSettings = { ...settings, labKubeConfigs: configs };
    await InvokeChannel('save-settings', newSettings);
    updateSettings(newSettings);

    setContextSelectionVisible(false);
    setRequiresClusterSetup(false);
  };

  return (
    <div className="flex flex-col h-full m-4">
      <Transition appear show={contextSelectionVisible} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setContextSelectionVisible(false)}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="prose inline-block w-full max-w-md p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-container shadow-xl rounded border-2 border-container">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 m-0">
                  <div className="flex items-center h-12">
                    <h4 className="text-gray-200 m-0 flex-1">Choose context</h4>
                    <button type="button" className="flex flex-col" onClick={() => setContextSelectionVisible(false)}>
                      <i className="fa-solid fa-circle-xmark fa-xl text-[#FFB543]" />
                    </button>
                  </div>
                </Dialog.Title>
                <div className="max-h-96 overflow-scroll no-scrollbar border-component">
                  {contexts?.map(c => (
                    <button
                      type="button"
                      className="h-24 text-left hover:bg-component rounded border-container border-2 w-full p-2"
                      onClick={() => setContext(c.name)}
                    >
                      <div>
                        <span>{c.name}</span>
                        {c.server && <span className="text-gray-500 text-sm ml-1">({c.server})</span>}
                        <div className="text-sm">
                          <span className="text-gray-400">Cluster: </span>
                          <span>{c.cluster}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">User: </span>
                          <span>{c.user}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="h-48 shrink-0 flex bg-container rounded">
        <div>
          <img className="object-cover w-64 h-48 rounded mb-3" src={`asset://${lab.coverImage}`} alt="" />
          {!requiresClusterSetup && (
            <LabButton
              needsImagePull={needsImagePull}
              dockerConnected={dockerStatus.connected}
              pullInProgress={imagePullInProgress}
              onClick={labButtonClick}
              alreadyStarted={labProgress.length > 0}
            />
          )}
          {requiresClusterSetup && (
            <div className="w-64 prose">
              <p>
                <i className="fa-solid fa-warning fa-sm text-[#FFB543] w-5" />
                This lab requires access to a Kubernetes cluster.
              </p>
              <button
                type="button"
                className="mt-auto rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline text-center w-full h-10"
                onClick={() => setContextSelectionVisible(true)}
              >
                CONFIGURE KUBERNETES
              </button>
            </div>
          )}
        </div>

        <div className="ml-4 flex-1 prose max-w-none flex flex-col">
          <h1 className="mb-2">{lab.title}</h1>
          <div className="text-s">
            <span className="text-gray-400">Published by: </span>
            <span>{lab.author.name}</span>
          </div>
          <div className="text-s">
            <span className="text-gray-400 mr-1">Estimated time:</span>
            <span>{lab.estimatedTime}</span>
          </div>
          <div className="text-s">
            <span className="text-gray-400 mr-1">Difficulty:</span>
            <span>{lab.difficulty}</span>
          </div>
          <p className="mt-2 text-gray-200">{lab.description}</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-scroll no-scrollbar mb-8 ml-64">
        <div className="flex-1 ml-4">
          <div className="flex h-10 mt-3 mb-4">
            {sectionButton({ title: `What you'll learn`, active: sectionIdx === 0, onClick: () => setSectionIdx(0) })}
            {sectionButton({ title: `Syllabus`, active: sectionIdx === 1, onClick: () => setSectionIdx(1) })}
            {sectionButton({ title: `Image Information`, active: sectionIdx === 2, onClick: () => setSectionIdx(2) })}
          </div>
          {sectionIdx === 0 && <Markdown markdown={lab.frontMatter} assetRoot={lab.id} />}
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
