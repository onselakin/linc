import git, { GitProgressEvent } from 'isomorphic-git';

import { Bridge } from 'ipc/ipc-handler';
import { Lab } from 'types/lab';
import { app } from 'electron';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import path from 'path';
import yaml from 'js-yaml';
import Scenario from 'types/scenario';
import Step from 'types/step';

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
          channel.notify({ ...progress, repo: repoName });
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
  const labPath = path.join(labsPath, payload.name);
  const labFile = path.join(labsPath, payload.name, 'lab.yaml');
  if (!fs.existsSync(labFile)) {
    channel.error(new Error('Lab file not found.'));
    return;
  }
  // TODO: Add schema validation
  try {
    const lab = yaml.load(fs.readFileSync(labFile, 'utf-8')) as Lab;
    const coverFile = path.join(labPath, 'cover.md');
    if (fs.existsSync(coverFile)) {
      lab.cover = fs.readFileSync(coverFile, 'utf-8');
    }
    const scenariosPath = path.join(labPath, 'scenarios');
    // Walk through the folders and add the scenarios
    lab.scenarios = fs
      .readdirSync(scenariosPath, { withFileTypes: true })
      .filter(dir => dir.isDirectory())
      .map(dir => {
        const scenarioFile = path.join(scenariosPath, dir.name, 'scenario.yaml');
        const scenario = yaml.load(fs.readFileSync(scenarioFile, 'utf-8')) as Scenario;
        const stepsPath = path.join(scenariosPath, dir.name, 'steps');
        if (!fs.existsSync(stepsPath)) {
          scenario.steps = [];
          return scenario;
        }
        scenario.steps = fs
          .readdirSync(stepsPath, { withFileTypes: true })
          .filter(stepDir => stepDir.isDirectory())
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map(stepDir => {
            const stepPath = path.join(scenariosPath, dir.name, 'steps', stepDir.name);
            const step = yaml.load(fs.readFileSync(path.join(stepPath, 'step.yaml'), 'utf-8')) as Step;
            const contentFilePath = path.join(stepPath, 'content.md');
            if (fs.existsSync(contentFilePath)) {
              step.content = fs.readFileSync(contentFilePath, 'utf-8');
            }
            return step;
          });
        return scenario;
      });
    channel.reply(lab);
  } catch (e) {
    channel.error(e);
  }
};

export default {
  'lab:clone': cloneLab,
  'lab:load': loadLab,
};
