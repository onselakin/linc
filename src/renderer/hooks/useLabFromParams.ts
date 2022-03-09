import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from 'renderer/atoms/labsAtom';
import { Lab } from 'types/lab';
import Scenario from 'types/scenario';
import Step from '../../types/step';

const useLabFromParams = (): Lab => {
  const { labId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labId)!;
  return lab;
};

const useScenarioFromParams = (): Scenario => {
  const { scenarioId } = useParams();
  const lab = useLabFromParams();
  const scenario = lab.scenarios.find(s => s.id === scenarioId)!;
  return scenario;
};

const useStepFromParams = (): Step => {
  const { stepId } = useParams();
  const scenario = useScenarioFromParams();
  const step = scenario.steps.find(s => s.id === stepId)!;
  return step;
};

export { useLabFromParams, useScenarioFromParams, useStepFromParams };
