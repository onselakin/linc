export default interface Step {
  id: string;
  title: string;
  content: string;
  layout: {
    allowNewTerminals: boolean;
    defaultTerminals: {
      id: string;
      title: string;
      allowClose: boolean;
      cwd: string;
    }[];
  };
}
