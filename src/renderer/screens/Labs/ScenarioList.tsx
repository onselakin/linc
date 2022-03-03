import 'renderer/App.css';
import { Link } from 'react-router-dom';
import { Lab } from '../../../types/lab';

type ScenaristProps = {
  lab: Lab;
};

const ScenarioList = ({ lab }: ScenaristProps) => {
  return (
    <div className="pt-4">
      <div className="text-white flex flex-col">
        <div className="h-36 overflow-hidden grid place-content-center rounded mb-2">
          <img src={lab!.coverImage} alt="" />
        </div>
        <div>
          <i className="fa-solid fa-flask fa-sm text-[#FFB543] w-5" />
          {lab.title}
        </div>
        <div className="ml-5 text-xs">
          <span className="text-gray-400">by </span>
          <span>{lab!.author}</span>
        </div>
        <Link
          className="my-4 rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline text-center"
          to={`/lab/${lab!.id}/scenario/${lab!.scenarios[0].id}`}
        >
          START LAB
        </Link>
        {lab.scenarios.map(scenario => (
          <div className="flex flex-col p-5 pt-3 mb-2 rounded bg-container" key={scenario.id}>
            <div className="flex flex-row items-center text-md">
              <div className="flex-1 text-[#5186EF]">
                <Link to={`/lab/${lab.id}/scenario/${scenario.id}`}>{scenario.title}</Link>
              </div>
              <div>
                <i className="fa-solid fa-circle-check fa-sm self-end text-gray-400" />
              </div>
            </div>
            <div className="text-xs text-gray-400">%15 complete</div>
            <div className="w-full">
              <div className="absolute bg-green h-0.5 w-20" />
            </div>
            <div className="mt-3">
              {scenario.steps.map(step => (
                <div className="mt-2 w-full flex flex-col">
                  <div className="text-sm text-gray-300">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ScenarioList;
