import 'renderer/App.css';

import statusAtom from 'renderer/atoms/status';
import dockerAtom from 'renderer/atoms/docker';
import { useRecoilValue } from 'recoil';
import { SpinnerDotted } from 'spinners-react';

const Status = () => {
  const status = useRecoilValue(statusAtom);
  const dockerStatus = useRecoilValue(dockerAtom);
  let progressValue = 0;
  if (status.currentProgress !== undefined && status.totalProgress !== undefined && status.totalProgress !== 0) {
    progressValue = (512 * status.currentProgress) / status.totalProgress;
  }

  return (
    <div className="absolute left-0 bottom-0 right-0 h-10 bg-container flex">
      <div className="flex-1 flex items-center pl-4 text-gray-400 gap-2">
        {status.message !== '' && (
          <>
            {status.icon === 'spinner' ? (
              <SpinnerDotted size={24} thickness={180} speed={139} color="#36ad47" />
            ) : (
              <i className={`fa-solid fa-${status.icon} fa-md`} />
            )}
            <span>{status.message}</span>
          </>
        )}
      </div>

      <div className="flex items-center w-64 text-green">
        <div className="rounded h-6 bg-green" style={{ width: `${progressValue}px` }} />
      </div>

      <div className="mr-4 mt-1 font-mono text-gray-400 text-sm w-52">
        <div className="flex h-8 items-center justify-end gap-2">
          {dockerStatus.connected ? '' : 'Not '} Connected to Docker{' '}
          <i className={`fa-solid fa-plug fa-md ${dockerStatus.connected ? 'text-green' : 'text-red-500'}`} />
        </div>
      </div>
    </div>
  );
};
export default Status;
