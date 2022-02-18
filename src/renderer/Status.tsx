import './App.css';

import statusState from './state/status';
import { useRecoilValue } from 'recoil';

const Status = () => {
  const status = useRecoilValue(statusState);

  return (
    <div className="absolute left-0 bottom-0 right-0 h-14 border-2 border-blue-500 bg-green-500">{status.message}</div>
  );
};
export default Status;
