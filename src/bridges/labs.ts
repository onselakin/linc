import git, { GitProgressEvent } from 'isomorphic-git';

import { Bridge } from 'ipc/ipc-handler';
import { Lab } from 'types/lab';
import { app } from 'electron';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import path from 'path';
import yaml from 'js-yaml';

const labsPath = path.join(app.getPath('userData'), 'labwiz', 'labs');

const cloneLab: Bridge<
  { url: string; username: string; password: string },
  { name: string; success: boolean },
  { repo: string; phase: string; loaded: number; total: number }
> = async (payload, channel) => {
  console.log(`Cloning repo: ${payload}`);
  const regex = /^(https|git)(:\/\/|@)([^/:]+)[/:]([^/:]+)\/(.+).git$/gm;
  const match = regex.exec(payload.url);
  if (match != null) {
    const repoName = match[5];
    const dir = path.join(labsPath, repoName);
    try {
      const gitConfig = {
        fs,
        http,
        dir,
        url: payload.url,
        author: {
          name: 'Onsel Akin',
          email: 'onsela@outlook.com',
        },
        onAuth: () => ({
          username: payload.username,
          password: payload.password,
        }),
        onProgress: (progress: GitProgressEvent) => {
          console.log(`${repoName}: ${progress.loaded}/${progress.total} `);
        },
      };
      if (fs.existsSync(dir)) {
        await git.pull(gitConfig);
      } else {
        await git.clone(gitConfig);
      }
      channel.reply({ name: repoName, success: true });
    } catch (error) {
      console.log(`Error cloning repo: ${repoName}`);
      channel.reply({ name: repoName, success: false });
    }
  }
};

const loadLab: Bridge<{ name: string }, Lab, unknown> = async (payload, channel) => {
  const labFile = path.join(labsPath, payload.name, 'lab.yaml');
  console.log(labFile);
  if (!fs.existsSync(labFile)) {
    channel.error(new Error('Lab file not found.'));
    return;
  }
  // TODO: Add schema validation
  try {
    const labYaml = yaml.load(fs.readFileSync(labFile, 'utf-8')) as Lab;
    channel.reply(labYaml);
  } catch (e) {
    console.log(e);
    channel.error(e);
  }
};

export default {
  'clone-lab': cloneLab,
  'load-lab': loadLab,
};
