import '../../App.css';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { InvokeChannel } from 'ipc';
import LabCard from './LabCard';
import labsAtom from '../../atoms/labsAtom';
import settingsAtom from '../../atoms/settings';
import statusAtom from '../../atoms/status';
import { useEffect } from 'react';
import { Lab } from '../../../types/lab';
import ScenarioRunner from './ScenarioRunner';

const LabList = () => {
  const updateSettings = useSetRecoilState(settingsAtom);
  const updateStatus = useSetRecoilState(statusAtom);
  const [labs, updateLabs] = useRecoilState(labsAtom);

  useEffect(() => {
    const loadSettings = async () => {
      const s = await InvokeChannel('load-settings');
      updateSettings(s);

      const results = await Promise.all(
        s.labs
          .map(async l => {
            updateStatus({ message: `Cloning lab: ${l.url}` });

            const result = await InvokeChannel('clone-lab', l);
            if (result.success) {
              return InvokeChannel('load-lab', { name: result.name });
            }
            return undefined;
          })
          .filter(l => l !== undefined)
      );
      updateLabs(results as Lab[]);

      updateStatus({ message: '' });
    };

    loadSettings();
  }, [updateSettings, updateStatus, updateLabs]);

  return (
    <>
      {/*{labs.map(l => (*/}
      {/*  <LabCard lab={l} />*/}
      {/*))}*/}
      {labs.length > 0 && (
        <div className="p-10">
          <ScenarioRunner />
        </div>
      )}
    </>
  );
};
export default LabList;
