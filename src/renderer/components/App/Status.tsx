import 'renderer/App.css';

import statusAtom from '../../atoms/status';
import { useRecoilValue } from 'recoil';

const Status = () => {
  const status = useRecoilValue(statusAtom);

  return <div className="absolute left-0 bottom-0 right-0 h-14 border-t-2 border-gray-500">{status.message}</div>;
};
export default Status;
