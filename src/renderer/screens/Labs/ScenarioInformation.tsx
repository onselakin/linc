import 'renderer/App.css';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from 'renderer/atoms/labsAtom';
import Markdown from 'renderer/components/Markdown';
import StepNavigation from 'renderer/components/StepNavigation';

const ScenarioInformation = () => {
  const { labId, scenarioId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labId);
  const scenario = lab?.scenarios.find(s => s.id === scenarioId);

  return (
    <>
      <div className="prose max-w-none">
        <Markdown markdown={scenario!.startContent} />
      </div>
      <StepNavigation
        nextVisible
        nextTitle={scenario?.steps[0].title}
        previous=""
        next={`/lab/${lab?.id}/scenario/${lab?.scenarios[0].id}/step/${lab?.scenarios[0].steps[0].id}`}
      />
    </>
  );
};
export default ScenarioInformation;
