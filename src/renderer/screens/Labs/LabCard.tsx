import 'renderer/App.css';
import { Lab } from 'types/lab';
import { Link } from 'react-router-dom';

type LabCardProps = {
  lab: Lab;
};

const LabCard = ({ lab }: LabCardProps) => {
  return (
    <div className="h-64 w-96 m-4 rounded overflow-hidden shadow-lg bg-gray-500">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{lab.title}</div>
        <p className="text-gray-700 text-base text-gray-200 mb-6">{lab.description}</p>
        <Link to={`/lab/${lab.id}/info`}>More...</Link>
      </div>
    </div>
  );
};
export default LabCard;
