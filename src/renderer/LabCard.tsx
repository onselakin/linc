import './App.css';
import { Lab } from '../types/lab';

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
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #photography
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #travel
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #winter
        </span>
      </div>
    </div>
  );
};
export default LabCard;
