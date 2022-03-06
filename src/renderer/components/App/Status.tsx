import 'renderer/App.css';

import statusAtom from '../../atoms/status';
import dockerAtom from '../../atoms/docker';
import { useRecoilValue } from 'recoil';

const Status = () => {
  const status = useRecoilValue(statusAtom);
  const dockerStatus = useRecoilValue(dockerAtom);

  return (
    <div className="absolute left-0 bottom-0 right-0 h-10 bg-container flex">
      <div className="flex-1 flex items-center pl-4 text-gray-400 gap-2">
        {status.message !== '' && (
          <>
            <i className="fa-solid fa-circle-info fa-md" />
            <span>{status.message}</span>
          </>
        )}
      </div>
      <div className="mr-4 mt-1 font-mono text-gray-400">
        <div className="flex rounded-xl h-8 px-4 bg-container items-center gap-2">
          {dockerStatus.connected ? '' : 'Not '} Connected to Docker{' '}
          <i className={`fa-solid fa-plug fa-md ${dockerStatus.connected ? 'text-green' : 'text-red-500'}`} />
        </div>
      </div>
    </div>
  );
};
export default Status;
