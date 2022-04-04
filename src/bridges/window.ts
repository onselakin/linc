import { Bridge } from '../ipc/ipc-handler';
import { shell } from 'electron';

const openExternalPage: Bridge<{ url: string }, void> = async ({ url }, channel) => {
  shell.openExternal(url);
  channel.reply();
};

export default {
  'window:open': openExternalPage,
};
