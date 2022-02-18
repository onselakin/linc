import './App.css';

import { InvokeAction } from 'ipc';
import settingsAtom from './atoms/settings';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const Loader = () => {
  const [settings, updateSettings] = useRecoilState(settingsAtom);

  useEffect(() => {
    updateSettings(window.electron.store.settings());
  }, [updateSettings]);

  const emitAction = () => {
    InvokeAction<unknown, { phase: string; loaded: number; total: number }>(
      'clone-repo',
      { url: 'https://github.com/onselakin/kubectl-aliases' },
      notf => console.log(`${notf.phase}: ${notf.loaded}/${notf.total}`)
    )
      .then(() => console.log('Cloned'))
      .catch(err => console.log('Error:', err));
  };

  return (
    <div>
      Checking Scenario Repositories: {settings.labs[0]}
      <button type="button" onClick={emitAction}>
        Click me!
      </button>
    </div>
  );
};
export default Loader;
