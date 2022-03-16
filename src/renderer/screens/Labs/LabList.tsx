import '../../App.css';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { InvokeChannel } from 'ipc';
import LabCard from './LabCard';
import labsAtom from '../../atoms/labs';
import settingsAtom from '../../atoms/settings';
import statusAtom from '../../atoms/status';
import { useEffect } from 'react';
import Lab from '../../../types/lab';
import { useNavigate } from 'react-router-dom';

const LabList = () => {
  const navigate = useNavigate();
  const updateSettings = useSetRecoilState(settingsAtom);
  const updateStatus = useSetRecoilState(statusAtom);
  const [labs, updateLabs] = useRecoilState(labsAtom);

  const setCurrentLabAndNavigate = (lab: Lab) => {
    navigate(`/lab/${lab.id}/info`);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const s = await InvokeChannel('load-settings');
      updateSettings(s);

      const results = await Promise.all(
        s.labRepos
          .map(async l => {
            updateStatus({ message: `Cloning lab: ${l.url}` });

            const result = await InvokeChannel('lab:clone', l);
            if (result.success) {
              return InvokeChannel('lab:load', { id: result.id });
            }
            return undefined;
          })
          .filter(l => l !== undefined)
      );
      updateLabs({ ...labs, all: results as Lab[] });

      updateStatus({ message: '' });
    };

    loadSettings();
  }, [updateSettings, updateStatus, updateLabs]);

  return (
    <div className="h-full w-full flex flex-col-3 flex-wrap gap-5 overflow-scroll no-scrollbar p-4">
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
    </div>
  );
};
export default LabList;
