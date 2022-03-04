import '../../App.css';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { InvokeChannel } from 'ipc';
import LabCard from './LabCard';
import labsAtom from '../../atoms/labsAtom';
import settingsAtom from '../../atoms/settings';
import statusAtom from '../../atoms/status';
import { useEffect } from 'react';
import { Lab } from '../../../types/lab';
import { useNavigate } from 'react-router-dom';

const LabList = () => {
  const navigate = useNavigate();
  const updateSettings = useSetRecoilState(settingsAtom);
  const updateStatus = useSetRecoilState(statusAtom);
  const [labs, updateLabs] = useRecoilState(labsAtom);

  const setCurrentLabAndNavigate = (lab: Lab) => {
    updateLabs({ ...labs, currentLabId: lab.id });
    navigate(`/lab/${lab.id}/info`);
  };

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
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} onNavigate={() => setCurrentLabAndNavigate(l)} />
      ))}
    </div>
  );
};
export default LabList;
