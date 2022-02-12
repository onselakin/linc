import './App.css';

import settingsState from './state/settings';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const Loader = () => {
  const [settings, updateSettings] = useRecoilState(settingsState);

  useEffect(() => {
    // EmitAction<number, number>('hello-world', 'hello', notf =>
    //   console.log(notf)
    // )
    //   .then(res => console.log(res))
    //   .catch(err => console.log(err));

    updateSettings(window.electron.store.settings());
  }, [updateSettings]);

  return <div>Checking Scenario Repositories: {settings.courseRepos[0]}</div>;
};
export default Loader;
