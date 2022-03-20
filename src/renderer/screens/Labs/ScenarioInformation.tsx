import { InvokeChannel } from 'ipc';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import 'renderer/App.css';
import progressAtom from 'renderer/atoms/progress';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import { useCurrentLab, useCurrentScenario } from 'renderer/hooks/useCurrent';
import ScenarioList from './ScenarioList';

const ScenarioInformation = () => {
  const lab = useCurrentLab();
  const scenario = useCurrentScenario();
  const [progressRecords, setProgressRecords] = useRecoilState(progressAtom);

  useEffect(() => {
    const init = async () => {
      setProgressRecords(await InvokeChannel('progress:load', { labId: lab.id }));
    };
    init();
  }, [lab, setProgressRecords]);

  return (
    <div className="flex my-4">
      <div className="w-80">
        <ScenarioList lab={lab} progressRecords={progressRecords} />
      </div>
      <div className="flex-1 mx-4">
        <div className="prose max-w-none">
          <Markdown markdown={scenario.startContent} />
        </div>
        <StepNavigation
          nextVisible
          nextTitle={scenario.steps[0].title}
          previous=""
          next={`/lab/${lab.id}/scenario/${lab.scenarios[0].id}/step/${lab.scenarios[0].steps[0].id}`}
        />
      </div>
    </div>
  );
};
export default ScenarioInformation;
