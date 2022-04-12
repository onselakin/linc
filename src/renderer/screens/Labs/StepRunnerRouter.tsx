/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { useCurrentStep } from 'renderer/hooks/useCurrent';
import BasicStepRunner from './StepRunners/BasicStepRunner';
import TerminalStepRunner from './StepRunners/TerminalStepRunner';

const StepRunnerRouter = () => {
  const step = useCurrentStep();

  if (step.layout.type === 'basic') {
    return <BasicStepRunner />;
  }

  return <TerminalStepRunner />;
};

export default StepRunnerRouter;
