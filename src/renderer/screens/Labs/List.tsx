import '../../App.css';

import { useRecoilState, useSetRecoilState } from 'recoil';

import { InvokeChannel } from 'ipc';
import LabCard from '../../components/Labs/LabCard';
import SideBar from '../../components/App/SideBar';
import Status from '../../components/App/Status';
import TopBar from '../../components/App/TopBar';
import labsAtom from '../../atoms/labsAtom';
import settingsAtom from '../../atoms/settings';
import statusAtom from '../../atoms/status';
import { useEffect } from 'react';
import { Lab } from '../../../types/lab';

const List = () => {
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
    <div className="absolute top-0 right-0 bottom-0 left-0">
      <TopBar />
      <SideBar />
      <Status />
      <div className="absolute top-14 left-14 bottom-14 right-0 flex flex-col-3 flex-wrap content-start overflow-scroll no-scrollbar gap-5 border-2 border-yellow-500 bg-green-500">
        {labs.map(l => (
          <LabCard lab={l} />
        ))}
      </div>
    </div>
  );
};
export default List;
