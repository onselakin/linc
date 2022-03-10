/* eslint-disable @typescript-eslint/no-explicit-any */

import { Bridge } from 'ipc/ipc-handler';
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const connect: Bridge<void, void, { success: boolean }> = async (_, channel) => {
  setInterval(async () => {
    try {
      const reply = Buffer.from(await docker.ping()).toString();
      channel.notify({ success: reply === 'OK' });
    } catch (error) {
      channel.notify({ success: false });
    }
  }, 5000);
};

const inspect: Bridge<{ imageName: string }, unknown> = async ({ imageName }, channel) => {
  try {
    const image = docker.getImage(imageName);
    const inspectInfo = await image.inspect();
    channel.reply(inspectInfo);
  } catch (error) {
    channel.error(new Error('IMAGE_NOT_FOUND'));
  }
};

const pull: Bridge<
  { image: string; tag: string },
  void,
  { status: string; currentProgress: number; totalProgress: number }
> = async ({ image, tag }, channel) => {
  docker.pull(`${image}:${tag}`, {}, (err: Error, stream: any) => {
    if (err) {
      console.log(err);
      channel.error(err);
    }

    docker.modem.followProgress(
      stream,
      error => {
        if (error) {
          channel.error(err);
        }
        channel.reply();
      },
      event => {
        channel.notify({
          status: event.status,
          currentProgress: event.progressDetail ? event.progressDetail.current : 0,
          totalProgress: event.progressDetail ? event.progressDetail.total : 0,
        });
      }
    );
  });
};

export default {
  'docker:connect': connect,
  'docker:inspect': inspect,
  'docker:pull': pull,
};
