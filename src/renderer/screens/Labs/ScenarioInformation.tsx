import { useRecoilValue } from 'recoil';
import { useCurrentLab, useCurrentScenario } from 'renderer/hooks/useCurrent';
import progressAtom from 'renderer/atoms/progress';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import ScenarioList from './ScenarioList';

const ScenarioInformation = () => {
  const lab = useCurrentLab();
  const scenario = useCurrentScenario();
  const labProgress = useRecoilValue(progressAtom);

  return (
    <div className="flex my-4">
      <div className="w-80">
        <ScenarioList lab={lab} progressRecords={labProgress} />
      </div>
      <div className="flex-1 mx-4">
        <div className="prose max-w-none">
          <Markdown markdown={scenario.startContent} assetRoot={lab.localPath} />
        </div>
        <StepNavigation
          nextSubtitle="Start Scenario"
          nextTitle={scenario.steps[0].title}
          next={`/lab/${lab.id}/scenario/${scenario.id}/step/${scenario.steps[0].id}`}
        />
      </div>
    </div>
  );
};
export default ScenarioInformation;
