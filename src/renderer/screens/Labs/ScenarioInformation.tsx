import 'renderer/App.css';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';
import { useCurrentLab, useCurrentScenario } from 'renderer/hooks/useCurrent';

const ScenarioInformation = () => {
  const lab = useCurrentLab();
  const scenario = useCurrentScenario();

  return (
    <>
      <div className="prose max-w-none">
        <Markdown markdown={scenario.startContent} />
      </div>
      <StepNavigation
        nextVisible
        nextTitle={scenario.steps[0].title}
        previous=""
        next={`/lab/${lab.id}/scenario/${lab.scenarios[0].id}/step/${lab.scenarios[0].steps[0].id}`}
      />
    </>
  );
};
export default ScenarioInformation;
