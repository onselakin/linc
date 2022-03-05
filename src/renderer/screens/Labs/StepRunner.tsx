/* eslint-disable react/no-array-index-key */

import 'renderer/App.css';

import { useRecoilValue } from 'recoil';
import { currentLab } from 'renderer/atoms/labsAtom';
import { Container, Section, Bar } from 'react-simple-resizer';
import Term, { TerminalRef } from 'renderer/components/Terminal';
import React, { useRef, useState } from 'react';
import Markdown from 'renderer/components/Markdown';

interface Tab {
  title: string;
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
  const lab = useRecoilValue(currentLab);
  const scenario = lab.scenarios[0];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([{ title: 'bash' }]);
  const containerRef = React.createRef<Container>();
  const terminalRefs = useRef<TerminalRef[]>([]);

  const afterResizing = () => {
    terminalRefs.current.forEach(t => t.fit());
  };

  const addTab = () => {
    terminalRefs.current = [];
    const title = Math.random().toString(36).slice(-5);
    const termTabs = [...tabs, { title }];
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

  return (
    <Container className="h-full" afterResizing={afterResizing} ref={containerRef}>
      <Section minSize={500}>
        <div className="h-full overflow-scroll no-scrollbar pr-2">
          <Markdown markdown={scenario.steps[0].content} />
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
              {tabs.map((_, idx) => (
                <Term size={500} ref={term => addRef(term)} visible={activeTabIndex === idx} />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
};

// <Term size={500} ref={term => addRef(term!)} />

export default StepRunner;
