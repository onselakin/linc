import { ActionRequest, ActionResponse } from 'ipc';

import { app } from 'electron';
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import path from 'path';

const githubActions = {
  'clone-repo': async (
    req: ActionRequest<{ url: string }>,
    res: ActionResponse<
      { name: string },
      { phase: string; loaded: number; total: number }
    >
  ) => {
    try {
      const regex = /^(https|git)(:\/\/|@)([^/:]+)[/:]([^/:]+)\/(.+).git$/gm;
      const str = `https://github.com/onselakin/k8s-lab.git`;
      const match = regex.exec(str);
      if (match != null) {
        await git.clone({
          fs,
          http,
          dir: path.join(app.getPath('home'), 'lab', 'courses', match[5]),
          onAuth: () => ({
            username: 'onselakin',
            password: '***REMOVED***',
          }),
          url: req.payload.url,
          onProgress: progress => {
            res.notify(progress);
          },
        });
      } else {
        res.error('Failed to extract repo name');
      }
    } catch (error) {
      res.error(error);
    }
  },
};

export default githubActions;
