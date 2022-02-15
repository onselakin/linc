import { ActionRequest, ActionResponse } from 'ipc';
import git, { GitProgressEvent } from 'isomorphic-git';

import { app } from 'electron';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import path from 'path';

const labActions = {
  'clone-lab': async (
    req: { url: string; username: string; password: string },
    res: ActionResponse<
      { name: string },
      { repo: string; phase: string; loaded: number; total: number }
    >
  ) => {
    console.log('[Clone-Lab]--------------------');
    console.log(req);

    const regex = /^(https|git)(:\/\/|@)([^/:]+)[/:]([^/:]+)\/(.+).git$/gm;
    const match = regex.exec(req.url);
    if (match != null) {
      const repoName = match[5];
      console.log(
        path.join(app.getPath('userData'), 'labwiz', 'courses', repoName)
      );
      try {
        await git.clone({
          fs,
          http,
          dir: path.join(
            app.getPath('userData'),
            'labwiz',
            'courses',
            repoName
          ),
          url: req.url,
          onAuth: () => ({
            username: req.username,
            password: req.password,
          }),
          onProgress: (progress: GitProgressEvent) => {
            res.notify({ repo: repoName, ...progress });
          },
        });
      } catch (error) {
        res.error(error);
      }
    }
  },
};

export default labActions;
