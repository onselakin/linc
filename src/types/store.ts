import { Settings } from './settings';
import ProgressRecord from './progressRecord';

export default interface Store {
  settings: Settings;
  progressRecords: ProgressRecord[];
}
