import '../../App.css';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { InvokeChannel } from 'ipc';
import LabCard from './LabCard';
import labsAtom from 'renderer/atoms/labs';
import settingsAtom from 'renderer/atoms/settings';
import statusAtom from 'renderer/atoms/status';
import { useEffect, useState } from 'react';
import Lab from 'types/lab';
import { useNavigate } from 'react-router-dom';

const LabList = () => {
  const navigate = useNavigate();
  const updateSettings = useSetRecoilState(settingsAtom);
  const updateStatus = useSetRecoilState(statusAtom);
  const [labs, updateLabs] = useRecoilState(labsAtom);
  const [isLoading, setIsLoading] = useState(true);

  const loadLabAndNavigate = async (lab: Lab) => {
    if (isLoading) return;
    const fullLab = await InvokeChannel('lab:load', { id: lab.id, summaryOnly: false });
    const allLabs = labs.all.map(l => l);
    const index = allLabs.findIndex(l => l.id === lab.id);
    allLabs[index] = fullLab;
    updateLabs({ ...labs, all: allLabs });
    navigate(`/lab/${lab.id}`);
  };

  useEffect(() => {
    if (labs.all.length > 0) {
      setIsLoading(false);
      return;
    }

    const loadSettings = async () => {
      const s = await InvokeChannel('load-settings');

      const results = await Promise.all(
        s.labRepos
          .map(async l => {
            updateStatus({ message: `Cloning lab: ${l.url}` });

            const result = await InvokeChannel('lab:clone', l);
            if (result.success) {
              return InvokeChannel('lab:load', { id: result.id, summaryOnly: true });
            }
            return undefined;
          })
          .filter(l => l !== undefined)
      );
      updateLabs({ ...labs, all: results as Lab[] });
      updateStatus({ message: '' });
      updateSettings(s);
      setIsLoading(false);
    };

    loadSettings();
  }, [updateSettings, updateStatus, updateLabs]);

  return (
    <div className="h-full w-full flex flex-col-3 flex-wrap gap-5 overflow-scroll no-scrollbar p-4">
      {labs.all.map(l => (
        <LabCard lab={l} key={l.id} loadDisabled={isLoading} onNavigate={() => loadLabAndNavigate(l)} />
      ))}
    </div>
  );
};
export default LabList;
