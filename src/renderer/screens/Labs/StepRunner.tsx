/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { Container, Section, Bar } from 'react-simple-resizer';
import Term, { TerminalRef } from 'renderer/components/Terminal';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import { useCurrentLab, useCurrentScenario, useCurrentStep } from 'renderer/hooks/useCurrent';
import { InvokeChannel } from '../../../ipc';
import randomId from '../../../utils/randomId';

interface Tab {
  title: string;
  terminalId: string;
}

const TabButton = ({
  idx,
  title,
  active,
  onActivateClick,
  onCloseClick,
}: {
  idx: number;
  title: string;
  active: boolean;
  onActivateClick: () => void;
  onCloseClick: (idx: number) => void;
}) => {
  return (
    <div
      className={`bg-container h-7 items-center px-4 flex flex-row gap-2 ${
        active && 'border-b-2 border-green'
      } text-sm`}
    >
      <button type="button" className="flex flex-row items-center gap-2" onClick={onActivateClick}>
        <i className="fa-solid fa-terminal fa-sm" />
        <p>{title}</p>
      </button>
      <button type="button" className="ml-3 flex flex-row items-center" onClick={() => onCloseClick(idx)}>
        <i className="fa-solid fa-xmark hover:fa-lock fa-sm" />
      </button>
    </div>
  );
};

const StepRunner = () => {
  const currentLab = useCurrentLab();
  const currentScenario = useCurrentScenario();
  const currentStep = useCurrentStep();

  const currentStepIdx = currentScenario.steps.indexOf(currentStep);
  const previousStepEnabled = currentStepIdx > 0;
  const nextStepEnabled = currentScenario.steps.length > currentStepIdx + 1;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const containerRef = React.createRef<Container>();
  const terminalRefs = useRef<TerminalRef[]>([]);

  const [containerId, setContainerId] = useState('');

  const afterResizing = () => {
    terminalRefs.current.forEach(t => t.fit());
  };

  const addTab = () => {
    terminalRefs.current = [];
    const title = randomId();
    const termTabs = [...tabs, { title, terminalId: title }];
    setTabs(termTabs);
    setActiveTabIndex(termTabs.length - 1);
  };

  const closeTab = (idx: number) => {
    terminalRefs.current[idx].exit();

    const currentTab = tabs[activeTabIndex];
    const tabToClose = tabs[idx];
    const termTabs = tabs.filter(t => t !== tabToClose);

    if (idx !== activeTabIndex) {
      setActiveTabIndex(termTabs.indexOf(currentTab));
      setTabs(termTabs);
      return;
    }

    let targetTabIndex = idx < termTabs.length ? idx : idx - 1;
    if (targetTabIndex < 0) targetTabIndex = 0;

    setActiveTabIndex(targetTabIndex);
    setTabs(termTabs);
  };

  const addRef = (ref: TerminalRef | null) => {
    if (ref !== null) terminalRefs.current.push(ref);
    return ref;
  };

  useEffect(() => {
    InvokeChannel('docker:create', { imageName: currentLab.container.image })
      .then(result => {
        setContainerId(result.containerId);
        console.log(result.containerId);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentLab.container.image]);

  return (
    <Container className="h-full" afterResizing={afterResizing} ref={containerRef}>
      <Section minSize={500}>
        <div className="h-full overflow-scroll no-scrollbar pr-2">
          <Markdown markdown={currentStep.content} />
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
        <div className="h-full w-full flex flex-col border-red-300">
          <div className="h-8 rounded-tl rounded-tr bg-container font-mono text-gray-300 flex flex-row px-2 gap-8 items-center">
            <div className="flex-1 flex flex-row gap-5">
              {tabs.map((tab, idx) => (
                <TabButton
                  idx={idx}
                  title={tab.title}
                  key={idx}
                  active={activeTabIndex === idx}
                  onActivateClick={() => setActiveTabIndex(idx)}
                  onCloseClick={() => closeTab(idx)}
                />
              ))}
            </div>
            <button type="button" className="text-green" onClick={addTab}>
              <i className="fa-solid fa-square-plus fa-xl" />
            </button>
          </div>
          <div className="flex-1 bg-black">
            <div className="h-full w-full bg-black relative">
              {tabs.map((tab, idx) => (
                <Term
                  key={idx}
                  containerId={containerId}
                  terminalId={tab.terminalId}
                  size={500}
                  ref={term => addRef(term)}
                  visible={activeTabIndex === idx}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default StepRunner;
