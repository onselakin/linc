import './App.css';

import { InvokeAction } from 'ipc';
import { Settings } from 'types/settings';
import settingsState from './state/settings';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const Home = () => {
  const [settings, updateSettings] = useRecoilState(settingsState);

  useEffect(() => {
    async function loadSettings() {
      const s = await InvokeAction<Settings>('load-settings');
      console.log(s);
    }

    loadSettings();
  }, [updateSettings]);

  return (
    <div className="flex flex-col h-full bg-pink-600">
      <div className="h-14 grid content-center bg-green-500">Top</div>
      <div className="flex bg-yellow-500 h-full flex-grow">
        <div className="w-14 grid justify-center p-3 bg-red-800">1</div>
        <div className="flex-grow p-10 bg-blue-800">1</div>
      </div>
      <div className="h-12 grid content-center bg-green-500">Bottom</div>
    </div>
  );
};
export default Home;
