import Step from './step';

export default interface Scenario {
  id: string;
  title: string;
  description: string;

  startContent: string;
  finishContent: string;

  steps: Step[];
}
