import 'renderer/App.css';
import { Lab } from 'types/lab';
import { Link } from 'react-router-dom';

type LabCardProps = {
  lab: Lab;
};

const LabCard = ({ lab }: LabCardProps) => {
  return (
    <div className="h-64 w-96 rounded overflow-hidden shadow-lg bg-yellow-200">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{lab.title}</div>
        <p className="text-gray-700 text-base">{lab.description}</p>
      </div>
      <Link to={`/lab/${lab.id}`}>Scenarios</Link>
    </div>
  );
};
export default LabCard;
