import Scenario from './scenario';

export default interface Lab {
  id: string;
  version: string;
  tags: string;
  title: string;
  author: {
    name: string;
    photo: string;
    bio: string;
    social: {
      twitter: string;
      linkedin: string;
    };
  };
  description: string;
  frontMatter: string;
  backMatter: string;
  difficulty: string;
  estimatedTime: string;
  coverImage: string;
  container: {
    image: string;
  };
  scenarios: Scenario[];
}
