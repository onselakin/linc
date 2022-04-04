/* eslint-disable @typescript-eslint/no-explicit-any */

import labActions from './labs';
import storeActions from './settings';
import terminalActions from './terminal';
import dockerActions from './docker';
import progressActions from './progress';
import k8sactions from './k8s';
import windowActions from './window';

const actions = {
  ...labActions,
  ...storeActions,
  ...terminalActions,
  ...dockerActions,
  ...progressActions,
  ...k8sactions,
  ...windowActions,
};
export default actions;
