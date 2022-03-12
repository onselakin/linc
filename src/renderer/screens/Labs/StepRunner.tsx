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

  const currentStepIdx = currentScenario.steps.indexOf(currentStep);
  const previousStepEnabled = currentStepIdx > 0;
  const nextStepEnabled = currentScenario.steps.length > currentStepIdx + 1;

  const terminalTabsRef = useRef<TerminalTabsRef>(null);

  const [containerId, setContainerId] = useState('');

  const updateStatus = useSetRecoilState(statusAtom);
  const resetStatus = useResetRecoilState(statusAtom);

  const afterResizing = () => {};

  useEffect(() => {
    updateStatus(() => ({ icon: 'rocket', message: 'Launching container' }));
    InvokeChannel('docker:create', { imageName: currentLab.container.image })
      .then(result => {
        setContainerId(result.containerId);
        resetStatus();
      })
      .catch(error => {
        updateStatus(() => ({ icon: 'exclamation', message: `Error launching container: ${error}` }));
      });
  }, [currentLab.container.image, resetStatus, updateStatus]);

  const executeCode = (code: string, targetTerminal?: string) => {
    if (targetTerminal !== undefined) terminalTabsRef.current?.executeCommand(targetTerminal, code);
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
            />
          </div>
        </div>
      </Section>
      <Bar className="bg-container" size={3} style={{ cursor: 'col-resize' }} />
      <Section minSize={250}>
        {containerId !== '' && (
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
