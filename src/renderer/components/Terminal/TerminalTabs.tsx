/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Term, { TerminalRef } from './Terminal';
import { useRef, useState } from 'react';
import TabButton from './TabButton';
import randomId from 'utils/randomId';

interface Tab {
  terminalId: string;
}

interface TerminalTabsProps {
  containerId: string;
}

const TerminalTabs = ({ containerId }: TerminalTabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const terminalRefs = useRef<TerminalRef[]>([]);

  const addTab = () => {
    terminalRefs.current = [];
    const termTabs = [...tabs, { terminalId: randomId() }];
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
    <div className="h-full w-full flex flex-col border-red-300">
      <div className="h-8 rounded-tl rounded-tr bg-container font-mono text-gray-300 flex flex-row px-2 gap-8 items-center">
        <div className="flex-1 flex flex-row gap-5">
          {tabs.map((tab, idx) => (
            <TabButton
              idx={idx}
              title={tab.terminalId}
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
  );
};

export default TerminalTabs;
