import 'renderer/App.css';
import Lab from 'types/lab';

type LabCardProps = {
  lab: Lab;
  loadDisabled: boolean;
  onNavigate: (lab: Lab) => void;
};

const LabCard = ({ lab, loadDisabled, onNavigate }: LabCardProps) => {
  return (
    <div className="h-[500px] w-96 rounded overflow-hidden drop-shadow-xl bg-container flex flex-col text-white">
      <div className="h-48 overflow-hidden grid place-content-center">
        <img src={`asset://${lab.coverImage}`} alt="" />
      </div>
      <div className="mt-1 mx-4 flex flex-col gap-2">
        <h3 className="text-[#788AB6] my-2 text-xl">{lab.title}</h3>
        <p className="text-md">{lab.description}</p>
        <div>
          <p className="text-sm">
            <span className="mr-2 text-gray-300">Author:</span>
            <span>{lab.author.name}</span>
          </p>
          <p className="text-sm">
            <span className="mr-2 text-gray-300">Estimated time:</span>
            <span>{lab.estimatedTime}</span>
          </p>
        </div>
        <div className="flex flex-row my-4 gap-2">
          {lab.tags.split(',').map(tag => (
            <div className="rounded rounded-md bg-[#09E294] px-2 text-sm text-black" key={tag}>
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="self-end mx-2 mb-4 flex flex-col flex-1">
        <button
          type="button"
          className={`mt - auto rounded ${loadDisabled ? 'bg-gray-500' : 'bg-[#FD9900]'} text-black text-sm py-1 px-4`}
          onClick={() => {
            onNavigate(lab);
          }}
        >
          GO TO LAB <i className="fa-solid fa-angles-right" />
        </button>
      </div>
    </div>
  );
};
export default LabCard;
