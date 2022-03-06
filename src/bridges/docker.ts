import { Bridge } from 'ipc/ipc-handler';

const { Docker } = require('node-docker-api');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const connect: Bridge<void, void, { success: boolean }> = async (_, channel) => {
  setInterval(async () => {
    try {
      const reply = await docker.ping();
      channel.notify({ success: reply === 'OK' });
    } catch (error) {
      channel.notify({ success: false });
    }
  }, 5000);
};

const pullImage: Bridge<{ image: string }, { success: boolean }> = async (payload, channel) => {
  docker.image.console.log(`Cloning repo: ${payload}`);
  channel.reply({ success: true });
};

export default {
  'docker:connect': connect,
  'docker:pull-image': pullImage,
};
