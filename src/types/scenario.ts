import Step from './step';

export default interface Scenario {
  id: string;
  title: string;

  description: string;

  container: {
    image: string;
  };

  steps: Step[];
}
