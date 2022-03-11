import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import labsAtom from 'renderer/atoms/labs';
import Lab from 'types/lab';
import Scenario from 'types/scenario';
import Step from 'types/step';

const useCurrentLab = (): Lab => {
  const { labId } = useParams();
  const labs = useRecoilValue(labsAtom);
  const lab = labs.all.find(l => l.id === labId)!;
  return lab;
};

const useCurrentScenario = (): Scenario => {
  const { scenarioId } = useParams();
  const lab = useCurrentLab();
  const scenario = lab.scenarios.find(s => s.id === scenarioId)!;
  return scenario;
};

const useCurrentStep = (): Step => {
  const { stepId } = useParams();
  const scenario = useCurrentScenario();
  const step = scenario.steps.find(s => s.id === stepId)!;
  return step;
};

export { useCurrentLab, useCurrentScenario, useCurrentStep };
