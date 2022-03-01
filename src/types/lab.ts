import Scenario from './scenario';

export interface Lab {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string;
  scenarios: Scenario[];
}
