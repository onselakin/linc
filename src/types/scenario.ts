export interface MarkDownStep {
  type: string;
  content: string;
}

export interface XTermSection {
  type: string;
  tool: string;
}

export default interface Scenario {
  id: string;
  title: string;

  description: string;

  container: {
    image: string;
  };

  settings: {
    vsCodeEnabled: boolean;
    terminalEnabled: boolean;
  };

  steps: Array<MarkDownStep | XTermSection>;
}
