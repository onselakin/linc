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

  return <div>Checking Scenario Repositories: {settings.courseRepos[0]}</div>;
};
export default Home;
