import Scenario from './scenario';

export interface Lab {
  name: string;
  description: string;
  scenarios: Scenario[];
}
