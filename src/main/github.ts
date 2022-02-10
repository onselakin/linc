import { app } from 'electron';
import fs from 'fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import path from 'path';

const dir = path.join(app.getPath('home'), 'test-clone');

git
  .clone({
    fs,
    http,
    dir,
    url: 'https://github.com/isomorphic-git/lightning-fs',
  })
  .then(console.log)
  .catch(error => console.log(error));
