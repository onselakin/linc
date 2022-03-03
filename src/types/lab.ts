import Scenario from './scenario';

export interface Lab {
  id: string;
  version: string;
  tags: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  difficulty: string;
  estimatedTime: string;
  coverImage: string;
  scenarios: Scenario[];
}
