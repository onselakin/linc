import 'renderer/App.css';
import { Link } from 'react-router-dom';
import Lab from '../../../types/lab';

type ScenarioListProps = {
  lab: Lab;
  drawerMode: boolean;
  needsImagePull: boolean;
  dockerEngineUnavailable: boolean;
  disabled: boolean;
  onStartLabClick: () => void;
  onPullImageClick: () => void;
};

const ScenarioList = ({
  lab,
  drawerMode,
  needsImagePull,
  dockerEngineUnavailable,
  disabled,
  onStartLabClick,
  onPullImageClick,
}: ScenarioListProps) => {
  return (
    <div className={`${drawerMode ? 'bg-container' : ''} `}>
      <div className="text-white flex flex-col">
        <div className="h-36 overflow-hidden grid place-content-center rounded mb-2">
          <img src={lab.coverImage} alt="" />
        </div>
        <div>
          <i className="fa-solid fa-flask fa-sm text-[#FFB543] w-5" />
          {lab.title}
        </div>
        <div className="ml-5 text-xs">
          <span className="text-gray-400">by </span>
          <span>{lab.author}</span>
        </div>
        {!drawerMode && !needsImagePull && !dockerEngineUnavailable && (
          <button
            type="button"
            className="my-4 rounded border-2 border-orange text-orange text-sm py-1 px-4 no-underline text-center"
            onClick={onStartLabClick}
          >
            START LAB
          </button>
        )}
        {!drawerMode && needsImagePull && !dockerEngineUnavailable && (
          <button
            type="button"
            disabled={disabled}
            className={`my-4 rounded border-2 ${
              disabled ? 'border-gray-600 text-gray-600' : 'border-orange text-orange'
            } text-sm py-1 px-4 no-underline text-center`}
            onClick={onPullImageClick}
          >
            PULL LAB IMAGE
          </button>
        )}
        {dockerEngineUnavailable && (
          <div className="my-4 rounded border-2 border-red-400 text-red-400 text-sm py-1 px-2 no-underline text-center">
            DOCKER ENGINE UNAVAILABLE
          </div>
        )}
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
            <div className="text-xs text-gray-400 mt-1">%15 complete</div>
            <div className="w-full mt-1">
              <div className="absolute bg-green h-1 w-4" />
            </div>
            <div className="mt-3">
              {scenario.steps.map(step => (
                <div key={step.id} className="mt-2 w-full flex flex-col">
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
