/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { Container, Section, Bar } from 'react-simple-resizer';
import React, { useEffect, useState } from 'react';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import { useCurrentLab, useCurrentScenario, useCurrentStep } from 'renderer/hooks/useCurrent';
import { InvokeChannel } from 'ipc';
import TerminalTabs from 'renderer/components/Terminal/TerminalTabs';

const StepRunner = () => {
  const currentLab = useCurrentLab();
  const currentScenario = useCurrentScenario();
  const currentStep = useCurrentStep();

  const currentStepIdx = currentScenario.steps.indexOf(currentStep);
  const previousStepEnabled = currentStepIdx > 0;
  const nextStepEnabled = currentScenario.steps.length > currentStepIdx + 1;

  const resizableContainerRef = React.createRef<Container>();

  const [containerId, setContainerId] = useState('');

  const afterResizing = () => {};

  useEffect(() => {
    InvokeChannel('docker:create', { imageName: currentLab.container.image })
      .then(result => {
        setContainerId(result.containerId);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentLab.container.image]);

  const executeCode = (code: string) => {};

  return (
    <Container className="h-full" afterResizing={afterResizing} ref={resizableContainerRef}>
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
        <TerminalTabs containerId={containerId} />
      </Section>
    </Container>
  );
};

export default StepRunner;
