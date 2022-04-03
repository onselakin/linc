/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import 'renderer/App.css';

import { useCurrentLab } from 'renderer/hooks/useCurrent';
import BasicStepRunner from './StepRunners/BasicStepRunner';
import TerminalStepRunner from './StepRunners/TerminalStepRunner';

const StepRunnerRouter = () => {
  const lab = useCurrentLab();

  if (lab.singleScenario) {
    return <BasicStepRunner />;
  }

  return <TerminalStepRunner />;
};

export default StepRunnerRouter;
