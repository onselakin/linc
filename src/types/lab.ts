import Scenario from './scenario';

export interface Lab {
  name: string;
  title: string;
  description: string;
  scenarios: Scenario[];
}
