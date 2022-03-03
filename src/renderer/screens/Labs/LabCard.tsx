import 'renderer/App.css';
import { Lab } from 'types/lab';

type LabCardProps = {
  lab: Lab;
  onNavigate: (lab: Lab) => void;
};

const LabCard = ({ lab, onNavigate }: LabCardProps) => {
  return (
    <div className="h-96 w-96 m-4 rounded overflow-hidden drop-shadow-xl bg-container flex flex-col text-white">
      <div className="h-36 overflow-hidden grid place-content-center">
        <img src={lab.coverImage} alt="" />
      </div>
      <div className="flex flex-row mt-4 ml-2 gap-2">
        {lab.tags.split(',').map(tag => (
          <div className="rounded rounded-md bg-[#09E294] px-2 text-sm" key={tag}>
            {tag}
          </div>
        ))}
      </div>
      <div className="mt-3 mx-2">
        <h3 className="text-white my-4 text-xl">{lab.title}</h3>
        <p className="text-sm">{lab.description}</p>
      </div>
      <div className="self-end mx-2 mb-4 flex flex-col flex-1">
        <button
          type="button"
          className="mt-auto rounded bg-[#FD9900] text-white text-sm py-1 px-4"
          onClick={() => {
            onNavigate(lab);
          }}
        >
          START LAB
        </button>
      </div>
    </div>
  );
};
export default LabCard;
