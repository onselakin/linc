/* eslint-disable @typescript-eslint/no-explicit-any */

import labActions from './labs';
import storeActions from './settings';
import terminalActions from './terminal';
import dockerActions from './docker';

const actions = { ...labActions, ...storeActions, ...terminalActions, ...dockerActions };
export default actions;
