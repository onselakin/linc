import './App.css';

import { InvokeAction } from 'ipc';
import { Settings } from 'types/settings';
import Status from './Status';
import settingsState from './state/settings';
import statusState from './state/status';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

const Home = () => {
  const updateSettings = useSetRecoilState(settingsState);
  const updateStatus = useSetRecoilState(statusState);

  useEffect(() => {
    async function loadSettings() {
      updateStatus({ message: 'Loading settings' });

      const s = await InvokeAction<Settings>('load-settings');
      updateSettings(s);

      InvokeAction<void, { phase: string; loaded: number; total: number }>('clone-lab', s.labs[0], notf =>
        console.log(`${notf.phase}: ${notf.loaded}/${notf.total}`)
      )
        .then(() => console.log('Cloned'))
        .catch(err => console.log('Error:', err));

      updateStatus({
        message: `Settings loaded. Using repo: ${s.labs[0].username}`,
      });
    }

    loadSettings();
  }, [updateSettings, updateStatus]);

  return (
    <div className="flex flex-col h-full bg-pink-600">
      <div className="h-14 grid content-center bg-green-500">Top</div>
      <div className="flex bg-yellow-500 h-full flex-grow">
        <div className="w-14 grid justify-center p-3 bg-red-800">1</div>
        <div className="flex-grow p-10 bg-blue-800">1</div>
      </div>
      <div className="h-12 grid ml-1 content-center bg-green-500">
        <Status />
      </div>
    </div>
  );
};
export default Home;
