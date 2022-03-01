/* eslint-disable @typescript-eslint/no-explicit-any */

import labActions from './labs';
import storeActions from './settings';
import terminalActions from './terminal';

const actions = { ...labActions, ...storeActions, ...terminalActions };
export default actions;
