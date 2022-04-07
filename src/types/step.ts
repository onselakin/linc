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
  volumeName: string;
  scripts: {
    shell: string;
    init: boolean;
    verify: boolean;
  };
  container: {
    image: string;
  };
  includes: { [key: string]: string };
}
