/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { Container, Section, Bar } from 'react-simple-resizer';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import { useCurrentLab, useCurrentScenario, useCurrentStep } from 'renderer/hooks/useCurrent';
import { InvokeChannel } from 'ipc';
import TerminalTabs, { TerminalTabsRef } from 'renderer/components/Terminal/TerminalTabs';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import statusAtom from '../../atoms/status';

const StepRunner = () => {
  const currentLab = useCurrentLab();
  const currentScenario = useCurrentScenario();
  const currentStep = useCurrentStep();
  const [containerId, setContainerId] = useState('');

  const currentStepIdx = currentScenario.steps.indexOf(currentStep);
  const previousStepEnabled = currentStepIdx > 0;
  const nextStepEnabled = currentScenario.steps.length > currentStepIdx + 1;

  const terminalTabsRef = useRef<TerminalTabsRef>(null);

  const updateStatus = useSetRecoilState(statusAtom);
  const resetStatus = useResetRecoilState(statusAtom);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('use effect');
    const createAndInitContainer = async () => {
      updateStatus({ icon: 'rocket', message: 'Launching container' });

      const containerSpec: any = { imageName: currentLab.container.image, volumeBindings: [] };
      containerSpec.volumeBindings.push({
        source: `${currentLab.id}/`,
        target: '/lab',
      });
      if (currentStep.volumeTarget) {
        containerSpec.volumeBindings.push({
          source: `${currentLab.id}/scenarios/${currentScenario.id}/steps/${currentStep.id}/files/`,
          target: currentStep.volumeTarget,
        });
      }

      try {
        const createResult = await InvokeChannel('docker:create', containerSpec);
        setContainerId(createResult.containerId);
        resetStatus();

        if (currentStep.scripts.init) {
          updateStatus({ icon: 'spinner', message: 'Initializing step' });

          const { success } = await InvokeChannel('docker:exec', {
            containerId: createResult.containerId,
            script: `/lab/scenarios/${currentScenario.id}/steps/${currentStep.id}/init.sh`,
            shell: currentStep.scripts.shell,
          });
          setInitialized(success);
          resetStatus();
        }
      } catch (error) {
        updateStatus({ icon: 'exclamation', message: `Error launching container: ${error}` });
      }
    };

    createAndInitContainer().catch(error =>
      updateStatus({
        icon: 'exclamation',
        message: `Error launching container: ${error}`,
      })
    );
  }, []);

  const afterResizing = () => {};

  const executeCode = (code: string, targetTerminal?: string) => {
    if (targetTerminal !== undefined) terminalTabsRef.current?.executeCommand(targetTerminal, code);
  };

  const verifyStep = () => {
    return new Promise<void>((resolve, reject) => {
      if (currentStep.scripts.verify) {
        updateStatus({ icon: 'spinner', message: 'Verifying step' });

        InvokeChannel('docker:exec', {
          containerId,
          script: `/lab/scenarios/${currentScenario.id}/steps/${currentStep.id}/verify.sh`,
          shell: currentStep.scripts.shell,
        })
          .then(({ success }) => {
            resetStatus();
            if (!success) {
              reject();
              return;
            }
            resolve();
          })
          .catch(error => {
            updateStatus({ icon: 'exclamation', message: `Error launching container: ${error}` });
            reject();
          });
      } else {
        resolve();
      }
    });
  };

  return (
    <Container className="h-full" afterResizing={afterResizing}>
      <Section minSize={500}>
        <div className="h-full overflow-scroll no-scrollbar pr-2">
          <Markdown markdown={currentStep.content} onExecute={executeCode} />

          <div className="my-4">
            <StepNavigation
              previousVisible={previousStepEnabled}
              nextVisible={nextStepEnabled}
              previousTitle={previousStepEnabled ? currentScenario.steps[currentStepIdx - 1].title : ''}
              nextTitle={nextStepEnabled ? currentScenario.steps[currentStepIdx + 1].title : ''}
              previous={
                previousStepEnabled
                  ? `/lab/${currentLab.id}/scenario/${currentScenario.id}/step/${
                      currentScenario.steps[currentStepIdx - 1].id
                    }`
                  : ''
              }
              next={
                nextStepEnabled
                  ? `/lab/${currentLab.id}/scenario/${currentScenario.id}/step/${
                      currentScenario.steps[currentStepIdx + 1].id
                    }`
                  : ''
              }
              verifyProgress={verifyStep}
            />
          </div>
        </div>
      </Section>
      <Bar className="bg-container" size={3} style={{ cursor: 'col-resize' }} />

      <Section minSize={250}>
        {containerId !== '' && initialized && (
          <TerminalTabs
            ref={terminalTabsRef}
            containerId={containerId}
            initialTabs={currentStep.layout.defaultTerminals}
            allowNewTerminals={false}
          />
        )}
      </Section>
    </Container>
  );
};

export default StepRunner;
