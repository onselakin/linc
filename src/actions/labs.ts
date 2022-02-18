import git, { GitProgressEvent } from 'isomorphic-git';

import { Channel } from 'ipc';
import { Lab } from 'types/lab';
import { app } from 'electron';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import path from 'path';

const labActions = {
  'clone-lab': async (
    payload: { url: string; username: string; password: string },
    channel: Channel<{ name: string; success: boolean }, { repo: string; phase: string; loaded: number; total: number }>
  ) => {
    const regex = /^(https|git)(:\/\/|@)([^/:]+)[/:]([^/:]+)\/(.+).git$/gm;
    const match = regex.exec(payload.url);
    if (match != null) {
      const repoName = match[5];
      try {
        await git.clone({
          fs,
          http,
          dir: path.join(app.getPath('userData'), 'labwiz', 'labs', repoName),
          url: payload.url,
          onAuth: () => ({
            username: payload.username,
            password: payload.password,
          }),
          onProgress: (progress: GitProgressEvent) => {
            channel.notify({ repo: repoName, ...progress });
          },
        });
        channel.reply({ name: repoName, success: true });
      } catch (error) {
        channel.reply({ name: repoName, success: false });
      }
    }
  },
  'load-lab': async (payload: { name: string }, channel: Channel<Lab>) => {

  },
};

export default labActions;
