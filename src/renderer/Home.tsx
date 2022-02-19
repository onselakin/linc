import './App.css';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { InvokeChannel } from 'ipc';
import { Lab } from 'types/lab';
import LabCard from './LabCard';
import { Settings } from 'types/settings';
import SideBar from './SideBar';
import Status from './Status';
import TopBar from './TopBar';
import labsAtom from './atoms/labsAtom';
import settingsAtom from './atoms/settings';
import statusAtom from './atoms/status';
import { useEffect } from 'react';

const Home = () => {
  const updateSettings = useSetRecoilState(settingsAtom);
  const updateStatus = useSetRecoilState(statusAtom);

  useEffect(() => {
    async function loadSettings() {
      const s = await InvokeChannel<Settings>('load-settings');
      updateSettings(s);

      const results = await Promise.all(
        s.labs.map(async lab => {
          updateStatus({ message: `Cloning lab: ${lab.url}` });

          const result = await InvokeChannel<
            { name: string; success: boolean },
            { repo: string; phase: string; loaded: number; total: number }
          >('clone-lab', lab);
          return result;
        })
      );

      results
        .filter(r => r.success)
        .forEach(async r => {
          const lab = await InvokeChannel<Lab>('load-lab', { name: r });
        });

      updateStatus({ message: '' });
    }

    loadSettings();
  }, [updateSettings, updateStatus]);

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <TopBar />
      <SideBar />
      <Status />
      <div className="absolute top-14 left-14 bottom-14 right-0 flex flex-col-3 flex-wrap overflow-scroll no-scrollbar gap-5 border-2 border-yellow-500 bg-green-500">
        <LabCard />
        <LabCard />
      </div>
    </div>
  );
};
export default Home;
