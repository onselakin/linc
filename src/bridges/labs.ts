import git, { GitProgressEvent } from 'isomorphic-git';
import { Bridge } from 'ipc/ipc-handler';
import { app } from 'electron';
import Lab from 'types/lab';
import fs from 'fs';
import http from 'isomorphic-git/http/node';
import path from 'path';
import yaml from 'js-yaml';
import Scenario from 'types/scenario';
import Step from 'types/step';

const labsPath = path.join(app.getPath('userData'), 'labwiz', 'labs');

function readStep(stepPath: string, id: string, lab: Lab) {
  const step = yaml.load(fs.readFileSync(path.join(stepPath, 'step.yaml'), 'utf-8')) as Step;
  step.id = id;

  if (!step.container) {
    step.container = lab.container;
  }

  const contentFilePath = path.join(stepPath, 'content.md');
  if (fs.existsSync(contentFilePath)) {
    step.content = fs.readFileSync(contentFilePath, 'utf-8');
    step.includes = {};

    const configRegex = /~[^{]*\{([^}]*)}\n?~\n?/gm;
    const configs = [...step.content.matchAll(configRegex)].map(r => r[1]);
    configs.forEach(c => {
      const yamlCfg: any = yaml.load(c);
      if (yamlCfg.file) {
        const includeContentPath = path.join(stepPath, 'files', yamlCfg.file);
        if (fs.existsSync(includeContentPath)) {
          step.includes[yamlCfg.file] = fs.readFileSync(includeContentPath, 'utf-8');
        }
      }
    });
  }

  const initScriptFilePath = path.join(stepPath, 'init.sh');
  if (fs.existsSync(initScriptFilePath)) {
    step.scripts.init = true;
  }

  const verifyScriptFilePath = path.join(stepPath, 'verify.sh');
  if (fs.existsSync(verifyScriptFilePath)) {
    step.scripts.verify = true;
  }

  return step;
}

function readScenario(scenarioPath: string, id: string, scenariosPath: string, lab: Lab) {
  const scenarioFile = path.join(scenarioPath, 'scenario.yaml');
  const scenario = yaml.load(fs.readFileSync(scenarioFile, 'utf-8')) as Scenario;
  scenario.id = id;

  const startContentFilePath = path.join(scenarioPath, 'start.md');
  if (fs.existsSync(startContentFilePath)) {
    scenario.startContent = fs.readFileSync(startContentFilePath, 'utf-8');
  }
  const finishContentFilePath = path.join(scenarioPath, 'finish.md');
  if (fs.existsSync(finishContentFilePath)) {
    scenario.finishContent = fs.readFileSync(finishContentFilePath, 'utf-8');
  }

  const stepsPath = path.join(scenariosPath, id, 'steps');
  if (!fs.existsSync(stepsPath)) {
    scenario.steps = [];
    return scenario;
  }
  scenario.steps = fs
    .readdirSync(stepsPath, { withFileTypes: true })
    .filter(stepDir => stepDir.isDirectory())
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .map(stepDir => {
      const stepPath = path.join(scenariosPath, id, 'steps', stepDir.name);
      return readStep(stepPath, stepDir.name, lab);
    });
  return scenario;
}

const cloneLab: Bridge<
  { url: string; username: string; password: string },
  { id: string; success: boolean },
  { repo: string; phase: string; loaded: number; total: number }
> = async (payload, channel) => {
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
          channel.notify({ ...progress, repo: repoName });
        },
      };
      if (fs.existsSync(dir)) {
        await git.pull(gitConfig);
      } else {
        await git.clone(gitConfig);
      }
      channel.reply({ id: repoName, success: true });
    } catch (error) {
      channel.reply({ id: repoName, success: false });
    }
  }
};

const loadLab: Bridge<{ id: string }, Lab, unknown> = async (payload, channel) => {
  const labPath = path.join(labsPath, payload.id);
  const labFile = path.join(labsPath, payload.id, 'lab.yaml');
  if (!fs.existsSync(labFile)) {
    channel.error(new Error('Lab file not found.'));
    return;
  }
  try {
    const lab = yaml.load(fs.readFileSync(labFile, 'utf-8')) as Lab;
    lab.id = payload.id;
    lab.localPath = labPath;

    const frontFile = path.join(labPath, 'front.md');
    if (fs.existsSync(frontFile)) {
      lab.frontMatter = fs.readFileSync(frontFile, 'utf-8');
    }

    const backFile = path.join(labPath, 'back.md');
    if (fs.existsSync(backFile)) {
      lab.backMatter = fs.readFileSync(backFile, 'utf-8');
    }

    const scenariosPath = path.join(labPath, 'scenarios');

    // Walk through the folders and add the scenarios
    if (fs.existsSync(scenariosPath)) {
      lab.scenarios = fs
        .readdirSync(scenariosPath, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => {
          const scenarioPath = path.join(scenariosPath, dir.name);
          return readScenario(scenarioPath, dir.name, scenariosPath, lab);
        });
    } else if (fs.existsSync(`${labPath}/steps`)) {
      lab.singleScenario = true;

      const stepsPath = path.join(labPath, 'steps');

      // Create a placeholder scenario for the steps
      lab.scenarios = [
        {
          id: 'default-scenario',
          title: '',
          estimatedTime: '',
          description: '',
          finishContent: '',
          startContent: '',
          steps: fs
            .readdirSync(stepsPath, { withFileTypes: true })
            .filter(stepDir => stepDir.isDirectory())
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .map(stepDir => {
              const stepPath = path.join(stepsPath, stepDir.name);
              return readStep(stepPath, stepDir.name, lab);
            }),
        },
      ];
    }
    channel.reply(lab);
  } catch (e) {
    channel.error(e);
  }
};

const readFile: Bridge<{ labId: string; scenarioId: string; stepId: string; fileName: string }, string> = async (
  { labId, scenarioId, stepId, fileName },
  channel
) => {
  const fullFilePath = path.join(labsPath, labId, 'scenarios', scenarioId, 'steps', stepId, 'files', fileName);
  if (!fs.existsSync(fullFilePath)) {
    channel.error(new Error('FILE_NOT_FOUND'));
    return;
  }

  const contents = fs.readFileSync(fullFilePath, 'utf-8');
  channel.reply(contents);
};

export default {
  'lab:clone': cloneLab,
  'lab:load': loadLab,
  'lab:readFile': readFile,
};
