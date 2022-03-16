import { Settings } from './settings';
import Progress from './progress';

export default interface Store {
  settings: Settings;
  progress: Progress[];
}
