/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { Container, Section, Bar } from 'react-simple-resizer';
import { useEffect, useRef, useState } from 'react';
import { useCurrentLab, useCurrentScenario, useCurrentStep } from 'renderer/hooks/useCurrent';
import { InvokeChannel } from 'ipc';
import TerminalTabs, { TerminalTabsRef } from 'renderer/components/Terminal/TerminalTabs';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import statusAtom from 'renderer/atoms/status';
import progressAtom from 'renderer/atoms/progress';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import settingsAtom from 'renderer/atoms/settings';
import Stepper from '../Stepper';
import Toaster from 'renderer/components/Toaster';

const TerminalStepRunner = () => {
  const currentLab = useCurrentLab();
  const currentScenario = useCurrentScenario();
  const currentStep = useCurrentStep();
  const [containerId, setContainerId] = useState('');
  const [initialized, setInitialized] = useState(false);
  const terminalTabsRef = useRef<TerminalTabsRef>(null);
  const settings = useRecoilValue(settingsAtom);

  const updateStatus = useSetRecoilState(statusAtom);
  const resetStatus = useResetRecoilState(statusAtom);
  const [labProgress, updateLabProgress] = useRecoilState(progressAtom);
  const [toasterConfig, setToasterConfig] = useState({ visible: false, containerOutput: '' });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef?.current?.scroll({ top: 0, behavior: 'smooth' });

    let stepContainerId = '';

    const createAndInitContainer = async () => {
      updateStatus({ icon: 'rocket', message: 'Launching container' });

      const containerSpec: any = {
        imageName: currentStep.container.image,
        volumeBindings: [],
        kubeConfig: settings.labKubeConfigs[currentLab.id],
      };
      if (currentStep.volumeName) {
        containerSpec.volumeBindings.push({
          source: currentLab.singleScenario
            ? `${currentLab.id}/steps/${currentStep.id}/volume/`
            : `${currentLab.id}/scenarios/${currentScenario.id}/steps/${currentStep.id}/volume/`,
          target: currentStep.volumeName,
        });
      }

      try {
        const createResult = await InvokeChannel('docker:create', containerSpec);
        setContainerId(createResult.containerId);
        stepContainerId = createResult.containerId;
        resetStatus();

        if (currentStep.scripts.init) {
          updateStatus({ icon: 'spinner', message: 'Initializing step' });

          const { success } = await InvokeChannel('docker:exec', {
            containerId: createResult.containerId,
            script: `/lab/scenarios/${currentScenario.id}/steps/${currentStep.id}/init.sh`,
            shell: currentStep.scripts.shell,
            workingDir: '/',
          });

          if (!success) {
            setInitialized(false);
            return;
          }
        }
        resetStatus();
        setInitialized(true);
      } catch (error) {
        updateStatus({ icon: 'exclamation', message: `Error launching container: ${error}` });
      }
    };

    createAndInitContainer();

    return () => {
      InvokeChannel('terminal:kill');
      InvokeChannel('docker:exit', { containerId: stepContainerId });
    };
  }, [currentLab, currentScenario, currentStep, resetStatus, updateStatus]);

  const afterResizing = () => {
    terminalTabsRef.current?.fit();
  };

  const executeCode = (code: string, targetTerminal?: string) => {
    if (targetTerminal !== undefined) terminalTabsRef.current?.executeCommand(targetTerminal, code);
  };

  const verifyNext = async () => {
    resetStatus();

    if (currentStep.scripts.verify) {
      updateStatus({ icon: 'spinner', message: 'Verifying step' });

      const result = await InvokeChannel('docker:exec', {
        containerId,
        script: `/lab/scenarios/${currentScenario.id}/steps/${currentStep.id}/verify.sh`,
        shell: currentStep.scripts.shell,
        workingDir: `/lab/scenarios/${currentScenario.id}/steps/${currentStep.id}`,
      });
      resetStatus();

      if (!result.success) {
        setToasterConfig({ visible: true, containerOutput: result.output });
        return false;
      }
    }

    if (
      !labProgress.some(
        p => p.labId === currentLab.id && p.scenarioId === currentScenario.id && p.stepId === currentStep.id
      )
    ) {
      const currentProgress = [
        ...labProgress,
        {
          labId: currentLab.id,
          scenarioId: currentScenario.id,
          stepId: currentStep.id,
        },
      ];
      updateLabProgress(currentProgress);
      await InvokeChannel('progress:save', currentProgress);
    }

    setInitialized(false);
    setContainerId('');
    return true;
  };

  return (
    <>
      <Container className="h-full mx-1" afterResizing={afterResizing}>
        <Section minSize={500}>
          <div ref={contentRef} className="h-full overflow-scroll no-scrollbar px-2">
            <Stepper />

            <Markdown
              markdown={currentStep.content}
              includes={currentStep.includes}
              onExecute={executeCode}
              assetRoot={currentLab.id}
            />

            <div className="my-4">
              <StepNavigation verifyBeforeNext={verifyNext} />
            </div>
          </div>
        </Section>
        <Bar className="bg-container" size={3} style={{ cursor: 'col-resize' }} />

        <Section minSize={250}>
          {containerId !== '' && initialized && (
            <TerminalTabs
              ref={terminalTabsRef}
              containerId={containerId}
              initialTabs={currentStep.layout?.defaultTerminals ?? []}
              allowNewTerminals={false}
            />
          )}
        </Section>
      </Container>
      <Toaster
        title="Verification failed"
        isShowing={toasterConfig.visible}
        onClose={() => setToasterConfig({ visible: false, containerOutput: '' })}
      >
        <div className="">
          <p>Step verification failed. Output from the container:</p>
          <div className="font-mono bg-gray-700 p-2 my-2 rounded">{toasterConfig.containerOutput}</div>
        </div>
      </Toaster>
    </>
  );
};

export default TerminalStepRunner;
