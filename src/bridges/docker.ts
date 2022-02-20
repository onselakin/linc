import { Bridge } from 'ipc/ipc-handler';

const pullImage: Bridge<{ image: string }, { success: boolean }> = async (payload, channel) => {
  console.log(`Cloning repo: ${payload}`);
  channel.reply({ success: true });
};

export default {
  'pull-image': pullImage,
};
