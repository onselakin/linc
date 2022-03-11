/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */

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
  { imageName: string },
  void,
  { status: string; currentProgress: number; totalProgress: number }
> = async ({ imageName }, channel) => {
  docker.pull(imageName, {}, (err: Error, containerStream: any) => {
    if (err) {
      channel.error(err);
    }

    docker.modem.followProgress(
      containerStream,
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

const create: Bridge<{ imageName: string }, { containerId: string }> = async ({ imageName }, channel) => {
  const options = {
    Hostname: '',
    User: '',
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
    OpenStdin: true,
    StdinOnce: false,
    Env: [],
    Cmd: ['bash'],
    Dns: ['8.8.8.8', '8.8.4.4'],
    Image: imageName,
    Volumes: {},
    VolumesFrom: [],
  };
  const container = await docker.createContainer(options);

  container.start(err => {
    if (err) {
      channel.error(err);
      return;
    }
    container.wait(err => {
      if (err) {
        channel.error(err);
        return;
      }
      // TODO: Exit container
      console.log('exit container');
    });
  });

  channel.reply({ containerId: container.id });
};

export default {
  'docker:connect': connect,
  'docker:inspect': inspect,
  'docker:pull': pull,
  'docker:create': create,
};
