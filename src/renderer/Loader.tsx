import './App.css';

import { EmitAction } from 'ipc';
import settingsState from './state/settings';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const Loader = () => {
  const [settings, updateSettings] = useRecoilState(settingsState);

  useEffect(() => {
    updateSettings(window.electron.store.settings());
  }, [updateSettings]);

  const emitAction = () => {
    EmitAction<number, number>('hello-world', 'hello', notf =>
      console.log(notf)
    )
      .then(res => console.log('Response: ', res))
      .catch(err => console.log('Error:', err));
  };

  return (
    <div>
      Checking Scenario Repositories: {settings.courseRepos[0]}
      <button type="button" onClick={emitAction}>
        Click me!
      </button>
    </div>
  );
};
export default Loader;
