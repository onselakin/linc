export interface Settings {
  labRepos: {
    url: string;
    username?: string;
    password?: string;
  }[];
  labKubeConfigs: Record<string, string>;
}
