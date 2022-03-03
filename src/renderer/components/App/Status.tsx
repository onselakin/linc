import 'renderer/App.css';

import statusAtom from '../../atoms/status';
import { useRecoilValue } from 'recoil';

const Status = () => {
  const status = useRecoilValue(statusAtom);

  return (
    <div className="absolute left-0 bottom-0 right-0 h-10 bg-component flex">
      <div className="flex-1">{status.message}</div>
      <div className="mr-4 mt-1 font-mono text-gray-400">
        <div className="flex rounded-xl h-8 px-4 bg-container items-center gap-2">
          Connected to Docker <i className={`fa-solid fa-plug fa-md text-green`} />
        </div>
      </div>
    </div>
  );
};
export default Status;
