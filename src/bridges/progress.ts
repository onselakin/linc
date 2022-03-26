import { Bridge } from 'ipc/ipc-handler';
import store from '../store';
import ProgressRecord from 'types/progressRecord';

const load: Bridge<{ labId: string }, ProgressRecord[]> = async ({ labId }, channel) => {
  try {
    const records = store.get('progressRecords').filter(r => r.labId === labId);
    channel.reply(records);
  } catch (error) {
    channel.error(error);
  }
};

const save: Bridge<ProgressRecord[], void> = async (payload, channel) => {
  try {
    const merged = [...store.get('progressRecords'), ...payload];
    store.set('progressRecords', merged);
    channel.reply();
  } catch (error) {
    channel.error(error);
  }
};

export default {
  'progress:load': load,
  'progress:save': save,
};
