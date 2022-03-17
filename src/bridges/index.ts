/* eslint-disable @typescript-eslint/no-explicit-any */

import labActions from './labs';
import storeActions from './settings';
import terminalActions from './terminal';
import dockerActions from './docker';
import progressActions from './progress';

const actions = { ...labActions, ...storeActions, ...terminalActions, ...dockerActions, ...progressActions };
export default actions;
