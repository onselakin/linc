import 'renderer/App.css';
import Lab from 'types/lab';

type LabCardProps = {
  lab: Lab;
  onNavigate: (lab: Lab) => void;
};

const LabCard = ({ lab, onNavigate }: LabCardProps) => {
  return (
    <div className="h-96 w-96 rounded overflow-hidden drop-shadow-xl bg-container flex flex-col text-white">
      <div className="h-36 overflow-hidden grid place-content-center">
        <img src={lab.coverImage} alt="" />
      </div>
      <div className="mt-1 mx-4">
        <h3 className="text-white my-2 text-xl">{lab.title}</h3>
        <div className="flex flex-row my-4 gap-2">
          {lab.tags.split(',').map(tag => (
            <div className="rounded rounded-md bg-[#09E294] px-2 text-sm" key={tag}>
              {tag}
            </div>
          ))}
        </div>
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
          GO TO LAB <i className="fa-solid fa-angles-right" />
        </button>
      </div>
    </div>
  );
};
export default LabCard;
