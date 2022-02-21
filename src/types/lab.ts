import Scenario from './scenario';

export interface Lab {
  id: string;
  title: string;
  description: string;
  scenarios: Scenario[];
}
