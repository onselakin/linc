import './App.css';

import statusState from './state/status';
import { useRecoilValue } from 'recoil';

const Status = () => {
  const status = useRecoilValue(statusState);

  return <div>{status.message}</div>;
};
export default Status;
