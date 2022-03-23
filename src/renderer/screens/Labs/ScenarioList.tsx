import 'renderer/App.css';
import { Link } from 'react-router-dom';
import Lab from 'types/lab';
import ProgressRecord from 'types/progressRecord';
import Scenario from '../../../types/scenario';

type ScenarioListProps = {
  lab: Lab;
  progressRecords: ProgressRecord[];
};

const ScenarioList = ({ lab, progressRecords }: ScenarioListProps) => {
  const isScenarioCompleted = (scenario: Scenario) =>
    (scenario.steps ? scenario.steps.length : 1) ===
    progressRecords.filter(r => r.labId === lab.id && r.scenarioId === scenario.id).length;

  const completionPercentage = (scenario: Scenario) =>
    Math.round(
      (100 * progressRecords.filter(r => r.labId === lab.id && r.scenarioId === scenario.id).length) /
        (scenario.steps ? scenario.steps.length : 1)
    );

  return (
    <div className="text-white flex flex-col">
      <div className="h-36 overflow-hidden grid place-content-center rounded">
        <img src={lab.coverImage} alt="" />
      </div>
      <div className="my-3">
        <i className="fa-solid fa-flask fa-sm text-[#FFB543] w-5" />
        {lab.title}
      </div>
      {lab.scenarios.map(scenario => (
        <div className="flex flex-col p-5 pt-3 mb-2 rounded bg-container" key={scenario.id}>
          <div className="flex flex-row items-center text-md">
            <div className="flex-1 text-[#5186EF]">
              <Link to={`/lab/${lab.id}/scenario/${scenario.id}`}>{scenario.title}</Link>
            </div>
            <div>
              <i
                className={`fa-solid fa-circle-check fa-sm self-end ${
                  isScenarioCompleted(scenario) ? 'text-green-400' : 'text-gray-400'
                }`}
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">{completionPercentage(scenario)}% complete</div>
          <div className="w-full mt-1 relative">
            <div className="absolute bg-green h-1" style={{ width: `${completionPercentage(scenario)}%` }} />
          </div>
          <div className="mt-3">
            {scenario.steps.map(step => (
              <div key={step.id} className="mt-3 w-full flex flex-col">
                <div className="text-sm text-gray-300">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default ScenarioList;
