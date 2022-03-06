/* eslint-disable @typescript-eslint/no-explicit-any */

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

const inspect: Bridge<{ imageName: string }, unknown> = async ({ imageName }, channel) => {
  const images = await docker.image.list();
  const image = images.find((i: any) => i.data.RepoTags.includes(imageName));
  if (image === undefined) {
    channel.error(new Error('IMAGE_NOT_FOUND'));
    return;
  }
  const imageStatus = await image.status();
  channel.reply(imageStatus.data);
};

const pull: Bridge<
  { image: string; tag: string },
  void,
  { status: string; currentProgress: number; totalProgress: number }
> = async ({ image, tag }, channel) => {
  const promiseStream = (stream: any) =>
    new Promise((resolve, reject) => {
      stream.on('data', (data: any) => {
        try {
          const statusData = data.toString();
          const status = JSON.parse(statusData);
          channel.notify({
            status: status.status,
            currentProgress: status.progressDetail ? status.progressDetail.current : 0,
            totalProgress: status.progressDetail ? status.progressDetail.total : 0,
          });
        } catch (error) {
          console.log(error);
        }
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });

  docker.image
    .create({}, { fromImage: image, tag })
    .then((stream: any) => promiseStream(stream))
    .then(() => channel.reply())
    .catch((e: Error) => channel.error(e));
};

export default {
  'docker:connect': connect,
  'docker:inspect': inspect,
  'docker:pull': pull,
};
