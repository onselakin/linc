/* eslint-disable @typescript-eslint/no-explicit-any */

import labActions from './labs';
import storeActions from './settings';
import terminalActions from './terminal';
import dockerActions from './docker';
import progressActions from './progress';
import k8sactions from './k8s';

const actions = {
  ...labActions,
  ...storeActions,
  ...terminalActions,
  ...dockerActions,
  ...progressActions,
  ...k8sactions,
};
export default actions;
